import sqlite3
import os
import sys

# Path to the database
DB_PATH = os.path.join('backend', 'beatcoders.db')

def inspect_db():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database not found at {DB_PATH}")
        return

    print(f"Inspecting database: {DB_PATH}")
    print("=" * 60)

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # Allow accessing columns by name
        cursor = conn.cursor()

        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
        tables = [row['name'] for row in cursor.fetchall()]

        if not tables:
            print("No tables found in the database.")
            return

        print(f"Found {len(tables)} tables:\n")

        for table in sorted(tables):
            # Get row count
            cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
            count = cursor.fetchone()['count']
            
            print(f"Table: {table} ({count} rows)")
            print("-" * 30)

            # Get column names
            cursor.execute(f"PRAGMA table_info({table})")
            columns = [col['name'] for col in cursor.fetchall()]
            print(f"Columns: {', '.join(columns)}")

            # Show first 3 rows
            if count > 0:
                print("Sample Data (First 3 rows):")
                cursor.execute(f"SELECT * FROM {table} LIMIT 3")
                rows = cursor.fetchall()
                for row in rows:
                    # Convert row to dict for nicer printing
                    print(f"  {dict(row)}")
            else:
                print("  (Empty table)")
            
            print("\n")

        conn.close()

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    inspect_db()
