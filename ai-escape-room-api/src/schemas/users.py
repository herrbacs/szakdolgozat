from pydantic import BaseModel, EmailStr
import uuid


class ProfileResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    username: str
    tokens: int
