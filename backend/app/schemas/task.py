from typing import Optional
from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "todo"
    project_id: int

class TaskCreate(TaskBase):
    pass

# ADD THIS: This is what was missing
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class Task(TaskBase):
    id: int

    class Config:
        from_attributes = True
