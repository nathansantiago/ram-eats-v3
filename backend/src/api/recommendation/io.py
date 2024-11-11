# builtin 
from typing import Dict, Any

# external
from pydantic import BaseModel

# internal

class RecommendationRecommendMealInput(BaseModel):
    user_id: str

class RecommendationRecommendMealOutput(BaseModel):
    meal_information: Dict[str, Dict[str, Any]]