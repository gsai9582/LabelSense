from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "Reviewer"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: str
    department: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    department: str

    model_config = {"from_attributes": True}
