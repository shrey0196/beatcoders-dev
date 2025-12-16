"""
Create a test user for Phase 4 testing
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from config.database import SessionLocal
from models.user import User
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_test_user():
    """Create a test user with premium access"""
    db = SessionLocal()
    
    try:
        # Check if test user already exists
        existing = db.query(User).filter(User.user_id == "test123").first()
        if existing:
            print("[INFO] Test user 'test123' already exists!")
            print(f"   Email: {existing.email}")
            print(f"   Premium: {existing.is_premium}")
            # Ensure Elo is set
            if not existing.elo_rating:
                existing.elo_rating = 1200
                db.commit()
                print("   [INFO] Reset Elo to 1200")
            return
        
        # Create test user
        test_user = User(
            user_id="test123",
            email="test@beatcoders.com",
            username="TestUser",
            password_hash=pwd_context.hash("password123"),
            is_verified=True,
            is_premium=True,
            premium_since=datetime.utcnow(),
            elo_rating=1200
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("[SUCCESS] Test user created successfully!")
        print("\n" + "="*60)
        print("LOGIN CREDENTIALS")
        print("="*60)
        print(f"Email:    test@beatcoders.com")
        print(f"Password: password123")
        print(f"User ID:  {test_user.user_id}")
        print("="*60)
        
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    print("="*60)
    print("Create Test User for Phase 4")
    print("="*60)
    print()
    create_test_user()
