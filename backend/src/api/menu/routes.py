# builtin

# external
from fastapi import APIRouter, Request

# internal
from src.api.menu.io import MenuGetMenuOutput
from src.modules.meal_calculation.module import MealCalculationModule

menu_router: APIRouter = APIRouter(prefix="/menu", tags=["menu"])

@menu_router.get("/get-menu")
async def menu_get_menu(request: Request) -> MenuGetMenuOutput:
    meal_calculation_module: MealCalculationModule = request.app.state.meal_calculation_module

    simply_prepared_station_id = meal_calculation_module.get_station_id("Simply Prepared Grill", "Lunch")
    kitchen_table_station_id = meal_calculation_module.get_station_id("The Kitchen Table", "Lunch")

    simply_prepared_menu = meal_calculation_module.get_menu_data(simply_prepared_station_id)
    kitchen_table_menu = meal_calculation_module.get_menu_data(kitchen_table_station_id)

    categorized_simply_prepared = meal_calculation_module.categorize_items(simply_prepared_menu)
    categorized_kitchen_table = meal_calculation_module.categorize_items(kitchen_table_menu)

    return MenuGetMenuOutput(
        meal_information={
            "Simply Prepared Grill": categorized_simply_prepared,
            "Kitchen Table": categorized_kitchen_table
        }
    )
