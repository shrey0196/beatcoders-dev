from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json
import uuid
import asyncio
import random
from api.routes.run_code import execute_python_code

# Constant for open slot in private matches
OPEN_SLOT = "__OPEN__"

from api.routes.run_code import execute_python_code
from api.routes.run_code import execute_python_code
from test_cases.hidden_tests import get_hidden_tests
from config.database import SessionLocal
from models.user import User
from sqlalchemy import desc
from utils.cache import leaderboard_cache

# Battle Problem Registry
BATTLE_PROBLEMS = {
    "Two Sum": {
        "id": "Two Sum",
        "title": "Two Sum",
        "description": """
            <p style="margin-bottom: 1em;">Given an array of integers <code class="code-pill">nums</code> and an integer <code class="code-pill">target</code>, return indices of the two numbers such that they add up to <code class="code-pill">target</code>.</p>
            <p style="margin-bottom: 1.5em;">You may assume that each input would have <strong style="color: var(--text-primary)">exactly one solution</strong>, and you may not use the same element twice.</p>
            <div class="example-card">
                <div class="example-label">Example 1:</div>
                <div class="example-content">
                    <div><span class="input-label">Input:</span> nums = [2,7,11,15], target = 9</div>
                    <div><span class="output-label">Output:</span> [0,1]</div>
                </div>
            </div>
        """,
        "starterCode": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass",
        "visibleTestCases": [
            {"input": {"nums": [2, 7, 11, 15], "target": 9}, "output": [0, 1]},
            {"input": {"nums": [3, 2, 4], "target": 6}, "output": [1, 2]}
        ]
    },
    "Valid Anagram": {
        "id": "Valid Anagram",
        "title": "Valid Anagram",
        "description": """
            <p style="margin-bottom: 1em;">Given two strings <code class="code-pill">s</code> and <code class="code-pill">t</code>, return <code class="code-pill">true</code> if <code class="code-pill">t</code> is an anagram of <code class="code-pill">s</code>, and <code class="code-pill">false</code> otherwise.</p>
            <div class="example-card">
                <div class="example-label">Example 1:</div>
                <div class="example-content">
                    <div><span class="input-label">Input:</span> s = "anagram", t = "nagaram"</div>
                    <div><span class="output-label">Output:</span> true</div>
                </div>
            </div>
        """,
        "starterCode": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
        "visibleTestCases": [
            {"input": {"s": "anagram", "t": "nagaram"}, "output": True},
            {"input": {"s": "rat", "t": "car"}, "output": False}
        ]
    },
    "Contains Duplicate": {
        "id": "Contains Duplicate",
        "title": "Contains Duplicate",
        "description": """
            <p style="margin-bottom: 1em;">Given an integer array <code class="code-pill">nums</code>, return <code class="code-pill">true</code> if any value appears <strong>at least twice</strong> in the array, and return <code class="code-pill">false</code> if every element is distinct.</p>
            <div class="example-card">
                <div class="example-label">Example 1:</div>
                <div class="example-content">
                    <div><span class="input-label">Input:</span> nums = [1,2,3,1]</div>
                    <div><span class="output-label">Output:</span> true</div>
                </div>
            </div>
        """,
        "starterCode": "class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        pass",
        "visibleTestCases": [
            {"input": {"nums": [1, 2, 3, 1]}, "output": True},
            {"input": {"nums": [1, 2, 3, 4]}, "output": False}
        ]
    }
}

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Active connections: user_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}
        # Queue for matchmaking: list of user_ids
        self.queue: List[str] = []
        # Active matches: match_id -> match_state
        self.matches: Dict[str, Dict[str, Any]] = {}
        # User to Match mapping: user_id -> match_id
        self.user_match_map: Dict[str, str] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        
        # Load Rating
        rating = 1200
        if not user_id.startswith("guest"):
            try:
                db = SessionLocal()
                # Strip socket ID suffix (e.g. shrey_1234 -> shrey)
                real_username = user_id.rsplit('_', 1)[0]
                
                user = db.query(User).filter(User.username == real_username).first()
                if not user:
                    # Fallback if using numeric ID or if ID mismatch
                     user = db.query(User).filter(User.user_id == user_id).first()
                
                if user and user.elo_rating:
                    rating = user.elo_rating
                db.close()
            except Exception as e:
                print(f"[Battle] DB Error loading rating: {e}")
        
        # Store in temp memory (could use a separate dict or attach to WS object)
        # For simplicity, we'll keep a local map
        if not hasattr(self, 'user_ratings'): self.user_ratings = {}
        self.user_ratings[user_id] = rating

        print(f"[Battle] User {user_id} connected (Rating: {rating}).")

    async def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        
        if user_id in self.queue:
            self.queue.remove(user_id)
            
        # Handle if user was in a match
        if user_id in self.user_match_map:
            match_id = self.user_match_map[user_id]
            await self.end_match_disconnect(match_id, user_id)
            del self.user_match_map[user_id]
            
        print(f"[Battle] User {user_id} disconnected.")

    async def end_match_disconnect(self, match_id: str, disconnected_user: str):
        if match_id in self.matches:
            match = self.matches[match_id]
            # Notify other player
            for p_id in match['players']:
                if p_id != disconnected_user and p_id in self.active_connections:
                    await self.active_connections[p_id].send_json({
                        "type": "GAME_OVER",
                        "winner": p_id,
                        "reason": "Opponent disconnected"
                    })
            del self.matches[match_id]

    async def join_queue(self, user_id: str):
        if user_id not in self.queue:
            self.queue.append(user_id)
            print(f"[Battle] User {user_id} joined queue. Queue size: {len(self.queue)}")
            await self.check_queue()

    async def check_queue(self):
        if len(self.queue) >= 2:
            player1 = self.queue.pop(0)
            player2 = self.queue.pop(0)
            await self.create_match(player1, player2)

    async def create_match(self, p1: str, p2: str):
        match_id = str(uuid.uuid4())
        await self._init_match(match_id, p1, p2)

    async def create_private_match(self, match_id: str, p1: str, p2: str):
        print(f"[Battle] creating private match {match_id} for {p1} vs {p2}")
        await self._init_match(match_id, p1, p2)

    async def _init_match(self, match_id: str, p1: str, p2: str):
        # Pick Random Problem
        problem_id = random.choice(list(BATTLE_PROBLEMS.keys()))
        problem_data = BATTLE_PROBLEMS[problem_id]
        
        # Initial Game State
        match_state = {
            "id": match_id,
            "players": [p1, p2],
            "health": {p1: 100, p2: 100},
            "problem_id": problem_id, 
            "status": "pending", # Wait for connections if private
            "connected_players": []
        }
        
        self.matches[match_id] = match_state
        self.user_match_map[p1] = match_id
        self.user_match_map[p2] = match_id
        
        print(f"[Battle] Match {match_id} initialized between {p1} and {p2} (Problem: {problem_id})")
        
        # If players are already connected (e.g. queue match), notify immediately
        # checking connections is tricky because for private match they might NOT be connected to Battle WS yet
        # So we trigger notification only if they are active.
        
        await self.try_start_match(match_id)

    async def join_private_match(self, user_id: str, match_id: str):
        if match_id in self.matches:
             match = self.matches[match_id]
             
             # Check if user is already a player
             if user_id in match['players']:
                 if user_id not in match['connected_players']:
                     match['connected_players'].append(user_id)
                 await self.try_start_match(match_id)
             # Check if there's an open slot
             elif OPEN_SLOT in match['players']:
                 # Replace OPEN_SLOT with the joining user
                 open_index = match['players'].index(OPEN_SLOT)
                 match['players'][open_index] = user_id
                 
                 # Update health dict
                 match['health'][user_id] = 100
                 if OPEN_SLOT in match['health']:
                     del match['health'][OPEN_SLOT]
                 
                 # Update user_match_map
                 self.user_match_map[user_id] = match_id
                 
                 # Add to connected players
                 match['connected_players'].append(user_id)
                 
                 print(f"[Battle] User {user_id} filled open slot in match {match_id}")
                 await self.try_start_match(match_id)
             else:
                 print(f"[Battle] User {user_id} tried to join private match {match_id} but is not a player.")

    async def try_start_match(self, match_id: str):
        if match_id not in self.matches: return
        match = self.matches[match_id]
        p1, p2 = match['players']
        
        # Check if both are connected to WS
        p1_connected = p1 in self.active_connections
        p2_connected = p2 in self.active_connections
        
        if p1_connected and p2_connected:
            match['status'] = "active"
            problem_id = match['problem_id']
            problem_data = BATTLE_PROBLEMS[problem_id]
            
            print(f"[Battle] Starting Match {match_id}")
            
            # Notify Players
            for p in [p1, p2]:
                opponent = p2 if p == p1 else p1
                await self.active_connections[p].send_json({
                    "type": "MATCH_FOUND",
                    "match_id": match_id,
                    "opponent": opponent,
                    "problem": {
                        "id": problem_id,
                        "title": problem_data['title'],
                        "description": problem_data['description'],
                        "starterCode": problem_data['starterCode']
                    },
                    "health": 100,
                    "opponent_health": 100
                })

    async def process_code_submission(self, user_id: str, code: str):
        match_id = self.user_match_map.get(user_id)
        if not match_id or match_id not in self.matches:
            return

        match = self.matches[match_id]
        
        # Get Test Cases (Visible + Hidden)
        problem_id = match['problem_id']
        problem_def = BATTLE_PROBLEMS.get(problem_id)
        
        if not problem_def:
             print(f"Error: Problem {problem_id} not found in registry")
             return

        visible_tests = problem_def['visibleTestCases']
        hidden_tests = get_hidden_tests(problem_id)
        
        all_test_cases = visible_tests + hidden_tests
        
        # Execute Code
        passed_count = 0
        total_tests = len(all_test_cases)
        results = []

        for tc in all_test_cases:
            # execute_python_code returns: (passed: bool, actual_output: Any, error: str)
            passed, actual, error = execute_python_code(code, tc)
            results.append({"passed": passed, "error": error})
            if passed:
                passed_count += 1
        
        is_full_solve = passed_count == total_tests
        
        # Calculate Damage
        damage = 0
        if passed_count > 0:
            damage = passed_count * 10
            if is_full_solve:
                damage += 50  # Bonus
                
        # Send Results to User (Private Feedback)
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json({
                "type": "SUBMIT_RESULT",
                "passed": passed_count,
                "total": total_tests,
                "damage_dealt": damage,
                "results": results
            })
            
        # Apply Damage to Opponent if any
        if damage > 0:
            opponent_id = match['players'][1] if match['players'][0] == user_id else match['players'][0]
            match['health'][opponent_id] = max(0, match['health'][opponent_id] - damage)
            current_opponent_health = match['health'][opponent_id]
            
            # Broadcast Attack (Update Health Bars for BOTH)
            for p in match['players']:
                if p in self.active_connections:
                     await self.active_connections[p].send_json({
                        "type": "ATTACK",
                        "attacker": user_id,
                        "damage": damage,
                        "target": opponent_id,
                        "new_health": current_opponent_health
                    })
            
            # Check Win Condition
            if current_opponent_health <= 0:
                await self.end_match(match_id, winner=user_id)

    async def end_match(self, match_id: str, winner: str):
        if match_id in self.matches:
            match = self.matches[match_id]
            players = match['players']
            
            # Simple Elo Logic
            K_FACTOR = 30
            # rating_change defined below per player
            
            for p in players:
                is_winner = (p == winner)
                current_rating = self.user_ratings.get(p, 1200)
                
                # Mock calculation dependent on opponent? For MVP just constant
                # Proper Elo needs opponent rating.
                opponent_id = players[1] if players[0] == p else players[0]
                opponent_rating = self.user_ratings.get(opponent_id, 1200)
                
                expected_score = 1 / (1 + 10 ** ((opponent_rating - current_rating) / 400))
                actual_score = 1 if is_winner else 0
                
                rating_change = round(K_FACTOR * (actual_score - expected_score))
                new_rating = current_rating + rating_change
                
                # UPDATE DB
                if not p.startswith("guest"):
                     try:
                        db = SessionLocal()
                        real_username = p.rsplit('_', 1)[0]
                        user = db.query(User).filter(User.username == real_username).first()
                        if not user: user = db.query(User).filter(User.user_id == real_username).first()
                        
                        if user:
                            print(f"[Battle] Updating rating for {real_username}: {user.elo_rating} -> {new_rating}")
                            user.elo_rating = new_rating
                            db.commit()
                        else:
                            print(f"[Battle] User {real_username} not found in DB for rating update.")
                        db.close()
                     except Exception as e:
                        print(f"[Battle] DB Error saving rating: {e}")
                else:
                    print(f"[Battle] Skipping rating update for guest: {p}")
                
                # Update memory
                self.user_ratings[p] = new_rating

                if p in self.active_connections:
                     await self.active_connections[p].send_json({
                        "type": "GAME_OVER",
                        "winner": winner,
                        "result": "VICTORY" if is_winner else "DEFEAT",
                        "rating_change": rating_change,
                        "new_rating": new_rating
                    })
            # Cleanup
            if match_id in self.matches: del self.matches[match_id]
            for p in match['players']:
                if p in self.user_match_map: del self.user_match_map[p]

    def get_active_users(self) -> List[Dict[str, Any]]:
        active_list = []
        # Ensure ratings initialized
        if not hasattr(self, 'user_ratings'): self.user_ratings = {}
        
        for user_id in self.active_connections:
            status = "battling" if user_id in self.user_match_map else "online"
            active_list.append({
                "user_id": user_id,
                "status": status,
                "rating": self.user_ratings.get(user_id, 1200)
            })
        return active_list

