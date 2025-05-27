# backend/app/security.py
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .config import settings
from .database import get_db

# The tokenUrl should match the endpoint that provides the token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.UserBase(email=email) # Simplified, just need email for lookup
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return user


async def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    # This function is a simple pass-through for active users.
    # It's used if you want to ensure the user is active but don't need other role checks.
    # get_current_user already checks for active status.
    if not current_user.is_active: # This check is technically redundant due to get_current_user
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user


async def get_current_active_admin_user(current_user: models.User = Depends(get_current_user)):
    if not current_user.is_active: # Redundant if get_current_user handles it, but safe
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have admin privileges"
        )
    return current_user
