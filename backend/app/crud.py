# backend/app/crud.py
import json
from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date, datetime, timedelta  # Added datetime, timedelta
from passlib.context import CryptContext

# Password Hashing Context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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


# ----- Users -----
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_hashed_password(password):
    return pwd_context.hash(password)

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_hashed_password(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        company=user.company
        # role and is_active will use defaults from model
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_in: schemas.UserUpdate):
    db_user = get_user(db, user_id=user_id)
    if not db_user:
        return None # Or raise HTTPException(status_code=404, detail="User not found")

    update_data = user_in.dict(exclude_unset=True)

    for field, value in update_data.items():
        if field == "email" and value != db_user.email:
            existing_user_with_email = get_user_by_email(db, email=value)
            if existing_user_with_email and existing_user_with_email.id != user_id:
                # This email is already taken by another user.
                # We'll let the router handle the HTTPException for this specific case.
                # Alternatively, could raise it here. For now, just skip updating email if taken.
                # Or, the router should check this before calling update_user for email changes.
                # For simplicity in CRUD, let's assume router handles pre-checks for unique constraints like email.
                # If not, a more robust error handling or check is needed here.
                # For now, let's allow the update, and DB will raise IntegrityError if email is unique and conflicts.
                # A better approach: check in router or raise specific error here.
                # Let's just set it, router should validate.
                pass # Fall through to setattr
        setattr(db_user, field, value)

    db.add(db_user) # Not strictly necessary if only updating existing fields on an attached object
    db.commit()
    db.refresh(db_user)
    return db_user


# ----- GeoZones -----
def create_geozone(db: Session, geozone: schemas.GeoZoneCreate, user_id: int | None = None):
    geojson_data_str = json.dumps(geozone.geojson_data)
    db_geozone = models.GeoZone(
        name=geozone.name,
        description=geozone.description,
        geojson_data=geojson_data_str,
        user_id=user_id # Assign user_id from the authenticated user or explicitly passed
    )
    db.add(db_geozone)
    db.commit()
    db.refresh(db_geozone)
    return db_geozone

def get_geozone(db: Session, geozone_id: int):
    return db.query(models.GeoZone).filter(models.GeoZone.id == geozone_id).first()

def get_geozones(db: Session, skip: int = 0, limit: int = 100, user_id: int | None = None):
    query = db.query(models.GeoZone)
    if user_id is not None:
        query = query.filter(models.GeoZone.user_id == user_id)
    return query.offset(skip).limit(limit).all()

def update_geozone(db: Session, geozone_id: int, geozone_update: schemas.GeoZoneCreate):
    db_geozone = db.query(models.GeoZone).filter(models.GeoZone.id == geozone_id).first()
    if db_geozone:
        update_data = geozone_update.dict(exclude_unset=True)
        if "geojson_data" in update_data:
            update_data["geojson_data"] = json.dumps(update_data["geojson_data"])
        
        for key, value in update_data.items():
            setattr(db_geozone, key, value)
        
        # user_id might be explicitly set if admin is changing ownership
        if geozone_update.user_id is not None:
             setattr(db_geozone, "user_id", geozone_update.user_id)

        db.commit()
        db.refresh(db_geozone)
    return db_geozone

def delete_geozone(db: Session, geozone_id: int):
    db_geozone = db.query(models.GeoZone).filter(models.GeoZone.id == geozone_id).first()
    if db_geozone:
        db.delete(db_geozone)
        db.commit()
    return db_geozone


# ----- UserConfigurations -----
def get_user_configuration(db: Session, user_id: int):
    return db.query(models.UserConfiguration).filter(models.UserConfiguration.user_id == user_id).first()

def create_user_configuration(db: Session, user_id: int, config: schemas.UserConfigurationCreate):
    # This function creates or fully replaces the configuration.
    db_config = get_user_configuration(db, user_id=user_id)
    
    config_data_str = json.dumps(config.configurations)

    if db_config:
        db_config.configurations = config_data_str
        # updated_at will be handled by the model's onupdate
    else:
        db_config = models.UserConfiguration(
            user_id=user_id,
            configurations=config_data_str
        )
        db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config


# ----- CountryEconomicProfile -----

