import requests
import time
import json

BASE_URL = "http://localhost:8001/api/cognitive"
TASK_ID = f"test-task-{int(time.time())}"

def test_signals_and_analysis():
    print(f"Testing with Task ID: {TASK_ID}")
    
    # 1. Send Signals
    signals = [
        {"type": "KEY_PRESS", "ts": int(time.time() * 1000), "data": {"latency": 100, "length": 1}},
        {"type": "KEY_PRESS", "ts": int(time.time() * 1000) + 100, "data": {"latency": 120, "length": 2}},
        {"type": "KEY_PRESS", "ts": int(time.time() * 1000) + 200, "data": {"latency": 90, "length": 3}},
        {"type": "KEY_PRESS", "ts": int(time.time() * 1000) + 5000, "data": {"latency": 110, "length": 4}}, # 5s later
    ]
    
    payload = {
        "task_id": TASK_ID,
        "signals": signals,
        "user_id": 1
    }
    
    print("Sending signals...")
    try:
        resp = requests.post(f"{BASE_URL}/signals", json=payload)
        print(f"Signals Response: {resp.status_code} - {resp.text}")
        if resp.status_code != 200:
            return
    except Exception as e:
        print(f"Failed to connect to backend: {e}")
        return

    # 2. Request Analysis
    print("Requesting analysis...")
    try:
        resp = requests.get(f"{BASE_URL}/analysis/{TASK_ID}")
        print(f"Analysis Response: {resp.status_code}")
        if resp.status_code == 200:
            print(json.dumps(resp.json(), indent=2))
        else:
            print(resp.text)
    except Exception as e:
        print(f"Failed to request analysis: {e}")

    # 3. Request Session Signals (Timeline)
    print("Requesting session signals...")
    try:
        resp = requests.get(f"{BASE_URL}/session/{TASK_ID}")
        print(f"Session Response: {resp.status_code}")
        if resp.status_code == 200:
            print(f"Got {len(resp.json().get('signals', []))} signals")
        else:
            print(resp.text)
    except Exception as e:
        print(f"Failed to request session: {e}")

if __name__ == "__main__":
    test_signals_and_analysis()
