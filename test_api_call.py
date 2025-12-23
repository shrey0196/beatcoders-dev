
import requests
import sys

# Constants matching the user's scenario
BASE_URL = "http://localhost:8001"
USER_ID = "shreyashrey096831" # From the screenshot
REQUEST_ID = 1

url = f"{BASE_URL}/api/friends/accept/{REQUEST_ID}?current_user_id={USER_ID}"

print(f"Sending POST to {url}...")

try:
    response = requests.post(url)
    print(f"Status Code: {response.status_code}")
    print("Response Headers:")
    for k, v in response.headers.items():
        print(f"  {k}: {v}")
    
    print("\nResponse Body:")
    print(response.text)
    
except Exception as e:
    print(f"Request failed: {e}")
