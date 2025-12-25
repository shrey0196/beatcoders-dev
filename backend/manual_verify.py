from config.database import SessionLocal
from models.user import User
import sys
import argparse

def verify_user(email):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"❌ User with email '{email}' not found.")
            return
        
        if user.is_verified:
            print(f"ℹ️  User '{email}' is already verified.")
            return

        user.is_verified = True
        user.verification_code = None
        user.verification_code_expires = None
        db.commit()
        print(f"✅ User '{email}' successfully verified manually!")
        print("You can now login with this account.")
    except Exception as e:
        print(f"❌ Error verifying user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Manually verify a user account")
    parser.add_argument("email", help="The email of the user to verify")
    args = parser.parse_args()
    
    verify_user(args.email)
