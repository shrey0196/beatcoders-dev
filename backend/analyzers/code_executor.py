"""
Code Executor
Safely executes user-submitted code against test cases
"""
import signal
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import traceback


@dataclass
class TestResult:
    passed: bool
    test_case_index: int
    description: str
    input: Dict[str, Any]
    expected: Any
    actual: Any
    error: Optional[str] = None
    execution_time_ms: float = 0.0


@dataclass
class ExecutionResult:
    all_passed: bool
    tests_passed: int
    tests_total: int
    test_results: List[TestResult]
    syntax_error: Optional[str] = None


class TimeoutException(Exception):
    """Raised when code execution times out"""
    pass


def timeout_handler(signum, frame):
    """Signal handler for timeout"""
    raise TimeoutException("Code execution timed out (max 2 seconds)")


class CodeExecutor:
    """Executes user code safely with test cases"""
    
    def __init__(self, timeout_seconds: int = 2):
        self.timeout_seconds = timeout_seconds
    
    def execute_tests(self, code: str, function_name: str, test_cases: List[Dict], 
                     language: str = "python") -> ExecutionResult:
        """
        Execute code against test cases
        
        Args:
            code: User-submitted code
            function_name: Name of the function to test
            test_cases: List of test case dictionaries
            language: Programming language (currently only Python supported)
        
        Returns:
            ExecutionResult with pass/fail status and details
        """
        if language != "python":
            return ExecutionResult(
                all_passed=False,
                tests_passed=0,
                tests_total=len(test_cases),
                test_results=[],
                syntax_error=f"Language '{language}' not supported yet. Only Python is supported."
            )
        
        # First, check syntax
        try:
            compile(code, '<string>', 'exec')
        except SyntaxError as e:
            return ExecutionResult(
                all_passed=False,
                tests_passed=0,
                tests_total=len(test_cases),
                test_results=[],
                syntax_error=f"Syntax Error on line {e.lineno}: {e.msg}"
            )
        
        # Execute test cases
        test_results = []
        tests_passed = 0
        
        for i, test_case in enumerate(test_cases):
            result = self._execute_single_test(
                code, 
                function_name, 
                test_case, 
                i
            )
            test_results.append(result)
            if result.passed:
                tests_passed += 1
        
        return ExecutionResult(
            all_passed=(tests_passed == len(test_cases)),
            tests_passed=tests_passed,
            tests_total=len(test_cases),
            test_results=test_results,
            syntax_error=None
        )
    
    def _execute_single_test(self, code: str, function_name: str, 
                            test_case: Dict, index: int) -> TestResult:
        """Execute a single test case"""
        import time
        
        test_input = test_case["input"]
        expected = test_case["expected"]
        description = test_case.get("description", f"Test {index + 1}")
        order_independent = test_case.get("order_independent", False)
        
        try:
            start_time = time.time()
            
            # Create restricted execution environment
            restricted_globals = {
                "__builtins__": {
                    "range": range,
                    "len": len,
                    "enumerate": enumerate,
                    "zip": zip,
                    "map": map,
                    "filter": filter,
                    "sorted": sorted,
                    "sum": sum,
                    "max": max,
                    "min": min,
                    "abs": abs,
                    "int": int,
                    "str": str,
                    "float": float,
                    "bool": bool,
                    "list": list,
                    "dict": dict,
                    "set": set,
                    "tuple": tuple,
                    "True": True,
                    "False": False,
                    "None": None,
                }
            }
            local_scope = {}
            
            # Execute the user's code
            exec(code, restricted_globals, local_scope)
            
            # Get the function
            if function_name not in local_scope:
                return TestResult(
                    passed=False,
                    test_case_index=index,
                    description=description,
                    input=test_input,
                    expected=expected,
                    actual=None,
                    error=f"Function '{function_name}' not found in your code"
                )
            
            user_function = local_scope[function_name]
            
            # Call the function with test inputs
            actual = user_function(**test_input)
            
            execution_time_ms = (time.time() - start_time) * 1000
            
            # Compare results
            passed = self._compare_results(expected, actual, order_independent)
            
            return TestResult(
                passed=passed,
                test_case_index=index,
                description=description,
                input=test_input,
                expected=expected,
                actual=actual,
                error=None if passed else "Output doesn't match expected result",
                execution_time_ms=execution_time_ms
            )
        
        except TimeoutException as e:
            return TestResult(
                passed=False,
                test_case_index=index,
                description=description,
                input=test_input,
                expected=expected,
                actual=None,
                error=str(e)
            )
        
        except Exception as e:
            return TestResult(
                passed=False,
                test_case_index=index,
                description=description,
                input=test_input,
                expected=expected,
                actual=None,
                error=f"{type(e).__name__}: {str(e)}"
            )
    
    def _compare_results(self, expected: Any, actual: Any, order_independent: bool = False) -> bool:
        """Compare expected and actual results"""
        if order_independent:
            # For problems where order doesn't matter (e.g., group anagrams)
            if isinstance(expected, list) and isinstance(actual, list):
                # Sort both for comparison
                try:
                    expected_sorted = sorted([sorted(x) if isinstance(x, list) else x for x in expected])
                    actual_sorted = sorted([sorted(x) if isinstance(x, list) else x for x in actual])
                    return expected_sorted == actual_sorted
                except:
                    return set(map(tuple, expected)) == set(map(tuple, actual))
        
        return expected == actual
