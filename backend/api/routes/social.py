from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Dict, Any
from config.database import get_db
from models.user import User, FriendRequest, friendships
from pydantic import BaseModel
from datetime import datetime
from utils.cache import profile_cache

router = APIRouter()

# --- Pydantic Models ---
class UserProfile(BaseModel):
    username: str
    elo_rating: int
    is_premium: bool
    created_at: datetime
    is_friend: bool = False
    stats: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class FriendRequestSchema(BaseModel):
    id: int
    sender_username: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Routes ---

@router.post("/friends/request/{username}")
def send_friend_request(username: str, current_user_id: str = "guest", db: Session = Depends(get_db)):
    if current_user_id == "guest":
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    # Get current user
    # Note: current_user_id from auth dependency is usually the user_id (string), not DB ID (int).
    # We need to resolve it.
    sender = db.query(User).filter(User.user_id == current_user_id).first()
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")
        
    target = db.query(User).filter(User.username == username).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
        
    if sender.id == target.id:
        raise HTTPException(status_code=400, detail="Cannot friend yourself")
        
    # Check if already friends
    if target in sender.friends:
        raise HTTPException(status_code=400, detail="Already friends")
        
    # Check if request already sent
    existing_req = db.query(FriendRequest).filter(
        FriendRequest.sender_id == sender.id,
        FriendRequest.receiver_id == target.id,
        FriendRequest.status == "pending"
    ).first()
    
    if existing_req:
        raise HTTPException(status_code=400, detail="Request already sent")
        
    # Check if they sent us one (accept it instead?) - For now just create new request
    
    new_req = FriendRequest(sender_id=sender.id, receiver_id=target.id)
    db.add(new_req)
    db.commit()
    
    return {"message": "Friend request sent"}

@router.get("/friends/requests", response_model=List[FriendRequestSchema])
def get_friend_requests(current_user_id: str = "guest", db: Session = Depends(get_db)):
    if current_user_id == "guest":
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    user = db.query(User).filter(User.user_id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    requests = db.query(FriendRequest).filter(
        FriendRequest.receiver_id == user.id,
        FriendRequest.status == "pending"
    ).all()
    
    # Map to schema manually if needed to include usernames
    result = []
    for req in requests:
        result.append({
            "id": req.id,
            "sender_username": req.sender.username,
            "status": req.status,
            "created_at": req.created_at
        })
        
    return result

@router.post("/friends/accept/{request_id}")
def accept_friend_request(request_id: int, current_user_id: str = "guest", db: Session = Depends(get_db)):
    if current_user_id == "guest":
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    user = db.query(User).filter(User.user_id == current_user_id).first()
    
    req = db.query(FriendRequest).filter(FriendRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    if req.receiver_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Request already processed")
        
    # Accept
    req.status = "accepted"
    
    try:
        # Create friendship (Bi-directional)
        sender = req.sender
        
        # Check if already friends to prevent unique constraint errors
        # Note: We must be careful with M2M appends if the relationship is already properly populated
        if sender not in user.friends:
            user.friends.append(sender)
            
        if user not in sender.friends:
            sender.friends.append(user)
        
        db.commit()
    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")
    
    return {"message": "Friend request accepted"}

@router.get("/friends")
def get_friends(current_user_id: str = "guest", db: Session = Depends(get_db)):
    if current_user_id == "guest":
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    user = db.query(User).filter(User.user_id == current_user_id).first()
    if not user: return []
    
    return [
        {"username": f.username, "elo_rating": f.elo_rating, "is_online": False} # Online status needs WebSocket manager
        for f in user.friends
    ]

@router.get("/profile/{username}", response_model=UserProfile)
def get_public_profile(username: str, current_user_id: str = "guest", db: Session = Depends(get_db)):
    # Check Cache for Public Data
    cached_profile = profile_cache.get(f"profile:{username}")
    
    if not cached_profile:
        target_user = db.query(User).filter(User.username == username).first()
        if not target_user:
            raise HTTPException(status_code=404, detail="User not found")
            
        cached_profile = {
            "username": target_user.username,
            "elo_rating": target_user.elo_rating,
            "is_premium": target_user.is_premium,
            "created_at": target_user.created_at,
            "stats": {
                "profile_views": target_user.profile_views or 0,
            }
        }
        # Update views count in background or asynchronously? 
        # For now, we trust the cached views count for 30s. 
        # Actually, let's increment views on DB even on cache hit? 
        # No, simpler to just cache reads. Views update might lag 30s.
        
        profile_cache.set(f"profile:{username}", cached_profile)

    # Compute personalized fields (is_friend)
    is_friend = False
    if current_user_id != "guest":
        me = db.query(User).filter(User.user_id == current_user_id).first()
        # We need to check friendship. This requires target_user ID or checking by username in friends list.
        # Since 'me.friends' is a list of User objects, we can check by username.
        if me:
            # Efficient check if list is huge? For now iteration is fine.
            is_friend = any(f.username == username for f in me.friends)

    # Construct final response
    return {
        **cached_profile,
        "is_friend": is_friend
    }
