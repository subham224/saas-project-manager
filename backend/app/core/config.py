from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Using the Docker DB credentials
    DATABASE_URL: str = "postgresql://postgres:password123@localhost:5432/saas_db"
    SECRET_KEY: str = "your_permanent_secret_key_123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
