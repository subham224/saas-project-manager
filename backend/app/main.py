from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.endpoints import auth, organizations, projects, tasks

# 1. Create database tables automatically on startup
# Note: In production, it's better to use Alembic, but this works for now.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SaaS Project Management API")

# 2. CORS Configuration
# Replace the URL below with your actual Vercel deployment URL
origins = [
    "https://saas-project-manager.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(organizations.router, prefix="/organizations", tags=["Organizations"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(tasks.router, prefix="/projects/{project_id}/tasks", tags=["Tasks"])

@app.get("/")
def read_root():
    return {"status": "API is running", "environment": "production"}