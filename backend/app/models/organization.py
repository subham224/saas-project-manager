import enum
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    OWNER = "owner"  # Added this!
    ADMIN = "admin"
    MEMBER = "member"

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

    members = relationship("OrganizationMember", back_populates="organization")
    projects = relationship("Project", back_populates="organization")

class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    role = Column(String, default=UserRole.MEMBER)

    user = relationship("User", back_populates="organizations")
    organization = relationship("Organization", back_populates="members")
