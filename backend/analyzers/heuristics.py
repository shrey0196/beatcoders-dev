from typing import List, Dict, Any
import statistics
import numpy as np

class CognitiveHeuristics:
    """
    Enhanced rule-based analysis engine to detect cognitive states from raw behavioral signals.
    Phase 2: Advanced algorithms for fatigue, frustration, flow state, and cognitive load.
    """

    def analyze_session(self, signals: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not signals:
            return self._empty_analysis()

        # 1. Filter and categorize signals
        keystrokes = [s for s in signals if s['type'] == 'KEY_PRESS']
        deletions = [s for s in signals if s['type'] == 'DELETE']
        undos = [s for s in signals if s['type'] == 'UNDO']
        redos = [s for s in signals if s['type'] == 'REDO']
        pastes = [s for s in signals if s['type'] == 'PASTE']
        pauses = [s for s in signals if s['type'] == 'KEY_PRESS' and s['data'].get('latency', 0) > 2000]

        # 2. Calculate basic metrics
        total_time = (signals[-1]['ts'] - signals[0]['ts']) / 1000 if len(signals) > 1 else 0
        wpm = self._calculate_wpm(keystrokes, total_time)
        
        # 3. Advanced state detection
        fatigue_score = self._detect_fatigue_advanced(keystrokes, total_time)
        frustration_score = self._detect_frustration_advanced(keystrokes, deletions, undos, redos)
        flow_score = self._detect_flow_state(keystrokes, deletions, pauses)
        cognitive_load = self._estimate_cognitive_load(keystrokes, deletions, pauses, pastes)
        focus_score = self._calculate_focus_advanced(pauses, total_time, keystrokes)
        
        # 4. Detect key moments
        key_moments = self._detect_key_moments(signals, keystrokes, deletions)
        
        # 5. Calculate session quality
        session_quality = self._calculate_session_quality(flow_score, frustration_score, fatigue_score)

        return {
            "metrics": {
                "wpm": round(wpm, 1),
                "total_time_sec": round(total_time, 1),
                "keystroke_count": len(keystrokes),
                "deletion_count": len(deletions),
                "undo_count": len(undos),
                "redo_count": len(redos),
                "paste_count": len(pastes),
                "pause_count": len(pauses),
                "typing_consistency": self._calculate_typing_consistency(keystrokes)
            },
            "states": {
                "fatigue": round(fatigue_score, 2),
                "frustration": round(frustration_score, 2),
                "flow": round(flow_score, 2),
                "focus": round(focus_score, 2),
                "cognitive_load": round(cognitive_load, 2)
            },
            "session_quality": session_quality,
            "key_moments": key_moments,
            "fingerprint": {
                "type": self._classify_coder_type(wpm, frustration_score, flow_score),
                "planning_score": self._calculate_planning_score(pauses, deletions, keystrokes),
                "resilience_score": self._calculate_resilience_score(frustration_score, flow_score)
            },
            "recommendations": self._generate_recommendations(fatigue_score, frustration_score, flow_score, cognitive_load)
        }

    def _empty_analysis(self):
        return {
            "metrics": {"wpm": 0, "total_time_sec": 0, "keystroke_count": 0},
            "states": {"fatigue": 0, "frustration": 0, "flow": 0, "focus": 0, "cognitive_load": 0},
            "session_quality": "insufficient_data",
            "key_moments": [],
            "fingerprint": {"type": "Unknown", "planning_score": 0, "resilience_score": 0},
            "recommendations": []
        }

    def _calculate_wpm(self, keystrokes, total_time_sec):
        if total_time_sec < 1: return 0
        words = len(keystrokes) / 5
        return (words / total_time_sec) * 60

    def _detect_fatigue_advanced(self, keystrokes, total_time):
        """
        Advanced fatigue detection using time-series analysis and burst patterns.
        """
        if len(keystrokes) < 50: return 0.0
        
        # Divide session into quartiles
        quartile_size = len(keystrokes) // 4
        if quartile_size == 0: return 0.0
        
        quartile_speeds = []
        for i in range(4):
            start = i * quartile_size
            end = (i + 1) * quartile_size if i < 3 else len(keystrokes)
            quartile_keys = keystrokes[start:end]
            latencies = [k['data'].get('latency', 0) for k in quartile_keys]
            avg_latency = statistics.mean(latencies) if latencies else 0
            quartile_speeds.append(avg_latency)
        
        # Check for progressive slowdown
        if quartile_speeds[0] == 0: return 0.0
        
        slowdown_trend = 0
        for i in range(1, 4):
            if quartile_speeds[i] > quartile_speeds[i-1]:
                slowdown_trend += 1
        
        # Calculate overall slowdown ratio
        final_slowdown = quartile_speeds[-1] / quartile_speeds[0] if quartile_speeds[0] > 0 else 1.0
        
        # Fatigue score based on trend and magnitude
        if slowdown_trend >= 3 and final_slowdown > 1.5:
            return 0.9  # High fatigue
        elif slowdown_trend >= 2 and final_slowdown > 1.3:
            return 0.6  # Moderate fatigue
        elif final_slowdown > 1.2:
            return 0.3  # Mild fatigue
        
        return 0.1  # Minimal fatigue

    def _detect_frustration_advanced(self, keystrokes, deletions, undos, redos):
        """
        Improved frustration detection using deletion bursts and undo/redo patterns.
        """
        if not keystrokes: return 0.0
        
        # Basic deletion ratio
        delete_ratio = len(deletions) / len(keystrokes)
        
        # Undo/redo cycling (sign of confusion)
        undo_redo_ratio = (len(undos) + len(redos)) / len(keystrokes) if keystrokes else 0
        
        # Detect deletion bursts (rapid consecutive deletions)
        deletion_bursts = 0
        if len(deletions) > 1:
            for i in range(1, len(deletions)):
                time_diff = deletions[i]['ts'] - deletions[i-1]['ts']
                if time_diff < 500:  # Less than 500ms between deletions
                    deletion_bursts += 1
        
        burst_ratio = deletion_bursts / len(deletions) if deletions else 0
        
        # Combined frustration score
        frustration = 0
        frustration += delete_ratio * 0.4  # Weight: 40%
        frustration += undo_redo_ratio * 0.3  # Weight: 30%
        frustration += burst_ratio * 0.3  # Weight: 30%
        
        return min(1.0, frustration)

    def _detect_flow_state(self, keystrokes, deletions, pauses):
        """
        Detect flow state: sustained rhythm, minimal deletions, consistent typing.
        """
        if len(keystrokes) < 30: return 0.0
        
        # 1. Typing rhythm consistency (low variance in latency)
        latencies = [k['data'].get('latency', 0) for k in keystrokes if k['data'].get('latency', 0) < 2000]
        if len(latencies) < 10: return 0.0
        
        mean_latency = statistics.mean(latencies)
        std_latency = statistics.stdev(latencies) if len(latencies) > 1 else 0
        consistency = 1.0 - min(1.0, std_latency / mean_latency if mean_latency > 0 else 1.0)
        
        # 2. Low deletion rate
        delete_ratio = len(deletions) / len(keystrokes)
        low_errors = 1.0 - min(1.0, delete_ratio * 5)  # Scale up impact
        
        # 3. Minimal long pauses
        pause_ratio = len(pauses) / len(keystrokes) if keystrokes else 1.0
        minimal_pauses = 1.0 - min(1.0, pause_ratio * 10)
        
        # Flow score (all factors must be high)
        flow_score = (consistency * 0.4 + low_errors * 0.3 + minimal_pauses * 0.3)
        
        return flow_score

    def _estimate_cognitive_load(self, keystrokes, deletions, pauses, pastes):
        """
        Estimate cognitive load based on pause patterns and edit complexity.
        """
        if not keystrokes: return 0.0
        
        # 1. Long pause frequency (thinking time)
        pause_ratio = len(pauses) / len(keystrokes) if keystrokes else 0
        
        # 2. Edit complexity (deletions + pastes indicate trial-error)
        edit_ratio = (len(deletions) + len(pastes)) / len(keystrokes) if keystrokes else 0
        
        # 3. Average pause duration
        avg_pause_duration = statistics.mean([p['data'].get('latency', 0) for p in pauses]) if pauses else 0
        pause_duration_score = min(1.0, avg_pause_duration / 5000)  # Normalize to 5 seconds
        
        # Cognitive load (higher = more mental effort)
        load = (pause_ratio * 0.4 + edit_ratio * 0.3 + pause_duration_score * 0.3)
        
        return min(1.0, load)

    def _calculate_focus_advanced(self, pauses, total_time, keystrokes):
        """
        Advanced focus calculation considering pause distribution and typing bursts.
        """
        if total_time == 0 or not keystrokes: return 1.0
        
        # 1. Active time ratio
        total_pause_time = sum([p['data'].get('latency', 0) for p in pauses]) / 1000
        active_ratio = 1.0 - (total_pause_time / total_time)
        
        # 2. Typing burst consistency (focused sessions have regular bursts)
        if len(keystrokes) > 10:
            latencies = [k['data'].get('latency', 0) for k in keystrokes]
            burst_consistency = 1.0 - min(1.0, statistics.stdev(latencies) / statistics.mean(latencies) if statistics.mean(latencies) > 0 else 1.0)
        else:
            burst_consistency = 0.5
        
        focus = (active_ratio * 0.6 + burst_consistency * 0.4)
        return max(0.0, min(1.0, focus))

    def _calculate_typing_consistency(self, keystrokes):
        """Calculate typing rhythm consistency (0-1, higher = more consistent)"""
        if len(keystrokes) < 10: return 0.0
        latencies = [k['data'].get('latency', 0) for k in keystrokes if k['data'].get('latency', 0) < 2000]
        if len(latencies) < 2: return 0.0
        mean_lat = statistics.mean(latencies)
        std_lat = statistics.stdev(latencies)
        return 1.0 - min(1.0, std_lat / mean_lat if mean_lat > 0 else 1.0)

    def _detect_key_moments(self, signals, keystrokes, deletions):
        """Detect breakthrough moments, frustration spikes, and focus zones"""
        moments = []
        
        if len(keystrokes) < 20: return moments
        
        # Detect frustration spikes (deletion bursts)
        for i in range(len(deletions) - 2):
            time_window = deletions[i+2]['ts'] - deletions[i]['ts']
            if time_window < 2000:  # 3 deletions in 2 seconds
                moments.append({
                    "type": "frustration_spike",
                    "timestamp": deletions[i]['ts'],
                    "description": "Rapid deletion burst detected"
                })
        
        # Detect breakthrough moments (long pause followed by sustained typing)
        for i in range(len(keystrokes) - 10):
            if keystrokes[i]['data'].get('latency', 0) > 5000:  # Long pause
                # Check if followed by sustained typing
                next_10 = keystrokes[i+1:i+11]
                avg_latency = statistics.mean([k['data'].get('latency', 0) for k in next_10])
                if avg_latency < 300:  # Fast typing after pause
                    moments.append({
                        "type": "breakthrough",
                        "timestamp": keystrokes[i]['ts'],
                        "description": "Breakthrough moment: pause followed by rapid progress"
                    })
        
        return moments[:5]  # Limit to top 5 moments

    def _calculate_session_quality(self, flow_score, frustration_score, fatigue_score):
        """Overall session quality assessment"""
        if flow_score > 0.7 and frustration_score < 0.3:
            return "excellent"
        elif flow_score > 0.5 and frustration_score < 0.5:
            return "good"
        elif fatigue_score > 0.7 or frustration_score > 0.7:
            return "challenging"
        else:
            return "moderate"

    def _calculate_planning_score(self, pauses, deletions, keystrokes):
        """High score = thinks before typing (fewer deletions after pauses)"""
        if not keystrokes: return 0.0
        long_pauses = [p for p in pauses if p['data'].get('latency', 0) > 3000]
        delete_ratio = len(deletions) / len(keystrokes)
        # More pauses + fewer deletions = better planning
        planning = (len(long_pauses) / len(keystrokes)) * (1.0 - delete_ratio) if keystrokes else 0
        return min(1.0, planning * 5)  # Scale up

    def _calculate_resilience_score(self, frustration_score, flow_score):
        """High score = maintains flow despite challenges"""
        if frustration_score < 0.3:
            return 0.9  # Low frustration = high resilience
        elif flow_score > 0.5:
            return 0.7  # Maintained flow despite frustration
        else:
            return max(0.0, 1.0 - frustration_score)

    def _classify_coder_type(self, wpm, frustration, flow):
        """Enhanced coder type classification"""
        if flow > 0.7 and wpm > 60:
            return "Flow State Sprinter"
        elif flow > 0.6 and frustration < 0.2:
            return "Zen Coder"
        elif wpm < 30 and frustration < 0.3:
            return "Thoughtful Architect"
        elif frustration > 0.6:
            return "Trial & Error Battler"
        elif wpm > 50 and frustration < 0.5:
            return "Balanced Developer"
        else:
            return "Adaptive Learner"

    def _generate_recommendations(self, fatigue, frustration, flow, cognitive_load):
        """Generate actionable recommendations based on detected states"""
        recommendations = []
        
        if fatigue > 0.6:
            recommendations.append({
                "type": "warning",
                "message": "High fatigue detected. Consider taking a short break.",
                "icon": "⚠️"
            })
        
        if frustration > 0.7:
            recommendations.append({
                "type": "tip",
                "message": "Frustration spike detected. Try breaking the problem into smaller steps.",
                "icon": "💡"
            })
        
        if flow > 0.7:
            recommendations.append({
                "type": "success",
                "message": "You're in flow state! Great focus and rhythm.",
                "icon": "🔥"
            })
        
        if cognitive_load > 0.7 and frustration < 0.4:
            recommendations.append({
                "type": "info",
                "message": "High cognitive load detected. You're tackling a complex problem - keep going!",
                "icon": "🧠"
            })
        
        if flow < 0.3 and frustration < 0.3 and cognitive_load < 0.3:
            recommendations.append({
                "type": "tip",
                "message": "Low engagement detected. Try setting a specific goal for this session.",
                "icon": "🎯"
            })
        
        return recommendations
