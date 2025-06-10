# backend/app/models.py
from sqlalchemy import (
    Column, Integer, String, Float, Date, ForeignKey, UniqueConstraint, Boolean, Text, DateTime
)
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Country(Base):
    __tablename__ = "countries"
    __table_args__ = (UniqueConstraint("iso_code"),)

    id       = Column(Integer, primary_key=True, index=True)
    iso_code = Column(String(3), nullable=False)
    name     = Column(String(100), nullable=False)
    region   = Column(String(50))
    currency = Column(String(50))

    # Relación 1–N con valores de indicadores
    indicator_values = relationship(
        "IndicatorValue", back_populates="country", cascade="all, delete-orphan"
    )
    economic_profile = relationship("CountryEconomicProfile", back_populates="country", uselist=False, cascade="all, delete-orphan")

class Indicator(Base):
    __tablename__ = "indicators"
    __table_args__ = (UniqueConstraint("code"),)

    id    = Column(Integer, primary_key=True, index=True)
    code  = Column(String(20), nullable=False)
    name  = Column(String(100), nullable=False)
    unit  = Column(String(30))

    values = relationship(
        "IndicatorValue", back_populates="indicator", cascade="all, delete-orphan"
    )

class DataSource(Base):
    __tablename__ = "data_sources"
    __table_args__ = (UniqueConstraint("name"),)

    id   = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    url  = Column(String(255))

    values = relationship(
        "IndicatorValue", back_populates="source", cascade="all, delete-orphan"
    )

class IndicatorValue(Base):
    __tablename__ = "indicator_values"
    __table_args__ = (
        UniqueConstraint("country_id", "indicator_id", "date", "source_id"),
    )

    id           = Column(Integer, primary_key=True, index=True)
    country_id   = Column(Integer, ForeignKey("countries.id"), nullable=False)
    indicator_id = Column(Integer, ForeignKey("indicators.id"), nullable=False)
    source_id    = Column(Integer, ForeignKey("data_sources.id"), nullable=False)
    date         = Column(Date, nullable=False)
    value        = Column(Float, nullable=False)

    country   = relationship("Country", back_populates="indicator_values")
    indicator = relationship("Indicator", back_populates="values")
    source    = relationship("DataSource", back_populates="values")


class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String(255), unique=True, index=True, nullable=False) # Standard max email length
    hashed_password = Column(String(255), nullable=False) # Sufficient for bcrypt hash
    is_active       = Column(Boolean, default=True)
    role            = Column(String(50), default="user") # e.g., "user", "admin"
    company         = Column(String(100), nullable=True)
    full_name       = Column(String(100), nullable=True)

    # Relationship to GeoZone
    geozones = relationship("GeoZone", back_populates="user", cascade="all, delete-orphan")
    # Relationship to UserConfiguration (one-to-one)
    config = relationship("UserConfiguration", back_populates="user", uselist=False, cascade="all, delete-orphan")


class GeoZone(Base):
    __tablename__ = "geozones"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(255), nullable=False, index=True)
    description   = Column(String(500), nullable=True)
    geojson_data  = Column(Text, nullable=False) # Storing GeoJSON as text
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=True) # Optional owner
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="geozones")


class UserConfiguration(Base):
    __tablename__ = "user_configurations"

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    configurations = Column(Text, nullable=True) # JSON string
    created_at     = Column(DateTime, default=datetime.utcnow)
    updated_at     = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="config")


class CountryEconomicProfile(Base):
    __tablename__ = "country_economic_profiles"

    id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=False, unique=True)
    economic_data = Column(Text, nullable=True)  # To store JSON data
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    country = relationship("Country", back_populates="economic_profile")
