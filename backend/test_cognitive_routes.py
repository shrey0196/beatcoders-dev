from fastapi.testclient import TestClient
from main import app
import time

client = TestClient(app)

def test_receive_signals_empty():
    response = client.post("/api/cognitive/signals", json={
        "task_id": "test_task",
        "signals": []
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Empty signal batch"

def test_receive_signals_success():
    response = client.post("/api/cognitive/signals", json={
        "task_id": "test_task",
        "signals": [
            {"type": "KEY_PRESS", "ts": int(time.time()*1000), "data": {"key": "a"}}
        ]
    })
    assert response.status_code == 200
    assert "id" in response.json()

def test_metrics_endpoint():
    # Make a request to populate metrics
    client.post("/api/cognitive/signals", json={
        "task_id": "test_task",
        "signals": [
            {"type": "KEY_PRESS", "ts": int(time.time()*1000), "data": {"key": "a"}}
        ]
    })
    
    response = client.get("/api/cognitive/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "count" in data
    assert data["count"] > 0
    assert "avg_latency_ms" in data
