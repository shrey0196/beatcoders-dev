import requests
import sqlite3
import time

BASE_URL = "http://127.0.0.1:8001/api/auth"
DB_PATH = "backend/beatcoders.db"
EMAIL = "api_test_user@example.com"
PASSWORD = "Password123!"
NEW_PASSWORD = "NewPassword123!"

def get_db_connection():
    return sqlite3.connect(DB_PATH)

def register():
    print(f"Registering {EMAIL}...")
    response = requests.post(f"{BASE_URL}/register", json={
        "email": EMAIL,
        "password": PASSWORD
    })
    if response.status_code == 200:
        print("Registration successful")
        return True
    else:
        print(f"Registration failed: {response.text}")
        return False

def get_verification_code():
    print("Fetching verification code from DB...")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT verification_code FROM users WHERE email=?", (EMAIL,))
    result = cursor.fetchone()
    conn.close()
    if result:
        print(f"Code found: {result[0]}")
        return result[0]
    else:
        print("Code not found")
        return None

def verify_email(code):
    print(f"Verifying email with code {code}...")
    response = requests.post(f"{BASE_URL}/verify-email", json={
        "email": EMAIL,
        "code": code
    })
    if response.status_code == 200:
        print("Verification successful")
        return True
    else:
        print(f"Verification failed: {response.text}")
        return False

def login(password):
    print(f"Logging in with password {password}...")
    response = requests.post(f"{BASE_URL}/login", json={
        "email": EMAIL,
        "password": password
    })
    if response.status_code == 200:
        print("Login successful")
        return True
    else:
        print(f"Login failed: {response.text}")
        return False

def forgot_password():
    print("Requesting password reset...")
    response = requests.post(f"{BASE_URL}/forgot-password", json={
        "email": EMAIL
    })
    if response.status_code == 200:
        print("Forgot password request successful")
        return True
    else:
        print(f"Forgot password request failed: {response.text}")
        return False

def get_reset_code():
    print("Fetching reset code from DB...")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT reset_code FROM password_resets WHERE email=? ORDER BY created_at DESC LIMIT 1", (EMAIL,))
    result = cursor.fetchone()
    conn.close()
    if result:
        print(f"Reset code found: {result[0]}")
        return result[0]
    else:
        print("Reset code not found")
        return None

def reset_password(code):
    print(f"Resetting password with code {code}...")
    response = requests.post(f"{BASE_URL}/reset-password", json={
        "email": EMAIL,
        "code": code,
        "new_password": NEW_PASSWORD
    })
    if response.status_code == 200:
        print("Password reset successful")
        return True
    else:
        print(f"Password reset failed: {response.text}")
        return False

def main():
    # Clean up previous test user if exists
    conn = get_db_connection()
    conn.execute("DELETE FROM users WHERE email=?", (EMAIL,))
    conn.execute("DELETE FROM password_resets WHERE email=?", (EMAIL,))
    conn.commit()
    conn.close()

    if not register(): return
    
    # Try login before verification (should fail)
    print("Attempting login before verification (expecting failure)...")
    response = requests.post(f"{BASE_URL}/login", json={"email": EMAIL, "password": PASSWORD})
    if response.status_code == 403:
        print("Login failed as expected (Account not verified)")
    else:
        print(f"Unexpected login response: {response.status_code} {response.text}")

    code = get_verification_code()
    if not code: return

    if not verify_email(code): return

    if not login(PASSWORD): return

    if not forgot_password(): return

    reset_code = get_reset_code()
    if not reset_code: return

    if not reset_password(reset_code): return

    if not login(NEW_PASSWORD): return

    print("\nALL TESTS PASSED!")

if __name__ == "__main__":
    main()
