import os
import sys
import certifi
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

# Fix for SSL Certificate Verify Failed
os.environ['SSL_CERT_FILE'] = certifi.where()

# Load environment variables
load_dotenv(os.path.join('backend', '.env'))

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM", "noreply@beatcoders.com")
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "BeatCoders")

def test_send_email(to_email):
    print(f"Testing email configuration...")
    print(f"API Key present: {'Yes' if SENDGRID_API_KEY else 'No'}")
    print(f"From Email: {EMAIL_FROM}")
    print(f"To Email: {to_email}")

    if not SENDGRID_API_KEY:
        print("ERROR: SENDGRID_API_KEY is missing in .env file")
        return

    try:
        message = Mail(
            from_email=Email(EMAIL_FROM, EMAIL_FROM_NAME),
            to_emails=To(to_email),
            subject="BeatCoders Email Test",
            html_content=Content("text/html", "<h1>It Works!</h1><p>This is a test email from BeatCoders debugging script.</p>")
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.body}")
        print(f"Response Headers: {response.headers}")
        
        if response.status_code in [200, 201, 202]:
            print("\nSUCCESS: Email sent successfully!")
        else:
            print("\nFAILURE: Email failed to send.")
            
    except Exception as e:
        print(f"\nEXCEPTION: {str(e)}")
        if hasattr(e, 'body'):
            print(f"Error Body: {e.body}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        email = sys.argv[1]
    else:
        email = input("Enter the email address to send test email to: ")
    
    test_send_email(email)
