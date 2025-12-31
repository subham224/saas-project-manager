from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api import deps
# CORRECTED IMPORT: Project comes from models.project, not models.task
from app.models.project import Project 
from app.schemas.project import ProjectCreate, Project as ProjectSchema
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ProjectSchema])
def read_projects(
    organization_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    # Ensure user is part of this org
    deps.verify_user_in_org(organization_id, db, current_user)
    
    projects = db.query(Project).filter(Project.organization_id == organization_id).all()
    return projects

@router.post("/", response_model=ProjectSchema)
def create_project(
    organization_id: int,
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    # Ensure user is part of this org
    deps.verify_user_in_org(organization_id, db, current_user)
    
    project = Project(
        **project_in.dict(),
        organization_id=organization_id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