manager = ConnectionManager()

@router.websocket("/ws/battle/{user_id}")
async def battle_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_json()
            message_type = data.get("type")
            
            if message_type == "JOIN_QUEUE":
                await manager.join_queue(user_id)

            elif message_type == "CREATE_PRIVATE_MATCH":
                 # For email invites: create match with open slot
                 match_id = data.get("match_id")
                 if match_id:
                     await manager.create_private_match(match_id, user_id, OPEN_SLOT)
                     print(f"[Battle] Created private match {match_id} with open slot for {user_id}")

            elif message_type == "JOIN_MATCH":
                 match_id = data.get("match_id")
                 await manager.join_private_match(user_id, match_id)
            
            elif message_type == "SUBMIT_CODE":
                await manager.process_code_submission(user_id, data.get('code'))
                
    except WebSocketDisconnect:
        await manager.disconnect(user_id)
    except Exception as e:
        print(f"[Battle] Error: {e}")
        await manager.disconnect(user_id)


@router.get("/api/battle/active_users")
async def get_active_users():
    lobby_users = lobby_manager.get_online_users()
    return {"users": lobby_users}

@router.get("/api/battle/leaderboard")
def get_leaderboard():
    # Check Cache
    cached = leaderboard_cache.get("top_10")
    if cached:
        return cached

    db = SessionLocal()
    try:
        # Get top 10 users by Elo
        top_users = db.query(User).filter(User.elo_rating != None).order_by(desc(User.elo_rating)).limit(10).all()
        result = {
            "leaderboard": [
                {"rank": i+1, "username": u.username or "Unknown", "rating": u.elo_rating}
                for i, u in enumerate(top_users)
            ]
        }
        # Set Cache
        leaderboard_cache.set("top_10", result)
        return result
    finally:
        db.close()

