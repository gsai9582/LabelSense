import os
from typing import Optional
from app.ai.base import BaseLLMClient
from app.ai.mock_provider import MockLLMClient
from app.ai.gemini_provider import GeminiLLMClient

def get_llm_client() -> BaseLLMClient:
    provider = os.getenv("LLM_PROVIDER", "mock").lower().strip()
    api_key = os.getenv("LLM_API_KEY", "").strip()
    model = os.getenv("LLM_MODEL", "gemini-1.5-flash").strip()

    if provider == "gemini" and api_key:
        return GeminiLLMClient(api_key=api_key, model=model)
    elif provider == "mock":
        return MockLLMClient()
    else:
        # Fallback to Mock provider labeled demo mode when key is absent
        return MockLLMClient()
