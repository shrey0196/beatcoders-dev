"""
CRS (Cognitive Rating Score) Calculator
Calculates a comprehensive score based on user's coding performance
"""

from typing import Dict, List, Any
from datetime import datetime, timedelta
import statistics

class CRSCalculator:
    """Calculate Cognitive Rating Score from user submissions and cognitive data"""
    
    # Score weights
    WEIGHTS = {
        "speed": 0.25,
        "accuracy": 0.30,
        "problem_solving": 0.30,
        "consistency": 0.15
    }
    
    # Tier thresholds
    TIERS = {
        "bronze": (0, 400),
        "silver": (400, 600),
        "gold": (600, 800),
        "platinum": (800, 1000)
    }
    
    def calculate_crs(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate CRS score from user data
        
        Args:
            user_data: {
                "submissions": [...],  # List of submission records
                "cognitive_sessions": [...],  # List of cognitive analysis data
                "problems_solved": int,
                "total_attempts": int
            }
        
        Returns:
            {
                "score": float,
                "components": {...},
                "tier": str,
                "insights": [...]
            }
        """
        components = {
            "speed": self._calculate_speed_score(user_data),
            "accuracy": self._calculate_accuracy_score(user_data),
            "problem_solving": self._calculate_problem_solving_score(user_data),
            "consistency": self._calculate_consistency_score(user_data)
        }
        
        # Calculate weighted total
        total_score = sum(
            components[key] * self.WEIGHTS[key] 
            for key in components
        )
        
        # Determine tier
        tier = self._get_tier(total_score)
        
        # Generate insights
        insights = self._generate_insights(components, total_score, tier)
        
        return {
            "score": round(total_score, 1),
            "components": {k: round(v, 1) for k, v in components.items()},
            "tier": tier,
            "insights": insights,
            "calculated_at": datetime.utcnow().isoformat()
        }
    
    def _calculate_speed_score(self, user_data: Dict[str, Any]) -> float:
        """Calculate speed component (0-1000)"""
        submissions = user_data.get("submissions", [])
        if not submissions:
            return 0.0
        
        # Analyze solve times
        solve_times = [s.get("time_taken", 0) for s in submissions if s.get("status") == "accepted"]
        if not solve_times:
            return 0.0
        
        avg_time = statistics.mean(solve_times)
        
        # Benchmark: 15 min = 900s is average (500 points)
        # Faster = higher score, slower = lower score
        if avg_time <= 300:  # 5 min or less
            return 900.0
        elif avg_time <= 600:  # 10 min
            return 750.0
        elif avg_time <= 900:  # 15 min
            return 500.0
        elif avg_time <= 1800:  # 30 min
            return 300.0
        else:
            return 150.0
    
    def _calculate_accuracy_score(self, user_data: Dict[str, Any]) -> float:
        """Calculate accuracy component (0-1000)"""
        total_attempts = user_data.get("total_attempts", 0)
        problems_solved = user_data.get("problems_solved", 0)
        
        if total_attempts == 0:
            return 0.0
        
        # Success rate
        success_rate = problems_solved / total_attempts
        
        # Also consider first-attempt success
        submissions = user_data.get("submissions", [])
        first_attempt_success = sum(
            1 for s in submissions 
            if s.get("attempt_number") == 1 and s.get("status") == "accepted"
        )
        
        first_attempt_rate = first_attempt_success / problems_solved if problems_solved > 0 else 0
        
        # Weighted combination
        accuracy_score = (success_rate * 0.6 + first_attempt_rate * 0.4) * 1000
        
        return min(accuracy_score, 1000.0)
    
    def _calculate_problem_solving_score(self, user_data: Dict[str, Any]) -> float:
        """Calculate problem-solving component (0-1000)"""
        submissions = user_data.get("submissions", [])
        cognitive_sessions = user_data.get("cognitive_sessions", [])
        
        if not submissions:
            return 0.0
        
        # Difficulty distribution
        difficulty_points = {
            "easy": 100,
            "medium": 250,
            "hard": 500
        }
        
        total_difficulty_points = sum(
            difficulty_points.get(s.get("difficulty", "easy"), 100)
            for s in submissions
            if s.get("status") == "accepted"
        )
        
        # Cognitive patterns (flow state, problem-solving approach)
        cognitive_bonus = 0
        if cognitive_sessions:
            flow_sessions = sum(
                1 for cs in cognitive_sessions 
                if cs.get("analysis", {}).get("dominant_state") == "flow"
            )
            cognitive_bonus = (flow_sessions / len(cognitive_sessions)) * 200
        
        # Normalize to 0-1000 scale
        base_score = min(total_difficulty_points / 10, 800)
        
        return min(base_score + cognitive_bonus, 1000.0)
    
    def _calculate_consistency_score(self, user_data: Dict[str, Any]) -> float:
        """Calculate consistency component (0-1000)"""
        submissions = user_data.get("submissions", [])
        
        if len(submissions) < 3:
            return 0.0
        
        # Check activity over time
        submission_dates = [
            datetime.fromisoformat(s.get("submitted_at", datetime.utcnow().isoformat()))
            for s in submissions
        ]
        submission_dates.sort()
        
        # Calculate gaps between submissions
        gaps = [
            (submission_dates[i+1] - submission_dates[i]).days
            for i in range(len(submission_dates) - 1)
        ]
        
        if not gaps:
            return 0.0
        
        avg_gap = statistics.mean(gaps)
        
        # Reward regular practice
        if avg_gap <= 1:  # Daily practice
            consistency_score = 900.0
        elif avg_gap <= 3:  # Every few days
            consistency_score = 700.0
        elif avg_gap <= 7:  # Weekly
            consistency_score = 500.0
        elif avg_gap <= 14:  # Bi-weekly
            consistency_score = 300.0
        else:
            consistency_score = 150.0
        
        # Bonus for recent activity
        if submission_dates:
            days_since_last = (datetime.utcnow() - submission_dates[-1]).days
            if days_since_last <= 1:
                consistency_score = min(consistency_score + 100, 1000)
        
        return consistency_score
    
    def _get_tier(self, score: float) -> str:
        """Determine tier based on score"""
        for tier, (min_score, max_score) in self.TIERS.items():
            if min_score <= score < max_score:
                return tier
        return "platinum"  # 800+
    
    def _generate_insights(self, components: Dict[str, float], total_score: float, tier: str) -> List[str]:
        """Generate personalized insights based on score components"""
        insights = []
        
        # Overall tier message
        tier_messages = {
            "bronze": "You're building your foundation. Keep practicing!",
            "silver": "You're making solid progress. Focus on consistency.",
            "gold": "Excellent work! You're becoming a strong problem solver.",
            "platinum": "Outstanding! You're in the top tier of coders."
        }
        insights.append(tier_messages.get(tier, "Keep coding!"))
        
        # Component-specific insights
        if components["speed"] < 400:
            insights.append("💡 Work on solving problems faster. Try setting time limits.")
        
        if components["accuracy"] < 400:
            insights.append("🎯 Focus on accuracy. Take time to understand problems before coding.")
        
        if components["problem_solving"] < 400:
            insights.append("🧩 Challenge yourself with harder problems to improve problem-solving skills.")
        
        if components["consistency"] < 400:
            insights.append("📅 Practice regularly! Consistency is key to improvement.")
        
        # Strength recognition
        strongest = max(components.items(), key=lambda x: x[1])
        if strongest[1] > 600:
            strength_names = {
                "speed": "speed",
                "accuracy": "accuracy",
                "problem_solving": "problem-solving",
                "consistency": "consistency"
            }
            insights.append(f"⭐ Your {strength_names[strongest[0]]} is a strong point!")
        
        return insights
