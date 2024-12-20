# builtin
import re

# external
from supabase import AsyncClient
from fastapi import HTTPException

# internal
from src.globals.environment import Environment

class MealCalculationModule:
    def __init__(self, environment: Environment, supabase: AsyncClient):
        self.environment: Environment = environment
        self.supabase: AsyncClient = supabase

    def get_user_data(self, user_uid: str) -> dict[str, any]:
        response = self.supabase.table('Users').select("*").eq('user_uid', user_uid).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return response.data[0]

    def get_station_id(self, station_name: str, meal_time: str) -> int:
        response = (
            self.supabase.table('FoodStations')
            .select("station_id, meal_id")
            .eq("station_name", station_name)
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=404, detail="Station not found " + station_name)

        meal_id = self.get_meal_id(meal_time)
        station = next((record for record in response.data if record['meal_id'] == meal_id), None)

        if not station:
            raise HTTPException(status_code=404, detail=f"Station for {meal_time} not found")

        return station['station_id']
    
    def get_meal_id(self, meal_time: str) -> int:
        meal_response = self.supabase.table('Meals').select("meal_id").eq("meal_name", meal_time).execute()
        if not meal_response.data:
            raise HTTPException(status_code=404, detail="Meal not found")

        return meal_response.data[0]['meal_id']

    def get_menu_data(self, station: int) -> list[dict[str, any]]:
        menu_response = self.supabase.table('MealsOptions').select("*").eq('station_id', station).execute()
        menu_data = menu_response.data

        option_ids = [item['option_id'] for item in menu_data]
        nutrient_response = self.supabase.table('NutrientInformation').select(
            "option_id, nutrient_name, nutrient_value"
        ).in_("option_id", option_ids).execute()
        nutrient_data = nutrient_response.data

        nutrient_dict = {}
        for item in nutrient_data:
            option_id = item['option_id']
            if option_id not in nutrient_dict:
                nutrient_dict[option_id] = {}
            nutrient_dict[option_id][item['nutrient_name']] = item['nutrient_value']

        filtered_menu_data = [
            {key: value for key, value in item.items() if key != 'ingredients'} for item in menu_data
        ]

        merged_menu_data = []
        for item in filtered_menu_data:
            option_id = item['option_id']
            if option_id in nutrient_dict:
                merged_item = {**item, **nutrient_dict[option_id]}
                merged_menu_data.append(merged_item)

        return merged_menu_data

    def categorize_items(self, menu: list[dict[str, any]]) -> list[dict[str, any]]:
        def convert_to_float(value: str) -> float:
            numeric_value = re.findall(r"[-+]?\d*\.\d+|\d+", value)
            return float(numeric_value[0]) if numeric_value else 0.0

        for item in menu:
            item["Protein"] = convert_to_float(item.get("Protein", "0"))
            item["Calories"] = convert_to_float(item.get("Calories", "0"))
            item["TotalFat"] = convert_to_float(item.get("TotalFat", "0"))
            item["Iron"] = convert_to_float(item.get("Iron", "0"))
            item["Potassium"] = convert_to_float(item.get("Potassium", "0"))
            item["VitaminD"] = convert_to_float(item.get("VitaminD", "0"))

        # Function sorts menu items based on "healthiness" level
        categorized_menu = sorted(menu, key=lambda x: (
            -x["Protein"] / x["Calories"] if x["Calories"] > 0 else 0,
            x["TotalFat"],
            -x["Iron"],
            -x["Potassium"],
            -x["VitaminD"]
        ))
        return categorized_menu

    def calculate_daily_cal(self, user_data: dict[str, any]) -> int:
        user_data['height'] *= 2.54
        user_data['weight'] *= 0.453592

        pal = user_data['activity_level'] / 10

        if user_data['gender'] == False:
            bmr = 10 * user_data['weight'] + 6.25 * user_data['height'] - 5 * user_data['age'] + 5
        else:
            bmr = 10 * user_data['weight'] + 6.25 * user_data['height'] - 5 * user_data['age'] - 161
        
        maintenance_cal = round(bmr * pal)

        if user_data['fitness_goal'] == 0:
            daily_tot_cal = round(maintenance_cal * 1.11)
        elif user_data['fitness_goal'] == 2:
            daily_tot_cal = round(maintenance_cal * 0.89)
        else:
            daily_tot_cal = maintenance_cal

        return daily_tot_cal
    

    def update_intake_amounts(self, user_uid: str) -> dict[str, any]:
        user_data = self.get_user_data(user_uid)
        daily_cal = self.calculate_daily_cal(user_data)
        #TODO: Will need to tweak this amount to get it to a sweet spot
        daily_protein = int(round((0.23 * daily_cal) / 4))
        self.supabase.table('Users').update({
            'daily_calorie_goal': daily_cal,
            'daily_protein_intake': daily_protein
        }).eq('user_uid', user_uid).execute()
    

    def get_intake_values(self, user_uid: str) -> dict[str, any]:
        user_data = self.get_user_data(user_uid)
        daily_cal = user_data["daily_calorie_goal"]
        daily_protein = user_data["daily_protein_intake"]
        return {
            "calories": daily_cal,
            "protein": daily_protein
        }
        

    def calculate_meal(self, user_data: dict[str, any], menu: list[dict[str, any]]) -> dict[str, any]:
        #TODO: Potentially change this variable to pull the daily_cal directly from Users table in supabase
        daily_cal = self.calculate_daily_cal(user_data)
        meal_cal = (daily_cal * .90) // (user_data['meal_count'])
        meal_cal_lower = meal_cal - 25
        meal_cal_upper = meal_cal + 25
        protein_goal = 0.23 * meal_cal_upper
        carbs_goal = 0.52 * meal_cal_upper
        fats_goal = 0.25 * meal_cal_upper

        selected_items = {}
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fats = 0

        def convert_to_float(value: any) -> float:
            if isinstance(value, float):
                return value
            elif isinstance(value, str):
                numeric_value = re.findall(r"[-+]?\d*\.\d+|\d+", value)
                return float(numeric_value[0]) if numeric_value else 0.0
            else:
                return 0.0

        # Sort menu items by protein content in descending order
        menu = sorted(menu, key=lambda x: convert_to_float(x.get("Protein", "0")), reverse=True)

        while total_calories < meal_cal_lower:
            for item in menu:
                info = {
                    "Calories": convert_to_float(item.get("Calories", "0")),
                    "Protein": convert_to_float(item.get("Protein", "0")),
                    "TotalCarbohydrate": convert_to_float(item.get("TotalCarbohydrate", "0")),
                    "TotalFat": convert_to_float(item.get("TotalFat", "0"))
                }

                if (total_calories + info["Calories"]) <= meal_cal_upper \
                    and (total_protein + info["Protein"]) <= protein_goal \
                    and (total_carbs + info["TotalCarbohydrate"]) <= carbs_goal \
                    and (total_fats + info["TotalFat"]) <= fats_goal:
                    if item["option_name"] not in selected_items:
                        selected_items[item["option_name"]] = {"number_of_servings": 1}
                    else:
                        selected_items[item["option_name"]]["number_of_servings"] += 1

                    total_calories += info["Calories"]
                    total_protein += info["Protein"]
                    total_carbs += info["TotalCarbohydrate"]
                    total_fats += info["TotalFat"]

                    if total_calories >= meal_cal_lower:
                        break

        return {
            "selected_items": selected_items,
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_carbs": total_carbs,
            "total_fats": total_fats
        }