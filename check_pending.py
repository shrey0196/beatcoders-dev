
import sys
import os

sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.config.database import engine
from backend.models.user import FriendRequest, User
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
db = Session()

# Receiver ID from previous context
receiver_username = "shreyashrey096831"
receiver = db.query(User).filter(User.username == receiver_username).first()

if receiver:
    pending = db.query(FriendRequest).filter(
        FriendRequest.receiver_id == receiver.id,
        FriendRequest.status == "pending"
    ).all()
    
    print(f"Pending requests for {receiver_username}: {len(pending)}")
    for r in pending:
        print(f" - ID: {r.id}, Sender: {r.sender.username}, Status: {r.status}")
else:
    print("Receiver not found.")
