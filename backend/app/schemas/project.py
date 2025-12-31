from typing import Optional
from pydantic import BaseModel

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    organization_id: int

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True
