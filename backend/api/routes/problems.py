from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import json
from config.database import get_db
from models.problem import Problem

router = APIRouter()

@router.get("/problems/{problem_title}")
async def get_problem_data(problem_title: str, db: Session = Depends(get_db)):
    # Fallback to static data if DB lookup fails or for specific hints
    # This ensures "Two Sum" works immediately even if the DB is fresh
    
    # 1. Try DB first
    print(f"DEBUG: Requesting problem: '{problem_title}'")
    problem = db.query(Problem).filter(Problem.title.ilike(problem_title)).first()
    print(f"DEBUG: Problem found in DB: {problem is not None}")
    if problem:
        print(f"DEBUG: Problem title in DB: '{problem.title}'")
    
    # 2. Hardcoded fallback for Two Sum hints (since DB population might be missing it)
    fallback_hints = {
        'Two Sum': {
            'mermaid': """graph TD
    A[Start with array and target] --> B{Use Hash Map?}
    B -->|Yes| C[Create empty hash map]
    C --> D[Iterate through array]
    D --> E{complement = target - current}
    E --> F{Is complement in map?}
    F -->|Yes| G[Return indices]
    F -->|No| H[Store current in map]
    H --> D
    G --> I[End - O n time]
    
    style C fill:#22c55e
    style F fill:#4ea8ff
    style I fill:#22c55e"""
        },
        'Valid Anagram': {
             'mermaid': """graph TD
    A[Start with two strings] --> B{Same length?}
    B -->|No| C[Return false]
    B -->|Yes| D[Count character frequencies]
    D --> E[Use hash map or array]
    E --> F[Compare frequencies]
    F --> G{All match?}
    G -->|Yes| H[Return true]
    G -->|No| I[Return false]
    
    style D fill:#22c55e
    style E fill:#4ea8ff
    style H fill:#22c55e"""
        },
        'Contains Duplicate': {
            'mermaid': """graph TD
    A[Start with array] --> B{Use Set?}
    B -->|Yes| C[Create empty set]
    C --> D[Iterate through array]
    D --> E{Element in set?}
    E -->|Yes| F[Return true - duplicate found]
    E -->|No| G[Add to set]
    G --> D
    F --> H[End - O n time]
    
    style C fill:#22c55e
    style E fill:#4ea8ff
    style H fill:#22c55e"""
        },
        'Group Anagrams': {
            'mermaid': """graph TD
    A[Start with list of strings] --> B[Create HashMap<SortedString, List>]
    B --> C[Iterate through each string]
    C --> D[Sort string characters]
    D --> E{Key exists in Map?}
    E -->|No| F[Create new list for key]
    E -->|Yes| G[Append original string to list]
    G --> C
    F --> C
    C --> H[Return Values of Map]
    
    style B fill:#22c55e
    style D fill:#4ea8ff
    style H fill:#22c55e"""
        },
        'Valid Palindrome': {
            'mermaid': """graph TD
    A[Start with string s] --> B[Initialize Left=0, Right=len-1]
    B --> C{Left < Right?}
    C -->|No| D[Return true]
    C -->|Yes| E{Is Left Alphanumeric?}
    E -->|No| F[Left++]
    E -->|Yes| G{Is Right Alphanumeric?}
    G -->|No| H[Right--]
    G -->|Yes| I{s[Left] == s[Right]?}
    I -->|No| J[Return false]
    I -->|Yes| K[Left++, Right--]
    K --> C
    F --> C
    H --> C
    
    style B fill:#22c55e
    style I fill:#4ea8ff"""
        },
        'Best Time to Buy and Sell Stock': {
            'mermaid': """graph TD
    A[Start with prices array] --> B[MinPrice = inf, MaxProfit = 0]
    B --> C[Iterate through prices]
    C --> D{Price < MinPrice?}
    D -->|Yes| E[MinPrice = Price]
    D -->|No| F{Price - MinPrice > MaxProfit?}
    F -->|Yes| G[MaxProfit = Price - MinPrice]
    E --> C
    G --> C
    C --> H[Return MaxProfit]
    
    style B fill:#22c55e
    style F fill:#4ea8ff"""
        }
    }

    if problem:
        hints = json.loads(problem.hints) if problem.hints else {}
        # Merge fallback hints if DB hints are empty
        if not hints and problem.title in fallback_hints:
            hints = fallback_hints[problem.title]
            
        return {
            "title": problem.title,
            "difficulty": problem.difficulty,
            "topic": problem.topic,
            "acceptance": problem.acceptance,
            "htmlDescription": problem.description,
            "hints": hints,
            "testCases": json.loads(problem.test_cases) if problem.test_cases else [],
            "starterCode": problem.starter_code
        }
    
    # If not in DB, return minimal static data for known problems (Dev Mode Fallback)
    decoded_title = problem_title.replace("%20", " ") # Basic decoding just in case
    # Try exact match or decoded match in keys
    found_key = decoded_title if decoded_title in fallback_hints else None
    if not found_key:
         # Try case insensitive
         for k in fallback_hints.keys():
             if k.lower() == decoded_title.lower():
                 found_key = k
                 break

    if found_key:
         return {
            "title": found_key,
            "difficulty": "Easy", # Default
            "topic": "Algorithms",
            "acceptance": "N/A",
            "htmlDescription": "<p>Problem description not in database.</p>",
            "hints": fallback_hints[found_key],
            "testCases": [],
            "starterCode": ""
        }

    raise HTTPException(status_code=404, detail=f"Problem '{problem_title}' not found")

