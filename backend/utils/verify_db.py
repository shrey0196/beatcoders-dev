
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from config.database import SessionLocal
from models.problem import Problem

db = SessionLocal()
problems = db.query(Problem).all()
print(f"Problem count: {len(problems)}")
for p in problems:
    print(f"- {p.title}")
db.close()
