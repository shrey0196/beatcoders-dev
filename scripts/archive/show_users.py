"""
Simple script to show your users and generate SQL commands
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from config.database import SessionLocal
from models.user import User

def show_users_and_sql():
    db = SessionLocal()
    
    try:
        users = db.query(User).all()
        
        print("\n" + "="*80)
        print("YOUR USERS")
        print("="*80)
        
        for i, user in enumerate(users, 1):
            premium = "✓ PREMIUM" if user.is_premium else "✗ FREE"
            print(f"\n{i}. User ID: {user.user_id}")
            print(f"   Email: {user.email}")
            print(f"   Status: {premium}")
            
            if not user.is_premium:
                print(f"\n   To upgrade this user, run:")
                print(f"   python update_premium.py {user.user_id}")
        
        print("\n" + "="*80)
        print(f"Total: {len(users)} users")
        print("="*80)
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == '__main__':
    show_users_and_sql()
