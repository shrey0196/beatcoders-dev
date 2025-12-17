from sqlalchemy import Column, Integer, Float, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from config.database import Base

class CRSScore(Base):
    """Cognitive Rating Score - tracks user's overall coding performance"""
    __tablename__ = "crs_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    score = Column(Float, default=0.0)  # 0-1000 scale
    
    # Score component breakdown
    components = Column(JSON, default={
        "speed": 0.0,        # 25% weight
        "accuracy": 0.0,     # 30% weight
        "problem_solving": 0.0,  # 30% weight
        "consistency": 0.0   # 15% weight
    })
    
    # Historical data for growth tracking
    history = Column(JSON, default=[])  # Array of {timestamp, score, components}
    
    # Metadata
    total_problems_solved = Column(Integer, default=0)
    days_active = Column(Integer, default=0)  # Number of unique days with activity
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
