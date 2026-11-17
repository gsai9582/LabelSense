import json
import time
import base64
from typing import Type, TypeVar, Optional, Any
import httpx
from pydantic import BaseModel

from app.ai.base import BaseLLMClient, LLMResponseMetadata

T = TypeVar("T", bound=BaseModel)

class GeminiLLMClient(BaseLLMClient):
    provider_name: str = "gemini"

    def __init__(
        self,
        api_key: str,
        model: str = "gemini-1.5-flash",
        base_url: str = "https://generativelanguage.googleapis.com/v1beta",
        timeout: float = 20.0,
    ):
        self.api_key = api_key
        self.model = model
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.is_available = bool(api_key and len(api_key) > 5)

    async def generate_json(
        self,
        prompt: str,
        response_model: Type[T],
        system_instruction: str = "",
        temperature: float = 0.1,
    ) -> tuple[T, LLMResponseMetadata]:
        if not self.is_available:
            raise RuntimeError("Gemini API key is not configured or invalid.")

        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        schema = response_model.model_json_schema()

        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": temperature,
                "responseMimeType": "application/json",
            },
        }

        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        start_time = time.time()
        
        # Retry once on failure
        last_error = None
        for attempt in range(2):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    resp = await client.post(url, json=payload)
                    
                if resp.status_code != 200:
                    raise RuntimeError(f"Gemini API returned HTTP {resp.status_code}: {resp.text[:200]}")
                    
                result_json = resp.json()
                raw_text = result_json["candidates"][0]["content"]["parts"][0]["text"]
                parsed_dict = json.loads(raw_text)
                validated_model = response_model.model_validate(parsed_dict)
                
                latency = int((time.time() - start_time) * 1000)
                meta = LLMResponseMetadata(
                    provider="gemini",
                    model=self.model,
                    latency_ms=latency,
                    prompt_tokens=result_json.get("usageMetadata", {}).get("promptTokenCount", len(prompt) // 4),
                    completion_tokens=result_json.get("usageMetadata", {}).get("candidatesTokenCount", len(raw_text) // 4),
                    is_demo_mode=False,
                )
                return validated_model, meta
            except Exception as e:
                last_error = e
                # Wait briefly before second attempt
                time.sleep(0.5)

        raise RuntimeError(f"Gemini structured generation failed after 2 attempts: {str(last_error)}")

    async def generate_text(
        self,
        prompt: str,
        system_instruction: str = "",
        temperature: float = 0.2,
    ) -> tuple[str, LLMResponseMetadata]:
        if not self.is_available:
            raise RuntimeError("Gemini API key is not configured.")

        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": temperature},
        }
        if system_instruction:
            payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

        start_time = time.time()
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, json=payload)

        if resp.status_code != 200:
            raise RuntimeError(f"Gemini API returned HTTP {resp.status_code}: {resp.text[:200]}")

        result_json = resp.json()
        raw_text = result_json["candidates"][0]["content"]["parts"][0]["text"]
        latency = int((time.time() - start_time) * 1000)

        meta = LLMResponseMetadata(
            provider="gemini",
            model=self.model,
            latency_ms=latency,
            prompt_tokens=result_json.get("usageMetadata", {}).get("promptTokenCount", len(prompt) // 4),
            completion_tokens=result_json.get("usageMetadata", {}).get("candidatesTokenCount", len(raw_text) // 4),
            is_demo_mode=False,
        )
        return raw_text, meta

    async def vision_extract(
        self,
        image_bytes: bytes,
        mime_type: str,
        prompt: str,
        response_model: Type[T],
    ) -> tuple[T, LLMResponseMetadata]:
        if not self.is_available:
            raise RuntimeError("Gemini API key is not configured.")

        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        b64_image = base64.b64encode(image_bytes).decode("utf-8")

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inlineData": {
                                "mimeType": mime_type,
                                "data": b64_image,
                            }
                        },
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json",
            },
        }

        start_time = time.time()
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, json=payload)

        if resp.status_code != 200:
            raise RuntimeError(f"Gemini Vision API returned HTTP {resp.status_code}: {resp.text[:200]}")

        result_json = resp.json()
        raw_text = result_json["candidates"][0]["content"]["parts"][0]["text"]
        parsed_dict = json.loads(raw_text)
        validated_model = response_model.model_validate(parsed_dict)
        latency = int((time.time() - start_time) * 1000)

        meta = LLMResponseMetadata(
            provider="gemini",
            model=self.model,
            latency_ms=latency,
            prompt_tokens=result_json.get("usageMetadata", {}).get("promptTokenCount", 200),
            completion_tokens=result_json.get("usageMetadata", {}).get("candidatesTokenCount", len(raw_text) // 4),
            is_demo_mode=False,
        )
        return validated_model, meta
