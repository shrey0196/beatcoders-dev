from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sys
from io import StringIO
import traceback

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
        sys.stdout = StringIO()
        
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
async def submit_code(request: SubmitCodeRequest):
    """
    Execute code against all test cases (visible + hidden)
    """
    try:
        if not request.code:
            raise HTTPException(status_code=400, detail="No code provided")
        
        if request.language != 'python':
            raise HTTPException(status_code=400, detail="Only Python is supported currently")
        
        # Mock hidden test cases (in production, fetch from DB)
        hidden_test_cases = []
        
        if request.problemId == 'Two Sum':
            hidden_test_cases = [
                {"input": {"nums": [0, 4, 3, 0], "target": 0}, "output": [0, 3]},
                {"input": {"nums": [-1, -2, -3, -4, -5], "target": -8}, "output": [2, 4]}
            ]
        elif request.problemId == 'Valid Anagram':
            hidden_test_cases = [
                {"input": {"s": "listen", "t": "silent"}, "output": True},
                {"input": {"s": "hello", "t": "world"}, "output": False}
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
        
        return SubmitCodeResponse(
            success=True,
            allPassed=all_passed,
            passedCount=passed_count,
            totalCount=len(results),
            results=results,
            runtime='42ms',  # Mock data
            memory='14.2MB'  # Mock data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
