# backend/app/routers/geozones.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..database import get_db
from ..security import get_current_user, get_current_active_admin_user

router = APIRouter(
    prefix="/geozones",
    tags=["geozones"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.GeoZone)
def create_geozone(
    geozone: schemas.GeoZoneCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_admin_user) # Admin creates zones
):
    # If user_id is not provided in the schema, it defaults to None (or could be current_user.id if that's the logic)
    # For this setup, admin can assign a user_id or leave it null.
    # If current_user should be the owner by default for non-admin creation, adjust crud.create_geozone call
    return crud.create_geozone(db=db, geozone=geozone, user_id=geozone.user_id)


@router.get("/", response_model=List[schemas.GeoZone])
def read_geozones(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role == "admin":
        # Admin sees all geozones
        geozones = crud.get_geozones(db, skip=skip, limit=limit)
    else:
        # Regular user sees only their own geozones
        geozones = crud.get_geozones(db, skip=skip, limit=limit, user_id=current_user.id)
    return geozones


@router.get("/{geozone_id}", response_model=schemas.GeoZone)
def read_geozone(
    geozone_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_geozone = crud.get_geozone(db, geozone_id=geozone_id)
    if db_geozone is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="GeoZone not found")
    
    if current_user.role != "admin" and db_geozone.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this geozone")
    
    return db_geozone


@router.put("/{geozone_id}", response_model=schemas.GeoZone)
def update_geozone(
    geozone_id: int, 
    geozone_update: schemas.GeoZoneCreate, # Using GeoZoneCreate for updates as specified
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_admin_user) # Only admin can update
):
    db_geozone = crud.get_geozone(db, geozone_id=geozone_id)
    if db_geozone is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="GeoZone not found")
    
    # Admin can update any geozone
    updated_geozone = crud.update_geozone(db=db, geozone_id=geozone_id, geozone_update=geozone_update)
    return updated_geozone


@router.delete("/{geozone_id}", response_model=schemas.GeoZone) # Or return a status code
def delete_geozone(
    geozone_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_admin_user) # Only admin can delete
):
    db_geozone = crud.get_geozone(db, geozone_id=geozone_id)
    if db_geozone is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="GeoZone not found")

    # Admin can delete any geozone
    deleted_geozone = crud.delete_geozone(db=db, geozone_id=geozone_id)
    if deleted_geozone is None: # Should not happen if previous check passed, but good practice
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="GeoZone not found during deletion")
    return deleted_geozone
