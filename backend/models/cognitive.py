from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from config.database import Base

class CognitiveHistory(Base):
    __tablename__ = "cognitive_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    task_id = Column(String, index=True)
    signals = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
