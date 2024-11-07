# builtin
from contextlib import asynccontextmanager

# external
from fastapi import FastAPI

# internal
from src.globals.environment import Environment
from src.modules.meal_calculation.module import MealCalculationModule

async def setup_supabase():
    

@asynccontextmanager
async def lifespan(app: FastAPI):
    # setup
    environment: Environment = Environment()
    app.state.environment = environment

    meal_calculation_module: MealCalculationModule = MealCalculationModule(environment=environment)
    app.state.meal_calculation_module = meal_calculation_module
    yield
    # teardown
    
app: FastAPI = FastAPI(lifespan=lifespan)

