
import asyncio
import websockets
import json
import time

WS_URL = "ws://localhost:8001/ws/battle/bot_opponent_123"

SOLUTIONS = {
    "Two Sum": """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                return [seen[diff], i]
            seen[num] = i
        return []
""",
    "Valid Anagram": """
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t): return False
        return sorted(s) == sorted(t)
""",
    "Contains Duplicate": """
class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        return len(nums) != len(set(nums))
"""
}

async def run_bot():
    print(f"Connecting to {WS_URL}...")
    async with websockets.connect(WS_URL) as websocket:
        print("Connected.")
        
        # Join Queue
        await websocket.send(json.dumps({"type": "JOIN_QUEUE"}))
        print("Joined Queue. Waiting for match...")
        
        while True:
            msg = await websocket.recv()
            data = json.loads(msg)
            # print(f"Received: {data['type']}")
            
            if data['type'] == 'MATCH_FOUND':
                print(f"MATCH FOUND! Opponent: {data['opponent']}")
                problem_title = data['problem']['title']
                print(f"Problem: {problem_title}")
                
                # Wait a bit to simulate thinking
                print("Thinking...")
                await asyncio.sleep(5)
                
                solution = SOLUTIONS.get(problem_title)
                if solution:
                    print(f"Submitting solution for {problem_title}...")
                    await websocket.send(json.dumps({
                        "type": "SUBMIT_CODE",
                        "code": solution
                    }))
                else:
                    print("No solution found for this problem.")
                    
            elif data['type'] == 'SUBMIT_RESULT':
                print(f"Bot Attack Result: {data['damage_dealt']} damage dealt.")
                
            elif data['type'] == 'GAME_OVER':
                print("GAME OVER")
                print(f"Winner: {data['winner']}")
                break

if __name__ == "__main__":
    try:
        asyncio.run(run_bot())
    except KeyboardInterrupt:
        print("Bot stopped.")
