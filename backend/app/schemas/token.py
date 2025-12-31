from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    # 'sub' (Subject) is standard in JWT to hold the User ID
    sub: Optional[str] = None