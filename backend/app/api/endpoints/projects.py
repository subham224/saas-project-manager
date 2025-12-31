from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import deps
from app.models.project import Project
from app.schemas.project import ProjectCreate, Project as ProjectSchema

router = APIRouter()

@router.get("/", response_model=List[ProjectSchema])
def read_projects(
    organization_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    # Filter projects by the organization ID
    projects = db.query(Project).filter(Project.organization_id == organization_id).all()
    return projects

@router.post("/", response_model=ProjectSchema)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    db_obj = Project(**project_in.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
