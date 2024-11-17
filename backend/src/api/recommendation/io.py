# builtin 
from typing import Dict, Any

# external
from pydantic import BaseModel

# internal

class RecommendationRecommendMealInput(BaseModel):
    user_id: str

class RecommendationRecommendMealOutput(BaseModel):
    meal_information: Dict[str, Dict[str, Any]]

class IntakeGoalsInput(BaseModel):
    user_uid: str

class UpdateIntakeGoalsOutput(BaseModel):
    success: bool
    message: str

class GetIntakeGoalsOutput(BaseModel):
    intake_goals: Dict[str, Any]