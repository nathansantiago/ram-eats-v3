#builtin

#external
from pydantic import BaseModel

#internal

class UserMealTrackingInput(BaseModel):
    user_uid: str
    option_id: int
    number_of_servings: int
    

class UserMealTrackingOutput(BaseModel):
    success: bool
    message: str


class UserDailyIntakeInput(BaseModel):
    user_uid: str
    date: str


class UserDailyIntakeOutput(BaseModel):
    date: str
    calories: int
    protein: int
    carbs: int