from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.cognitive import CognitiveHistory
from analyzers.heuristics import CognitiveHeuristics
from analyzers.fingerprint import CognitiveFingerprintGenerator
from pydantic import BaseModel
from typing import List, Any, Optional

router = APIRouter()
heuristics_engine = CognitiveHeuristics()
fingerprint_generator = CognitiveFingerprintGenerator()

class Signal(BaseModel):
    type: str
    ts: int
    data: Any

class SignalBatch(BaseModel):
    task_id: str
    signals: List[Signal]
    user_id: Optional[int] = None

import time
from collections import deque

# In-memory metrics storage (keep last 100 request latencies)
latency_metrics = deque(maxlen=100)

@router.post("/signals")
def receive_signals(batch: SignalBatch, db: Session = Depends(get_db)):
    start_time = time.time()
    
    if not batch.signals:
        raise HTTPException(status_code=400, detail="Empty signal batch")

    db_record = CognitiveHistory(
        task_id=batch.task_id,
        signals=[s.dict() for s in batch.signals],
        user_id=batch.user_id
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    duration_ms = (time.time() - start_time) * 1000
    latency_metrics.append(duration_ms)
    
    response = {"status": "ok", "id": db_record.id}
    if duration_ms > 200:
        response["warning"] = f"High latency: {duration_ms:.2f}ms"
        
    return response

@router.get("/metrics")
def get_metrics():
    """Internal monitoring for signal ingestion performance"""
    if not latency_metrics:
        return {"count": 0, "avg_latency_ms": 0, "max_latency_ms": 0}
    
    return {
        "count": len(latency_metrics),
        "avg_latency_ms": sum(latency_metrics) / len(latency_metrics),
        "max_latency_ms": max(latency_metrics),
        "recent_samples": list(latency_metrics)
    }

@router.get("/analysis/{task_id}")
def analyze_session(task_id: str, db: Session = Depends(get_db)):
    """Get cognitive analysis for a task session"""
    history = db.query(CognitiveHistory).filter(CognitiveHistory.task_id == task_id).all()
    
    if not history:
        raise HTTPException(status_code=404, detail="No signals found for this task")

    # Merge all signal batches
    all_signals = []
    for record in history:
        if record.signals:
            all_signals.extend(record.signals)
    
    all_signals.sort(key=lambda x: x['ts'])
    
    # Run analysis
    analysis = heuristics_engine.analyze_session(all_signals)
    
    # Advanced Cognitive Mirror Analysis
    from analyzers.cognitive_mirror import CognitiveMirror
    mirror_engine = CognitiveMirror()
    mirror_analysis = mirror_engine.analyze_session(all_signals)
    
    # Merge results
    analysis['fingerprint'] = mirror_analysis # Override or add fingerprint
    
    return {
        "task_id": task_id,
        "signal_count": len(all_signals),
        "analysis": analysis
    }

@router.get("/session/{task_id}")
def get_session_signals(task_id: str, db: Session = Depends(get_db)):
    """Get raw signals for a session (used by frontend replay)"""
    history = db.query(CognitiveHistory).filter(CognitiveHistory.task_id == task_id).all()
    
    if not history:
        raise HTTPException(status_code=404, detail="No signals found for this task")

    all_signals = []
    for record in history:
        if record.signals:
            all_signals.extend(record.signals)
    
    all_signals.sort(key=lambda x: x['ts'])
    
    return {
        "task_id": task_id,
        "signals": all_signals
    }

@router.get("/session-timeline/{task_id}")
def get_session_timeline(task_id: str, db: Session = Depends(get_db)):
    """
    Get time-series data for session replay visualization.
    Returns data points for timeline chart.
    """
    history = db.query(CognitiveHistory).filter(CognitiveHistory.task_id == task_id).all()
    
    if not history:
        raise HTTPException(status_code=404, detail="No signals found for this task")

    # Merge all signals
    all_signals = []
    for record in history:
        if record.signals:
            all_signals.extend(record.signals)
    
    all_signals.sort(key=lambda x: x['ts'])
    
    if not all_signals:
        return {"timeline": [], "duration_sec": 0}
    
    # Generate timeline data points (sample every 5 seconds)
    start_time = all_signals[0]['ts']
    end_time = all_signals[-1]['ts']
    duration_ms = end_time - start_time
    duration_sec = duration_ms / 1000
    
    timeline = []
    window_size = 5000  # 5 second windows
    
    for window_start in range(0, int(duration_ms), window_size):
        window_end = window_start + window_size
        
        # Get signals in this window
        window_signals = [
            s for s in all_signals 
            if window_start <= (s['ts'] - start_time) < window_end
        ]
        
        if not window_signals:
            continue
        
        # Calculate metrics for this window
        keystrokes = [s for s in window_signals if s['type'] == 'KEY_PRESS']
        deletions = [s for s in window_signals if s['type'] == 'DELETE']
        
        # WPM for this window
        window_wpm = (len(keystrokes) / 5) * (60 / (window_size / 1000)) if keystrokes else 0
        
        # Deletion rate
        deletion_rate = len(deletions) / len(keystrokes) if keystrokes else 0
        
        # Average latency
        latencies = [k['data'].get('latency', 0) for k in keystrokes]
        avg_latency = sum(latencies) / len(latencies) if latencies else 0
        
        # State estimation (simplified)
        state = "normal"
        if deletion_rate > 0.3:
            state = "frustration"
        elif window_wpm > 60 and deletion_rate < 0.1:
            state = "flow"
        elif avg_latency > 1000:
            state = "thinking"
        
        timeline.append({
            "time_sec": round((window_start + start_time - all_signals[0]['ts']) / 1000, 1),
            "wpm": round(window_wpm, 1),
            "deletions": len(deletions),
            "keystrokes": len(keystrokes),
            "avg_latency": round(avg_latency, 0),
            "state": state
        })
    
    return {
        "task_id": task_id,
        "duration_sec": round(duration_sec, 1),
        "timeline": timeline
    }

@router.get("/fingerprint/{user_id}")
def get_user_fingerprint(user_id: int, db: Session = Depends(get_db)):
    """
    Get cognitive fingerprint for a user based on all their sessions.
    """
    # Get all sessions for this user
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
         raise HTTPException(status_code=404, detail="User not found")

    if not user.is_premium:
        return {
            "user_id": user_id,
            "error": "Premium Required",
            "message": "Detailed cognitive fingerprinting is a Premium feature."
        }
        
    user_sessions = db.query(CognitiveHistory).filter(
        CognitiveHistory.user_id == user_id
    ).all()
    
    if not user_sessions:
        return {
            "user_id": user_id,
            "message": "No coding sessions found. Start practicing to build your cognitive profile!"
        }
    
    # Group signals by task_id
    sessions_by_task = {}
    for record in user_sessions:
        if record.task_id not in sessions_by_task:
            sessions_by_task[record.task_id] = []
        if record.signals:
            sessions_by_task[record.task_id].extend(record.signals)
    
    # Analyze each session
    session_analyses = []
    for task_id, signals in sessions_by_task.items():
        signals.sort(key=lambda x: x['ts'])
        analysis = heuristics_engine.analyze_session(signals)
        session_analyses.append(analysis)
    
    # Generate fingerprint
    fingerprint = fingerprint_generator.generate_fingerprint(
        session_analyses, 
        str(user_id)
    )
    
    return fingerprint

