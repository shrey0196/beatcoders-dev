"""
Test script for Phase 4 features
Tests CRS calculation, roadmap generation, and AI mentor
"""

import requests
import json

BASE_URL = "http://localhost:8001/api"

def test_crs_endpoints():
    """Test CRS endpoints"""
    print("\n=== Testing CRS Endpoints ===")
    
    # Test user (you'll need to use an actual user_id from your database)
    user_id = "test123"  # Replace with actual user_id
    
    # 1. Get CRS
    print(f"\n1. Getting CRS for user {user_id}...")
    response = requests.get(f"{BASE_URL}/crs/{user_id}")
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"Score: {data.get('score')}")
        print(f"Tier: {data.get('tier')}")
        print(f"Components: {json.dumps(data.get('components'), indent=2)}")
    else:
        print(f"Error: {response.text}")
    
    # 2. Calculate CRS
    print(f"\n2. Calculating CRS for user {user_id}...")
    response = requests.post(f"{BASE_URL}/crs/calculate", json={"user_id": user_id})
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"Message: {data.get('message')}")
        print(f"New Score: {data.get('score')}")
        print(f"Tier: {data.get('tier')}")
    else:
        print(f"Error: {response.text}")
    
    # 3. Get CRS history
    print(f"\n3. Getting CRS history...")
    response = requests.get(f"{BASE_URL}/crs/{user_id}/history")
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"History entries: {len(data.get('history', []))}")
        print(f"Current score: {data.get('current_score')}")
    else:
        print(f"Error: {response.text}")

def test_roadmap_endpoints():
    """Test Skill Roadmap endpoints (Premium feature)"""
    print("\n\n=== Testing Skill Roadmap Endpoints ===")
    
    user_id = "test123"  # Replace with actual premium user_id
    
    # 1. Generate roadmap
    print(f"\n1. Generating roadmap for user {user_id}...")
    response = requests.post(f"{BASE_URL}/roadmap/{user_id}/generate")
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"Message: {data.get('message')}")
        roadmap = data.get('roadmap', {})
        print(f"Level: {roadmap.get('current_level')}")
        print(f"Target skills: {roadmap.get('target_skills')}")
    else:
        print(f"Error: {response.text}")
        if response.status_code == 403:
            print("Note: This feature requires premium access")
    
    # 2. Get roadmap
    print(f"\n2. Getting roadmap...")
    response = requests.get(f"{BASE_URL}/roadmap/{user_id}")
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"Has roadmap: {data.get('has_roadmap')}")
        if data.get('has_roadmap'):
            print(f"Level: {data.get('current_level')}")
            print(f"Weekly plan: {json.dumps(data.get('weekly_plan'), indent=2)}")
    else:
        print(f"Error: {response.text}")
    
    # 3. Get suggestions
    print(f"\n3. Getting smart suggestions...")
    response = requests.get(f"{BASE_URL}/roadmap/{user_id}/suggestions")
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        suggestions = data.get('suggestions', [])
        print(f"Suggestions count: {len(suggestions)}")
        for i, suggestion in enumerate(suggestions[:3], 1):
            print(f"  {i}. {suggestion.get('title')} ({suggestion.get('type')})")
    else:
        print(f"Error: {response.text}")

def test_ai_mentor_endpoints():
    """Test AI Mentor endpoints (Premium feature)"""
    print("\n\n=== Testing AI Mentor Endpoints ===")
    
    user_id = "test123"  # Replace with actual premium user_id
    
    # 1. Create new session
    print(f"\n1. Creating new mentor session...")
    response = requests.post(f"{BASE_URL}/mentor/session/new", json={
        "user_id": user_id,
        "context": {"topic": "arrays"}
    })
    print(f"Status: {response.status_code}")
    session_id = None
    if response.ok:
        data = response.json()
        session_id = data.get('session_id')
        print(f"Session ID: {session_id}")
        print(f"Welcome: {data.get('welcome_message')}")
    else:
        print(f"Error: {response.text}")
        if response.status_code == 403:
            print("Note: This feature requires premium access")
    
    # 2. Send message to mentor
    if session_id:
        print(f"\n2. Sending message to mentor...")
        response = requests.post(f"{BASE_URL}/mentor/chat", json={
            "user_id": user_id,
            "session_id": session_id,
            "message": "I'm stuck on a two pointers problem. Can you give me a hint?",
            "context": {"topic": "two pointers"}
        })
        print(f"Status: {response.status_code}")
        if response.ok:
            data = response.json()
            print(f"Response: {data.get('response')}")
        else:
            print(f"Error: {response.text}")
    
    # 3. Get sessions
    print(f"\n3. Getting mentor sessions...")
    response = requests.get(f"{BASE_URL}/mentor/{user_id}/sessions")
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        sessions = data.get('sessions', [])
        print(f"Sessions count: {len(sessions)}")
        for i, session in enumerate(sessions[:3], 1):
            print(f"  {i}. Messages: {session.get('message_count')}, Preview: {session.get('preview')}")
    else:
        print(f"Error: {response.text}")

def test_premium_access():
    """Test premium access control"""
    print("\n\n=== Testing Premium Access Control ===")
    
    # Test with non-premium user
    free_user = "freeuser123"
    
    print(f"\n1. Testing roadmap access for free user...")
    response = requests.get(f"{BASE_URL}/roadmap/{free_user}")
    print(f"Status: {response.status_code}")
    if response.status_code == 403:
        print("✓ Correctly blocked free user from roadmap")
    else:
        print("✗ Free user should not have access")
    
    print(f"\n2. Testing AI mentor access for free user...")
    response = requests.post(f"{BASE_URL}/mentor/chat", json={
        "user_id": free_user,
        "message": "Hello"
    })
    print(f"Status: {response.status_code}")
    if response.status_code == 403:
        print("✓ Correctly blocked free user from AI mentor")
    else:
        print("✗ Free user should not have access")

if __name__ == '__main__':
    print("=" * 60)
    print("Phase 4 Feature Testing")
    print("=" * 60)
    print("\nNOTE: Update user_id variables with actual user IDs from your database")
    print("For premium features, ensure the user has is_premium=True in the database")
    
    try:
        # Test CRS (available to all users)
        test_crs_endpoints()
        
        # Test Roadmap (premium only)
        test_roadmap_endpoints()
        
        # Test AI Mentor (premium only)
        test_ai_mentor_endpoints()
        
        # Test premium access control
        test_premium_access()
        
        print("\n" + "=" * 60)
        print("Testing Complete!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to backend server")
        print("Make sure the backend is running on http://localhost:8001")
    except Exception as e:
        print(f"\n❌ Error: {e}")
