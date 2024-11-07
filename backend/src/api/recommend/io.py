# builtin 

# external
from pydantic import BaseModel

# internal

class RecommendationRecommendMealInput(BaseModel):
    user_id: str

class RecommendationRecommendMealOutput(BaseModel):
    meal_information: str