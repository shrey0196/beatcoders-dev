import sqlite3
import os

# Database path
DB_PATH = 'beatcoders.db'

def revert_crs():
    print("Starting CRS Revert...")
    
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return
    
    print(f"Reverting database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if crs_history table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='crs_history'")
        if cursor.fetchone():
            print("Dropping crs_history table...")
            cursor.execute("DROP TABLE crs_history")
            print("crs_history table dropped.")
        else:
            print("crs_history table does not exist.")
        
        # Check columns in users table
        cursor.execute("PRAGMA table_info(users)")
        columns = [info[1] for info in cursor.fetchall()]
        
        print(f"Current columns in users: {columns}")
        
        # SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
        if 'crs_score' in columns or 'tier' in columns or 'weaknesses' in columns:
            print("Recreating users table without CRS columns...")
            
            # Create new table without CRS columns
            cursor.execute("""
                CREATE TABLE users_new (
                    id INTEGER PRIMARY KEY,
                    user_id TEXT UNIQUE,
                    email TEXT UNIQUE,
                    username TEXT,
                    password_hash TEXT,
                    is_verified INTEGER DEFAULT 0,
                    verification_code TEXT,
                    verification_code_expires TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Copy data from old table to new table
            cursor.execute("""
                INSERT INTO users_new (id, user_id, email, username, password_hash, 
                                       is_verified, verification_code, verification_code_expires, created_at)
                SELECT id, user_id, email, username, password_hash, 
                       is_verified, verification_code, verification_code_expires, created_at
                FROM users
            """)
            
            # Drop old table
            cursor.execute("DROP TABLE users")
            
            # Rename new table to users
            cursor.execute("ALTER TABLE users_new RENAME TO users")
            
            print("Users table recreated without CRS columns.")
        else:
            print("CRS columns do not exist in users table.")
        
        conn.commit()
        print("CRS Revert complete!")
        
    except Exception as e:
        print(f"Error during revert: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    revert_crs()
