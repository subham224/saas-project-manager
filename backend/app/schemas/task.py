from typing import Optional
from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo" # todo, in_progress, done

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class Task(TaskBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
