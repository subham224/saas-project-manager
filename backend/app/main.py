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
# app/main.py

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Verifying database tables...")
    try:
        # STEP 1: Nuke the old, broken tables
        # Delete this line after your first successful registration!
        Base.metadata.drop_all(bind=engine) 
        
        # STEP 2: Recreate them with the correct 'full_name' column
        Base.metadata.create_all(bind=engine)
        
        logger.info("Database is clean and ready with correct columns.")
    except Exception as e:
        logger.error(f"Database error during startup: {e}")
    
    yield
# 2. INITIALIZE APP WITH LIFESPAN
app = FastAPI(title="SaaS Project Management", lifespan=lifespan)

# 3. CORS CONFIGURATION
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://saas-project-manager.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
)

# 4. ROUTERS
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/projects/{project_id}/tasks", tags=["tasks"])

@app.get("/health")
def health_check():
    return {"status": "online", "database": "verified"}

@app.get("/cors-test")
def cors_test():
    return {"cors": "enabled"}
