import enum
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    
    # Relationships using strings
    projects = relationship("Project", back_populates="organization")
    members = relationship("OrganizationMember", back_populates="organization")

class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, default=UserRole.MEMBER)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    
    # Relationships using strings
    user = relationship("User", back_populates="organizations")
    organization = relationship("Organization", back_populates="members")
