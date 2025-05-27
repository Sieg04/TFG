# backend/app/routers/user_configurations.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db
from ..security import get_current_user

router = APIRouter(
    prefix="/users/me/configurations",
    tags=["user-configurations"],
    responses={404: {"description": "Not found"}}, # Generic, can be overridden
)

@router.get("/", response_model=schemas.UserConfiguration)
def read_user_configuration(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_user_config = crud.get_user_configuration(db, user_id=current_user.id)
    if db_user_config is None:
        # If no config exists, we can either return 404 or an empty/default config.
        # For now, let's return 404, client can decide to create one.
        # Alternatively, return a default UserConfiguration object:
        # return schemas.UserConfiguration(id=-1, user_id=current_user.id, configurations={}, created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User configuration not found")
    return db_user_config

@router.put("/", response_model=schemas.UserConfiguration)
def upsert_user_configuration( # Using PUT for create or replace semantics
    config_in: schemas.UserConfigurationCreate, # This schema expects the full 'configurations' object
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # This effectively replaces the existing configuration with the new one.
    # If you want a partial update (PATCH-like behavior), you'd use UserConfigurationUpdate
    # and a different CRUD function (like the update_user_configuration I created).
    # For this PUT, create_user_configuration (which does upsert/replace) is appropriate.
    db_user_config = crud.create_user_configuration(db, user_id=current_user.id, config=config_in)
    return db_user_config

@router.patch("/", response_model=schemas.UserConfiguration)
def patch_user_configuration( # Using PATCH for partial update semantics
    config_update: schemas.UserConfigurationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # This uses the CRUD function designed for partial updates (merging).
    db_user_config = crud.update_user_configuration(db, user_id=current_user.id, config_update=config_update)
    if db_user_config is None and config_update.configurations is None:
         # This case means no existing config and no data provided to create one.
         # Or if update_user_configuration returns None when no changes are made to an existing empty config.
         # We might need to re-fetch or ensure update_user_configuration always returns the object.
         # For now, let's try to re-fetch. If still none, then it's an issue.
        db_user_config = crud.get_user_configuration(db, user_id=current_user.id)
        if db_user_config is None:
             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User configuration not found, and no update data provided.")

    return db_user_config
