from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, nullable=True, index=True)
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
    elo_rating = Column(Integer, default=1200, index=True)

    # Phase 14: Career
    is_public_profile = Column(Boolean, default=False)
    open_to_work = Column(Boolean, default=False)
    profile_views = Column(Integer, default=0)

    # Phase 6: Social
    # Friends relationship (self-referential many-to-many)
    friends = relationship(
        "User",
        secondary="friendships",
        primaryjoin="User.id==friendships.c.user_id",
        secondaryjoin="User.id==friendships.c.friend_id",
        backref="friended_by"
    )


# Phase 6: Association Table for Friendships
friendships = Table(
    'friendships', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('friend_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('created_at', DateTime(timezone=True), server_default=func.now())
)

class FriendRequest(Base):
    __tablename__ = "friend_requests"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), index=True)
    receiver_id = Column(Integer, ForeignKey("users.id"), index=True)
    status = Column(String, default="pending", index=True) # pending, accepted, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_requests")
    receiver = relationship("User", foreign_keys=[receiver_id], backref="received_requests")
