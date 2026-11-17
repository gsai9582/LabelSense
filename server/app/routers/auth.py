import datetime
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt

from app.database import get_db
from app.config import settings
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode('utf-8')[:72]
    return bcrypt.checkpw(pwd_bytes, hashed_password.encode('utf-8'))

DEMO_USERS = [
    {
        "id": "USR-REV-01",
        "email": "aris.vance@medtech-demo.internal",
        "full_name": "Dr. Aris Vance",
        "role": "Reviewer",
        "department": "Regulatory Affairs & Vigilance",
        "password": "clinical_demo_password",
    },
    {
        "id": "USR-QA-02",
        "email": "elena.rostova@medtech-demo.internal",
        "full_name": "Elena Rostova",
        "role": "QA Lead",
        "department": "Quality Assurance & Release Operations",
        "password": "clinical_demo_password",
    },
    {
        "id": "USR-ADM-03",
        "email": "david.chen@medtech-demo.internal",
        "full_name": "David Chen",
        "role": "Admin",
        "department": "Quality Management Systems (QMS)",
        "password": "clinical_demo_password",
    },
]

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # First check demo users
    user_match = next((u for u in DEMO_USERS if u["email"] == request.email or u["role"] == request.role), None)
    
    if not user_match:
        # Check database
        db_user = db.query(User).filter(User.email == request.email).first()
        if not db_user:
            # Fallback to QA Lead persona for demonstration
            user_match = DEMO_USERS[1]
        else:
            user_match = {
                "id": db_user.id,
                "email": db_user.email,
                "full_name": db_user.full_name,
                "role": db_user.role,
                "department": db_user.department,
            }

    role = request.role or user_match["role"]
    token_data = {
        "sub": user_match["id"],
        "email": user_match["email"],
        "role": role,
    }
    token = create_access_token(token_data)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=role,
        user_id=user_match["id"],
        full_name=user_match["full_name"],
        department=user_match["department"],
    )

@router.get("/me", response_model=UserResponse)
def get_me():
    user = DEMO_USERS[1] # Default QA Lead persona
    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        department=user["department"],
    )
