# builtin
from typing import Dict, Any

# external
from pydantic import BaseModel

# internal

class MenuGetMenuOutput(BaseModel):
    meal_information: Dict[str, list[Dict[str, Any]]]