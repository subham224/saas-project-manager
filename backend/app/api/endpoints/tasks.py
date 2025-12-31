from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import deps
from app.models.task import Task
from app.schemas.task import TaskCreate, Task as TaskSchema, TaskUpdate

router = APIRouter()

@router.get("/", response_model=List[TaskSchema])
def read_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    return db.query(Task).filter(Task.project_id == project_id).all()

@router.post("/", response_model=TaskSchema)
def create_task(
    project_id: int,
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    task_data = task_in.dict()
    task_data.pop("project_id", None) 
    db_obj = Task(**task_data, project_id=project_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.patch("/{task_id}", response_model=TaskSchema)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}
