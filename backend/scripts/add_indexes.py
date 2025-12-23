
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import engine
from sqlalchemy import text

def add_indexes():
    print("Optimization: Adding Database Indexes...")
    with engine.connect() as conn:
        # 1. Username Index (Safe: distinct names generally)
        print("- Indexing User.username...")
        try:
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_username ON users (username)"))
            print("  -> Success")
        except Exception as e:
            print(f"  -> Skipped/Error: {e}")

        # 2. Elo Rating Index (For Leaderboard)
        print("- Indexing User.elo_rating...")
        try:
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_elo_rating ON users (elo_rating)"))
            print("  -> Success")
        except Exception as e:
            print(f"  -> Skipped/Error: {e}")

        # 3. Friend Request FKs (For Joins)
        print("- Indexing FriendRequest foreign keys...")
        try:
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_fr_sender_id ON friend_requests (sender_id)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_fr_receiver_id ON friend_requests (receiver_id)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_fr_status ON friend_requests (status)"))
            print("  -> Success")
        except Exception as e:
            print(f"  -> Skipped/Error: {e}")

    print("Optimization Complete.")

if __name__ == "__main__":
    add_indexes()
