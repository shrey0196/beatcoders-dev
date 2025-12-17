from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User
from models.skill_roadmap import SkillRoadmap
from analyzers.roadmap_generator import RoadmapGenerator
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()
roadmap_gen = RoadmapGenerator()

def check_premium(user: User):
    """Check if user has premium access"""
    if not user.is_premium:
        pass
        # raise HTTPException(
        #     status_code=403, 
        #     detail="This feature requires premium access. Upgrade to unlock personalized skill roadmaps!"
        # )

@router.get("/roadmap/{user_id}")
def get_roadmap(user_id: str, db: Session = Depends(get_db)):
    """Get personalized skill roadmap (Premium only)"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    check_premium(user)
    
    # Get or create roadmap
    roadmap = db.query(SkillRoadmap).filter(SkillRoadmap.user_id == user.id).first()
    
    if not roadmap:
        # Generate initial roadmap
        return {"message": "No roadmap found. Generate one first.", "has_roadmap": False}
    
    return {
        "current_level": roadmap.current_level,
        "target_skills": roadmap.target_skills,
        "weekly_plan": roadmap.weekly_plan,
        "next_recommendations": roadmap.next_recommendations,
        "completed_milestones": roadmap.completed_milestones,
        "last_updated": roadmap.last_updated.isoformat() if roadmap.last_updated else None,
        "has_roadmap": True
    }

@router.post("/roadmap/{user_id}/generate")
def generate_roadmap(user_id: str, db: Session = Depends(get_db)):
    """Generate or regenerate skill roadmap (Premium only)"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    check_premium(user)
    
    # Get user's CRS
    from models.crs import CRSScore
    crs_record = db.query(CRSScore).filter(CRSScore.user_id == user.id).first()
    
    # Use sample data since there's no Submission model
    # In production, integrate with your submission tracking system
    problems_solved = crs_record.total_problems_solved if crs_record else 0
    difficulty_dist = {"easy": 0, "medium": 0, "hard": 0}
    solved_topics = []
    
    user_data = {
        "crs_score": crs_record.score if crs_record else 0.0,
        "problems_solved": problems_solved,
        "difficulty_distribution": difficulty_dist,
        "solved_topics": solved_topics
    }
    
    # Generate roadmap
    roadmap_data = roadmap_gen.generate_roadmap(user_data)
    
    # Update or create roadmap record
    roadmap = db.query(SkillRoadmap).filter(SkillRoadmap.user_id == user.id).first()
    
    if not roadmap:
        roadmap = SkillRoadmap(user_id=user.id)
        db.add(roadmap)
    
    roadmap.current_level = roadmap_data["current_level"]
    roadmap.target_skills = roadmap_data["target_skills"]
    roadmap.weekly_plan = roadmap_data["weekly_plan"]
    roadmap.next_recommendations = roadmap_data["next_recommendations"]
    
    # Initialize milestones if empty
    if not roadmap.completed_milestones:
        roadmap.completed_milestones = []
    
    db.commit()
    db.refresh(roadmap)
    
    return {
        "message": "Roadmap generated successfully",
        "roadmap": {
            "current_level": roadmap.current_level,
            "target_skills": roadmap.target_skills,
            "weekly_plan": roadmap.weekly_plan,
            "next_recommendations": roadmap.next_recommendations
        },
        "note": "Using sample data. Integrate with your submission system for personalized roadmaps."
    }

@router.get("/roadmap/{user_id}/weekly-plan")
def get_weekly_plan(user_id: str, db: Session = Depends(get_db)):
    """Get adaptive weekly plan (Premium only)"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    check_premium(user)
    
    roadmap = db.query(SkillRoadmap).filter(SkillRoadmap.user_id == user.id).first()
    
    if not roadmap:
        raise HTTPException(status_code=404, detail="No roadmap found. Generate one first.")
    
    return {
        "weekly_plan": roadmap.weekly_plan,
        "current_level": roadmap.current_level
    }

@router.post("/roadmap/{user_id}/milestone")
def complete_milestone(user_id: str, request: dict, db: Session = Depends(get_db)):
    """Mark a milestone as completed (Premium only)"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    check_premium(user)
    
    milestone_name = request.get("milestone_name")
    if not milestone_name:
        raise HTTPException(status_code=400, detail="milestone_name required")
    
    roadmap = db.query(SkillRoadmap).filter(SkillRoadmap.user_id == user.id).first()
    
    if not roadmap:
        raise HTTPException(status_code=404, detail="No roadmap found")
    
    # Add to completed milestones
    if not roadmap.completed_milestones:
        roadmap.completed_milestones = []
    
    milestone_entry = {
        "milestone": milestone_name,
        "completed_at": datetime.utcnow().isoformat()
    }
    
    roadmap.completed_milestones.append(milestone_entry)
    db.commit()
    
    return {
        "message": "Milestone completed!",
        "milestone": milestone_entry
    }

@router.get("/roadmap/{user_id}/suggestions")
def get_suggestions(user_id: str, db: Session = Depends(get_db)):
    """Get smart course/problem suggestions (Premium only)"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    check_premium(user)
    
    roadmap = db.query(SkillRoadmap).filter(SkillRoadmap.user_id == user.id).first()
    
    if not roadmap:
        # Return generic suggestions
        return {
            "suggestions": [
                {
                    "type": "course",
                    "title": "Getting Started with Algorithms",
                    "description": "Build a strong foundation in problem-solving",
                    "link": "#"
                }
            ]
        }
    
    return {
        "suggestions": roadmap.next_recommendations,
        "current_level": roadmap.current_level,
        "focus_areas": roadmap.weekly_plan.get("focus_areas", [])
    }
