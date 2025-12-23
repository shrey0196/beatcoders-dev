
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
        "beginner": (0, 300),
        "bronze": (300, 500),
        "silver": (500, 700),
        "gold": (700, 900),
        "platinum": (900, 1000),
        "diamond": (1000, 3000) # Theoretical max
    }

    # Minimum requirements for each tier
    MIN_REQUIREMENTS = {
        "beginner": {"problems": 0, "days_active": 0},
        "bronze": {"problems": 10, "days_active": 3},
        "silver": {"problems": 25, "days_active": 7},
        "gold": {"problems": 50, "days_active": 14},
        "platinum": {"problems": 100, "days_active": 30},
        "diamond": {"problems": 200, "days_active": 60}
    }

    def calculate_crs(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate CRS score from user data
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

        problems_solved = user_data.get("problems_solved", 0)
        days_active = user_data.get("days_active", 0)
        
        # Determine tier
        tier = self._get_tier(total_score, problems_solved, days_active)
        
        # Generate insights
        insights = self._generate_insights(components, total_score, tier)
        
        return {
            "score": round(total_score, 1),
            "components": {k: round(v, 1) for k, v in components.items()},
            "tier": tier,
            "insights": insights,
            "calculated_at": datetime.utcnow().isoformat()
        }

    def _calculate_speed_score(self, data: Dict[str, Any]) -> float:
        # Heuristic: Base 500, +/- based on time taken vs optimal
        submissions = data.get("submissions", [])
        if not submissions: return 100.0
        
        score_sum = 0
        for sub in submissions:
            # Assume 15 mins (900s) is "standard"
            time = sub.get("time_taken", 900)
            score_sum += min(1000, 1000 * (900 / (time + 1)))
        
        return min(1000, score_sum / len(submissions))

    def _calculate_accuracy_score(self, data: Dict[str, Any]) -> float:
        solved = data.get("problems_solved", 0)
        attempts = data.get("total_attempts", 1)
        if attempts == 0: return 0.0
        ratio = solved / attempts
        return min(1000, ratio * 1000)

    def _calculate_problem_solving_score(self, data: Dict[str, Any]) -> float:
        # Based on difficulty
        dist = data.get("difficulty_distribution", {})
        score = (dist.get("easy", 0) * 100) + (dist.get("medium", 0) * 300) + (dist.get("hard", 0) * 600)
        # Normalize roughly
        solved = data.get("problems_solved", 1)
        return min(1000, score / solved * 2) if solved else 0

    def _calculate_consistency_score(self, data: Dict[str, Any]) -> float:
        # Simple placeholder
        return 500.0

    def _get_tier(self, score: float, problems_solved: int = 0, days_active: int = 0) -> str:
        """Determine tier based on score AND minimum requirements"""
        sorted_tiers = sorted(
            self.TIERS.items(), 
            key=lambda x: x[1][0], 
            reverse=True
        )
        
        for tier_name, (min_score, max_score) in sorted_tiers:
            if score >= min_score:
                requirements = self.MIN_REQUIREMENTS.get(tier_name, {"problems": 0, "days_active": 0})
                if (problems_solved >= requirements["problems"] and 
                    days_active >= requirements["days_active"]):
                    return tier_name
        return "beginner"
    
    def _generate_insights(self, components: Dict[str, float], total_score: float, tier: str) -> List[str]:
        """Generate personalized insights based on score components"""
        insights = []
        tier_messages = {
            "beginner": "Welcome! Start your coding journey by solving problems daily.",
            "bronze": "You're building your foundation. Keep practicing!",
            "silver": "You're making solid progress. Focus on consistency.",
            "gold": "Excellent work! You're becoming a strong problem solver.",
            "platinum": "Outstanding! You're in the top tier of coders.",
            "diamond": "🏆 Master level! You're among the elite coders."
        }
        insights.append(tier_messages.get(tier, "Keep coding!"))
        
        if components["speed"] < 400:
            insights.append("💡 Work on solving problems faster. Try setting time limits.")
        if components["accuracy"] < 400:
            insights.append("🎯 Focus on accuracy. Take time to understand problems before coding.")
        if components["problem_solving"] < 400:
            insights.append("🧩 Challenge yourself with harder problems to improve problem-solving skills.")
        if components["consistency"] < 400:
            insights.append("📅 Practice regularly! Consistency is key to improvement.")
        
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
