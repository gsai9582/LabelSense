import datetime
from pydantic import BaseModel
from typing import Optional, Dict, List, Any

class DocumentResponse(BaseModel):
    id: str
    filename: str
    original_name: str
    mime_type: str
    file_size_bytes: int
    sha256_hash: str
    status: str
    created_at: datetime.datetime

    model_config = {"from_attributes": True}

class ExtractedFields(BaseModel):
    sku: Optional[str] = None
    product_name: Optional[str] = None
    gtin: Optional[str] = None
    lot: Optional[str] = None
    exp_date: Optional[str] = None
    manufacturer_name: Optional[str] = None
    device_class: Optional[str] = "Class III"
    symbols: List[str] = []
    confidence_scores: Dict[str, float] = {}
