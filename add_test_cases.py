import os
import re

file_path = 'static/js/main.js'

# We'll add testCases to each problem object
# For now, adding simple test cases that match the examples in the descriptions

test_cases_data = {
    "Two Sum": [
        {"input": {"nums": [2,7,11,15], "target": 9}, "output": [0,1]},
        {"input": {"nums": [3,2,4], "target": 6}, "output": [1,2]},
        {"input": {"nums": [3,3], "target": 6}, "output": [0,1]}
    ],
    "Valid Anagram": [
        {"input": {"s": "anagram", "t": "nagaram"}, "output": True},
        {"input": {"s": "rat", "t": "car"}, "output": False},
        {"input": {"s": "a", "t": "a"}, "output": True}
    ],
    "Contains Duplicate": [
        {"input": {"nums": [1,2,3,1]}, "output": True},
        {"input": {"nums": [1,2,3,4]}, "output": False},
        {"input": {"nums": [1,1,1,3,3,4,3,2,4,2]}, "output": True}
    ],
    "Group Anagrams": [
        {"input": {"strs": ["eat","tea","tan","ate","nat","bat"]}, "output": [["bat"],["nat","tan"],["ate","eat","tea"]]},
        {"input": {"strs": [""]}, "output": [[""]]},
        {"input": {"strs": ["a"]}, "output": [["a"]]}
    ],
    "Top K Frequent Elements": [
        {"input": {"nums": [1,1,1,2,2,3], "k": 2}, "output": [1,2]},
        {"input": {"nums": [1], "k": 1}, "output": [1]},
        {"input": {"nums": [1,2], "k": 2}, "output": [1,2]}
    ],
    "Product of Array Except Self": [
        {"input": {"nums": [1,2,3,4]}, "output": [24,12,8,6]},
        {"input": {"nums": [-1,1,0,-3,3]}, "output": [0,0,9,0,0]},
        {"input": {"nums": [2,3,4,5]}, "output": [60,40,30,24]}
    ]
}

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # For each problem, we need to add testCases field
    # We'll do this by finding each problem object and adding the testCases before the closing brace
    
    for problem_name, test_cases in test_cases_data.items():
        # Find the problem object
        # Pattern: title: "Problem Name", ... htmlDescription: `...` }
        pattern = rf'(title:\s*"{re.escape(problem_name)}"[^}}]+htmlDescription:\s*`[^`]*`)\s*\}}'
        
        # Create the testCases string
        test_cases_str = ',\n      testCases: ' + str(test_cases).replace("'", '"').replace('True', 'true').replace('False', 'false')
        
        # Replace
        replacement = r'\1' + test_cases_str + '\n    }'
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully added test cases to problemsData")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
