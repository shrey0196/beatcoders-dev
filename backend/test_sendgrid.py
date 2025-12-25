import os
import certifi
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Force SSL fix
os.environ['SSL_CERT_FILE'] = certifi.where()

load_dotenv()

def test_sendgrid():
    api_key = os.getenv("SENDGRID_API_KEY")
    sender = os.getenv("EMAIL_FROM", "noreply@beatcoders.com")
    
    print(f"Testing SendGrid Configuration...")
    print(f"API Key found: {'Yes' if api_key else 'No'}")
    if api_key:
        print(f"API Key prefix: {api_key[:10]}...")
    print(f"Sender: {sender}")
    
    if not api_key:
        print("❌ Error: SENDGRID_API_KEY is not set in .env")
        return

    message = Mail(
        from_email=sender,
        to_emails='test@example.com',  # We won't actually check this inbox, just want API response
        subject='BeatCoders API Key Test',
        html_content='<strong>It works!</strong>'
    )
    
    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        print("\n✅ Verification Successful!")
        print(f"Status Code: {response.status_code}")
        print("Your API key is valid and working.")
    except Exception as e:
        print("\n❌ Verification Failed!")
        print(f"Error: {str(e)}")
        if hasattr(e, 'body'):
            print(f"Response Body: {e.body}")
        
        print("\nTroubleshooting Tips:")
        print("1. Check if the key starts with 'SG.'")
        print("2. Ensure 'Email Sending' permission is enabled for this key.")
        print("3. Verify that the 'Sender Identity' (email_from) matches what is verified in SendGrid.")

if __name__ == "__main__":
    test_sendgrid()
