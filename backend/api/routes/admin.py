from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from config.database import get_db
from models.user import User
from models.problem import Problem
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/admin", tags=["admin"])

class AdminUser(BaseModel):
    id: int
    user_id: str
    email: str
    username: Optional[str] = None
    is_verified: bool
    is_premium: bool
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    # Basic stats
    total_users = db.query(User).count()
    verified_users = db.query(User).filter(User.is_verified == True).count()
    premium_users = db.query(User).filter(User.is_premium == True).count()
    
    # Problem stats
    total_problems = db.query(Problem).count()
    
    # Recent activity (last 24h) - Placeholder logic as we don't have activity log table in this context easily accessible
    # Assuming created_at is populated
    # recent_users = db.query(User).filter(User.created_at >= datetime.utcnow() - timedelta(days=1)).count()
    
    return {
        "total_users": total_users,
        "verified_users": verified_users,
        "premium_users": premium_users,
        "total_problems": total_problems
    }

@router.get("/users", response_model=List[AdminUser])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.post("/flag/{user_id}")
def flag_user(user_id: str, db: Session = Depends(get_db)):
    # Placeholder for flagging logic (since schema doesn't have is_flagged yet)
    # We could deactivate them or just log it.
    # For now, just return success
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"User {user_id} flagged (Simulation)"}
