import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.routes.auth import get_password_hash, verify_password
from passlib.context import CryptContext

# Simulate legacy context for testing back-compat
legacy_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test_password_fix():
    print("Test 1: Normal password (new method)")
    pwd = "my_secure_password"
    hashed = get_password_hash(pwd)
    if verify_password(pwd, hashed):
        print("  SUCCESS: Verified")
    else:
        print("  FAILURE: Could not verify")

    print("\nTest 2: Long password > 72 bytes (new method)")
    long_pwd = "a" * 100
    hashed_long = get_password_hash(long_pwd)
    if verify_password(long_pwd, hashed_long):
        print("  SUCCESS: Verified")
    else:
        print("  FAILURE: Could not verify")
        
    print("\nTest 3: Silent Truncation Check (new method)")
    # Should NOT verify against truncated version anymore because sha256("aaaa...") != sha256("aaa... truncated")
    truncated_pwd = long_pwd[:72]
    if verify_password(truncated_pwd, hashed_long): # verifying truncated password against full hash
        print("  FAILURE: Silent truncation still valid (bad)")
    else:
        print("  SUCCESS: Truncated password correctly rejected")

    print("\nTest 4: Backward Compatibility (Legacy Hash)")
    legacy_pwd = "legacy_password"
    # Create a hash like the old system did (plain bcrypt)
    legacy_hash = legacy_pwd_context.hash(legacy_pwd)
    
    if verify_password(legacy_pwd, legacy_hash):
        print("  SUCCESS: Legacy hash verified")
    else:
        print("  FAILURE: Legacy hash verification failed")

if __name__ == "__main__":
    test_password_fix()
