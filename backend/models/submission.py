from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from config.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    problem_id = Column(String, index=True)
    code = Column(Text)
    language = Column(String)
    status = Column(String)  # 'accepted', 'failed'
    points = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
