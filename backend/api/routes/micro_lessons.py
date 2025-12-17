from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User
from pydantic import BaseModel
from typing import Optional, List
import random

router = APIRouter()

# Lesson Content Library
LESSON_LIBRARY = {
    "frustration_high": [
        {
            "id": "mindset_break",
            "title": "🧠 Brain Reset",
            "content": "Frustration is a sign that your brain is learning. Take a 2-minute walk. Scientific studies show that 'diffuse mode' thinking often solves problems that focused logic can't.",
            "type": "mindset"
        },
        {
            "id": "rubber_duck",
            "title": "🦆 Rubber Ducking",
            "content": "Explain your code line-by-line to an inanimate object (or us). 90% of bugs are found just by articulating the logic out loud.",
            "type": "technique"
        }
    ],
    "error_streak": [
        {
            "id": "print_debug",
            "title": "🔍 Visibility is Key",
            "content": "Don't guess! Add print statements before and after your main logic blocks. See exactly where the data diverges from your expectation.",
            "type": "technique"
        },
        {
            "id": "simplify",
            "title": "📉 Simplify the Problem",
            "content": "Comment out 50% of your code. Does it run? If yes, the bug is in the other half. Binary search your way to the error.",
            "type": "strategy"
        }
    ],
    "idle_long": [
        {
            "id": "just_start",
            "title": "🚀 The 5-Minute Rule",
            "content": "Overwhelmed? Commit to working for just 5 minutes. Usually, the hardest part is simply starting.",
            "type": "motivation"
        }
    ],
    "general": [
        {
            "id": "growth_mindset",
            "title": "🌱 Growth Mindset",
            "content": "You aren't 'bad at coding'. You just haven't solved *this* problem *yet*.",
            "type": "mindset"
        }
    ]
}

class LessonRequest(BaseModel):
    user_id: str
    trigger: str  # e.g., 'frustration', 'error', 'idle', 'login'
    context_score: Optional[float] = 0.0 # e.g., frustration level 0.0-1.0

@router.post("/learning/lesson")
def get_micro_lesson(req: LessonRequest, db: Session = Depends(get_db)):
    """
    Get a context-aware micro-lesson.
    PREMIUM ONLY.
    """
    # 1. Verify User & Premium Status
    user = db.query(User).filter(User.user_id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.is_premium:
        raise HTTPException(
            status_code=403, 
            detail="Micro-lessons are a Premium feature. Upgrade to unlock your AI Coach."
        )

    # 2. Select Lesson Strategy
    candidates = []
    
    if req.trigger == 'frustration' and req.context_score > 0.6:
        candidates.extend(LESSON_LIBRARY["frustration_high"])
    elif req.trigger == 'error_streak':
        candidates.extend(LESSON_LIBRARY["error_streak"])
    elif req.trigger == 'idle':
        candidates.extend(LESSON_LIBRARY["idle_long"])
    
    # Fallback
    if not candidates:
        candidates.extend(LESSON_LIBRARY["general"])
    
    # 3. Pick random lesson (in a real app, we'd track history to avoid repeats)
    selected_lesson = random.choice(candidates)
    
    return {
        "lesson": selected_lesson,
        "trigger": req.trigger
    }
