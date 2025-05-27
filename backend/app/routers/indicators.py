# backend/app/routers/indicators.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/indicators", tags=["indicators"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Indicator)
def create_indicator(indicator: schemas.IndicatorCreate, db: Session = Depends(get_db)):
    return crud.create_indicator(db, indicator)

@router.get("/", response_model=list[schemas.Indicator])
def read_indicators(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_indicators(db, skip, limit)

@router.get("/{indicator_id}", response_model=schemas.Indicator)
def read_indicator(indicator_id: int, db: Session = Depends(get_db)):
    db_ind = crud.get_indicator(db, indicator_id)
    if not db_ind:
        raise HTTPException(status_code=404, detail="Indicator not found")
    return db_ind
