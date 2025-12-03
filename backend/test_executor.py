"""
Quick test to verify the code executor works
"""
from analyzers.code_executor import CodeExecutor
from test_cases.problems import get_test_cases

# Get Two Sum test cases
test_data = get_test_cases("two-sum")
print(f"Function name: {test_data['function_name']}")
print(f"Number of test cases: {len(test_data['test_cases'])}")

# Test code (correct solution)
correct_code = """
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
"""

# Execute
executor = CodeExecutor()
result = executor.execute_tests(
    code=correct_code,
    function_name=test_data["function_name"],
    test_cases=test_data["test_cases"],
    language="python"
)

print(f"\nAll passed: {result.all_passed}")
print(f"Tests passed: {result.tests_passed}/{result.tests_total}")
print(f"Syntax error: {result.syntax_error}")

for i, test_result in enumerate(result.test_results):
    print(f"\nTest {i+1}: {test_result.description}")
    print(f"  Passed: {test_result.passed}")
    print(f"  Input: {test_result.input}")
    print(f"  Expected: {test_result.expected}")
    print(f"  Actual: {test_result.actual}")
    if test_result.error:
        print(f"  Error: {test_result.error}")
