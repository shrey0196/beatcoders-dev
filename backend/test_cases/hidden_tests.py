"""
Hidden test cases for coding problems
These are additional test cases that are not visible to users during the "Run" phase
but are executed during the "Submit" phase to validate the solution thoroughly.
"""

HIDDEN_TEST_CASES = {
    "3Sum": [
        {
            "input": {'nums': []},
            "output": [],
            "description": "Hidden Case 1"
        },
        {
            "input": {'nums': [0]},
            "output": [],
            "description": "Hidden Case 2"
        },
        {
            "input": {'nums': [-2, 0, 1, 1, 2]},
            "output": [[-2, 0, 2], [-2, 1, 1]],
            "description": "Hidden Case 3"
        }
    ],

    "Best Time to Buy and Sell Stock": [
        {
            "input": {'prices': [2, 4, 1]},
            "output": 2,
            "description": "Hidden Case 1"
        },
        {
            "input": {'prices': [100, 10, 5, 0]},
            "output": 0,
            "description": "Hidden Case 2"
        },
        {
            "input": {'prices': [1, 5, 2, 10]},
            "output": 9,
            "description": "Hidden Case 3"
        }
    ],

    "Binary Search": [
        {
            "input": {'nums': [1, 3, 5, 6], 'target': 2},
            "output": -1,
            "description": "Hidden Case 1"
        },
        {
            "input": {'nums': [1, 3, 5, 6], 'target': 7},
            "output": -1,
            "description": "Hidden Case 2"
        },
        {
            "input": {'nums': [1], 'target': 0},
            "output": -1,
            "description": "Hidden Case 3"
        }
    ],

    "Climbing Stairs": [
        {
            "input": {'n': 1},
            "output": 1,
            "description": "Hidden Case 1"
        },
        {
            "input": {'n': 5},
            "output": 8,
            "description": "Hidden Case 2"
        },
        {
            "input": {'n': 6},
            "output": 13,
            "description": "Hidden Case 3"
        }
    ],

    "Container With Most Water": [
        {
            "input": {'height': [1, 2, 1]},
            "output": 2,
            "description": "Hidden Case 1"
        },
        {
            "input": {'height': [1, 2, 4, 3]},
            "output": 4,
            "description": "Hidden Case 2"
        },
        {
            "input": {'height': [10, 10]},
            "output": 10,
            "description": "Hidden Case 3"
        }
    ],

    "Contains Duplicate": [
        {
            "input": {'nums': [0, 4, 5, 0, 3, 6]},
            "output": True,
            "description": "Hidden Case 1"
        },
        {
            "input": {'nums': []},
            "output": False,
            "description": "Hidden Case 2"
        },
        {
            "input": {'nums': [1]},
            "output": False,
            "description": "Hidden Case 3"
        }
    ],

    "Group Anagrams": [
        {
            "input": {'strs': ['']},
            "output": [['']],
            "description": "Hidden Case 1"
        },
        {
            "input": {'strs': ['a']},
            "output": [['a']],
            "description": "Hidden Case 2"
        },
        {
            "input": {'strs': ['abc', 'bca', 'cab', 'xyz', 'zyx', 'zxy']},
            "output": [['abc', 'bca', 'cab'], ['xyz', 'zyx', 'zxy']],
            "description": "Hidden Case 3"
        }
    ],

    "House Robber": [
        {
            "input": {'nums': [0]},
            "output": 0,
            "description": "Hidden Case 1"
        },
        {
            "input": {'nums': [1, 2]},
            "output": 2,
            "description": "Hidden Case 2"
        },
        {
            "input": {'nums': [2, 1, 1, 2]},
            "output": 4,
            "description": "Hidden Case 3"
        }
    ],

    "Kth Smallest Element in a BST": [
        {
            "input": {'root': [1], 'k': 1},
            "output": 1,
            "description": "Hidden Case 1"
        },
        {
            "input": {'root': [2, 1], 'k': 2},
            "output": 2,
            "description": "Hidden Case 2"
        },
        {
            "input": {'root': [2, 1, 3], 'k': 3},
            "output": 3,
            "description": "Hidden Case 3"
        }
    ],

    "Longest Consecutive Sequence": [
        {
            "input": {'nums': []},
            "output": 0,
            "description": "Hidden Case 1"
        },
        {
            "input": {'nums': [1]},
            "output": 1,
            "description": "Hidden Case 2"
        },
        {
            "input": {'nums': [1, 2, 0, 1]},
            "output": 3,
            "description": "Hidden Case 3"
        }
    ],

    "Longest Substring Without Repeating Characters": [
        {
            "input": {'s': ''},
            "output": 0,
            "description": "Hidden Case 1"
        },
        {
            "input": {'s': 'au'},
            "output": 2,
            "description": "Hidden Case 2"
        },
        {
            "input": {'s': 'dvdf'},
            "output": 3,
            "description": "Hidden Case 3"
        }
    ],

    "Product of Array Except Self": [
        {
            "input": {'nums': [0, 0]},
            "output": [0, 0],
            "description": "Hidden Case 1"
        },
        {
            "input": {'nums': [1, 1]},
            "output": [1, 1],
            "description": "Hidden Case 2"
        },
        {
            "input": {'nums': [2, 3]},
            "output": [3, 2],
            "description": "Hidden Case 3"
        }
    ],

    "Reorder List": [
        {
            "input": {'head': [1]},
            "output": [1],
            "description": "Hidden Case 1"
        },
        {
            "input": {'head': [1, 2]},
            "output": [1, 2],
            "description": "Hidden Case 2"
        },
        {
            "input": {'head': []},
            "output": [],
            "description": "Hidden Case 3"
        }
    ],

    "Search a 2D Matrix": [
        {
            "input": {'matrix': [[1]], 'target': 0},
            "output": False,
            "description": "Hidden Case 1"
        },
        {
            "input": {'matrix': [[1, 3], [5, 7]], 'target': 5},
            "output": True,
            "description": "Hidden Case 2"
        },
        {
            "input": {'matrix': [[1, 3], [5, 7]], 'target': 2},
            "output": False,
            "description": "Hidden Case 3"
        }
    ],

    "Top K Frequent Elements": [
        {
            "input": {'nums': [1, 2, 3], 'k': 3},
            "output": [1, 2, 3],
            "description": "Hidden Case 1"
        },
        {
            "input": {'nums': [1, 1, 2, 2, 2, 3], 'k': 1},
            "output": [2],
            "description": "Hidden Case 2"
        },
        {
            "input": {'nums': [-1, -1], 'k': 1},
            "output": [-1],
            "description": "Hidden Case 3"
        }
    ],

    "Two Sum": [
        {
            "input": {'nums': [1, 2], 'target': 3},
            "output": [0, 1],
            "description": "Hidden Case 1"
        },
        {
            "input": {'nums': [1, 2, 3, 4], 'target': 7},
            "output": [2, 3],
            "description": "Hidden Case 2"
        },
        {
            "input": {'nums': [-1, -2, -3, -4], 'target': -7},
            "output": [2, 3],
            "description": "Hidden Case 3"
        }
    ],

    "Valid Anagram": [
        {
            "input": {'s': '', 't': ''},
            "output": True,
            "description": "Hidden Case 1"
        },
        {
            "input": {'s': 'a', 't': 'b'},
            "output": False,
            "description": "Hidden Case 2"
        },
        {
            "input": {'s': 'ab', 't': 'ba'},
            "output": True,
            "description": "Hidden Case 3"
        },
        {
            "input": {'s': 'rat', 't': 'car'},
            "output": False,
            "description": "Hidden Case 4"
        }
    ],

    "Valid Palindrome": [
        {
            "input": {'s': 'ab_a'},
            "output": True,
            "description": "Hidden Case 1"
        },
        {
            "input": {'s': '0P'},
            "output": False,
            "description": "Hidden Case 2"
        },
        {
            "input": {'s': '.,'},
            "output": True,
            "description": "Hidden Case 3"
        }
    ],

    "Valid Parentheses": [
        {
            "input": {'s': '['},
            "output": False,
            "description": "Hidden Case 1"
        },
        {
            "input": {'s': '(('},
            "output": False,
            "description": "Hidden Case 2"
        },
        {
            "input": {'s': '){'},
            "output": False,
            "description": "Hidden Case 3"
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
