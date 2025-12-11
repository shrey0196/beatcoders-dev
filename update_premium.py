"""
Script to update user premium status
Usage: python update_premium.py <user_id>
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from config.database import SessionLocal
from models.user import User
from datetime import datetime

def update_premium_status(user_id, is_premium=True):
    """Update user's premium status"""
    db = SessionLocal()
    
    try:
        # Find user
        user = db.query(User).filter(User.user_id == user_id).first()
        
        if not user:
            print(f"❌ User '{user_id}' not found!")
            return False
        
        # Update premium status
        user.is_premium = is_premium
        
        if is_premium:
            user.premium_since = datetime.utcnow()
            user.premium_expires = None  # No expiration for now
            print(f"✅ User '{user_id}' upgraded to PREMIUM")
        else:
            user.premium_since = None
            user.premium_expires = None
            print(f"✅ User '{user_id}' downgraded to FREE")
        
        db.commit()
        
        # Show user info
        print(f"\nUser Details:")
        print(f"  Email: {user.email}")
        print(f"  Username: {user.username}")
        print(f"  Premium: {user.is_premium}")
        print(f"  Premium Since: {user.premium_since}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def list_all_users():
    """List all users and their premium status"""
    db = SessionLocal()
    
    try:
        users = db.query(User).all()
        
        print("\n" + "="*70)
        print("ALL USERS")
        print("="*70)
        print(f"{'User ID':<20} {'Email':<30} {'Premium':<10}")
        print("-"*70)
        
        for user in users:
            premium_status = "✓ YES" if user.is_premium else "✗ NO"
            print(f"{user.user_id:<20} {user.email:<30} {premium_status:<10}")
        
        print("="*70)
        print(f"Total users: {len(users)}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python update_premium.py <user_id>           # Upgrade to premium")
        print("  python update_premium.py <user_id> free      # Downgrade to free")
        print("  python update_premium.py list                # List all users")
        print("\nExamples:")
        print("  python update_premium.py user123")
        print("  python update_premium.py user123 free")
        print("  python update_premium.py list")
        sys.exit(1)
    
    if sys.argv[1] == 'list':
        list_all_users()
    else:
        user_id = sys.argv[1]
        is_premium = True if len(sys.argv) < 3 else sys.argv[2].lower() != 'free'
        update_premium_status(user_id, is_premium)
