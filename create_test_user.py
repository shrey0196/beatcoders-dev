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
        existing = db.query(User).filter(User.email == "test@beatcoders.com").first()
        if existing:
            print("❌ Test user already exists!")
            print(f"   User ID: {existing.user_id}")
            print(f"   Email: {existing.email}")
            print(f"   Premium: {existing.is_premium}")
            return
        
        # Create test user
        test_user = User(
            user_id="test123",
            email="test@beatcoders.com",
            username="TestUser",
            password_hash=pwd_context.hash("password123"),
            is_verified=True,
            is_premium=True,  # Start as premium
            premium_since=datetime.utcnow()
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print("\n" + "="*60)
        print("LOGIN CREDENTIALS")
        print("="*60)
        print(f"Email:    test@beatcoders.com")
        print(f"Password: password123")
        print(f"User ID:  {test_user.user_id}")
        print(f"Premium:  ✓ YES")
        print("="*60)
        print("\nYou can now:")
        print("  1. Login at: http://localhost:8001/dashboard.html")
        print("  2. Test all premium features!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    print("="*60)
    print("Create Test User for Phase 4")
    print("="*60)
    print()
    create_test_user()
