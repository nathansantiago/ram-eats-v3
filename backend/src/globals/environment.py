# builtin

# external
from pydantic_settings import BaseSettings, SettingsConfigDict

# internal

class Environment(BaseSettings):
    model_config: SettingsConfigDict = SettingsConfigDict(env_file=".env")
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str