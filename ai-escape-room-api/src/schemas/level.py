from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=6, max_length=128)

class LoginRequest(BaseModel):
    identifier: str
    password: str

class AuthResult(BaseModel):
    success: bool