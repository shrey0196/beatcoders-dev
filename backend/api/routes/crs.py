from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User
from models.crs import CRSScore
from analyzers.crs_calculator import CRSCalculator
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()
crs_calculator = CRSCalculator()

class CRSResponse(BaseModel):
    score: float
    components: dict
    tier: str
    insights: list
    total_problems_solved: int
    last_updated: str

@router.get("/crs/{user_id}")
def get_crs(user_id: str, db: Session = Depends(get_db)):
    """Get current CRS score for a user"""
    # Get user
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get or create CRS record
    crs_record = db.query(CRSScore).filter(CRSScore.user_id == user.id).first()
    
    if not crs_record:
        # Create initial CRS record
        crs_record = CRSScore(
            user_id=user.id,
            score=0.0,
            components={"speed": 0.0, "accuracy": 0.0, "problem_solving": 0.0, "consistency": 0.0},
            history=[],
            total_problems_solved=0
        )
        db.add(crs_record)
        db.commit()
        db.refresh(crs_record)
    
    return {
        "score": crs_record.score,
        "components": crs_record.components,
        "tier": crs_calculator._get_tier(crs_record.score),
        "insights": crs_calculator._generate_insights(
            crs_record.components, 
            crs_record.score, 
            crs_calculator._get_tier(crs_record.score)
        ),
        "total_problems_solved": crs_record.total_problems_solved,
        "last_updated": crs_record.last_updated.isoformat() if crs_record.last_updated else None
    }

@router.get("/crs/{user_id}/history")
def get_crs_history(user_id: str, db: Session = Depends(get_db)):
    """Get CRS score history for graphing"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    crs_record = db.query(CRSScore).filter(CRSScore.user_id == user.id).first()
    
    if not crs_record:
        return {"history": [], "current_score": 0.0}
    
    return {
        "history": crs_record.history,
        "current_score": crs_record.score
    }

@router.post("/crs/calculate")
def calculate_crs(request: dict, db: Session = Depends(get_db)):
    """
    Recalculate CRS score after a problem submission
    Request body: {"user_id": str}
    
    Note: This is a simplified version that works without database submissions.
    In production, integrate with your submission tracking system.
    """
    user_id = request.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")
    
    # Get user
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Since there's no Submission model, we'll use sample data for now
    # In production, you would query your actual submission tracking system
    
    # Check if submission data is provided in request
    submission_data = request.get("submission_data")
    
    if not submission_data:
        # Fallback to sample data if not provided
        submission_data = [
            {
                "status": "accepted",
                "time_taken": 600,  # 10 minutes
                "difficulty": "easy",
                "attempt_number": 1,
                "submitted_at": datetime.utcnow().isoformat()
            }
        ]
    
    problems_solved = 1  # Replace with actual count
    total_attempts = 1   # Replace with actual count
    difficulty_dist = {"easy": 1, "medium": 0, "hard": 0}  # Replace with actual data
    
    # Get cognitive sessions (if available)
    from models.cognitive import CognitiveHistory
    cognitive_sessions = db.query(CognitiveHistory).filter(
        CognitiveHistory.user_id == user.id
    ).all()
    
    cognitive_data = []
    for session in cognitive_sessions:
        if session.signals:
            cognitive_data.append({
                "analysis": {
                    "dominant_state": "normal"
                }
            })
    
    # Calculate CRS
    user_data = {
        "submissions": submission_data,
        "cognitive_sessions": cognitive_data,
        "problems_solved": problems_solved,
        "total_attempts": total_attempts,
        "difficulty_distribution": difficulty_dist
    }
    
    crs_result = crs_calculator.calculate_crs(user_data)
    
    # Update or create CRS record
    crs_record = db.query(CRSScore).filter(CRSScore.user_id == user.id).first()
    
    if not crs_record:
        crs_record = CRSScore(user_id=user.id)
        db.add(crs_record)
    
    # Update score and components
    crs_record.score = crs_result["score"]
    crs_record.components = crs_result["components"]
    crs_record.total_problems_solved = problems_solved
    
    # Add to history
    if not crs_record.history:
        crs_record.history = []
    
    history_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "score": crs_result["score"],
        "components": crs_result["components"]
    }
    crs_record.history.append(history_entry)
    
    # Keep only last 50 history entries
    if len(crs_record.history) > 50:
        crs_record.history = crs_record.history[-50:]
    
    db.commit()
    db.refresh(crs_record)
    
    return {
        "message": "CRS calculated successfully",
        "score": crs_record.score,
        "tier": crs_result["tier"],
        "insights": crs_result["insights"],
        "note": "Using sample data. Integrate with your submission system for accurate CRS."
    }

@router.get("/crs/{user_id}/insights")
def get_crs_insights(user_id: str, db: Session = Depends(get_db)):
    """Get personalized insights based on CRS"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    crs_record = db.query(CRSScore).filter(CRSScore.user_id == user.id).first()
    
    if not crs_record:
        return {
            "insights": ["Start solving problems to build your CRS score!"],
            "recommendations": ["Try some easy problems to get started"]
        }
    
    tier = crs_calculator._get_tier(crs_record.score)
    insights = crs_calculator._generate_insights(crs_record.components, crs_record.score, tier)
    
    # Add recommendations based on weak areas
    recommendations = []
    components = crs_record.components
    
    if components.get("speed", 0) < 400:
        recommendations.append("Practice with a timer to improve your speed")
    if components.get("accuracy", 0) < 400:
        recommendations.append("Focus on understanding problems before coding")
    if components.get("problem_solving", 0) < 400:
        recommendations.append("Try harder problems to boost problem-solving skills")
    if components.get("consistency", 0) < 400:
        recommendations.append("Set a daily coding goal to build consistency")
    
    return {
        "insights": insights,
        "recommendations": recommendations,
        "tier": tier,
        "score": crs_record.score
    }
