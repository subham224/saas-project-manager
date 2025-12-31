from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth, organizations, projects, tasks
from app.core.database import Base, engine

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SaaS Project Manager")

# --- CORS FIX IS HERE ---
# We allow ["*"] which means "Any website can talk to this API".
# This is the easiest way to make Vercel work immediately.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(organizations.router, prefix="/organizations", tags=["Organizations"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(tasks.router, prefix="/projects/{project_id}/tasks", tags=["Tasks"])

@app.get("/")
def read_root():
    return {"message": "SaaS Backend is Live 🚀"}
