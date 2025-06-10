# backend/app/routers/economic_profile.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any # Import Any

from .. import crud, models, schemas # Adjusted import for models
from ..database import SessionLocal # Adjusted import for SessionLocal

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix="/countries/{country_id}/economic-profile",
    tags=["Country Economic Profile"], # Changed tag slightly for clarity
)

@router.get("/", response_model=schemas.CountryEconomicProfile)
def read_economic_profile_for_country(
    country_id: int,
    db: Session = Depends(get_db)
) -> Any: # Return type is Any because it can be schema or HTTPException
    db_country = crud.get_country(db, country_id=country_id)
    if db_country is None:
        raise HTTPException(status_code=404, detail="Country not found")

    db_economic_profile = crud.get_country_economic_profile_by_country_id(db, country_id=country_id)

    if db_economic_profile is None:
        # If profile doesn't exist, create it with mock data
        # The country name is needed for the mock data generation logic in CRUD
        db_economic_profile = crud.create_country_economic_profile(db, country_id=country_id, country_name=db_country.name)
        # Re-fetch to ensure all relationships and ORM state are correct, though create returns the object
        # db_economic_profile = crud.get_country_economic_profile_by_country_id(db, country_id=country_id)

    if db_economic_profile is None:
        # This case should ideally not be reached if creation was successful
        raise HTTPException(status_code=500, detail="Economic profile could not be created or retrieved")

    return db_economic_profile
