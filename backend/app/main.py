from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
# 1. Import the task router here
from app.api.endpoints import auth, organizations, projects, tasks
# 2. Import the models so the database creates the tables
from app.models import user, organization, project, task

app = FastAPI(title="SaaS Project Manager API")

# --- CORS CONFIGURATION ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------------

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
app.include_router(
    projects.router, 
    prefix="/organizations/{organization_id}/projects", 
    tags=["projects"]
)

# 3. Add the Task Router
app.include_router(
    tasks.router,
    # This URL structure means: "Get tasks for this specific project"
    prefix="/projects/{project_id}/tasks",
    tags=["tasks"]
)

@app.get("/")
def health_check():
    return {
        "status": "healthy", 
        "app_name": "SaaS PM Tool",
        "mode": "dev"
    }