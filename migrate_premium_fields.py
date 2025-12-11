"""
Fix database migration - migrate ALL database files
"""

import sqlite3
import os

def find_all_databases():
    """Find all beatcoders.db files"""
    db_files = []
    
    # Check common locations
    locations = [
        'beatcoders.db',
        'backend/beatcoders.db',
        './beatcoders.db',
        './backend/beatcoders.db'
    ]
    
    for loc in locations:
        if os.path.exists(loc):
            abs_path = os.path.abspath(loc)
            if abs_path not in db_files:
                db_files.append(abs_path)
    
    return db_files

def migrate_single_db(db_path):
    """Migrate a single database file"""
    print(f"\n📦 Migrating: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check existing columns
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]
        
        migrations_needed = []
        if 'is_premium' not in columns:
            migrations_needed.append('is_premium')
        if 'premium_since' not in columns:
            migrations_needed.append('premium_since')
        if 'premium_expires' not in columns:
            migrations_needed.append('premium_expires')
        
        if not migrations_needed:
            print("  ✅ Already migrated")
            conn.close()
            return True
        
        print(f"  🔧 Adding: {', '.join(migrations_needed)}")
        
        # Add columns
        if 'is_premium' in migrations_needed:
            cursor.execute("ALTER TABLE users ADD COLUMN is_premium INTEGER DEFAULT 0")
            print("    ✓ is_premium")
        
        if 'premium_since' in migrations_needed:
            cursor.execute("ALTER TABLE users ADD COLUMN premium_since TIMESTAMP")
            print("    ✓ premium_since")
        
        if 'premium_expires' in migrations_needed:
            cursor.execute("ALTER TABLE users ADD COLUMN premium_expires TIMESTAMP")
            print("    ✓ premium_expires")
        
        conn.commit()
        
        # Verify
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        print(f"  ✅ Success! ({user_count} users)")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

if __name__ == '__main__':
    print("="*70)
    print("Database Migration - Find and Fix All Databases")
    print("="*70)
    
    db_files = find_all_databases()
    
    if not db_files:
        print("\n❌ No database files found!")
        print("\nSearched in:")
        print("  - beatcoders.db")
        print("  - backend/beatcoders.db")
    else:
        print(f"\n✅ Found {len(db_files)} database file(s):")
        for db in db_files:
            print(f"  - {db}")
        
        print("\n" + "="*70)
        
        success_count = 0
        for db in db_files:
            if migrate_single_db(db):
                success_count += 1
        
        print("\n" + "="*70)
        print(f"✅ Migrated {success_count}/{len(db_files)} database(s)")
        print("="*70)
        
        if success_count == len(db_files):
            print("\n🎉 All databases migrated successfully!")
            print("\nNow try: python show_users.py")
