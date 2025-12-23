
import sys
import os

# Add project root to sys.path
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from backend.config.database import Base, engine
    from backend.models.user import User, friendships
    from sqlalchemy.orm import sessionmaker

    print("Import successful.")

    # Create tables (if not exist, though they exist)
    # Base.metadata.create_all(bind=engine) # Don't run this freely on prod DBs

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("Session created.")
    
    # Try to access friends relationship on a dummy query to see if mapper fails
    user = db.query(User).first()
    if user:
        print(f"User found: {user.username}")
        # Access relationship
        print(f"Friends: {user.friends}")
    else:
        print("No users found to test relationship.")

    print("Model setup seems OK.")

except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"FAILED: {e}")
