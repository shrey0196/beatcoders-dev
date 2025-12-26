from sqlalchemy import create_engine, inspect
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "backend", "beatcoders.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
inspector = inspect(engine)

tables = inspector.get_table_names()
print(f"Tables found: {tables}")

required = ['friendships', 'friend_requests']
missing = [t for t in required if t not in tables]

if missing:
    print(f"MISSING TABLES: {missing}")
else:
    print("All required tables found.")
