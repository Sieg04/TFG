# backend/app/schemas.py
from datetime import date
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
