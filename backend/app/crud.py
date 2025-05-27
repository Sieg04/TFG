# backend/app/crud.py
import json # Added for GeoJSON string handling
from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date # Not used in user CRUD, but keep for other funcs
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
