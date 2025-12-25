import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("SENDGRID_API_KEY")
if api_key:
    print(f"SENDGRID_API_KEY is key found: {api_key[:4]}...{api_key[-4:]}")
else:
    print("SENDGRID_API_KEY is NOT set")

email_from = os.getenv("EMAIL_FROM")
print(f"EMAIL_FROM: {email_from}")
