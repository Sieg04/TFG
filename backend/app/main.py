# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import countries, indicators, datasources, indicator_values, users, geozones, user_configurations, economic_profile # Added economic_profile router

# Crear tablas
Base.metadata.create_all(bind=engine) # This will now also create the users, geozones, user_configurations and country_economic_profiles tables

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
app.include_router(users.router)
app.include_router(geozones.router)
app.include_router(user_configurations.router) # Added user_configurations router
app.include_router(economic_profile.router) # Added economic_profile router
