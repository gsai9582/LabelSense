from abc import ABC, abstractmethod
from typing import Type, TypeVar, Optional, Any, Dict
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

class LLMResponseMetadata(BaseModel):
    provider: str
    model: str
    latency_ms: int
    prompt_tokens: int = 0
    completion_tokens: int = 0
    cached: bool = False
    is_demo_mode: bool = False

class BaseLLMClient(ABC):
    provider_name: str = "base"
    is_available: bool = True

    @abstractmethod
    async def generate_json(
        self,
        prompt: str,
        response_model: Type[T],
        system_instruction: str = "",
        temperature: float = 0.1,
    ) -> tuple[T, LLMResponseMetadata]:
        """Request structured JSON response strictly adhering to the Pydantic schema."""
        pass

    @abstractmethod
    async def generate_text(
        self,
        prompt: str,
        system_instruction: str = "",
        temperature: float = 0.2,
    ) -> tuple[str, LLMResponseMetadata]:
        """Generate unstructured clinical explanation or chat response."""
        pass

    @abstractmethod
    async def vision_extract(
        self,
        image_bytes: bytes,
        mime_type: str,
        prompt: str,
        response_model: Type[T],
    ) -> tuple[T, LLMResponseMetadata]:
        """Extract label fields and token bounding coordinates from an image."""
        pass
