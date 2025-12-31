from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api import deps
from app.models.organization import Organization, OrganizationMember, UserRole
from app.schemas.organization import Organization as OrganizationSchema, OrganizationCreate

router = APIRouter()

@router.get("/", response_model=List[OrganizationSchema])
def read_organizations(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve organizations the current user belongs to.
    """
    return (
        db.query(Organization)
        .join(OrganizationMember)
        .filter(OrganizationMember.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )

@router.post("/", response_model=OrganizationSchema)
def create_organization(
    org_in: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Create new organization.
    """
    # 1. Create the Organization
    org = Organization(name=org_in.name, description=org_in.description)
    db.add(org)
    db.commit()
    db.refresh(org)

    # 2. Add the Creator as the "Owner"
    member = OrganizationMember(
        user_id=current_user.id,
        organization_id=org.id,
        role=UserRole.OWNER
    )
    db.add(member)
    db.commit()
    
    return org
