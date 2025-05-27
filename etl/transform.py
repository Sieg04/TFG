# etl/transform.py

import pandas as pd
from typing import List, Dict, Any

def transform_countries(raw: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Convierte la lista de países brutos en un DataFrame con columnas:
    iso_code, name, region, currency.
    """
    df = pd.json_normalize(raw)
    return pd.DataFrame({
        "iso_code": df["id"],
        "name": df["name"],                       # antes era name.value
        "region": df["region.value"],             # sigue siendo region.value
        "currency": ""                            # no viene moneda en este endpoint
    })

def transform_indicator_values(
        raw: List[Dict[str, Any]],
        indicator_code: str
) -> pd.DataFrame:
    """
    Convierte la lista de observaciones de indicador en DataFrame con:
    iso_code, date, value, indicator_code.
    """
    df = pd.json_normalize(raw)
    df = df.rename(columns={
        "country.id": "iso_code",
        "date": "date",
        "value": "value"
    })
    df["indicator_code"] = indicator_code
    df = df[["iso_code", "date", "value", "indicator_code"]]
    # Convertir tipos
    df["date"] = pd.to_datetime(df["date"], format="%Y").dt.date
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    return df.dropna(subset=["value"])
