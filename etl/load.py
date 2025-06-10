# etl/load.py
import pandas as pd
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, engine, Base
from backend.app import models

from etl.extract import fetch_countries, fetch_indicator
from etl.transform import transform_countries, transform_indicator_values

# Lista actualizada de códigos de indicadores del Banco Mundial
INDICATOR_CODES = [
    "NY.GDP.MKTP.CD",       # GDP (current US$)
    "SL.UEM.TOTL.ZS",       # Unemployment, total (% of total labor force)
    "NY.GDP.MKTP.KD",       # GDP (constant 2015 US$)
    "NY.GDP.PCAP.CD",       # GDP per capita (current US$)
    "NY.GDP.PCAP.KD",       # GDP per capita (constant 2015 US$)
    "NY.GDP.MKTP.KD.ZG",    # GDP growth (annual %)
    "NV.AGR.TOTL.ZS",       # Agriculture, forestry, and fishing, value added (% of GDP)
    "NV.IND.TOTL.ZS",       # Industry (including construction), value added (% of GDP)
    "NV.SRV.TOTL.ZS",       # Services, value added (% of GDP)
    "SL.TLF.CACT.ZS",       # Labor force participation rate, total (% of total population ages 15+)
    "FP.CPI.TOTL.ZG",       # Inflation, consumer prices (annual %)
    "NE.EXP.GNFS.ZS",       # Exports of goods and services (% of GDP)
    "NE.IMP.GNFS.ZS",       # Imports of goods and services (% of GDP)
    "BN.GSR.GNFS.CD",       # Net trade in goods and services (BoP, current US$)
    "GC.DOD.TOTL.GD.ZS",    # Central government debt, total (% of GDP)
    "GC.XPN.TOTL.GD.ZS",    # Expense (% of GDP)
    "PA.NUS.FCRF",          # Official exchange rate (LCU per US$, period average)
    "FI.RES.TOTL.CD",       # Total reserves (includes gold, current US$)
    "FR.INR.RINR",          # Real interest rate (%)
    "SI.POV.GINI",          # GINI index
    "SP.POP.TOTL",          # Population, total
    "SP.POP.0014.TO.ZS",    # Population ages 0-14 (% of total population)
    "SP.POP.1564.TO.ZS",    # Population ages 15-64 (% of total population)
    "SP.POP.65UP.TO.ZS",    # Population ages 65 and up (% of total population)
]

def ensure_indicator_exists(db: Session, indicator_code: str, indicator_name: str, indicator_unit: str = ''):
    """
    Asegura que un indicador exista en la base de datos.
    Si no existe, lo crea.
    """
    indicator = db.query(models.Indicator).filter_by(code=indicator_code).first()
    if not indicator:
        indicator = models.Indicator(
            code=indicator_code,
            name=indicator_name,
            unit=indicator_unit
        )
        db.add(indicator)
        db.commit()
        db.refresh(indicator)
    return indicator

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

        # 4. Cargar indicadores
        for code in INDICATOR_CODES:
            print(f"Procesando indicador: {code}")
            raw_data = fetch_indicator(code, 2000, 2022) # Usar el rango de fechas solicitado

            if not raw_data:
                print(f"No se encontraron datos para el indicador: {code}")
                continue

            df_ind, indicator_name = transform_indicator_values(raw_data, code)

            if df_ind.empty:
                print(f"No hay datos transformados para el indicador: {code}")
                continue

            if not indicator_name:
                print(f"No se pudo extraer el nombre para el indicador: {code}. Se usará el código como nombre.")
                indicator_name = code # Fallback si no se puede extraer el nombre

            ensure_indicator_exists(db, code, indicator_name)
            load_indicator_values(df_ind, db, src.id)
            print(f"Indicador {code} ({indicator_name}) cargado.")

    finally:
        db.close()

if __name__ == "__main__":
    main()
