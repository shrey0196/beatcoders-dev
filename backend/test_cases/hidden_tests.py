"""
Hidden test cases for coding problems
These are additional test cases that are not visible to users during the "Run" phase
but are executed during the "Submit" phase to validate the solution thoroughly.
"""

HIDDEN_TEST_CASES = {
    "Two Sum": [
        {
            "input": {"nums": [0, 4, 3, 0], "target": 0},
            "output": [0, 3],
            "description": "Zero target with duplicate zeros"
        },
        {
            "input": {"nums": [-1, -2, -3, -4, -5], "target": -8},
            "output": [2, 4],
            "description": "Negative numbers"
        }
    ],
    
    "Valid Anagram": [
        {
            "input": {"s": "listen", "t": "silent"},
            "output": True,
            "description": "Different arrangement"
        },
        {
            "input": {"s": "hello", "t": "world"},
            "output": False,
            "description": "Completely different strings"
        }
    ],
    
    "Contains Duplicate": [
        {
            "input": {"nums": [1, 2, 3, 4, 5, 6, 7, 8, 9, 1]},
            "output": True,
            "description": "Duplicate at end of long array"
        },
        {
            "input": {"nums": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]},
            "output": False,
            "description": "No duplicates in long array"
        },
        {
            "input": {"nums": [5, 5]},
            "output": True,
            "description": "Two element array with duplicate"
        }
    ]
}


def get_hidden_tests(problem_id: str) -> list:
    """
    Get hidden test cases for a specific problem
    
    Args:
        problem_id: The problem identifier (e.g., "Two Sum")
        
    Returns:
        List of hidden test cases, or empty list if none exist
    """
    return HIDDEN_TEST_CASES.get(problem_id, [])
