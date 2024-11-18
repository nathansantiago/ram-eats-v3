# builtin

# external
from fastapi import APIRouter, Request

# internal
from src.modules.item_tracker.module import ItemTrackerModule
from src.api.nutrition_tracker.io import UserMealTrackingInput, UserMealTrackingOutput, UserDailyIntakeInput, UserDailyIntakeOutput

meal_tracker_router: APIRouter = APIRouter(prefix="/nutrition_tracker", tags=["meal_history"])

@meal_tracker_router.post("/track-item")
async def track_food_item(input: UserMealTrackingInput, request: Request) -> UserMealTrackingOutput:
    item_tracker_module: ItemTrackerModule = request.app.state.item_tracker_module
    item_tracker_module.track_food_item(input)
    item_tracker_module.track_daily_intakes(input)

    return UserMealTrackingOutput(
        success = True,
        message = "Item tracked successfully, and daily intakes updated"
    )

@meal_tracker_router.post("/get-daily-intake-values")
async def get_daily_intakes(input: UserDailyIntakeInput, request: Request) -> UserDailyIntakeOutput:
    item_tracker_module: ItemTrackerModule = request.app.state.item_tracker_module
    return item_tracker_module.get_daily_intakes(input)