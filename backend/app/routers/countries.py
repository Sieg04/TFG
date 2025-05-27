# backend/app/routers/countries.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, models
from ..database import SessionLocal

router = APIRouter(prefix="/countries", tags=["countries"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Country)
def create_country(country: schemas.CountryCreate, db: Session = Depends(get_db)):
    return crud.create_country(db, country)

@router.get("/", response_model=list[schemas.Country])
def read_countries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_countries(db, skip, limit)

@router.get("/{country_id}", response_model=schemas.Country)
def read_country(country_id: int, db: Session = Depends(get_db)):
    db_country = crud.get_country(db, country_id)
    if not db_country:
        raise HTTPException(status_code=404, detail="Country not found")
    return db_country
