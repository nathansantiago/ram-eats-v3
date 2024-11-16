#builtin

#external
from pydantic import BaseModel

#internal

class UserMealTrackingInput(BaseModel):
    user_id: str
    option_id: int
    number_of_servings: int
    

class UserMealTrackingOutput(BaseModel):
    success: bool
    message: str