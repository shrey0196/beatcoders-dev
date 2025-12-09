
import json
import sys
import os
from pathlib import Path

# Add backend directory to path so we can import models/config
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

from config.database import SessionLocal, engine, Base
from models.problem import Problem

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# Templates for starter code if missing
STARTER_TEMPLATES = {
    "Two Sum": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass",
    "Valid Anagram": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your code here\n        pass",
    "Contains Duplicate": "class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        # Write your code here\n        pass",
    "Group Anagrams": "class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        # Write your code here\n        pass",
    "Top K Frequent Elements": "class Solution:\n    def topKFrequent(self, nums: List[int], k: int) -> List[int]:\n        # Write your code here\n        pass",
    "Product of Array Except Self": "class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        # Write your code here\n        pass"
}

def migrate():
    print("Starting migration...")
    
    # 1. Read JSON
    json_path = backend_dir / "data" / "problems.json"
    if not json_path.exists():
        print(f"Error: {json_path} not found.")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 2. Convert dictionary to list if needed (problems.json structure is dict of dicts)
    problems_list = []
    if isinstance(data, dict):
        # Format: {"Two Sum": {...}, "Valid Anagram": {...}}
        problems_list = data.values()
    elif isinstance(data, list):
        problems_list = data
    
    # 3. Insert into DB
    db = SessionLocal()
    try:
        count = 0
        for p_data in problems_list:
            title = p_data.get("title")
            if not title:
                continue

            # Check if exists
            existing = db.query(Problem).filter(Problem.title == title).first()
            if existing:
                print(f"Skipping {title} (already exists)")
                continue

            # Prepare data
            # Handle list vs dict structure differences in provided JSON vs Code logic
            # Assuming standard fields based on my reading of dashboard.html data
            
            # Helper to safely serialize JSON fields
            hints = json.dumps(p_data.get("hints", {}))
            test_cases = json.dumps(p_data.get("testCases", []))
            
            # Determine Difficulty/Topic/Acceptance (Mocking if missing in json)
            difficulty = p_data.get("difficulty", "Medium")
            topic = p_data.get("topic", "Algorithms")
            acceptance = p_data.get("acceptance", "N/A")
            
            # HTML Description
            description = p_data.get("htmlDescription", p_data.get("description", ""))

            # Starter Code
            starter = p_data.get("starterCode")
            if not starter:
                starter = STARTER_TEMPLATES.get(title, "# Write your code here\npass")

            new_problem = Problem(
                title=title,
                difficulty=difficulty,
                topic=topic,
                acceptance=acceptance,
                description=description,
                hints=hints,
                test_cases=test_cases,
                starter_code=starter
            )
            
            db.add(new_problem)
            count += 1
            print(f"Added: {title}")

        db.commit()
        print(f"Migration complete. Added {count} problems.")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
