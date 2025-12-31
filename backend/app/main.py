from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import engine, Base
from app.api.endpoints import auth, organizations, projects, tasks
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 1. LIFESPAN HANDLER (The modern way to handle startup)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs when the app starts
    logger.info("Verifying database tables...")
    try:
        # Creates tables in PostgreSQL if they don't exist
        Base.metadata.create_all(bind=engine)
        logger.info("Database is ready.")
    except Exception as e:
        logger.error(f"Database error during startup: {e}")
    
    yield  # The app stays running here
    
    # This runs when the app shuts down
    logger.info("Shutting down...")

# 2. INITIALIZE APP WITH LIFESPAN
app = FastAPI(title="SaaS Project Management", lifespan=lifespan)

# 3. CORS CONFIGURATION
origins = [
    "https://saas-project-manager.vercel.app",
    "http://localhost:3000","*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. ROUTERS
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/projects/{project_id}/tasks", tags=["tasks"])

@app.get("/health")
def health_check():
    return {"status": "online", "database": "verified"}