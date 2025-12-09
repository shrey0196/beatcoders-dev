
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from config.database import SessionLocal
from models.problem import Problem

STARTER_TEMPLATES = {
    "Two Sum": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass",
    "Valid Anagram": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your code here\n        pass",
    "Contains Duplicate": "class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        # Write your code here\n        pass"
}

db = SessionLocal()
problems = db.query(Problem).all()

for p in problems:
    if not p.starter_code or p.starter_code == "null":
        print(f"Fixing starter code for {p.title}")
        p.starter_code = STARTER_TEMPLATES.get(p.title, "# Write your code here\npass")
        db.add(p)

db.commit()
db.close()
print("Fixed missing starter codes.")
