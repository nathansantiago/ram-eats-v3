#builtin

#external
from supabase import AsyncClient
from fastapi import HTTPException

#internal
from src.globals.environment import Environment
from src.api.nutrition_tracker.io import UserMealTrackingInput, UserMealTrackingOutput

class ItemTrackerModule:
    def __init__ (self, environment: Environment, supabase: AsyncClient):
        self.environment: Environment = environment
        self.supabase: AsyncClient = supabase


    async def track_food_item(self, input: UserMealTrackingInput) -> UserMealTrackingOutput:
        try:
            response = await self.supabase.from_("UserMeals").select("*")\
                .eq("user_uid", input.user_uid)\
                .eq("option_id", input.option_id)\
                .execute()
            
            if response.data:
                current_servings = response.data[0]["number_of_servings"]
                new_servings = current_servings + input.number_of_servings
                await self.supabase.from_("UserMeals").update({
                    "number_of_servings": new_servings
                })\
                .eq("user_uid", input.user_uid)\
                .eq("option_id", input.option_id)\
                .execute()
            else:
                await self.supabase.from_("UserMeals").insert({
                    "user_uid": input.user_uid,
                    "option_id": input.option_id, 
                    "number_of_servings": input.number_of_servings
                }).execute()

            return UserMealTrackingOutput(
                success=True,
                message="Meal tracking updated successfully"
            )

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))