# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date

# ----- Countries -----
def get_countries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Country).offset(skip).limit(limit).all()

def get_country(db: Session, country_id: int):
    return db.query(models.Country).filter(models.Country.id == country_id).first()

def create_country(db: Session, country: schemas.CountryCreate):
    db_country = models.Country(**country.dict())
    db.add(db_country)
    db.commit()
    db.refresh(db_country)
    return db_country

# ----- Indicators -----
def get_indicators(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Indicator).offset(skip).limit(limit).all()

def get_indicator(db: Session, indicator_id: int):
    return db.query(models.Indicator).filter(models.Indicator.id == indicator_id).first()

def create_indicator(db: Session, indicator: schemas.IndicatorCreate):
    db_ind = models.Indicator(**indicator.dict())
    db.add(db_ind)
    db.commit()
    db.refresh(db_ind)
    return db_ind

# ----- DataSources -----
def get_data_sources(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DataSource).offset(skip).limit(limit).all()

def get_data_source(db: Session, source_id: int):
    return db.query(models.DataSource).filter(models.DataSource.id == source_id).first()

def create_data_source(db: Session, source: schemas.DataSourceCreate):
    db_src = models.DataSource(**source.dict())
    db.add(db_src)
    db.commit()
    db.refresh(db_src)
    return db_src

# ----- IndicatorValues -----
def get_indicator_values(
        db: Session,
        country_id: int | None = None,
        indicator_id: int | None = None,
        skip: int = 0,
        limit: int = 100
):
    q = db.query(models.IndicatorValue)
    if country_id is not None:
        q = q.filter(models.IndicatorValue.country_id == country_id)
    if indicator_id is not None:
        q = q.filter(models.IndicatorValue.indicator_id == indicator_id)
    return q.offset(skip).limit(limit).all()

def create_indicator_value(db: Session, iv: schemas.IndicatorValueCreate):
    db_iv = models.IndicatorValue(**iv.dict())
    db.add(db_iv)
    db.commit()
    db.refresh(db_iv)
    return db_iv
