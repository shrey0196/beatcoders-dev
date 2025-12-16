from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, nullable=True)
    password_hash = Column(String)
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)
    verification_code_expires = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Premium tier fields
    is_premium = Column(Boolean, default=False)
    premium_since = Column(DateTime(timezone=True), nullable=True)
    premium_expires = Column(DateTime(timezone=True), nullable=True)

    # Gamification
    elo_rating = Column(Integer, default=1200)
