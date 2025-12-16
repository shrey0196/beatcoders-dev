from config.database import SessionLocal
from models.user import User

db = SessionLocal()
users = db.query(User).all()
print(f"{'Username':<20} | {'Elo':<5}")
print("-" * 30)
for u in users:
    print(f"{u.username:<20} | {u.elo_rating}")
db.close()
