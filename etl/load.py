# etl/load.py
import pandas as pd
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, engine, Base
from backend.app import models

from etl.extract import fetch_countries, fetch_indicator
from etl.transform import transform_countries, transform_indicator_values

def load_countries(df: pd.DataFrame, db: Session):
    for _, row in df.iterrows():
        # create or ignore si ya existe
        if not db.query(models.Country).filter_by(iso_code=row.iso_code).first():
            obj = models.Country(
                iso_code=row.iso_code,
                name=row.name,
                region=row.region,
                currency=row.currency
            )
            db.add(obj)
    db.commit()

def load_indicator_values(df: pd.DataFrame, db: Session, source_id: int):
    for _, row in df.iterrows():
        # obtenemos la country_id e indicator_id
        country = db.query(models.Country).filter_by(iso_code=row.iso_code).first()
        indicator = db.query(models.Indicator).filter_by(code=row.indicator_code).first()
        if not country or not indicator:
            continue
        # prevenir duplicados
        exists = db.query(models.IndicatorValue).filter_by(
            country_id=country.id,
            indicator_id=indicator.id,
            date=row.date,
            source_id=source_id
        ).first()
        if not exists:
            iv = models.IndicatorValue(
                country_id=country.id,
                indicator_id=indicator.id,
                source_id=source_id,
                date=row.date,
                value=row.value
            )
            db.add(iv)
    db.commit()

def main():
    # 1. Inicializar BD (crea tablas si faltan)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 2. Cargar países
        raw_countries = fetch_countries()
        df_countries = transform_countries(raw_countries)
        load_countries(df_countries, db)

        # 3. Registrar la fuente de datos (p.ej. Banco Mundial) y obtener su id
        src = db.query(models.DataSource).filter_by(name="World Bank API").first()
        if not src:
            src = models.DataSource(name="World Bank API", url="http://api.worldbank.org")
            db.add(src)
            db.commit()
            db.refresh(src)

        # 4. Cargar indicadores de ejemplo (PIB y desempleo)
        for code in ["NY.GDP.MKTP.CD", "SL.UEM.TOTL.ZS"]:
            raw = fetch_indicator(code, 2000, 2020)
            df_ind = transform_indicator_values(raw, code)
            load_indicator_values(df_ind, db, src.id)

    finally:
        db.close()

if __name__ == "__main__":
    main()
