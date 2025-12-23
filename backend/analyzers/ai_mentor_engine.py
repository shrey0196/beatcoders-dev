"""
AI Mentor Engine
Provides intelligent coding guidance and mentorship (rule-based for now)
"""

from typing import Dict, List, Any, Optional
import random
from backend.utils.llm import LLMClient

class AIMentorEngine:
    """AI-powered coding mentor with LLM integration and fallback"""
    
    def __init__(self):
        self.llm = LLMClient()
    
    # Response templates by category
    RESPONSES = {
        "greeting": [
            "Hello! I'm your AI coding mentor. How can I help you today?",
            "Hi there! Ready to tackle some coding challenges together?",
            "Welcome! I'm here to guide you through your coding journey. What would you like to work on?"
        ],
        "hint_request": [
            "Let me give you a hint without spoiling the solution: {hint}",
            "Here's a nudge in the right direction: {hint}",
            "Think about this: {hint}"
        ],
        "explanation": [
            "Great question! {explanation}",
            "Let me explain: {explanation}",
            "Here's how it works: {explanation}"
        ],
        "encouragement": [
            "You're on the right track! Keep going!",
            "Great progress! You're thinking like a problem solver.",
            "Excellent approach! You're getting closer to the solution.",
            "Don't give up! Every expert was once a beginner."
        ],
        "debugging": [
            "Let's debug this together. {debug_tip}",
            "I noticed an issue: {debug_tip}",
            "Here's what might be wrong: {debug_tip}"
        ]
    }
    
    # Topic-specific hints
    TOPIC_HINTS = {
        "arrays": [
            "Consider using two pointers to traverse the array efficiently.",
            "Think about sorting the array first - it might simplify the problem.",
            "Can you use a hash map to track elements you've seen?",
            "What if you iterate from both ends of the array?"
        ],
        "strings": [
            "String manipulation often benefits from using a StringBuilder or list.",
            "Consider the sliding window technique for substring problems.",
            "Can you use a character frequency map?",
            "Think about edge cases: empty strings, single characters, special characters."
        ],
        "dynamic_programming": [
            "Start by identifying the subproblems - what smaller problems can you solve first?",
            "Think about the base cases - what are the simplest scenarios?",
            "Can you express the solution in terms of previously computed results?",
            "Consider whether you need 1D or 2D memoization."
        ],
        "graphs": [
            "Would BFS or DFS be more appropriate for this problem?",
            "Think about how to represent the graph - adjacency list or matrix?",
            "Don't forget to mark visited nodes to avoid cycles!",
            "Consider the time complexity of your graph traversal."
        ],
        "trees": [
            "Recursion is often natural for tree problems - think about the base case.",
            "Consider traversal orders: preorder, inorder, postorder.",
            "Can you solve this problem for a subtree first?",
            "Think about the relationship between parent and child nodes."
        ]
    }
    
    # Common debugging tips
    DEBUG_TIPS = [
        "Check your loop boundaries - are you accessing valid indices?",
        "Verify your base cases in recursive functions.",
        "Make sure you're handling edge cases like empty inputs.",
        "Add print statements to trace variable values.",
        "Check if you're modifying the correct variables.",
        "Ensure your return statement is in the right place."
    ]
    
    def generate_response(self, message: str, context: Dict[str, Any]) -> str:
        """
        Generate mentor response based on user message and context
        
        Args:
            message: User's message
            context: {
                "current_problem": str,
                "user_code": str,
                "topic": str,
                "difficulty": str,
                "conversation_history": [...]
            }
        
        Returns:
            AI mentor response
        """
        # Try LLM First
        if self.llm.provider != "none":
            llm_response = self._generate_llm_response(message, context)
            if llm_response:
                return llm_response

        # Fallback to Rule-Based
        return self._generate_fallback_response(message, context)

    def _generate_llm_response(self, message: str, context: Dict[str, Any]) -> Optional[str]:
        """Generate response using LLM"""
        
        # Build Context String
        problem_title = context.get("problem_title", "Unknown Problem")
        current_code = context.get("user_code", "")
        # Safely handle language, defaulting to Python if missing or None
        language = context.get("language") or "python"
        
        system_prompt = f"""
You are an expert AI Coding Mentor for BeatCoders. 
Your goal is to help the user solve the coding problem: "{problem_title}".

GUIDELINES:
1. Socratic Method: Do NOT just give the solution. Ask guiding questions.
2. Be Encouraging: Coding is hard. Validate their effort.
3. Context Aware: The user is writing code in {language}.
4. Conciseness: Keep responses short (under 3-4 sentences) unless explaining a complex concept.

CURRENT USER CODE:
```{language}
{current_code}
```
"""
        return self.llm.generate(message, system_prompt)

    def _generate_fallback_response(self, message: str, context: Dict[str, Any]) -> str:
        """
        [FALLBACK] Generate mentor response based on user message and rules
        """
        message_lower = message.lower()
        
        # Detect intent
        if self._is_greeting(message_lower):
            return self._handle_greeting()
        
        elif self._is_hint_request(message_lower):
            return self._handle_hint_request(context)
        
        elif self._is_explanation_request(message_lower):
            return self._handle_explanation(message, context)
        
        elif self._is_debugging_request(message_lower):
            return self._handle_debugging(context)
        
        elif self._is_encouragement_needed(message_lower):
            return self._handle_encouragement()
        
        else:
            return self._handle_general_question(message, context)
    
    def _is_greeting(self, message: str) -> bool:
        """Check if message is a greeting"""
        greetings = ["hello", "hi", "hey", "start", "help"]
        return any(g in message for g in greetings)
    
    def _is_hint_request(self, message: str) -> bool:
        """Check if user is asking for a hint"""
        hint_keywords = ["hint", "clue", "stuck", "help me", "don't know", "how to start"]
        return any(kw in message for kw in hint_keywords)
    
    def _is_explanation_request(self, message: str) -> bool:
        """Check if user wants an explanation"""
        explain_keywords = ["explain", "what is", "how does", "why", "understand"]
        return any(kw in message for kw in explain_keywords)
    
    def _is_debugging_request(self, message: str) -> bool:
        """Check if user needs debugging help"""
        debug_keywords = ["error", "bug", "wrong", "not working", "failing", "debug"]
        return any(kw in message for kw in debug_keywords)
    
    def _is_encouragement_needed(self, message: str) -> bool:
        """Check if user needs encouragement"""
        discouraged_keywords = ["can't", "difficult", "hard", "give up", "frustrated"]
        return any(kw in message for kw in discouraged_keywords)
    
    def _handle_greeting(self) -> str:
        """Handle greeting messages"""
        return random.choice(self.RESPONSES["greeting"])
    
    def _handle_hint_request(self, context: Dict[str, Any]) -> str:
        """Provide a hint based on problem topic"""
        topic = context.get("topic", "").lower()
        
        # Get topic-specific hint
        hint = None
        for key, hints in self.TOPIC_HINTS.items():
            if key in topic:
                hint = random.choice(hints)
                break
        
        if not hint:
            hint = "Break down the problem into smaller steps. What's the first thing you need to do?"
        
        template = random.choice(self.RESPONSES["hint_request"])
        return template.format(hint=hint)
    
    def _handle_explanation(self, message: str, context: Dict[str, Any]) -> str:
        """Provide explanations for concepts"""
        # Extract what they want explained
        topic = context.get("topic", "")
        
        explanations = {
            "two pointers": "The two pointers technique uses two indices to traverse a data structure, often from opposite ends. It's efficient for problems involving pairs or subarrays.",
            "sliding window": "Sliding window maintains a window of elements and slides it across the array. It's useful for substring/subarray problems with contiguous elements.",
            "dynamic programming": "Dynamic Programming solves complex problems by breaking them into simpler subproblems and storing results to avoid redundant calculations.",
            "bfs": "Breadth-First Search explores nodes level by level. It's great for finding shortest paths in unweighted graphs.",
            "dfs": "Depth-First Search explores as far as possible along each branch before backtracking. Useful for path finding and cycle detection.",
            "hash map": "Hash maps provide O(1) average-case lookup, insert, and delete. They're perfect for tracking frequencies or checking existence."
        }
        
        # Find matching explanation
        explanation = None
        for key, exp in explanations.items():
            if key in message.lower():
                explanation = exp
                break
        
        if not explanation:
            explanation = f"The {topic} technique is commonly used in coding problems. Try breaking it down step by step."
        
        template = random.choice(self.RESPONSES["explanation"])
        return template.format(explanation=explanation)
    
    def _handle_debugging(self, context: Dict[str, Any]) -> str:
        """Provide debugging assistance"""
        debug_tip = random.choice(self.DEBUG_TIPS)
        template = random.choice(self.RESPONSES["debugging"])
        return template.format(debug_tip=debug_tip)
    
    def _handle_encouragement(self) -> str:
        """Provide encouragement"""
        return random.choice(self.RESPONSES["encouragement"])
    
    def _handle_general_question(self, message: str, context: Dict[str, Any]) -> str:
        """Handle general questions"""
        return (
            "I'm here to help! Could you be more specific? Are you looking for:\n"
            "• A hint to get started?\n"
            "• An explanation of a concept?\n"
            "• Help debugging your code?\n"
            "Just let me know what you need!"
        )
    
    def get_problem_specific_guidance(self, problem_data: Dict[str, Any]) -> str:
        """Get guidance specific to a problem"""
        difficulty = problem_data.get("difficulty", "medium")
        topic = problem_data.get("topic", "general")
        
        guidance = f"For this {difficulty} {topic} problem:\n\n"
        
        # Add topic-specific starting point
        if topic.lower() in self.TOPIC_HINTS:
            hints = self.TOPIC_HINTS[topic.lower()]
            guidance += f"💡 {hints[0]}\n\n"
        
        # Add difficulty-specific advice
        if difficulty == "easy":
            guidance += "Take your time to understand the problem. Focus on writing clean, working code first."
        elif difficulty == "medium":
            guidance += "Think about the optimal approach. Can you improve the time or space complexity?"
        else:  # hard
            guidance += "This is challenging! Break it into smaller subproblems and consider edge cases carefully."
        
        return guidance
