
import time
from threading import Lock
from typing import Any, Optional, Dict

class TTLCache:
    def __init__(self, max_size: int = 100, default_ttl: int = 60):
        self.cache: Dict[str, Any] = {}
        self.expiry: Dict[str, float] = {}
        self.max_size = max_size
        self.default_ttl = default_ttl
        self.lock = Lock()

    def get(self, key: str) -> Optional[Any]:
        with self.lock:
            # Check if key exists
            if key not in self.cache:
                return None
            
            # Check expiration
            if time.time() > self.expiry[key]:
                self.delete(key)
                return None
            
            print(f"[Cache] HIT for key: {key}")
            return self.cache[key]

    def set(self, key: str, value: Any, ttl: int = None):
        with self.lock:
            # Simple LRU-like cleanup if full (remove one random/first item)
            # For a real project we'd use OrderedDict or dedicated LRU logic.
            # Here we just clear if full to prevent memory leak, simple hack.
            if len(self.cache) >= self.max_size:
                self.cache.clear()
                self.expiry.clear()
            
            expiration = time.time() + (ttl if ttl is not None else self.default_ttl)
            self.cache[key] = value
            self.expiry[key] = expiration
            print(f"[Cache] SET for key: {key} (TTL: {ttl})")

    def delete(self, key: str):
        if key in self.cache:
            del self.cache[key]
        if key in self.expiry:
            del self.expiry[key]

# Global Cache Instances
leaderboard_cache = TTLCache(max_size=5, default_ttl=60) # Caches the whole list, essentially 1 key
profile_cache = TTLCache(max_size=200, default_ttl=30)
