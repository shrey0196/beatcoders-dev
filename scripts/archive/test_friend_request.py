
import sys
import os

# Add both root and backend to path to satisfy imports
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from backend.config.database import Base, engine
    from backend.models.user import User, FriendRequest
    from sqlalchemy.orm import sessionmaker

    print("Imports OK.")
    
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    print("Checking FriendRequest...")
    # Just try to query one, or create a dummy query to init mapper
    req = db.query(FriendRequest).first()
    if req:
        print(f"Request found: {req.id}, Status: {req.status}")
        # Test relationships safety
        try:
            print(f"Sender: {req.sender.username if req.sender else 'None'}")
            print(f"Receiver: {req.receiver.username if req.receiver else 'None'}")
        except Exception as rel_err:
             print(f"Relationship Access Error: {rel_err}")
    else:
        print("No requests found, but query worked.")

    print("FriendRequest model OK.")

except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"FAILED: {e}")
