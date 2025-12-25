from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

long_password = "a" * 100
# bcrypt truncates at 72 bytes. 
# If we truncate manually to 72 (or 71/73 depending on null terminator implementation details), the hash should match if silent truncation is happening.

# Trying to find where the truncation happens
truncated_72 = long_password[:72]
truncated_71 = long_password[:71]

h_long = pwd_context.hash(long_password)
h_72 = pwd_context.hash(truncated_72)

if pwd_context.verify(long_password, h_long):
    print("Long password verifies against its own hash (Expected)")

if pwd_context.verify(long_password, h_72):
    print("WARNING: Silent truncation detected! A 72-char password verifies against the 100-char password's hash.")
else:
    print("No simple truncation detected at 72 bytes.")
