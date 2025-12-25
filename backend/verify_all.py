from config.database import SessionLocal
from models.user import User

def fix_all_users():
    db = SessionLocal()
    print("📋 Checking User Database...")
    print("-" * 50)
    
    users = db.query(User).all()
    
    if not users:
        print("❌ No users found in the database!")
        print("   Did you Register first?")
        return

    for user in users:
        status_icon = "✅" if user.is_verified else "❌"
        print(f"User: {user.email:<30} | Status: {status_icon} Verified")
        
        if not user.is_verified:
            print(f"   ↳ Verifying {user.email} now...")
            user.is_verified = True
            user.verification_code = None
            
    db.commit()
    print("-" * 50)
    print("✅ All users have been verified.")
    print("   You can now login.")
    db.close()

if __name__ == "__main__":
    fix_all_users()
