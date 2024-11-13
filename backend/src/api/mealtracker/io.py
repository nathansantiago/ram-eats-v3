#builtin
from typing import List

#external
from pydantic import BaseModel

#internal

class MealItem(BaseModel):
    option_id: int
    servings: float

class UserMealTrackingInput(BaseModel):
    user_id: str
    meal_items: List[MealItem]

class UserMealTrackingOutput(BaseModel):
    success: bool
    message: str