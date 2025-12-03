from typing import List, Dict, Any, Optional
import statistics
from collections import defaultdict

class CognitiveFingerprintGenerator:
    """
    Generate unique behavioral vectors for user skill profiling and personalization.
    Analyzes multiple sessions to build a comprehensive cognitive fingerprint.
    """
    
    def __init__(self):
        self.min_sessions_for_confidence = 3
    
    def generate_fingerprint(
        self, 
        session_analyses: List[Dict[str, Any]], 
        user_id: str
    ) -> Dict[str, Any]:
        """
        Generate cognitive fingerprint from multiple session analyses.
        
        Args:
            session_analyses: List of analysis results from heuristics engine
            user_id: User identifier
            
        Returns:
            Comprehensive cognitive fingerprint with behavioral vectors
        """
        if not session_analyses:
            return self._empty_fingerprint(user_id)
        
        # Extract metrics across sessions
        all_wpm = [s['metrics']['wpm'] for s in session_analyses if s['metrics']['wpm'] > 0]
        all_fatigue = [s['states']['fatigue'] for s in session_analyses]
        all_frustration = [s['states']['frustration'] for s in session_analyses]
        all_flow = [s['states']['flow'] for s in session_analyses]
        all_focus = [s['states']['focus'] for s in session_analyses]
        all_cognitive_load = [s['states']['cognitive_load'] for s in session_analyses]
        
        # Calculate typing profile
        typing_profile = self._analyze_typing_profile(all_wpm, session_analyses)
        
        # Calculate problem-solving style
        problem_solving_style = self._analyze_problem_solving_style(
            all_frustration, all_flow, session_analyses
        )
        
        # Calculate stress response
        stress_response = self._analyze_stress_response(
            all_fatigue, all_frustration, all_flow
        )
        
        # Calculate learning curve
        learning_curve = self._analyze_learning_curve(session_analyses)
        
        # Determine coder archetype
        archetype = self._determine_archetype(
            typing_profile, problem_solving_style, stress_response
        )
        
        # Calculate confidence based on data volume
        confidence = self._calculate_confidence(len(session_analyses))
        
        return {
            "user_id": user_id,
            "sessions_analyzed": len(session_analyses),
            "confidence": confidence,
            "typing_profile": typing_profile,
            "problem_solving_style": problem_solving_style,
            "stress_response": stress_response,
            "learning_curve": learning_curve,
            "coder_archetype": archetype,
            "percentiles": self._calculate_percentiles(
                all_wpm, all_flow, all_focus, all_cognitive_load
            ),
            "strengths": self._identify_strengths(
                typing_profile, problem_solving_style, stress_response
            ),
            "growth_areas": self._identify_growth_areas(
                typing_profile, problem_solving_style, stress_response
            )
        }
    
    def _empty_fingerprint(self, user_id: str) -> Dict[str, Any]:
        return {
            "user_id": user_id,
            "sessions_analyzed": 0,
            "confidence": 0.0,
            "message": "Insufficient data. Complete at least 3 coding sessions for analysis."
        }
    
    def _analyze_typing_profile(
        self, 
        all_wpm: List[float], 
        sessions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze typing speed, consistency, and patterns"""
        if not all_wpm:
            return {"avg_wpm": 0, "consistency": 0, "speed_category": "unknown"}
        
        avg_wpm = statistics.mean(all_wpm)
        wpm_std = statistics.stdev(all_wpm) if len(all_wpm) > 1 else 0
        consistency = 1.0 - min(1.0, wpm_std / avg_wpm if avg_wpm > 0 else 1.0)
        
        # Extract typing consistency from sessions
        all_consistency = [
            s['metrics'].get('typing_consistency', 0) 
            for s in sessions 
            if 'typing_consistency' in s['metrics']
        ]
        rhythm_consistency = statistics.mean(all_consistency) if all_consistency else 0.5
        
        # Categorize speed
        if avg_wpm > 70:
            speed_category = "fast"
        elif avg_wpm > 40:
            speed_category = "moderate"
        else:
            speed_category = "deliberate"
        
        return {
            "avg_wpm": round(avg_wpm, 1),
            "wpm_consistency": round(consistency, 2),
            "rhythm_consistency": round(rhythm_consistency, 2),
            "speed_category": speed_category,
            "burst_typing": avg_wpm > 60 and rhythm_consistency > 0.7
        }
    
    def _analyze_problem_solving_style(
        self,
        all_frustration: List[float],
        all_flow: List[float],
        sessions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze how user approaches problem-solving"""
        
        # Planning vs trial-error
        planning_scores = [
            s['fingerprint'].get('planning_score', 0) 
            for s in sessions 
            if 'planning_score' in s.get('fingerprint', {})
        ]
        avg_planning = statistics.mean(planning_scores) if planning_scores else 0.5
        
        # Deletion patterns
        all_deletions = [s['metrics']['deletion_count'] for s in sessions]
        all_keystrokes = [s['metrics']['keystroke_count'] for s in sessions if s['metrics']['keystroke_count'] > 0]
        
        avg_delete_ratio = (
            sum(all_deletions) / sum(all_keystrokes) 
            if all_keystrokes else 0
        )
        
        # Determine style
        if avg_planning > 0.6 and avg_delete_ratio < 0.1:
            style = "planner"  # Thinks before coding
        elif avg_delete_ratio > 0.2:
            style = "explorer"  # Trial and error
        else:
            style = "balanced"  # Mix of both
        
        return {
            "planning_score": round(avg_planning, 2),
            "exploration_score": round(avg_delete_ratio * 5, 2),  # Scale to 0-1
            "style": style,
            "avg_flow_state": round(statistics.mean(all_flow), 2) if all_flow else 0
        }
    
    def _analyze_stress_response(
        self,
        all_fatigue: List[float],
        all_frustration: List[float],
        all_flow: List[float]
    ) -> Dict[str, Any]:
        """Analyze how user performs under pressure"""
        
        avg_fatigue = statistics.mean(all_fatigue) if all_fatigue else 0
        avg_frustration = statistics.mean(all_frustration) if all_frustration else 0
        avg_flow = statistics.mean(all_flow) if all_flow else 0
        
        # Resilience = ability to maintain flow despite challenges
        resilience = avg_flow / (1.0 + avg_frustration) if avg_frustration > 0 else avg_flow
        
        # Stress tolerance
        if avg_frustration < 0.3 and avg_fatigue < 0.4:
            stress_tolerance = "high"
        elif avg_frustration < 0.6 and avg_fatigue < 0.6:
            stress_tolerance = "moderate"
        else:
            stress_tolerance = "developing"
        
        return {
            "resilience_score": round(resilience, 2),
            "stress_tolerance": stress_tolerance,
            "avg_fatigue": round(avg_fatigue, 2),
            "avg_frustration": round(avg_frustration, 2),
            "maintains_focus_under_pressure": avg_flow > 0.5 and avg_frustration > 0.4
        }
    
    def _analyze_learning_curve(
        self, 
        sessions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze improvement over time"""
        
        if len(sessions) < 2:
            return {
                "trend": "insufficient_data",
                "improvement_rate": 0,
                "velocity": "unknown"
            }
        
        # Sort sessions by time (assuming they're in order)
        # Compare first half vs second half
        mid = len(sessions) // 2
        first_half = sessions[:mid]
        second_half = sessions[mid:]
        
        # Compare flow scores
        first_flow = statistics.mean([s['states']['flow'] for s in first_half])
        second_flow = statistics.mean([s['states']['flow'] for s in second_half])
        
        # Compare frustration
        first_frustration = statistics.mean([s['states']['frustration'] for s in first_half])
        second_frustration = statistics.mean([s['states']['frustration'] for s in second_half])
        
        # Improvement indicators
        flow_improved = second_flow > first_flow
        frustration_reduced = second_frustration < first_frustration
        
        improvement_rate = (second_flow - first_flow) + (first_frustration - second_frustration)
        
        if improvement_rate > 0.2:
            trend = "improving"
            velocity = "fast"
        elif improvement_rate > 0:
            trend = "improving"
            velocity = "steady"
        elif improvement_rate > -0.1:
            trend = "stable"
            velocity = "steady"
        else:
            trend = "variable"
            velocity = "inconsistent"
        
        return {
            "trend": trend,
            "improvement_rate": round(improvement_rate, 2),
            "velocity": velocity,
            "flow_progression": round(second_flow - first_flow, 2),
            "frustration_reduction": round(first_frustration - second_frustration, 2)
        }
    
    def _determine_archetype(
        self,
        typing_profile: Dict[str, Any],
        problem_solving: Dict[str, Any],
        stress_response: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Determine overall coder archetype"""
        
        speed = typing_profile['speed_category']
        style = problem_solving['style']
        resilience = stress_response['resilience_score']
        
        # Archetype mapping
        if speed == "fast" and style == "planner" and resilience > 0.7:
            archetype = "Elite Architect"
            description = "Fast, strategic, and resilient. Excels at complex problems."
        elif speed == "fast" and problem_solving['avg_flow_state'] > 0.7:
            archetype = "Flow State Sprinter"
            description = "Achieves deep focus and rapid progress through sustained flow."
        elif style == "planner" and speed == "deliberate":
            archetype = "Thoughtful Architect"
            description = "Careful and methodical. Prioritizes correctness over speed."
        elif style == "explorer" and resilience > 0.5:
            archetype = "Resilient Explorer"
            description = "Learns through experimentation. Bounces back from setbacks."
        elif style == "balanced" and resilience > 0.6:
            archetype = "Adaptive Developer"
            description = "Flexible approach. Adjusts strategy based on problem complexity."
        else:
            archetype = "Emerging Coder"
            description = "Building skills and finding optimal approach."
        
        return {
            "name": archetype,
            "description": description,
            "confidence": self._calculate_archetype_confidence(typing_profile, problem_solving, stress_response)
        }
    
    def _calculate_archetype_confidence(
        self,
        typing_profile: Dict[str, Any],
        problem_solving: Dict[str, Any],
        stress_response: Dict[str, Any]
    ) -> float:
        """Calculate confidence in archetype classification"""
        # Higher consistency = higher confidence
        typing_consistency = typing_profile['wpm_consistency']
        style_clarity = abs(problem_solving['planning_score'] - 0.5) * 2  # Distance from middle
        
        confidence = (typing_consistency * 0.5 + style_clarity * 0.5)
        return round(confidence, 2)
    
    def _calculate_percentiles(
        self,
        all_wpm: List[float],
        all_flow: List[float],
        all_focus: List[float],
        all_cognitive_load: List[float]
    ) -> Dict[str, int]:
        """Calculate percentile rankings (mock - would compare against user base)"""
        # In production, compare against database of all users
        # For now, use simple heuristics
        
        avg_wpm = statistics.mean(all_wpm) if all_wpm else 0
        avg_flow = statistics.mean(all_flow) if all_flow else 0
        avg_focus = statistics.mean(all_focus) if all_focus else 0
        
        # Mock percentile calculation (would be database query in production)
        wpm_percentile = min(99, int((avg_wpm / 100) * 100))
        flow_percentile = min(99, int(avg_flow * 100))
        focus_percentile = min(99, int(avg_focus * 100))
        
        return {
            "typing_speed": max(1, wpm_percentile),
            "flow_achievement": max(1, flow_percentile),
            "focus_stability": max(1, focus_percentile)
        }
    
    def _identify_strengths(
        self,
        typing_profile: Dict[str, Any],
        problem_solving: Dict[str, Any],
        stress_response: Dict[str, Any]
    ) -> List[str]:
        """Identify user's key strengths"""
        strengths = []
        
        if typing_profile['avg_wpm'] > 60:
            strengths.append("Fast typing speed")
        
        if typing_profile['rhythm_consistency'] > 0.7:
            strengths.append("Consistent typing rhythm")
        
        if problem_solving['planning_score'] > 0.6:
            strengths.append("Strategic planning")
        
        if problem_solving['avg_flow_state'] > 0.6:
            strengths.append("Flow state achievement")
        
        if stress_response['resilience_score'] > 0.7:
            strengths.append("High resilience")
        
        if stress_response['stress_tolerance'] == "high":
            strengths.append("Excellent stress management")
        
        return strengths if strengths else ["Building foundational skills"]
    
    def _identify_growth_areas(
        self,
        typing_profile: Dict[str, Any],
        problem_solving: Dict[str, Any],
        stress_response: Dict[str, Any]
    ) -> List[str]:
        """Identify areas for improvement"""
        growth_areas = []
        
        if typing_profile['avg_wpm'] < 40:
            growth_areas.append("Increase typing speed through practice")
        
        if problem_solving['planning_score'] < 0.4:
            growth_areas.append("Spend more time planning before coding")
        
        if problem_solving['exploration_score'] > 0.6:
            growth_areas.append("Reduce trial-and-error by testing logic mentally first")
        
        if stress_response['avg_frustration'] > 0.6:
            growth_areas.append("Develop strategies to manage frustration")
        
        if stress_response['avg_fatigue'] > 0.6:
            growth_areas.append("Take regular breaks to maintain energy")
        
        return growth_areas if growth_areas else ["Continue current approach"]
    
    def _calculate_confidence(self, session_count: int) -> float:
        """Calculate confidence score based on data volume"""
        if session_count == 0:
            return 0.0
        elif session_count < 3:
            return 0.3
        elif session_count < 5:
            return 0.6
        elif session_count < 10:
            return 0.8
        else:
            return 0.95
