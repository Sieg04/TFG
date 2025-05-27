# backend/app/routers/indicator_values.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/indicator-values", tags=["indicator-values"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.IndicatorValue)
def create_indicator_value(iv: schemas.IndicatorValueCreate, db: Session = Depends(get_db)):
    return crud.create_indicator_value(db, iv)

@router.get("/", response_model=List[schemas.IndicatorValue])
def read_indicator_values(
        country_id: Optional[int] = Query(None),
        indicator_id: Optional[int] = Query(None),
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)
):
    results = crud.get_indicator_values(db, country_id, indicator_id, skip, limit)
    return results
