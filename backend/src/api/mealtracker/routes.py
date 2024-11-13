# builtin

# external
from fastapi import APIRouter, Request

# internal
from src.api.mealtracker.io import UserMealTrackingInput, UserMealTrackingOutput

meal_tracker_router: APIRouter = APIRouter(prefix="/meal_history", tags=["meal_history"])

@meal_tracker_router.post("/track_meal")
async def track_user_meal(input: UserMealTrackingInput, request: Request) -> UserMealTrackingOutput:
    supabase_client = request.app.state.supabase_client

    # this part supposed to get the shit from the users meal history for comparing
    result = supabase_client.table("UserMeals").select("*").eq("user_id", input.user_id).in_("option_id", [item.option_id for item in input.meal_items]).execute()

    existing_records = {record["option_id"]: record for record in result.data}
