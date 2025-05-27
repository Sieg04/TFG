# backend/app/schemas.py
from datetime import date, datetime # Added datetime
from typing import Optional, Any # Added Any
from pydantic import BaseModel

# ------ Country schemas ------
class CountryBase(BaseModel):
    iso_code: str
    name: str
    region: str | None = None
    currency: str | None = None

class CountryCreate(CountryBase):
    pass

class Country(CountryBase):
    id: int

    class Config:
        orm_mode = True


# ------ UserConfiguration schemas ------
class UserConfigurationBase(BaseModel):
    configurations: Any # Can be a dict representing the JSON structure

class UserConfigurationCreate(UserConfigurationBase):
    pass # For now, same as base. user_id will be from path/token.

class UserConfigurationUpdate(BaseModel): # Explicitly define for partial updates
    configurations: Optional[Any] = None

class UserConfiguration(UserConfigurationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# ------ GeoZone schemas ------
class GeoZoneBase(BaseModel):
    name: str
    description: Optional[str] = None
    geojson_data: Any # Can be dict representing GeoJSON object

class GeoZoneCreate(GeoZoneBase):
    user_id: Optional[int] = None # Optional owner

class GeoZone(GeoZoneBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# ------ User schemas ------
class UserBase(BaseModel):
    email: str
    company: Optional[str] = None
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel): # New schema for updating user details by admin
    email: Optional[str] = None
    full_name: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

    class Config:
        orm_mode = True # Not strictly necessary if not returning it directly often, but good practice

class User(UserBase):
    id: int
    is_active: bool
    role: str

    class Config:
        orm_mode = True


# ------ Indicator schemas ------
class IndicatorBase(BaseModel):
    code: str
    name: str
    unit: str | None = None

class IndicatorCreate(IndicatorBase):
    pass

class Indicator(IndicatorBase):
    id: int

    class Config:
        orm_mode = True


# ------ DataSource schemas ------
class DataSourceBase(BaseModel):
    name: str
    url: str | None = None

class DataSourceCreate(DataSourceBase):
    pass

class DataSource(DataSourceBase):
    id: int

    class Config:
        orm_mode = True


# ------ IndicatorValue schemas ------
class IndicatorValueBase(BaseModel):
    country_id: int
    indicator_id: int
    source_id: int
    date: date
    value: float

class IndicatorValueCreate(IndicatorValueBase):
    pass

class IndicatorValue(IndicatorValueBase):
    id: int

    class Config:
        orm_mode = True
