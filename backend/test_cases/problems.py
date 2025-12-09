"""
Test cases for coding problems
Each problem has a set of test cases with inputs and expected outputs
"""

PROBLEM_TEST_CASES = {
    "two-sum": {
        "function_name": "twoSum",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "test_cases": [
            {
                "input": {"nums": [2, 7, 11, 15], "target": 9},
                "expected": [0, 1],
                "description": "Basic case"
            },
            {
                "input": {"nums": [3, 2, 4], "target": 6},
                "expected": [1, 2],
                "description": "Non-adjacent elements"
            },
            {
                "input": {"nums": [3, 3], "target": 6},
                "expected": [0, 1],
                "description": "Duplicate elements"
            },
            {
                "input": {"nums": [1, 5, 3, 7, 9], "target": 12},
                "expected": [1, 3],
                "description": "Multiple possibilities"
            }
        ]
    },
    "valid-anagram": {
        "function_name": "isAnagram",
        "description": "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
        "test_cases": [
            {
                "input": {"s": "anagram", "t": "nagaram"},
                "expected": True,
                "description": "Valid anagram"
            },
            {
                "input": {"s": "rat", "t": "car"},
                "expected": False,
                "description": "Not an anagram"
            },
            {
                "input": {"s": "listen", "t": "silent"},
                "expected": True,
                "description": "Different order"
            }
        ]
    },
    "contains-duplicate": {
        "function_name": "containsDuplicate",
        "description": "Given an integer array nums, return true if any value appears at least twice in the array.",
        "test_cases": [
            {
                "input": {"nums": [1, 2, 3, 1]},
                "expected": True,
                "description": "Has duplicate"
            },
            {
                "input": {"nums": [1, 2, 3, 4]},
                "expected": False,
                "description": "No duplicate"
            },
            {
                "input": {"nums": [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]},
                "expected": True,
                "description": "Multiple duplicates"
            }
        ]
    },
    "group-anagrams": {
        "function_name": "groupAnagrams",
        "description": "Given an array of strings strs, group the anagrams together.",
        "test_cases": [
            {
                "input": {"strs": ["eat", "tea", "tan", "ate", "nat", "bat"]},
                "expected": [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
                "description": "Multiple groups",
                "order_independent": True
            },
            {
                "input": {"strs": [""]},
                "expected": [[""]],
                "description": "Empty string"
            },
            {
                "input": {"strs": ["a"]},
                "expected": [["a"]],
                "description": "Single character"
            }
        ]
    },
    "top-k-frequent-elements": {
        "function_name": "topKFrequent",
        "description": "Given an integer array nums and an integer k, return the k most frequent elements.",
        "test_cases": [
            {
                "input": {"nums": [1, 1, 1, 2, 2, 3], "k": 2},
                "expected": [1, 2],
                "description": "Basic case",
                "order_independent": True
            },
            {
                "input": {"nums": [1], "k": 1},
                "expected": [1],
                "description": "Single element"
            }
        ]
    },
    "product-of-array-except-self": {
        "function_name": "productExceptSelf",
        "description": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
        "test_cases": [
            {
                "input": {"nums": [1, 2, 3, 4]},
                "expected": [24, 12, 8, 6],
                "description": "Basic case"
            },
            {
                "input": {"nums": [-1, 1, 0, -3, 3]},
                "expected": [0, 0, 9, 0, 0],
                "description": "With zero"
            }
        ]
    }
}

def get_test_cases(problem_id: str):
    """Get test cases for a specific problem"""
    return PROBLEM_TEST_CASES.get(problem_id, None)
