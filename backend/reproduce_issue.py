from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

long_password = "a" * 80

try:
    print(f"Attempting to hash password of length {len(long_password)}")
    hashed = pwd_context.hash(long_password)
    print("Success (unexpected):")
    print(hashed)
except Exception as e:
    print("Caught expected error:")
    print(e)
