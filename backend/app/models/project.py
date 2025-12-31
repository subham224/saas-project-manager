from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    
    # Relationships
    organization = relationship("Organization", back_populates="projects")
    tasks = relationship("Task", back_populates="project")
