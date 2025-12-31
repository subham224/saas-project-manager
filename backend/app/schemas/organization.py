from typing import List, Optional
from pydantic import BaseModel

# Shared properties
class OrganizationBase(BaseModel):
    name: str
    description: Optional[str] = None

# Properties to receive via API on creation
class OrganizationCreate(OrganizationBase):
    pass

# Properties to receive via API on update
class OrganizationUpdate(OrganizationBase):
    pass

# Properties to return to client
class Organization(OrganizationBase):
    id: int

    class Config:
        from_attributes = True
