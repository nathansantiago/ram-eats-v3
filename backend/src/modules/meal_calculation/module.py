# builtin
import re

# external

# internal
from src.globals.environment import Environment

class MealCalculationModule:
    def __init__(self, environment: Environment):
        self.environment: Environment = environment


    def categorize_items(menu: list[dict[str, any]]) -> list[dict[str, any]]:
        # Function to convert nutrient values to numbers
        def convert_to_float(value: str) -> float:
            numeric_value = re.findall(r"[-+]?\d*\.\d+|\d+", value)
            return float(numeric_value[0]) if numeric_value else 0.0

        # Convert nutrient values to numbers
        for item in menu:
            item["Protein"] = convert_to_float(item.get("Protein", "0"))
            item["Calories"] = convert_to_float(item.get("Calories", "0"))
            item["TotalFat"] = convert_to_float(item.get("TotalFat", "0"))
            item["Iron"] = convert_to_float(item.get("Iron", "0"))
            item["Potassium"] = convert_to_float(item.get("Potassium", "0"))
            item["VitaminD"] = convert_to_float(item.get("VitaminD", "0"))

        # Categorize items based on healthiness rating
        categorized_menu = sorted(menu, key=lambda x: (
            -x["Protein"] / x["Calories"] if x["Calories"] > 0 else 0,
            x["TotalFat"],
            -x["Iron"],
            -x["Potassium"],
            -x["VitaminD"]
        ))
        return categorized_menu

    def calculate_daily_cal(user_data: dict[str, any]) -> int:
        # Calculate BMR using Mifflin-St Jeor Equation
        user_data['height'] *= 2.54  # Convert height from inches to cm
        user_data['weight'] *= 0.453592  # Convert weight from lbs to kg

        pal = user_data['activity_level'] / 10

        if user_data['gender'] == False:
            # Calculate BMR for males
            bmr = 10 * user_data['weight'] + 6.25 * user_data['height'] - 5 * user_data['age'] + 5
        else:
            # Calculate BMR for females
            bmr = 10 * user_data['weight'] + 6.25 * user_data['height'] - 5 * user_data['age'] - 161
        
        # Calculate maintenance calories using BMR and activity level
        maintenance_cal = round(bmr * pal)

        if user_data['fitness_goal'] == 0:
            # Calculate daily caloric intake for bulking
            daily_tot_cal = round(maintenance_cal * 1.11)
        elif user_data['fitness_goal'] == 2:
            # Calculate daily caloric intake for cutting
            daily_tot_cal = round(maintenance_cal * 0.89)
        else:
            # Daily calories for maintaining weight
            daily_tot_cal = maintenance_cal

        return daily_tot_cal

    def calculate_meal(self, user_data: dict[str, any], menu: list[dict[str, any]]) -> dict[str, any]:
        daily_cal = self.calculate_daily_cal(user_data)
        meal_cal = daily_cal // (user_data['meal_count'])
        meal_cal_lower = meal_cal - 50
        meal_cal_upper = meal_cal + 50
        protein_goal = 0.25 * meal_cal_upper  # Slightly reduced protein percentage
        carbs_goal = 0.50 * meal_cal_upper  # Adjusted carbohydrate percentage
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

                    # Break the loop if we are within the target range
                    if total_calories >= meal_cal_lower:
                        break

        return {
            "selected_items": selected_items,
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_carbs": total_carbs,
            "total_fats": total_fats
        }