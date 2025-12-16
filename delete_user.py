from config.database import SessionLocal
from models.user import User

db = SessionLocal()

try:
    # Search for user by email
    user = db.query(User).filter(User.email == "shreyashrey096@gmail.com").first()
    
    if user:
        print(f"Found user:")
        print(f"  Username: {user.username}")
        print(f"  User ID: {user.user_id}")
        print(f"  Email: {user.email}")
        print(f"  Elo Rating: {user.elo_rating}")
        
        # Delete the user
        db.delete(user)
        db.commit()
        print(f"\n✓ User deleted successfully!")
    else:
        print("No user found with email: shreyashrey096@gmail.com")
        
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
