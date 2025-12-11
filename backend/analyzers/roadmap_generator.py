"""
Skill Roadmap Generator
Generates personalized learning paths based on user's current skills and CRS
"""

from typing import Dict, List, Any
from datetime import datetime, timedelta
import random

class RoadmapGenerator:
    """Generate personalized skill development roadmaps"""
    
    # Skill categories and their progression
    SKILL_TREE = {
        "beginner": {
            "focus_areas": ["Arrays", "Strings", "Basic Math", "Loops"],
            "difficulty": "easy",
            "weekly_problems": 5
        },
        "intermediate": {
            "focus_areas": ["Hash Tables", "Two Pointers", "Sliding Window", "Recursion", "Sorting"],
            "difficulty": "medium",
            "weekly_problems": 4
        },
        "advanced": {
            "focus_areas": ["Dynamic Programming", "Graphs", "Trees", "Backtracking", "Greedy"],
            "difficulty": "medium-hard",
            "weekly_problems": 3
        },
        "expert": {
            "focus_areas": ["Advanced DP", "Graph Algorithms", "Segment Trees", "Trie", "Advanced Math"],
            "difficulty": "hard",
            "weekly_problems": 3
        }
    }
    
    # Course recommendations by skill level
    COURSE_RECOMMENDATIONS = {
        "beginner": [
            {
                "type": "course",
                "title": "Python Fundamentals for Coding Interviews",
                "description": "Master the basics of Python and problem-solving",
                "link": "#",
                "duration": "4 weeks"
            },
            {
                "type": "practice",
                "title": "Array Manipulation Mastery",
                "description": "50 curated array problems from easy to medium",
                "link": "#",
                "duration": "2 weeks"
            }
        ],
        "intermediate": {
            "type": "course",
            "title": "Data Structures Deep Dive",
            "description": "Master hash tables, stacks, queues, and heaps",
            "link": "#",
            "duration": "6 weeks"
        },
        "advanced": [
            {
                "type": "course",
                "title": "Dynamic Programming Patterns",
                "description": "Learn all major DP patterns with real examples",
                "link": "#",
                "duration": "8 weeks"
            },
            {
                "type": "book",
                "title": "Algorithm Design Manual",
                "description": "Comprehensive guide to algorithm design",
                "link": "#",
                "duration": "Self-paced"
            }
        ],
        "expert": [
            {
                "type": "course",
                "title": "Competitive Programming Masterclass",
                "description": "Advanced algorithms for competitive coding",
                "link": "#",
                "duration": "10 weeks"
            }
        ]
    }
    
    def assess_skill_level(self, user_data: Dict[str, Any]) -> str:
        """
        Assess user's current skill level based on their performance
        
        Args:
            user_data: {
                "crs_score": float,
                "problems_solved": int,
                "difficulty_distribution": {...}
            }
        
        Returns:
            Skill level: beginner, intermediate, advanced, expert
        """
        crs_score = user_data.get("crs_score", 0)
        problems_solved = user_data.get("problems_solved", 0)
        difficulty_dist = user_data.get("difficulty_distribution", {})
        
        hard_solved = difficulty_dist.get("hard", 0)
        medium_solved = difficulty_dist.get("medium", 0)
        
        # Determine level based on CRS and problem history
        if crs_score >= 800 and hard_solved >= 20:
            return "expert"
        elif crs_score >= 600 and medium_solved >= 30:
            return "advanced"
        elif crs_score >= 400 and problems_solved >= 20:
            return "intermediate"
        else:
            return "beginner"
    
    def generate_roadmap(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate complete skill roadmap for user
        
        Args:
            user_data: User performance and history data
        
        Returns:
            Complete roadmap with weekly plan and recommendations
        """
        current_level = self.assess_skill_level(user_data)
        skill_config = self.SKILL_TREE[current_level]
        
        # Identify skill gaps
        solved_topics = user_data.get("solved_topics", [])
        target_skills = [
            skill for skill in skill_config["focus_areas"]
            if skill not in solved_topics
        ]
        
        # If no gaps, suggest next level
        if not target_skills:
            next_level = self._get_next_level(current_level)
            if next_level:
                skill_config = self.SKILL_TREE[next_level]
                target_skills = skill_config["focus_areas"][:3]
        
        # Generate weekly plan
        weekly_plan = self._generate_weekly_plan(current_level, target_skills, skill_config)
        
        # Get course recommendations
        recommendations = self._get_recommendations(current_level, target_skills)
        
        # Define milestones
        milestones = self._generate_milestones(current_level, target_skills)
        
        return {
            "current_level": current_level,
            "target_skills": target_skills,
            "weekly_plan": weekly_plan,
            "next_recommendations": recommendations,
            "milestones": milestones,
            "generated_at": datetime.utcnow().isoformat()
        }
    
    def _generate_weekly_plan(self, level: str, target_skills: List[str], config: Dict) -> Dict[str, Any]:
        """Generate adaptive weekly plan"""
        today = datetime.utcnow()
        week_start = today - timedelta(days=today.weekday())
        
        # Calculate week number (weeks since start of year)
        week_number = today.isocalendar()[1]
        
        # Select focus areas for this week (rotate through target skills)
        focus_index = week_number % len(target_skills) if target_skills else 0
        this_week_focus = target_skills[focus_index:focus_index+2] if target_skills else []
        
        # Generate problem recommendations
        recommended_problems = []
        for i, skill in enumerate(this_week_focus):
            num_problems = config["weekly_problems"] // len(this_week_focus) if this_week_focus else 0
            for j in range(num_problems):
                recommended_problems.append({
                    "id": f"problem_{skill.lower().replace(' ', '_')}_{j+1}",
                    "title": f"{skill} Challenge {j+1}",
                    "difficulty": config["difficulty"],
                    "topic": skill,
                    "estimated_time": "15-30 min"
                })
        
        # Set weekly goals
        goals = [
            f"Solve {config['weekly_problems']} problems",
            f"Master {', '.join(this_week_focus)}" if this_week_focus else "Practice consistently",
            "Maintain daily coding streak"
        ]
        
        return {
            "week_number": week_number,
            "start_date": week_start.isoformat(),
            "end_date": (week_start + timedelta(days=7)).isoformat(),
            "goals": goals,
            "recommended_problems": recommended_problems,
            "focus_areas": this_week_focus
        }
    
    def _get_recommendations(self, level: str, target_skills: List[str]) -> List[Dict[str, Any]]:
        """Get personalized course and resource recommendations"""
        base_recommendations = self.COURSE_RECOMMENDATIONS.get(level, [])
        
        # Ensure it's a list
        if isinstance(base_recommendations, dict):
            base_recommendations = [base_recommendations]
        
        # Add skill-specific recommendations
        skill_specific = []
        for skill in target_skills[:2]:  # Top 2 skills
            skill_specific.append({
                "type": "practice",
                "title": f"{skill} Practice Set",
                "description": f"Curated problems focusing on {skill}",
                "link": "#",
                "duration": "1-2 weeks"
            })
        
        return base_recommendations + skill_specific
    
    def _generate_milestones(self, level: str, target_skills: List[str]) -> List[Dict[str, Any]]:
        """Generate achievement milestones"""
        milestones = []
        
        # Level-based milestones
        level_milestones = {
            "beginner": [
                {"name": "First 10 Problems", "target": 10, "type": "problems_solved"},
                {"name": "Week Streak", "target": 7, "type": "daily_streak"},
                {"name": "Array Master", "target": 1, "type": "topic_mastery"}
            ],
            "intermediate": [
                {"name": "50 Problems Solved", "target": 50, "type": "problems_solved"},
                {"name": "Medium Difficulty", "target": 10, "type": "medium_solved"},
                {"name": "Two Pointers Pro", "target": 1, "type": "topic_mastery"}
            ],
            "advanced": [
                {"name": "100 Problems Solved", "target": 100, "type": "problems_solved"},
                {"name": "DP Specialist", "target": 1, "type": "topic_mastery"},
                {"name": "Hard Problems", "target": 20, "type": "hard_solved"}
            ],
            "expert": [
                {"name": "200 Problems Solved", "target": 200, "type": "problems_solved"},
                {"name": "Contest Winner", "target": 1, "type": "contest_win"},
                {"name": "All Topics Mastered", "target": 10, "type": "topics_mastered"}
            ]
        }
        
        return level_milestones.get(level, [])
    
    def _get_next_level(self, current_level: str) -> str:
        """Get next skill level"""
        levels = ["beginner", "intermediate", "advanced", "expert"]
        try:
            current_index = levels.index(current_level)
            if current_index < len(levels) - 1:
                return levels[current_index + 1]
        except ValueError:
            pass
        return None
