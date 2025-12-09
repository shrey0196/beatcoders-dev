import sqlite3

DB_PATH = 'beatcoders.db'

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Check users table schema
print("=== USERS TABLE SCHEMA ===")
cursor.execute("PRAGMA table_info(users)")
columns = cursor.fetchall()
for col in columns:
    print(f"  {col[1]} ({col[2]})")

print("\n=== ALL TABLES ===")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
for table in tables:
    print(f"  {table[0]}")

conn.close()
