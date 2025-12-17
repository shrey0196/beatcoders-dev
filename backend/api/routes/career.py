from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from config.database import get_db
from models.user import User
from models.crs import CRSScore

router = APIRouter()

class ProfileUpdate(BaseModel):
    is_public_profile: bool
    open_to_work: Optional[bool] = None

@router.post("/career/profile/publish")
def publish_profile(
    update: ProfileUpdate, 
    user_id: str = Body(..., embed=True), 
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_public_profile = update.is_public_profile
    if update.open_to_work is not None:
        user.open_to_work = update.open_to_work
        
    db.commit()
    return {"message": "Profile updated", "is_public": user.is_public_profile}

@router.get("/career/profile/{target_id}")
def get_public_profile(target_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == target_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not user.is_public_profile:
        raise HTTPException(status_code=403, detail="Profile is private")
        
    crs = db.query(CRSScore).filter(CRSScore.user_id == target_id).first()
    crs_score = crs.score if crs else 0
    crs_tier = "Unranked" # Logic to get tier needed if we want it here, or fetch separately
    
    return {
        "user_id": user.user_id,
        "username": user.username,
        "elo": user.elo_rating,
        "is_premium": user.is_premium,
        "open_to_work": user.open_to_work,
        "crs_score": crs_score,
        "joined_at": user.created_at
    }

@router.get("/career/marketplace")
def get_marketplace(db: Session = Depends(get_db)):
    # In a real app, strict filters. Here, return all public profiles who are 'open_to_work'
    candidates = db.query(User).filter(
        User.is_public_profile == True,
        User.open_to_work == True
    ).limit(20).all()
    
    return [{
        "user_id": u.user_id,
        "username": u.username,
        "elo": u.elo_rating,
        "is_premium": u.is_premium
    } for u in candidates]