# --- Lobby System ---
class LobbyManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"[Lobby] User {user_id} connected.")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        print(f"[Lobby] User {user_id} disconnected.")

    async def send_challenge(self, sender_id: str, target_id: str):
        if target_id in self.active_connections:
            await self.active_connections[target_id].send_json({
                "type": "CHALLENGE_RECEIVED",
                "from_id": sender_id,
                "from_name": sender_id # Can enhance later
            })
            return True
        return False

    async def accept_challenge(self, target_id: str, challenger_id: str):
        # Create a private match
        # We reuse the Battle ConnectionManager to create the match state
        # But we need to pre-allocate the match ID so they can join it
        match_id = str(uuid.uuid4())
        
        # We need to tell the BattleManager that this match ID is reserved/valid or just let them join
        # For MVP: We just generate ID and send to both. 
        # When they connect to /ws/battle, they will send JOIN_MATCH {match_id}
        
        # Notify Target (Accepter)
        if target_id in self.active_connections:
            await self.active_connections[target_id].send_json({
                "type": "MATCH_START",
                "match_id": match_id,
                "opponent": challenger_id
            })
            
        if challenger_id in self.active_connections:
            await self.active_connections[challenger_id].send_json({
                "type": "MATCH_START",
                "match_id": match_id,
                "opponent": target_id
            })

        # Initialize match in Battle Manager
        await manager.create_private_match(match_id, target_id, challenger_id)

    def get_online_users(self):
        return [
            {"user_id": uid, "status": "online", "rating": 1200}
            for uid in self.active_connections
        ]

lobby_manager = LobbyManager()

@router.websocket("/ws/lobby/{user_id}")
async def lobby_endpoint(websocket: WebSocket, user_id: str):
    await lobby_manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_json()
            message_type = data.get("type")
            
            if message_type == "SEND_CHALLENGE":
                target_id = data.get("target_id")
                await lobby_manager.send_challenge(user_id, target_id)
            
            elif message_type == "ACCEPT_CHALLENGE":
                challenger_id = data.get("challenger_id")
                await lobby_manager.accept_challenge(user_id, challenger_id)
                
    except WebSocketDisconnect:
        lobby_manager.disconnect(user_id)
    except Exception as e:
        print(f"[Lobby] Error: {e}")
        lobby_manager.disconnect(user_id)
