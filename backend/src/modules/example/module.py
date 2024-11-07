# builtin

# external

# internal
from src.globals.environment import Environment

class ExampleModule:
    def __init__(self, environment: Environment):
        self.environment: Environment = environment