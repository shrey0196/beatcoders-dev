import sys
from config.database import SessionLocal
from models.user import User

db = SessionLocal()

try:
    # Search for user by email
    user = db.query(User).filter(User.email == "shreyashrey096@gmail.com").first()
    
    if user:
        print(f"Found user:", flush=True)
        print(f"  Username: {user.username}", flush=True)
        print(f"  User ID: {user.user_id}", flush=True)
        print(f"  Email: {user.email}", flush=True)
        print(f"  Elo Rating: {user.elo_rating}", flush=True)
        
        # Delete the user
        db.delete(user)
        db.commit()
        print(f"\nUser deleted successfully!", flush=True)
    else:
        print("No user found with email: shreyashrey096@gmail.com", flush=True)
        
except Exception as e:
    print(f"Error: {e}", flush=True)
    db.rollback()
finally:
    db.close()
