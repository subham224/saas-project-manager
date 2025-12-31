from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, Task as TaskSchema, TaskUpdate

router = APIRouter()

@router.get("/", response_model=List[TaskSchema])
def read_tasks(project_id: int, db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.project_id == project_id).all()

@router.post("/", response_model=TaskSchema)
def create_task(project_id: int, task_in: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**task_in.dict(), project_id=project_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/{task_id}", response_model=TaskSchema)
def update_task(project_id: int, task_id: int, task_in: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update fields if provided
    if task_in.title is not None:
        task.title = task_in.title
    if task_in.description is not None:
        task.description = task_in.description
    if task_in.status is not None:
        task.status = task_in.status
        
    db.commit()
    db.refresh(task)
    return task

# --- NEW DELETE ENDPOINT ---
@router.delete("/{task_id}")
def delete_task(project_id: int, task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return {"ok": True}
