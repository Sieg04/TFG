# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import countries, indicators, datasources, indicator_values

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Progrex API")

# Permitir llamadas desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(countries.router)
app.include_router(indicators.router)
app.include_router(datasources.router)
app.include_router(indicator_values.router)
