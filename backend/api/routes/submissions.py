"""
API routes for code submissions
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from analyzers.complexity_analyzer import ComplexityAnalyzer
from analyzers.feedback_generator import FeedbackGenerator

router = APIRouter()

class CodeSubmission(BaseModel):
    problem_id: str
    code: str
    language: str  # 'python', 'javascript', 'java', 'cpp'
    user_id: Optional[str] = None

class AnalysisResult(BaseModel):
    submission_id: str
    time_complexity: str
    space_complexity: str
    is_optimal: bool
    feedback_tier: str  # 'optimal', 'good', 'improvable', 'alternative'
    feedback_message: str
    hints: List[str]
    patterns_detected: List[str]
    execution_time_ms: Optional[float] = None

@router.post("/submit", response_model=dict)
async def submit_code(submission: CodeSubmission, background_tasks: BackgroundTasks):
    """
    Submit code for analysis
    """
    try:
        # Generate submission ID
        submission_id = f"sub_{datetime.now().timestamp()}"
        
        # Start analysis in background
        background_tasks.add_task(
            analyze_submission,
            submission_id,
            submission.code,
            submission.language,
            submission.problem_id
        )
        
        return {
            "submission_id": submission_id,
            "status": "processing",
            "message": "Code submitted successfully. Analysis in progress."
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analysis/{submission_id}", response_model=AnalysisResult)
async def get_analysis(submission_id: str):
    """
    Get analysis results for a submission
    """
    # TODO: Implement database lookup
    # For now, return mock data
    return AnalysisResult(
        submission_id=submission_id,
        time_complexity="O(n)",
        space_complexity="O(1)",
        is_optimal=True,
        feedback_tier="optimal",
        feedback_message="Great job! Your solution is optimal for this problem.",
        hints=[],
        patterns_detected=["single_pass", "constant_space"],
        execution_time_ms=12.5
    )

async def analyze_submission(submission_id: str, code: str, language: str, problem_id: str):
    """
    Background task to analyze code submission
    """
    try:
        # Initialize analyzers
        analyzer = ComplexityAnalyzer()
        feedback_gen = FeedbackGenerator()
        
        # Analyze code
        analysis = analyzer.analyze(code, language)
        
        # Generate feedback
        feedback = feedback_gen.generate_feedback(analysis, problem_id)
        
        # TODO: Save results to database
        print(f"Analysis complete for {submission_id}: {analysis}")
        
    except Exception as e:
        print(f"Error analyzing submission {submission_id}: {e}")
