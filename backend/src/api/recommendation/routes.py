# builtin

# external
from fastapi import APIRouter, Request

# internal
from src.modules.meal_calculation.module import MealCalculationModule
from src.api.recommendation.io import RecommendationRecommendMealInput, RecommendationRecommendMealOutput, IntakeGoalsInput, UpdateIntakeGoalsOutput, GetIntakeGoalsOutput

recommendation_router: APIRouter = APIRouter(prefix="/recommendation", tags=["recommendation"])

@recommendation_router.post("/recommend-meal")
async def recommendation_recommend_meal(input: RecommendationRecommendMealInput, request: Request) -> RecommendationRecommendMealOutput:
    meal_calculation_module: MealCalculationModule = request.app.state.meal_calculation_module
    user_data = meal_calculation_module.get_user_data(input.user_id)
    simply_prepared_station_id = meal_calculation_module.get_station_id("Simply Prepared Grill", "Lunch")
    kitchen_table_station_id = meal_calculation_module.get_station_id("The Kitchen Table", "Lunch")

    simply_prepared_menu = meal_calculation_module.get_menu_data(simply_prepared_station_id)
    kitchen_table_menu = meal_calculation_module.get_menu_data(kitchen_table_station_id)

    categorized_simply_prepared = meal_calculation_module.categorize_items(simply_prepared_menu)
    categorized_kitchen_table = meal_calculation_module.categorize_items(kitchen_table_menu)

    simply_prepared_meal = meal_calculation_module.calculate_meal(user_data, categorized_simply_prepared)
    kitchen_table_meal = meal_calculation_module.calculate_meal(user_data, categorized_kitchen_table)

    return RecommendationRecommendMealOutput(
        meal_information={
            "Simply Prepared Grill": simply_prepared_meal,
            "Kitchen Table": kitchen_table_meal
        }
    )


@recommendation_router.post("/update-intake-goals")
async def update_intake_goals(input: IntakeGoalsInput, request: Request) -> UpdateIntakeGoalsOutput:
    meal_calculation_module: MealCalculationModule = request.app.state.meal_calculation_module
    meal_calculation_module.update_intake_amounts(input.user_uid)
    return UpdateIntakeGoalsOutput(
        success = True,
        message = "Intake goals updated"
    )


@recommendation_router.get("/get-intake-goals")
async def get_intake_goals(input: IntakeGoalsInput, request: Request) -> GetIntakeGoalsOutput:
    meal_calculation_module: MealCalculationModule = request.app.state.meal_calculation_module
    intake_goals: dict[str, any] = meal_calculation_module.get_intake_values(input.user_uid)
    return GetIntakeGoalsOutput(
        intake_goals = intake_goals
    )