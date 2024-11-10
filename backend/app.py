# builtin
from contextlib import asynccontextmanager

# external
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import AsyncClient, create_client

# internal
from src.globals.environment import Environment
from src.modules.meal_calculation.module import MealCalculationModule
from src.api.recommend.routes import recommendation_router

async def setup_supabase(app: FastAPI):
    environment: Environment = app.state.environment
    supabase: AsyncClient = create_client(environment.SUPABASE_URL, environment.SUPABASE_KEY)
    app.state.supabase = supabase

def setup_modules(app: FastAPI):
    environment: Environment = app.state.environment
    supabase: AsyncClient = app.state.supabase
    meal_calculation_module: MealCalculationModule = MealCalculationModule(environment=environment, supabase=supabase)
    app.state.meal_calculation_module = meal_calculation_module

def setup_globals(app: FastAPI):
    environment: Environment = Environment()
    app.state.environment = environment

@asynccontextmanager
async def lifespan(app: FastAPI):
    # setup
    print("Starting up")
    setup_globals(app=app)
    await setup_supabase(app=app)
    setup_modules(app=app)
    yield
    # teardown
    print("Shutting down")
    
app: FastAPI = FastAPI(lifespan=lifespan)

# Configure CORS
origins = [
    "http://localhost:3000",  # Your frontend's origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendation_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}