def _get_mock_economic_data(country_name: str) -> dict:
    """Generates mock economic data for a given country name."""
    # Generate some dates for the last few months
    today = datetime.today()
    dates = [(today - timedelta(days=30 * i)).strftime("%Y-%m-%d") for i in range(4)]
    dates.reverse() # Chronological order

    if country_name == "Utopia":
        return {
            "stock_market": {
                "name": "Utopia Stock Exchange (USE)",
                "points": [
                    {"date": dates[0], "value": 1500.00},
                    {"date": dates[1], "value": 1520.50},
                    {"date": dates[2], "value": 1510.75},
                    {"date": dates[3], "value": 1550.25},
                ]
            },
            "real_estate": {
                "average_price_sqm_usd": 7500,
                "price_trend": [
                    {"date": dates[0], "value_usd_sqm": 7400},
                    {"date": dates[1], "value_usd_sqm": 7450},
                    {"date": dates[2], "value_usd_sqm": 7500},
                    {"date": dates[3], "value_usd_sqm": 7550},
                ]
            },
            "economy_type": "Advanced Technology Driven",
            "main_sectors": [
                {"name": "Renewable Energy", "leading_companies": ["GreenTech Solutions", "Solaris Corp"]},
                {"name": "Bio-engineering", "leading_companies": ["BioSynth Inc.", "LifeGene Ltd."]}
            ],
            "unicorn_companies": [
                {"name": "FutureAI", "valuation_billion_usd": 5.2, "sector": "Artificial Intelligence"},
                {"name": "EcoInnovate", "valuation_billion_usd": 3.1, "sector": "Sustainability Tech"}
            ]
        }
    elif country_name == "El Dorado":
        return {
            "stock_market": {
                "name": "El Dorado Gold Standard Exchange (EDGE)",
                "points": [
                    {"date": dates[0], "value": 800.00},
                    {"date": dates[1], "value": 810.00},
                    {"date": dates[2], "value": 790.50},
                    {"date": dates[3], "value": 820.00},
                ]
            },
            "real_estate": {
                "average_price_sqm_usd": 3200,
                "price_trend": [
                    {"date": dates[0], "value_usd_sqm": 3100},
                    {"date": dates[1], "value_usd_sqm": 3150},
                    {"date": dates[2], "value_usd_sqm": 3200},
                    {"date": dates[3], "value_usd_sqm": 3250},
                ]
            },
            "economy_type": "Resource-Rich Export-Oriented",
            "main_sectors": [
                {"name": "Mining", "leading_companies": ["GoldMine Corp", "Precious Metals Ltd."]},
                {"name": "Agriculture", "leading_companies": ["Tropical Harvests", "El Dorado Farms"]}
            ],
            "unicorn_companies": [
                {"name": "Ricura Resources", "valuation_billion_usd": 2.0, "sector": "Natural Resources Tech"},
            ]
        }
    else: # Default mock data for other countries
        return {
            "stock_market": {
                "name": f"{country_name} National Stock Market (NSM)",
                "points": [
                    {"date": dates[0], "value": 1000.00 + (hash(country_name) % 100)},
                    {"date": dates[1], "value": 1020.50 + (hash(country_name) % 100)},
                    {"date": dates[2], "value": 1010.75 + (hash(country_name) % 100)},
                    {"date": dates[3], "value": 1040.25 + (hash(country_name) % 100)},
                ]
            },
            "real_estate": {
                "average_price_sqm_usd": 4000 + (hash(country_name) % 500),
                "price_trend": [
                    {"date": dates[0], "value_usd_sqm": 3900 + (hash(country_name) % 500)},
                    {"date": dates[1], "value_usd_sqm": 3950 + (hash(country_name) % 500)},
                    {"date": dates[2], "value_usd_sqm": 4000 + (hash(country_name) % 500)},
                    {"date": dates[3], "value_usd_sqm": 4050 + (hash(country_name) % 500)},
                ]
            },
            "economy_type": "Mixed Economy",
            "main_sectors": [
                {"name": "Tourism", "leading_companies": [f"{country_name} Tours", "Holiday Inc."]},
                {"name": "Manufacturing", "leading_companies": ["BuildIt Co.", "Quality Goods Ltd."]}
            ],
            "unicorn_companies": []
        }

def create_country_economic_profile(db: Session, country_id: int, country_name: str) -> models.CountryEconomicProfile:
    """
    Creates an economic profile for a country using mock data.
    If a profile for the country_id already exists, it will not create a new one.
    (The unique constraint on country_id in the model handles this at DB level,
    but a check can be added here if specific behavior is needed before DB error)
    """
    # Optional: Check if profile already exists, though DB constraint handles it
    # existing_profile = get_country_economic_profile_by_country_id(db, country_id)
    # if existing_profile:
    #     return existing_profile # Or raise an error, or update, depending on desired logic

    mock_data = _get_mock_economic_data(country_name)

    # The 'economic_data' field in the model expects a string (Text type).
    # Pydantic's 'Any' type in the schema will allow a dict, which we then serialize to JSON string.
    profile_data_create = schemas.CountryEconomicProfileCreate(economic_data=mock_data)

    db_profile = models.CountryEconomicProfile(
        country_id=country_id,
        economic_data=json.dumps(profile_data_create.economic_data) # Serialize dict to JSON string
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def get_country_economic_profile_by_country_id(db: Session, country_id: int) -> models.CountryEconomicProfile | None:
    """Fetches an economic profile by country_id."""
    return db.query(models.CountryEconomicProfile).filter(models.CountryEconomicProfile.country_id == country_id).first()

def update_user_configuration(db: Session, user_id: int, config_update: schemas.UserConfigurationUpdate):
    # This function performs a partial update (merge) of the configuration.
    db_config = get_user_configuration(db, user_id=user_id)

    if not db_config:
        # If no config exists, create a new one with the provided update data
        if config_update.configurations is not None:
            new_config_data_str = json.dumps(config_update.configurations)
            db_config = models.UserConfiguration(user_id=user_id, configurations=new_config_data_str)
            db.add(db_config)
            db.commit()
            db.refresh(db_config)
            return db_config
        else:
            # Nothing to update and no existing config
            return None 
    
    # If config exists and there's data to update
    if config_update.configurations is not None:
        existing_data = json.loads(db_config.configurations) if db_config.configurations else {}
        
        # Simple dictionary update (merge)
        # For deeper merges, a more sophisticated approach might be needed
        existing_data.update(config_update.configurations)
        db_config.configurations = json.dumps(existing_data)
        
        db.commit()
        db.refresh(db_config)
        
    return db_config
