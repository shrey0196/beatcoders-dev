"""
API routes for code submissions
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from analyzers.complexity_analyzer import ComplexityAnalyzer
from analyzers.feedback_generator import FeedbackGenerator
from analyzers.code_executor import CodeExecutor
from test_cases.problems import get_test_cases
import traceback

router = APIRouter()

# In-memory storage for analysis results (replace with DB in production)
submission_results: Dict[str, 'AnalysisResult'] = {}

class CodeSubmission(BaseModel):
    problem_id: str
    code: str
    language: str  # 'python', 'javascript', 'java', 'cpp'
    user_id: Optional[str] = None
    user_tier: Optional[str] = 'free'

class TestCaseResult(BaseModel):
    passed: bool
    description: str
    input: Dict
    expected: Any
    actual: Any
    error: Optional[str] = None

class AnalysisResult(BaseModel):
    submission_id: str
    time_complexity: str
    space_complexity: str
    is_optimal: bool
    feedback_tier: str  # 'optimal', 'good', 'improvable', 'alternative', 'error'
    feedback_message: str
    feedback_title: str
    feedback_icon: str
    hints: List[str]
    patterns_detected: List[str]
    execution_time_ms: Optional[float] = None
    show_celebration: bool = False
    points: int = 0
    # Test execution results
    tests_passed: int = 0
    tests_total: int = 0
    test_results: List[TestCaseResult] = []

@router.post("/submit", response_model=dict)
async def submit_code(submission: CodeSubmission):
    """
    Submit code for analysis (Synchronous for immediate feedback)
    """
    try:
        # Generate submission ID
        submission_id = f"sub_{datetime.now().timestamp()}"
        
        # Run analysis synchronously
        analysis_result = await analyze_submission(
            submission_id,
            submission.code,
            submission.language,
            submission.problem_id,
            submission.user_tier or 'free'
        )
        
        # Store result
        submission_results[submission_id] = analysis_result
        
        return {
            "submission_id": submission_id,
            "status": "completed",
            "message": "Analysis complete."
        }
    
    except Exception as e:
        print(f"Submission error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analysis/{submission_id}", response_model=AnalysisResult)
async def get_analysis(submission_id: str):
    """
    Get analysis results for a submission
    """
    if submission_id not in submission_results:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return submission_results[submission_id]

async def analyze_submission(submission_id: str, code: str, language: str, problem_id: str, user_tier: str = 'free') -> AnalysisResult:
    """
    Analyze code submission and return result
    """
    try:
        # Get test cases for the problem
        test_data = get_test_cases(problem_id)
        
        if not test_data:
            # No test cases defined, skip execution
            return await _analyze_without_tests(submission_id, code, language, problem_id, user_tier)
        
        # Execute code against test cases
        executor = CodeExecutor()
        execution_result = executor.execute_tests(
            code=code,
            function_name=test_data["function_name"],
            test_cases=test_data["test_cases"],
            language=language
        )
        
        # Check for syntax errors
        if execution_result.syntax_error:
            return AnalysisResult(
                submission_id=submission_id,
                time_complexity="N/A",
                space_complexity="N/A",
                is_optimal=False,
                feedback_tier="improvable",
                feedback_message=f"❌ {execution_result.syntax_error}",
                feedback_title="Syntax Error",
                feedback_icon="❌",
                hints=["Check your syntax and try again.", "Make sure all parentheses and brackets are properly closed."],
                patterns_detected=[],
                execution_time_ms=0.0,
                show_celebration=False,
                tests_passed=0,
                tests_total=execution_result.tests_total,
                test_results=[]
            )
        
        # Convert test results to API format
        test_results_api = [
            TestCaseResult(
                passed=tr.passed,
                description=tr.description,
                input=tr.input,
                expected=tr.expected,
                actual=tr.actual,
                error=tr.error
            )
            for tr in execution_result.test_results
        ]
        
        # If tests failed, return failure feedback
        if not execution_result.all_passed:
            failed_tests = [tr for tr in execution_result.test_results if not tr.passed]
            first_failure = failed_tests[0] if failed_tests else None
            
            error_msg = f"❌ {execution_result.tests_passed}/{execution_result.tests_total} test cases passed."
            if first_failure and first_failure.error:
                error_msg += f"\n\nFirst failure: {first_failure.description}\n{first_failure.error}"
            
            return AnalysisResult(
                submission_id=submission_id,
                time_complexity="N/A",
                space_complexity="N/A",
                is_optimal=False,
                feedback_tier="improvable",
                feedback_message=error_msg,
                feedback_title="Tests Failed",
                feedback_icon="❌",
                hints=["Review the failed test cases below.", "Check your logic and edge cases."],
                patterns_detected=[],
                execution_time_ms=0.0,
                show_celebration=False,
                tests_passed=execution_result.tests_passed,
                tests_total=execution_result.tests_total,
                test_results=test_results_api
            )
        
        # All tests passed! Now run complexity analysis
        analyzer = ComplexityAnalyzer()
        feedback_gen = FeedbackGenerator()
        
        analysis = analyzer.analyze(code, language)
        feedback = feedback_gen.generate_feedback(analysis, problem_id, user_tier)
        
        # Calculate points
        points = 50 # Base points
        if feedback.tier == "optimal":
            points = 100
        elif feedback.tier == "good":
            points = 80
        
        return AnalysisResult(
            submission_id=submission_id,
            time_complexity=analysis.time_complexity,
            space_complexity=analysis.space_complexity,
            is_optimal=(feedback.tier == "optimal"),
            feedback_tier=feedback.tier,
            feedback_message=f"✅ All {execution_result.tests_total} test cases passed!\n\n{feedback.message}",
            feedback_title=feedback.title,
            feedback_icon=feedback.icon,
            hints=feedback.hints,
            patterns_detected=analysis.patterns,
            execution_time_ms=sum(tr.execution_time_ms for tr in execution_result.test_results) / len(execution_result.test_results),
            show_celebration=feedback.show_celebration,
            points=points,
            tests_passed=execution_result.tests_passed,
            tests_total=execution_result.tests_total,
            test_results=test_results_api
        )
        
    except Exception as e:
        print(f"Analysis unexpected error: {e}")
        traceback.print_exc()
        return AnalysisResult(
            submission_id=submission_id,
            time_complexity="N/A",
            space_complexity="N/A",
            is_optimal=False,
            feedback_tier="uncertain",
            feedback_message=f"⚠️ Analysis failed: {str(e)}",
            feedback_title="Analysis Error",
            feedback_icon="⚠️",
            hints=["Please try again or contact support if the issue persists."],
            patterns_detected=[],
            execution_time_ms=0.0,
            show_celebration=False,
            tests_passed=0,
            tests_total=0,
            test_results=[]
        )

async def _analyze_without_tests(submission_id: str, code: str, language: str, problem_id: str, user_tier: str) -> AnalysisResult:
    """Fallback for problems without test cases"""
    try:
        analyzer = ComplexityAnalyzer()
        feedback_gen = FeedbackGenerator()
        
        analysis = analyzer.analyze(code, language)
        feedback = feedback_gen.generate_feedback(analysis, problem_id, user_tier)
        
        return AnalysisResult(
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
            execution_time_ms=0.0,
            show_celebration=feedback.show_celebration,
            tests_passed=0,
            tests_total=0,
            test_results=[]
        )
    except ValueError as e:
        return AnalysisResult(
            submission_id=submission_id,
            time_complexity="N/A",
            space_complexity="N/A",
            is_optimal=False,
            feedback_tier="improvable",
            feedback_message=f"❌ Syntax Error: {str(e)}",
            feedback_title="Code Error",
            feedback_icon="❌",
            hints=["Check your syntax and try again."],
            patterns_detected=[],
            execution_time_ms=0.0,
            show_celebration=False,
            tests_passed=0,
            tests_total=0,
            test_results=[]
        )


# Database-backed endpoints

from sqlalchemy.orm import Session
from fastapi import Depends
from config.database import get_db
from models.submission import Submission
from typing import List

class SubmissionStatus(BaseModel):
    problem_id: str
    status: str
    points: int
    language: str

class SubmissionHistoryItem(BaseModel):
    id: int
    problem_id: str
    code: str
    language: str
    status: str
    points: int
    created_at: datetime

@router.get("/status/{user_id}", response_model=Dict[str, SubmissionStatus])
async def get_user_problem_status(user_id: str, db: Session = Depends(get_db)):
    """
    Get status of all problems for a user
    Returns: {problem_id: {status: 'accepted', points: 100, ...}}
    """
    # Get all submissions for user
    submissions = db.query(Submission).filter(Submission.user_id == user_id).all()
    
    status_map = {}
    
    for sub in submissions:
        # If problem already in map, only update if this submission is 'accepted' 
        # or if it's newer (for history tracking, but for status we care about 'accepted')
        
        # Simple logic: If we have an accepted submission, the problem is solved.
        # Use the best score.
        
        if sub.problem_id not in status_map:
            status_map[sub.problem_id] = SubmissionStatus(
                problem_id=sub.problem_id,
                status=sub.status,
                points=sub.points,
                language=sub.language
            )
        else:
            current = status_map[sub.problem_id]
            # Update if new one is accepted and current is not, or if new one has more points
            if (sub.status == 'accepted' and current.status != 'accepted') or \
               (sub.status == 'accepted' and sub.points > current.points):
                status_map[sub.problem_id] = SubmissionStatus(
                    problem_id=sub.problem_id,
                    status=sub.status,
                    points=sub.points,
                    language=sub.language
                )
    
    return status_map

@router.get("/history/{user_id}/{problem_id}", response_model=List[SubmissionHistoryItem])
async def get_submission_history(user_id: str, problem_id: str, db: Session = Depends(get_db)):
    """
    Get submission history for a specific problem
    """
    submissions = db.query(Submission).filter(
        Submission.user_id == user_id,
        Submission.problem_id == problem_id
    ).order_by(Submission.created_at.desc()).all()
    
    return [
        SubmissionHistoryItem(
            id=s.id,
            problem_id=s.problem_id,
            code=s.code,
            language=s.language,
            status=s.status,
            points=s.points,
            created_at=s.created_at
        )
        for s in submissions
    ]

@router.get("/all/{user_id}", response_model=List[SubmissionHistoryItem])
async def get_all_user_submissions(user_id: str, limit: int = 50, db: Session = Depends(get_db)):
    """
    Get all recent submissions for a user across all problems
    """
    submissions = db.query(Submission).filter(
        Submission.user_id == user_id
    ).order_by(Submission.created_at.desc()).limit(limit).all()

    return [
        SubmissionHistoryItem(
            id=s.id,
            problem_id=s.problem_id,
            code=s.code,  # Might want to exclude code for list view if heavy, but ok for now
            language=s.language,
            status=s.status,
            points=s.points,
            created_at=s.created_at,
        )
        for s in submissions
    ]
