# backend/app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from .. import crud, models, schemas
from ..database import get_db
from ..security import create_access_token, get_current_user, get_current_active_admin_user
from ..config import settings


router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

# Token endpoint
@router.post("/token") # Changed from @router.post("/token", response_model=schemas.Token) - no schema for token yet
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# User creation - remains open for now as per subtask description
@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return crud.create_user(db=db, user=user)


# Read multiple users - protected, admin only
@router.get("/", response_model=List[schemas.User])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_admin_user)
):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


# Read a specific user - protected, any authenticated user can access their own or others' info for now
# More granular permissions (e.g., user can only access their own info unless admin) would be a further step.
@router.get("/{user_id}", response_model=schemas.User)
def read_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    # Example: If you want to restrict users to only see their own info unless admin:
    # if current_user.id != db_user.id and current_user.role != "admin":
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this user's information")
    return db_user


@router.put("/{user_id}", response_model=schemas.User)
def update_user_details(
    user_id: int,
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_active_admin_user)
):
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Check if email is being updated and if the new email is already taken
    if user_in.email and user_in.email != db_user.email:
        existing_user_with_email = crud.get_user_by_email(db, email=user_in.email)
        if existing_user_with_email and existing_user_with_email.id != user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered by another user")

    updated_user = crud.update_user(db=db, user_id=user_id, user_in=user_in)
    if not updated_user: # Should not happen if previous check passed, but for safety
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found after update attempt")
    return updated_user
