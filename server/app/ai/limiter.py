import time
from collections import defaultdict
from fastapi import HTTPException, status

MAX_INPUT_CHARACTERS = 15000
RATE_LIMIT_PER_MINUTE = 60

class AIRateLimiter:
    def __init__(self, requests_per_minute: int = RATE_LIMIT_PER_MINUTE):
        self.limit = requests_per_minute
        self.requests = defaultdict(list)

    def check_rate_limit(self, client_id: str = "global"):
        now = time.time()
        window_start = now - 60.0

        # Filter out requests older than 1 minute
        self.requests[client_id] = [t for t in self.requests[client_id] if t > window_start]

        if len(self.requests[client_id]) >= self.limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"AI request rate limit exceeded ({self.limit} requests/minute). Please slow down.",
            )

        self.requests[client_id].append(now)

    @staticmethod
    def cap_input_size(text: str, max_chars: int = MAX_INPUT_CHARACTERS) -> str:
        if len(text) > max_chars:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Input payload exceeds maximum allowed size of {max_chars} characters (received {len(text)}).",
            )
        return text

ai_limiter = AIRateLimiter()
