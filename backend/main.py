"""
BeatCoders Backend API
FastAPI application for code submission and analysis
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Add parent directory to path to import analyzers
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from analyzers.complexity_analyzer import ComplexityAnalyzer
from analyzers.feedback_generator import FeedbackGenerator

app = FastAPI(
    title="BeatCoders API",
    description="Code efficiency analysis and submission API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5500",  # VS Code Live Server
        "http://127.0.0.1:5500",
        "http://localhost:63342", # PyCharm Default
        "http://localhost:63343", # PyCharm Alternative
        "null",  # Allow file:// protocol for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzers
analyzer = ComplexityAnalyzer()
feedback_gen = FeedbackGenerator()

# Database setup
from config.database import engine, Base
from models.user import User
from models.user import User
from models.password_reset import PasswordReset
from models.cognitive import CognitiveHistory
Base.metadata.create_all(bind=engine)

# Import and include auth router
from api.routes import auth, cognitive
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(cognitive.router, prefix="/api/cognitive", tags=["cognitive"])

# Pydantic models
class CodeSubmission(BaseModel):
    problem_id: str
    code: str
    language: str
    user_tier: Optional[str] = "free"

class AnalysisResponse(BaseModel):
    submission_id: str
    time_complexity: str
    space_complexity: str
    is_optimal: bool
    feedback_tier: str
    feedback_message: str
    feedback_title: str
    feedback_icon: str
    hints: List[str]
    patterns_detected: List[str]
    show_celebration: bool
    alternative_approaches: Optional[List[dict]] = None

# In-memory storage (replace with database later)
submissions_db = {}

@app.get("/")
async def root():
    return {
        "message": "BeatCoders API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "submit": "/api/submissions/submit",
            "analysis": "/api/submissions/analysis/{submission_id}"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/submissions/submit", response_model=dict)
async def submit_code(submission: CodeSubmission):
    """Submit code for analysis"""
    try:
        import time
        submission_id = f"sub_{int(time.time() * 1000)}"
        
        # Analyze the code
        analysis = analyzer.analyze(submission.code, submission.language)
        
        # Generate feedback
        feedback = feedback_gen.generate_feedback(
            analysis, 
            submission.problem_id,
            submission.user_tier
        )
        
        # Store in memory
        submissions_db[submission_id] = {
            "analysis": analysis,
            "feedback": feedback,
            "problem_id": submission.problem_id,
            "language": submission.language
        }
        
        return {
            "submission_id": submission_id,
            "status": "completed",
            "message": "Code analyzed successfully!"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/submissions/analysis/{submission_id}", response_model=AnalysisResponse)
async def get_analysis(submission_id: str):
    """Get analysis results"""
    if submission_id not in submissions_db:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    data = submissions_db[submission_id]
    analysis = data["analysis"]
    feedback = data["feedback"]
    
    return AnalysisResponse(
        submission_id=submission_id,
        time_complexity=analysis.time_complexity,
        space_complexity=analysis.space_complexity,
        is_optimal=(feedback.tier == "optimal"),
        feedback_tier=feedback.tier,
        feedback_message=feedback.message,
        feedback_title=feedback.title,
        feedback_icon=feedback.icon,
        hints=feedback.hints,
        patterns_detected=analysis.patterns,
        show_celebration=feedback.show_celebration,
        alternative_approaches=feedback.alternative_approaches
    )

if __name__ == "__main__":
    import uvicorn
    print("Starting BeatCoders API server...")
    print("API Documentation: http://localhost:8001/docs")
    print("Health Check: http://localhost:8001/health")
    uvicorn.run(app, host="0.0.0.0", port=8001)
