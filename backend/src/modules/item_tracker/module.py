#builtin
import re

#external
from supabase import AsyncClient
from fastapi import HTTPException
from datetime import date

#internal
from src.globals.environment import Environment
from src.api.nutrition_tracker.io import UserMealTrackingInput, UserDailyIntakeInput, UserDailyIntakeOutput


class ItemTrackerModule:
    def __init__ (self, environment: Environment, supabase: AsyncClient):
        self.environment: Environment = environment
        self.supabase: AsyncClient = supabase


    def track_food_item(self, input: UserMealTrackingInput) -> None:
        response = self.supabase.from_("UserMeals").select("*").eq("user_uid", input.user_uid)\
        .eq("option_id", input.option_id).execute()
            
        if response.data:
            current_servings = response.data[0]["number_of_servings"]
            new_servings = current_servings + input.number_of_servings
            self.supabase.from_("UserMeals").update({
                "number_of_servings": new_servings
            }).eq("user_uid", input.user_uid).eq("option_id", input.option_id).execute()
        else:
            self.supabase.from_("UserMeals").insert({
                "user_uid": input.user_uid,
                "option_id": input.option_id, 
                "number_of_servings": input.number_of_servings
            }).execute()

    
    def track_daily_intakes(self, input: UserMealTrackingInput) -> None:
        try:    
            nutrient_response = self.supabase.from_("NutrientInformation").select("*").eq("option_id", input.option_id).execute()

            if not nutrient_response.data:
                raise HTTPException(status_code=404, detail="Nutrient information not found")
            
            calories = protein = carbs = 0

            for nutrient in nutrient_response.data:
                value_str = re.sub(r'[^0-9.]', '', str(nutrient["nutrient_value"]))
                if not value_str:
                    continue

                value = float(value_str)
                nutrient_name = nutrient["nutrient_name"].lower()

                # Changed to lowercase in comparisons
                if "calories" in nutrient_name:
                    calories = int(round(value * input.number_of_servings))
                elif "protein" in nutrient_name:
                    protein = int(round(value * input.number_of_servings))
                elif "totalcarbohydrate" in nutrient_name:
                    carbs = int(round(value * input.number_of_servings))
            
            today = date.today().isoformat()

            existing_response = self.supabase.from_("UserDailyIntakes").select("*")\
                .eq("user_uid", input.user_uid)\
                .eq("date", today).execute()

            if existing_response.data:
                existing_data = existing_response.data[0]
                new_calories = existing_data["calories_consumed"] + calories
                new_protein = existing_data["protein_consumed"] + protein
                new_carbs = existing_data["carbs_consumed"] + carbs

                self.supabase.from_("UserDailyIntakes").update({
                    "calories_consumed": new_calories,
                    "protein_consumed": new_protein,
                    "carbs_consumed": new_carbs
                }).eq("user_uid", input.user_uid).eq("date", today).execute()
            else:
                self.supabase.from_("UserDailyIntakes").insert({
                    "user_uid": input.user_uid,
                    "date": today,
                    "calories_consumed": calories,
                    "protein_consumed": protein,
                    "carbs_consumed": carbs
                }).execute()

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        

    def get_daily_intakes(self, input: UserDailyIntakeInput) -> UserDailyIntakeOutput:
        date = input.date
        response = self.supabase.from_("UserDailyIntakes").select("*").eq("user_uid", input.user_uid).eq("date", date).execute()
        
        if not response.data:
            raise HTTPException(status_code= 404, detail = "No intake data found for the given date or user")
        
        return UserDailyIntakeOutput(
            date = response.data[0]["date"],
            calories = response.data[0]["calories_consumed"],
            protein = response.data[0]["protein_consumed"],
            carbs = response.data[0]["carbs_consumed"]
        )