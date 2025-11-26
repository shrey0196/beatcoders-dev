import sqlite3

# Connect to database
conn = sqlite3.connect('beatcoders.db')
cursor = conn.cursor()

# Get all users
cursor.execute('SELECT * FROM users')
users = cursor.fetchall()

# Print header
print("\n" + "="*100)
print("USERS TABLE")
print("="*100)
print(f"{'ID':<5} {'User ID':<15} {'Email':<25} {'Username':<15} {'Password Hash':<25} {'Created At':<20}")
print("-"*100)

# Print each user
if users:
    for row in users:
        user_id = row[0]
        user_id_str = row[1]
        email = row[2]
        username = row[3] if row[3] else "N/A"
        password_hash = row[4][:20] + "..." if row[4] else "N/A"
        created_at = row[5]
        print(f"{user_id:<5} {user_id_str:<15} {email:<25} {username:<15} {password_hash:<25} {created_at:<20}")
else:
    print("No users found in database.")

print("="*100)
print(f"\nTotal users: {len(users)}\n")

conn.close()
