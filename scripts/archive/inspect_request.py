
import sys
import os

sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.config.database import engine
from backend.models.user import FriendRequest, User
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
db = Session()

req = db.query(FriendRequest).filter(FriendRequest.id == 1).first()
if req:
    print(f"Request 1 Status: '{req.status}'") # Quotes to check for whitespace
    print(f"Sender: {req.sender.username}")
    print(f"Receiver: {req.receiver.username}")
    
    # Check friendship
    receiver = req.receiver
    sender = req.sender
    
    is_friend_receiver = sender in receiver.friends
    is_friend_sender = receiver in sender.friends
    
    print(f"Receiver considers Sender a friend: {is_friend_receiver}")
    print(f"Sender considers Receiver a friend: {is_friend_sender}")
else:
    print("Request 1 not found.")
