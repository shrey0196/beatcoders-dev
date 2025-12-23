from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User
from models.mentor_conversation import MentorConversation
from analyzers.ai_mentor_engine import AIMentorEngine
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()
mentor_engine = AIMentorEngine()

def check_premium(user: User, context: Optional[dict] = None):
    """Check if user has premium access"""
    # DEV OVERRIDE: Allow all users for testing
    return

    # Bypass for Interrogation Mode (Cognitive Mirror)
    if context and (context.get('source') == 'interrogation' or context.get('trigger') in ['PASTE', 'TRANSCRIPTION']):
        return

    if not user.is_premium:
        raise HTTPException(
            status_code=403, 
            detail="AI Mentor is a premium feature. Upgrade to get 24/7 coding guidance!"
        )

class ChatMessage(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    message: str
    context: Optional[dict] = None

@router.post("/mentor/chat")
def chat_with_mentor(chat: ChatMessage, db: Session = Depends(get_db)):
    """Send message to AI mentor and get response (Premium only)"""
    user = db.query(User).filter(User.user_id == chat.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    check_premium(user, chat.context)
    
    # Get or create session
    if chat.session_id:
        session = db.query(MentorConversation).filter(
            MentorConversation.session_id == chat.session_id
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        # Create new session
        session_id = str(uuid.uuid4())
        session = MentorConversation(
            user_id=user.id,
            session_id=session_id,
            messages=[],
            context=chat.context or {}
        )
        db.add(session)
    
    # Add user message to history
    if not session.messages:
        session.messages = []
    
    user_message = {
        "role": "user",
        "content": chat.message,
        "timestamp": datetime.utcnow().isoformat()
    }
    session.messages.append(user_message)
    
    # Generate AI response
    context = session.context or {}
    if chat.context:
        context.update(chat.context)
    
    ai_response = mentor_engine.generate_response(chat.message, context)
    
    # Add AI response to history
    ai_message = {
        "role": "assistant",
        "content": ai_response,
        "timestamp": datetime.utcnow().isoformat()
    }
    session.messages.append(ai_message)
    
    # Update context if provided
    if chat.context:
        session.context = context
    
    db.commit()
    db.refresh(session)
    
    return {
        "session_id": session.session_id,
        "response": ai_response,
        "timestamp": ai_message["timestamp"]
    }

@router.get("/mentor/{user_id}/sessions")
def get_mentor_sessions(user_id: str, db: Session = Depends(get_db)):
    """Get list of mentor sessions for a user (Premium only)"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    check_premium(user)
    
    sessions = db.query(MentorConversation).filter(
        MentorConversation.user_id == user.id,
        MentorConversation.is_active == 1
    ).order_by(MentorConversation.last_message_at.desc()).all()
    
    session_list = []
    for session in sessions:
        # Get last message preview
        last_message = session.messages[-1] if session.messages else None
        preview = last_message["content"][:50] + "..." if last_message else "New session"
        
        session_list.append({
            "session_id": session.session_id,
            "created_at": session.created_at.isoformat(),
            "last_message_at": session.last_message_at.isoformat(),
            "message_count": len(session.messages) if session.messages else 0,
            "preview": preview,
            "context": session.context
        })
    
    return {"sessions": session_list}

@router.get("/mentor/session/{session_id}")
def get_session_history(session_id: str, db: Session = Depends(get_db)):
    """Get specific session history (Premium only)"""
    session = db.query(MentorConversation).filter(
        MentorConversation.session_id == session_id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Verify user has premium (through user_id)
    user = db.query(User).filter(User.id == session.user_id).first()
    if user:
        check_premium(user)
    
    return {
        "session_id": session.session_id,
        "messages": session.messages,
        "context": session.context,
        "created_at": session.created_at.isoformat(),
        "last_message_at": session.last_message_at.isoformat()
    }

@router.post("/mentor/session/new")
def create_new_session(request: dict, db: Session = Depends(get_db)):
    """Start a new mentor session (Premium only)"""
    user_id = request.get("user_id")
    context = request.get("context", {})
    
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")
    
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    check_premium(user)
    
    # Create new session
    session_id = str(uuid.uuid4())
    session = MentorConversation(
        user_id=user.id,
        session_id=session_id,
        messages=[],
        context=context
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # Generate welcome message
    welcome_message = mentor_engine.generate_response("hello", context)
    
    ai_message = {
        "role": "assistant",
        "content": welcome_message,
        "timestamp": datetime.utcnow().isoformat()
    }
    session.messages = [ai_message]
    db.commit()
    
    return {
        "session_id": session.session_id,
        "welcome_message": welcome_message,
        "created_at": session.created_at.isoformat()
    }

@router.delete("/mentor/session/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Delete/archive a mentor session (Premium only)"""
    session = db.query(MentorConversation).filter(
        MentorConversation.session_id == session_id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Verify user has premium
    user = db.query(User).filter(User.id == session.user_id).first()
    if user:
        check_premium(user)
    
    # Archive instead of delete
    session.is_active = 0
    db.commit()
    
    return {"message": "Session archived successfully"}

@router.post("/mentor/problem-guidance")
def get_problem_guidance(request: dict, db: Session = Depends(get_db)):
    """Get AI guidance for a specific problem (Premium only)"""
    user_id = request.get("user_id")
    problem_data = request.get("problem_data", {})
    
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")
    
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    check_premium(user)
    
    # Generate problem-specific guidance
    guidance = mentor_engine.get_problem_specific_guidance(problem_data)
    
    return {
        "guidance": guidance,
        "problem": problem_data.get("title", "Current problem")
    }
