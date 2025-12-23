
import statistics
from typing import List, Dict, Any

class CognitiveMirror:
    """
    Analyzes behavioral signals to determine the user's cognitive state and coding style.
    Distinguishes between:
    - Flow State (High focus, varied rhythm)
    - Transcription (High linearity, low variance)
    - Struggle (High pauses, high deletions)
    - Paste/Plagiarism (Batch inputs)
    """

    def analyze_session(self, signals: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not signals:
            return {
                "type": "Unknown",
                "metrics": {"linearity": 0, "variance": 0},
                "insights": ["Not enough data"]
            }

        # 1. Extract Metrics
        key_presses = [s for s in signals if s.get('type') == 'KEY_PRESS']
        pastes = [s for s in signals if s.get('type') == 'PASTE']
        deletions = [s for s in signals if s.get('type') == 'DELETE']
        cursor_moves = [s for s in signals if s.get('type') == 'CURSOR_MOVE']
        
        # 2. Linearity Analysis
        progressions = 0
        regressions = 0
        if cursor_moves:
            for m in cursor_moves:
                nav = m.get('data', {}).get('navType')
                if nav == 'PROGRESSION': progressions += 1
                elif nav == 'REGRESSION': regressions += 1
        
        linearity = progressions / (progressions + regressions + 1) if cursor_moves else 0.5

        # 3. Variance Analysis (Rhythm)
        latencies = [s.get('data', {}).get('latency', 0) for s in key_presses]
        # Filter outlines (e.g. pauses > 5s) for variance calc
        active_latencies = [l for l in latencies if l < 2000]
        
        variance = 0
        if len(active_latencies) > 1:
            variance = statistics.variance(active_latencies)

        # 4. Classification Logic
        coder_type = "Balanced"
        insights = []

        if len(pastes) > 0:
            coder_type = "Source Detected"
            insights.append("Large code blocks were pasted.")
        elif getattr(self, '_is_transcription')(linearity, variance):
             coder_type = "Transcriber"
             insights.append("High linearity detected. Try resolving without reference.")
        elif getattr(self, '_is_struggle')(deletions, len(signals)):
            coder_type = "Refactorer"
            insights.append("High edit rate detected. You are refining your logic.")
        elif variance > 10000 and linearity < 0.8:
            coder_type = "Deep Thinker"
            insights.append("Non-linear navigation suggests deep problem solving.")

        return {
            "type": coder_type,
            "metrics": {
                "linearity": round(linearity, 2),
                "variance": round(variance, 2),
                "paste_count": len(pastes)
            },
            "insights": insights
        }

    def _is_transcription(self, linearity, variance):
        # Transcribers move forward (High Lin) and type steadily (Low Var)
        return linearity > 0.85 and variance < 10000

    def _is_struggle(self, deletions, total_signals):
        # High deletion rate
        return len(deletions) / (total_signals + 1) > 0.3
