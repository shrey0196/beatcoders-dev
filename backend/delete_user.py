import sys
import argparse
from config.database import SessionLocal
from models.user import User, FriendRequest, friendships
from sqlalchemy import or_

def delete_user(email):
    db = SessionLocal()
    try:
        # Search for user by email
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            print(f"Found user:", flush=True)
            print(f"  Username: {user.username}", flush=True)
            print(f"  User ID: {user.user_id}", flush=True)
            print(f"  Email: {user.email}", flush=True)
            print(f"  Elo Rating: {user.elo_rating}", flush=True)
            
            # Confirm deletion
            confirm = input("Are you sure you want to delete this user? (y/n): ")
            if confirm.lower() != 'y':
                print("Deletion cancelled.", flush=True)
                return

            # Delete related friend requests
            requests_deleted = db.query(FriendRequest).filter(
                or_(FriendRequest.sender_id == user.id, FriendRequest.receiver_id == user.id)
            ).delete(synchronize_session=False)
            print(f"Deleted {requests_deleted} friend requests.", flush=True)

            # Delete related friendships
            # Since friendships is a Table object, we use db.execute with a delete statement
            stmt = friendships.delete().where(
                or_(friendships.c.user_id == user.id, friendships.c.friend_id == user.id)
            )
            result = db.execute(stmt)
            print(f"Deleted {result.rowcount} friendship connections.", flush=True)

            # Delete the user
            db.delete(user)
            db.commit()
            print(f"\nUser {email} deleted successfully!", flush=True)
        else:
            print(f"No user found with email: {email}", flush=True)
            
    except Exception as e:
        print(f"Error: {e}", flush=True)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Delete a user by email.")
    parser.add_argument("email", type=str, help="The email of the user to delete")
    args = parser.parse_args()
    
    delete_user(args.email)
