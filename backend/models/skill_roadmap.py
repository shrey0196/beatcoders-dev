from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from config.database import Base

class SkillRoadmap(Base):
    """Personalized skill development roadmap (Premium feature)"""
    __tablename__ = "skill_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    
    # Skill assessment
    current_level = Column(String, default="beginner")  # beginner, intermediate, advanced, expert
    target_skills = Column(JSON, default=[])  # Array of skill names to develop
    
    # Weekly adaptive plan
    weekly_plan = Column(JSON, default={
        "week_number": 1,
        "start_date": None,
        "goals": [],
        "recommended_problems": [],
        "focus_areas": []
    })
    
    # Progress tracking
    completed_milestones = Column(JSON, default=[])  # Array of {milestone, completed_at}
    next_recommendations = Column(JSON, default=[])  # Array of {type, title, description, link}
    
    # Metadata
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
