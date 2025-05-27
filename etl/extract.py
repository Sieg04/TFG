# etl/extract.py
import requests
from typing import Any, Dict, List

WORLD_BANK_BASE = "http://api.worldbank.org/v2"

def fetch_countries(format: str = "json") -> List[Dict[str, Any]]:
    """
    Descarga la lista de países desde la API del Banco Mundial.
    """
    url = f"{WORLD_BANK_BASE}/country?format={format}&per_page=300"
    resp = requests.get(url)
    resp.raise_for_status()
    # La API devuelve [metadata, [countries...]]
    data = resp.json()
    return data[1]

def fetch_indicator(
        indicator_code: str,
        date_from: int,
        date_to: int,
        format: str = "json"
) -> List[Dict[str, Any]]:
    """
    Descarga valores de un indicador para todos los países en un rango de años.
    """
    url = (
        f"{WORLD_BANK_BASE}/country/all/indicator/{indicator_code}"
        f"?date={date_from}:{date_to}&format={format}&per_page=20000"
    )
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()[1]

# Ejemplo de uso directo (para pruebas)
if __name__ == "__main__":
    countries = fetch_countries()
    print(f"Descargados {len(countries)} países")
    gdp = fetch_indicator("NY.GDP.MKTP.CD", 2000, 2020)
    print(f"Descargados {len(gdp)} observaciones de PIB")
