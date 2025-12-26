
import requests
import sys

def test_api():
    url = "http://localhost:8001/api/problems/Two%20Sum"
    print(f"Testing URL: {url}")
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Data received:")
            print(f"Title: {data.get('title')}")
            print(f"Difficulty: {data.get('difficulty')}")
            print(f"Hints present: {bool(data.get('hints'))}")
            print(f"Test Cases present: {bool(data.get('testCases'))}")
            
            # Verify structure is correct
            if data.get("title") == "Two Sum" and data.get("hints"):
                print("\nVERIFICATION PASSED: API is serving data correctly from the Database.")
            else:
                print("\nVERIFICATION FAILED: Data content mismatch.")
        else:
            print(f"\nVERIFICATION FAILED: Error response {response.text}")
            
    except Exception as e:
        print(f"Connection failed: {e}")
        print("Ensure the backend server is running.")

if __name__ == "__main__":
    test_api()
