from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from config.database import Base

class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    reset_code = Column(String)
    expires_at = Column(DateTime(timezone=True))
    used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
