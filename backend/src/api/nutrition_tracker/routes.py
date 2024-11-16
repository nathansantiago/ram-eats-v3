# builtin

# external
from fastapi import APIRouter, Request

# internal
from src.api.nutrition_tracker.io import UserMealTrackingInput, UserMealTrackingOutput

meal_tracker_router: APIRouter = APIRouter(prefix="/meal_history", tags=["meal_history"])