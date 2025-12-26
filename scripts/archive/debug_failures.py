
import requests

BASE_URL = "http://localhost:8001/api"

def debug_failures():
    # 1. Non existent
    print("--- Test Non-Existent ---")
    r = requests.get(f"{BASE_URL}/problems/NonExistentProblem123")
    print(f"Status: {r.status_code}")
    print(f"JSON: {r.json()}")

    # 2. Integrity
    print("\n--- Test Integrity (Valid Anagram) ---")
    r = requests.get(f"{BASE_URL}/problems/Valid Anagram")
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        sc = data.get('starterCode')
        print(f"Starter Code Type: {type(sc)}")
        print(f"Starter Code Len: {len(sc) if sc else 'None'}")
        print(f"Starter Code Value: {repr(sc)}")

debug_failures()
