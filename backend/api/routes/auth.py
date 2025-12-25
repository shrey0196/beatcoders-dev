from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from config.database import get_db
from models.user import User
from models.password_reset import PasswordReset
from utils.email_service import send_verification_email, send_password_reset_email, generate_verification_code
import random
import string
import re
from datetime import datetime, timedelta

import hashlib

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    user_id: str
    email: str
    username: str | None = None
    
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    user_id: str
    username: str

class EmailVerification(BaseModel):
    email: EmailStr
    code: str

class ForgotPassword(BaseModel):
    email: EmailStr

class VerifyResetCode(BaseModel):
    email: EmailStr
    code: str

class ResetPassword(BaseModel):
    email: EmailStr
    code: str
    new_password: str

def generate_user_id(email: str) -> str:
    local_part = email.split('@')[0]
    sanitized = re.sub(r'[^a-zA-Z0-9]', '', local_part)
    if not sanitized:
        sanitized = "user"
    random_suffix = ''.join(random.choices(string.digits, k=3))
    return f"{sanitized}{random_suffix}"



def verify_password(plain_password, hashed_password):
    # Try verifying with SHA-256 pre-hashing (new method)
    # We hex-digest the password first to ensure it's always <= 64 chars
    sha256_password = hashlib.sha256(plain_password.encode()).hexdigest()
    if pwd_context.verify(sha256_password, hashed_password):
        return True
    
    # Fallback: Try verifying raw password (legacy)
    # This handles existing users who have plain bcrypt hashes
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    # Always pre-hash with SHA-256 to support unlimited length
    sha256_password = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(sha256_password)

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Generate verification code
        verification_code = generate_verification_code()
        code_expires = datetime.utcnow() + timedelta(minutes=10)
        
        hashed_password = get_password_hash(user.password)
        user_id = generate_user_id(user.email)
        new_user = User(
            email=user.email, 
            password_hash=hashed_password, 
            user_id=user_id, 
            username=user_id,
            is_verified=False,
            verification_code=verification_code,
            verification_code_expires=code_expires
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Send verification email
        send_verification_email(user.email, verification_code)
        
        return new_user
    except Exception as e:
        print(f"Registration Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )
    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not db_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please check your email for the verification code.",
        )
    return {
        "message": "Login successful", 
        "user_id": db_user.user_id, 
        "email": db_user.email,
        "username": db_user.username,
        "is_premium": db_user.is_premium,
        "premium_expires": db_user.premium_expires.isoformat() if db_user.premium_expires else None
    }

@router.put("/profile")
def update_profile(profile: UserProfileUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == profile.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.username = profile.username
    db.commit()
    return {"message": "Profile updated successfully", "username": db_user.username}

@router.post("/verify-email")
def verify_email(verification: EmailVerification, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == verification.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.is_verified:
        return {"message": "Email already verified"}
    
    if db_user.verification_code != verification.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    if datetime.utcnow() > db_user.verification_code_expires:
        raise HTTPException(status_code=400, detail="Verification code expired")
    
    db_user.is_verified = True
    db_user.verification_code = None
    db_user.verification_code_expires = None
    db.commit()
    
    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
def resend_verification(email_data: dict, db: Session = Depends(get_db)):
    email = email_data.get("email")
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.is_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    # Generate new code
    verification_code = generate_verification_code()
    code_expires = datetime.utcnow() + timedelta(minutes=10)
    
    db_user.verification_code = verification_code
    db_user.verification_code_expires = code_expires
    db.commit()
    
    # Send email
    send_verification_email(email, verification_code)
    
    return {"message": "Verification code sent"}

@router.post("/forgot-password")
def forgot_password(request: ForgotPassword, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == request.email).first()
    if not db_user:
        # Don't reveal if email exists for security
        return {"message": "If the email exists, a reset code has been sent"}
    
    # Generate reset code
    reset_code = generate_verification_code()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Store reset token
    reset_token = PasswordReset(
        email=request.email,
        reset_code=reset_code,
        expires_at=expires_at
    )
    db.add(reset_token)
    db.commit()
    
    # Send email
    send_password_reset_email(request.email, reset_code)
    
    return {"message": "If the email exists, a reset code has been sent"}

@router.post("/verify-reset-code")
def verify_reset_code(request: VerifyResetCode, db: Session = Depends(get_db)):
    reset_token = db.query(PasswordReset).filter(
        PasswordReset.email == request.email,
        PasswordReset.reset_code == request.code,
        PasswordReset.used == False
    ).first()
    
    if not reset_token:
        raise HTTPException(status_code=400, detail="Invalid reset code")
    
    if datetime.utcnow() > reset_token.expires_at:
        raise HTTPException(status_code=400, detail="Reset code expired")
    
    return {"message": "Reset code verified"}

@router.post("/reset-password")
def reset_password(request: ResetPassword, db: Session = Depends(get_db)):
    reset_token = db.query(PasswordReset).filter(
        PasswordReset.email == request.email,
        PasswordReset.reset_code == request.code,
        PasswordReset.used == False
    ).first()
    
    if not reset_token:
        raise HTTPException(status_code=400, detail="Invalid reset code")
    
    if datetime.utcnow() > reset_token.expires_at:
        raise HTTPException(status_code=400, detail="Reset code expired")
    
    # Update password
    db_user = db.query(User).filter(User.email == request.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.password_hash = get_password_hash(request.new_password)
    reset_token.used = True
    db.commit()
    
    return {"message": "Password reset successfully"}
