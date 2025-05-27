# backend/app/routers/datasources.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/datasources", tags=["datasources"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.DataSource)
def create_data_source(source: schemas.DataSourceCreate, db: Session = Depends(get_db)):
    return crud.create_data_source(db, source)

@router.get("/", response_model=list[schemas.DataSource])
def read_data_sources(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_data_sources(db, skip, limit)

@router.get("/{source_id}", response_model=schemas.DataSource)
def read_data_source(source_id: int, db: Session = Depends(get_db)):
    db_src = crud.get_data_source(db, source_id)
    if not db_src:
        raise HTTPException(status_code=404, detail="Data source not found")
    return db_src
