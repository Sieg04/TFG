import json
from datetime import datetime, date
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, engine, Base
from backend.app.models import Country, CountryEconomicProfile

# Define the JSON data structure
# Ensure this is updated or passed dynamically if needed for other countries or dates
URUGUAY_PROFILE_DATA = {
  "country_iso_code": "URY",
  "last_updated": date.today().isoformat(),
  "gdp_by_sector_source_note": "Data from World Bank (NV.AGR.TOTL.ZS, NV.IND.TOTL.ZS, NV.SRV.TOTL.ZS), latest available year.",
  "employment_by_sector": {
    "source_note": "Detailed sectoral employment data may require national statistics offices. Placeholder data.",
    "agriculture": "approx 9%",
    "industry": "approx 19%",
    "services": "approx 72%"
  },
  "major_companies": [
    { "name": "Antel", "sector": "Telecommunications", "description": "State-owned telecommunications company." },
    { "name": "UTE", "sector": "Energy", "description": "State-owned power company for generation, transmission, and distribution." },
    { "name": "ANCAP", "sector": "Energy/Fuel", "description": "State-owned company for oil refining, cement, and biofuels." },
    { "name": "Conaprole", "sector": "Dairy Products", "description": "Major dairy cooperative, leading national producer and exporter." },
    { "name": "Banco República (BROU)", "sector": "Banking", "description": "State-owned bank, largest in the country." },
    { "name": "Tienda Inglesa", "sector": "Retail", "description": "Prominent supermarket and department store chain." },
    { "name": "Montes del Plata / UPM", "sector": "Pulp & Paper", "description": "Significant pulp mill operations, major export contributors." },
    { "name": "MercadoLibre", "sector": "E-commerce/Technology", "description": "Although Argentinian, has significant operations and development presence in Uruguay." }
  ],
  "stock_market": {
    "main_index": "BVM (Bolsa de Valores de Montevideo)",
    "recent_trends": "The stock market in Uruguay is small and primarily dominated by government bonds and debt instruments. The equity market has limited liquidity and few listed companies. Trading activity is generally low compared to larger regional markets.",
    "source_note": "General assessment. Detailed live data requires specialized financial data providers."
  },
  "real_estate_market": {
    "general_trends": "Uruguay's real estate market is traditionally stable, often seen as a safe haven for regional investors. Montevideo offers a diverse range of properties, while coastal areas like Punta del Este are popular for luxury and tourism-related investments. Recent years have seen steady demand, with some fluctuations based on economic conditions and foreign investment.",
    "key_areas": ["Montevideo (Pocitos, Carrasco, Punta Carretas)", "Punta del Este (La Barra, José Ignacio)", "Colonia del Sacramento"],
    "source_note": "General assessment based on publicly available reports and real estate news."
  },
  "principal_trade_partners": {
    "exports": ["China", "Brazil", "USA", "Argentina", "European Union"],
    "imports": ["Brazil", "China", "Argentina", "USA", "European Union"],
    "source_note": "Typical partners, data from Uruguay XXI or Central Bank of Uruguay for specific year shares."
  },
  "public_spending_sectors": {
    "source_note": "Based on general knowledge of Uruguayan budget priorities. Precise figures require official budget documents from the Ministry of Economy and Finance.",
    "social_security": "Significant portion, due to an aging population and comprehensive system.",
    "education": "High priority, constitutionally mandated minimum percentage of GDP.",
    "health": "Significant public and private expenditure, focus on universal access.",
    "infrastructure": "Ongoing investments in roads, ports, and energy."
  },
  "currency_details": {
    "currency_code": "UYU",
    "currency_name": "Peso Uruguayo",
    "central_bank": "Banco Central del Uruguay (BCU)",
    "exchange_rate_source": "World Bank (PA.NUS.FCRF) provides an official average. Live rates from BCU or financial institutions."
  },
  "social_indicators_qualitative": {
    "human_development_index": {
      "value": "0.830", "year": "2021", "rank": "58th", "source": "UNDP Human Development Report (HDR 2021/2022)"
    },
    "poverty_rate_note": "Uruguay has made significant strides in poverty reduction. National poverty lines and data are provided by the Instituto Nacional de Estadística (INE). As of early 2020s, poverty rates are among the lowest in Latin America.",
    "gini_index_source_note": "GINI from World Bank (SI.POV.GINI) is loaded as an indicator. Uruguay typically has one of the lower GINI coefficients in the region, indicating less income inequality compared to neighbors."
  },
  "population_demographics_source_note": "Data from World Bank (SP.POP.TOTL, SP.POP.0014.TO.ZS, etc.) is loaded as indicators. Uruguay has an aging population and low birth rates."
}

def populate_profile(db: Session):
    country_iso_code = URUGUAY_PROFILE_DATA["country_iso_code"]

    # Query for the Country
    country = db.query(Country).filter(Country.iso_code == country_iso_code).first()

    if not country:
        print(f"Error: Country with ISO code {country_iso_code} not found. Please run etl/load.py first.")
        return

    # Serialize the JSON data to a string
    economic_data_json = json.dumps(URUGUAY_PROFILE_DATA)
    current_time = datetime.utcnow()

    # Query for an existing profile
    profile = db.query(CountryEconomicProfile).filter(CountryEconomicProfile.country_id == country.id).first()

    if profile:
        print(f"Updating existing profile for {country_iso_code}...")
        profile.economic_data = economic_data_json
        profile.updated_at = current_time
    else:
        print(f"Creating new profile for {country_iso_code}...")
        profile = CountryEconomicProfile(
            country_id=country.id,
            economic_data=economic_data_json,
            created_at=current_time,
            updated_at=current_time
        )
        db.add(profile)

    db.commit()
    print(f"Successfully populated/updated profile for {country_iso_code}.")

def main():
    # Initialize DB (optional, if tables might not exist, but load.py should handle it)
    # Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        populate_profile(db)
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure PYTHONPATH is set correctly if running this script directly
    # e.g., PYTHONPATH=/app python etl/populate_uruguay_profile.py
    print("Starting script to populate Uruguay's economic profile...")
    main()
    print("Script finished.")
