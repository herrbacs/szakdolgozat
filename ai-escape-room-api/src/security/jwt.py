from datetime import datetime, timedelta, timezone
from jose import jwt
from config import JWT_PRIVATE_KEY, JWT_PUBLIC_KEY
import uuid

ALGORITHM = "RS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 2
REFRESH_TOKEN_EXPIRE_DAYS = 30

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

def create_access_token(*, user_id: str) -> str:
    expire = _utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire, "type": "access"}
    return jwt.encode(payload, JWT_PRIVATE_KEY, algorithm=ALGORITHM)

def create_refresh_token(*, user_id: str) -> tuple[str, datetime]:
    expire = _utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "type": "refresh",
        "jti": str(uuid.uuid4())
    }
    token = jwt.encode(payload, JWT_PRIVATE_KEY, algorithm=ALGORITHM)
    return token, expire

def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_PUBLIC_KEY, algorithms=[ALGORITHM])