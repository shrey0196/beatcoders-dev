import random
import string
import os
import certifi
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

# Fix for SSL Certificate Verify Failed
os.environ['SSL_CERT_FILE'] = certifi.where()

load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM", "noreply@beatcoders.com")
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "BeatCoders")


def generate_verification_code() -> str:
    """Generate a 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))


def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """Send an email using SendGrid API"""
    try:
        # Log attempt
        with open("email_debug.log", "a") as f:
            f.write(f"Attempting to send email to {to_email} with subject '{subject}'\n")

        message = Mail(
            from_email=Email(EMAIL_FROM, EMAIL_FROM_NAME),
            to_emails=To(to_email),
            subject=subject,
            html_content=Content("text/html", html_content)
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        # Log success
        with open("email_debug.log", "a") as f:
            f.write(f"Success: {response.status_code}\nBody: {response.body}\nHeaders: {response.headers}\n")
        
        return response.status_code in [200, 201, 202]
    except Exception as e:
        # Log failure
        with open("email_debug.log", "a") as f:
            f.write(f"Error sending email: {str(e)}\n")
            if hasattr(e, 'body'):
                f.write(f"Error Body: {e.body}\n")
        print(f"Error sending email: {e}")
        return False


def send_verification_email(email: str, code: str) -> bool:
    """Send email verification code"""
    subject = "Verify Your BeatCoders Account"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
            .email-container {{ max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 28px; font-weight: 600; }}
            .content {{ padding: 40px 30px; }}
            .code-box {{ background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center; }}
            .code {{ font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 10px; font-family: 'Courier New', monospace; }}
            .info-box {{ background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px; }}
            .footer {{ background: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }}
            .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🎯 Welcome to BeatCoders!</h1>
            </div>
            <div class="content">
                <p style="font-size: 16px; margin-bottom: 20px;">Hi there!</p>
                <p>Thank you for joining BeatCoders, your platform for mastering coding challenges. To complete your registration and start your coding journey, please verify your email address.</p>
                
                <div class="code-box">
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Verification Code</p>
                    <div class="code">{code}</div>
                </div>
                
                <div class="info-box">
                    <strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>.
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't create an account with BeatCoders, please ignore this email.</p>
            </div>
            <div class="footer">
                <p style="margin: 0;">© 2024 BeatCoders. Happy Coding! 🚀</p>
                <p style="margin: 10px 0 0 0; font-size: 12px;">This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return send_email(email, subject, html_content)


def send_password_reset_email(email: str, code: str) -> bool:
    """Send password reset code"""
    subject = "Reset Your BeatCoders Password"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
            .email-container {{ max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px 30px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 28px; font-weight: 600; }}
            .content {{ padding: 40px 30px; }}
            .code-box {{ background: #f8f9fa; border: 2px dashed #f5576c; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center; }}
            .code {{ font-size: 36px; font-weight: bold; color: #f5576c; letter-spacing: 10px; font-family: 'Courier New', monospace; }}
            .warning-box {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }}
            .info-box {{ background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px; }}
            .footer {{ background: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
                <p style="font-size: 16px; margin-bottom: 20px;">Hi there!</p>
                <p>We received a request to reset your BeatCoders password. Use the verification code below to proceed with resetting your password.</p>
                
                <div class="code-box">
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Reset Code</p>
                    <div class="code">{code}</div>
                </div>
                
                <div class="info-box">
                    <strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>.
                </div>
                
                <div class="warning-box">
                    <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure. Your password will not be changed unless you complete the reset process.
                </div>
            </div>
            <div class="footer">
                <p style="margin: 0;">© 2024 BeatCoders. Stay Secure! 🔒</p>
                <p style="margin: 10px 0 0 0; font-size: 12px;">This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return send_email(email, subject, html_content)
