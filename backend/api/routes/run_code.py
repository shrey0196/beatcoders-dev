from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sys
import io
import traceback
from contextlib import redirect_stdout, redirect_stderr
from test_cases.hidden_tests import get_hidden_tests
# Import analyzers
from analyzers.complexity_analyzer import ComplexityAnalyzer
from analyzers.feedback_generator import FeedbackGenerator
# DB Imports
from fastapi import Depends
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User

router = APIRouter()

class TestCase(BaseModel):
    input: Dict[str, Any]
    output: Any

class RunCodeRequest(BaseModel):
    code: str
    language: str = "python"
    testCases: List[TestCase]
    problemId: str

class SubmitCodeRequest(BaseModel):
    code: str
    language: str = "python"
    problemId: str
    testCases: Optional[List[TestCase]] = []

class TestResult(BaseModel):
    caseNumber: int
    passed: bool
    input: Dict[str, Any]
    expected: Any
    actual: Optional[Any]
    error: Optional[str]
    hidden: bool = False

class RunCodeResponse(BaseModel):
    success: bool
    allPassed: bool
    results: List[TestResult]

class SubmitCodeResponse(BaseModel):
    success: bool
    allPassed: bool
    passedCount: int
    totalCount: int
    results: List[TestResult]
    runtime: str
    memory: str
    # Performance Stats
    runtimePercentile: Optional[float] = None
    memoryPercentile: Optional[float] = None
    # Analysis Fields
    points: int = 50
    timeComplexity: str = "N/A"
    spaceComplexity: str = "N/A"
    feedback_tier: str = "improvable"
    is_optimal: bool = False



def execute_python_code(code: str, test_case: Dict) -> tuple:
    """
    Execute Python code with a single test case
    Returns: (passed, actual_output, error)
    """
    try:
        # Create a namespace for execution
        namespace = {}
        
        # Capture stdout
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        
        try:
            # Execute the user's code to define the function
            exec(code, namespace)
            
            # Find the function name (assume it's the first function defined)
            func_name = None
            for name, obj in namespace.items():
                if callable(obj) and not name.startswith('__'):
                    func_name = name
                    break
            
            if not func_name:
                return False, None, "No function found in code"
            
            # Get the function
            user_function = namespace[func_name]
            
            # Call the function with test inputs
            input_data = test_case['input']
            expected_output = test_case['output']
            
            # Call function with unpacked arguments
            if isinstance(input_data, dict):
                actual_output = user_function(**input_data)
            else:
                actual_output = user_function(input_data)
            
            # Compare output
            passed = actual_output == expected_output
            
            return passed, actual_output, None
            
        finally:
            # Restore stdout
            output = sys.stdout.getvalue()
            sys.stdout = old_stdout
            
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        return False, None, error_msg

@router.post("/api/run-code", response_model=RunCodeResponse)
async def run_code(request: RunCodeRequest):
    """
    Execute code against visible test cases
    """
    try:
        if not request.code:
            raise HTTPException(status_code=400, detail="No code provided")
        
        if request.language != 'python':
            raise HTTPException(status_code=400, detail="Only Python is supported currently")
        
        results = []
        
        for i, test_case in enumerate(request.testCases):
            test_dict = {
                'input': test_case.input,
                'output': test_case.output
            }
            passed, actual, error = execute_python_code(request.code, test_dict)
            
            result = TestResult(
                caseNumber=i + 1,
                passed=passed,
                input=test_case.input,
                expected=test_case.output,
                actual=actual,
                error=error
            )
            results.append(result)
        
        all_passed = all(r.passed for r in results)
        
        return RunCodeResponse(
            success=True,
            allPassed=all_passed,
            results=results
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/submit-code", response_model=SubmitCodeResponse)
async def submit_code(request: SubmitCodeRequest, db: Session = Depends(get_db)):
    """
    Execute code against all test cases (visible + hidden)
    """
    try:
        if not request.code:
            raise HTTPException(status_code=400, detail="No code provided")
        
        if request.language != 'python':
            raise HTTPException(status_code=400, detail="Only Python is supported currently")
        
        # Get hidden test cases from centralized module
        hidden_test_cases_raw = get_hidden_tests(request.problemId)
        hidden_test_cases = [
            {"input": tc["input"], "output": tc["output"]}
            for tc in hidden_test_cases_raw
        ]
        
        # Combine all test cases
        visible_test_cases = [{"input": tc.input, "output": tc.output} for tc in request.testCases]
        all_test_cases = visible_test_cases + hidden_test_cases
        
        results = []
        for i, test_case in enumerate(all_test_cases):
            passed, actual, error = execute_python_code(request.code, test_case)
            
            result = TestResult(
                caseNumber=i + 1,
                passed=passed,
                input=test_case['input'],
                expected=test_case['output'],
                actual=actual,
                error=error,
                hidden=i >= len(visible_test_cases)
            )
            results.append(result)
        
        all_passed = all(r.passed for r in results)
        passed_count = sum(1 for r in results if r.passed)
        
        # Run Code Analysis
        analyzer = ComplexityAnalyzer()
        feedback_gen = FeedbackGenerator()
        
        # Analysis Variables
        points = 50
        time_comp = "N/A"
        space_comp = "N/A"
        tier = "improvable"
        is_optimal = False
        
        try:
            analysis = analyzer.analyze(request.code, request.language)
            feedback = feedback_gen.generate_feedback(analysis, request.problemId, "free")
            
            # Points Logic
            if feedback.tier == "optimal":
                points = 100
            elif feedback.tier == "good":
                points = 80
                
            time_comp = analysis.time_complexity
            space_comp = analysis.space_complexity
            tier = feedback.tier
            is_optimal = (tier == "optimal")
            
        except Exception as e:
            print(f"Analysis failed: {e}")
        
        # Mock Performance Metrics
        import random
        runtime_ms = random.randint(30, 100)
        memory_mb = round(random.uniform(10.0, 20.0), 1)
        
        runtime_beats = 0.0
        memory_beats = 0.0
        
        if all_passed:
            runtime_beats = round(random.uniform(40.0, 99.0), 2)
            memory_beats = round(random.uniform(40.0, 99.0), 2)

        return SubmitCodeResponse(
            success=True,
            allPassed=all_passed,
            passedCount=passed_count,
            totalCount=len(results),
            results=results,
            runtime=f"{runtime_ms}ms",
            memory=f"{memory_mb}MB",
            runtimePercentile=runtime_beats,
            memoryPercentile=memory_beats,
            points=points,
            timeComplexity=time_comp,
            spaceComplexity=space_comp,
            feedback_tier=tier,
            is_optimal=is_optimal
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
