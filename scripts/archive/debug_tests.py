
import requests

BASE_URL = "http://localhost:8001/api"

def debug_test():
    # 1. Non existent
    print("--- Test Non-Existent ---")
    r = requests.get(f"{BASE_URL}/problems/NonExistentProblem123")
    print(f"Status: {r.status_code}")
    print(f"Body: {r.text}")

    # 2. Case Insensitive
    print("\n--- Test Case Insensitive ---")
    r = requests.get(f"{BASE_URL}/problems/two sum")
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print(f"Title: {r.json().get('title')}")

    # 3. Integrity
    print("\n--- Test Integrity (Valid Anagram) ---")
    r = requests.get(f"{BASE_URL}/problems/Valid Anagram")
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"Starter Code Start: {data.get('starterCode', '')[:20]}")

debug_test()
