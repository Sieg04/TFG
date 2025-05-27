# backend/app/models.py
from sqlalchemy import (
    Column, Integer, String, Float, Date, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from .database import Base

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
