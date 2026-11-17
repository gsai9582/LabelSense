import hashlib
import time
from typing import Any, Optional, Dict

class AICache:
    def __init__(self, max_entries: int = 500, ttl_seconds: int = 3600):
        self.max_entries = max_entries
        self.ttl_seconds = ttl_seconds
        self._cache: Dict[str, Dict[str, Any]] = {}

    def _compute_key(self, provider: str, model: str, prompt: str) -> str:
        raw = f"{provider}:{model}:{prompt}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def get(self, provider: str, model: str, prompt: str) -> Optional[Any]:
        key = self._compute_key(provider, model, prompt)
        entry = self._cache.get(key)
        if not entry:
            return None

        # Check TTL
        if time.time() - entry["timestamp"] > self.ttl_seconds:
            del self._cache[key]
            return None

        return entry["data"]

    def set(self, provider: str, model: str, prompt: str, data: Any) -> str:
        key = self._compute_key(provider, model, prompt)
        # Evict oldest if full
        if len(self._cache) >= self.max_entries:
            oldest_key = min(self._cache.keys(), key=lambda k: self._cache[k]["timestamp"])
            del self._cache[oldest_key]

        self._cache[key] = {
            "timestamp": time.time(),
            "data": data,
        }
        return key

ai_cache = AICache()
