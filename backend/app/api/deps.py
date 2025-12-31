from typing import Generator, Optional, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.models.organization import OrganizationMember
from app.schemas.token import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenPayload(sub=user_id)
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == int(token_data.sub)).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# --- THIS WAS MISSING ---
def verify_user_in_org(
    organization_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> OrganizationMember:
    """
    Ensures the user is a member of the specific organization
    before allowing access to its resources (Projects, Tasks).
    """
    member = (
        db.query(OrganizationMember)
        .filter(
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.organization_id == organization_id
        )
        .first()
    )
    if not member:
        raise HTTPException(
            status_code=403, # Forbidden
            detail="Not authorized to access this organization"
        )
    return member
