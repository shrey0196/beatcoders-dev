from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from config.database import Base

class MentorConversation(Base):
    """AI Mentor chat conversations (Premium feature)"""
    __tablename__ = "mentor_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    session_id = Column(String, unique=True, index=True)
    
    # Conversation data
    messages = Column(JSON, default=[])  # Array of {role: 'user'|'assistant', content, timestamp}
    
    # Context for better responses
    context = Column(JSON, default={
        "current_problem": None,
        "user_code": None,
        "topic": None,
        "difficulty": None
    })
    
    # Metadata
    is_active = Column(Integer, default=1)  # 1 for active, 0 for archived
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_message_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
