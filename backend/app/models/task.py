# from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum
# from sqlalchemy.orm import relationship
# import enum
# from app.models.base import Base, TimestampMixin

# class TaskStatus(str, enum.Enum):
#     TODO = "TODO"
#     IN_PROGRESS = "IN_PROGRESS"
#     DONE = "DONE"

# class Project(Base, TimestampMixin):
#     __tablename__ = "projects"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     description = Column(Text, nullable=True)
    
#     # RELATIONS
#     # A project belongs to an Organization
#     organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    
#     # A project has many tasks
#     tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")

# class Task(Base, TimestampMixin):
#     __tablename__ = "tasks"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, nullable=False)
#     description = Column(Text, nullable=True)
#     status = Column(String, default=TaskStatus.TODO, nullable=False)
    
#     # RELATIONS
#     project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
#     project = relationship("Project", back_populates="tasks")
    
#     # Assignee (Optional - a task might not be assigned yet)
#     assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)

from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base

class TaskStatus(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    status = Column(String, default=TaskStatus.TODO) # Stored as string for simplicity
    
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    # Relationships
    project = relationship("Project", back_populates="tasks")