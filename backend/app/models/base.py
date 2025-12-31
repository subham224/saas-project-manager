# backend/app/models/base.py
from datetime import datetime
from sqlalchemy import Column, DateTime
from sqlalchemy.orm import declarative_base

# This is the base class for all our models
Base = declarative_base()

class TimestampMixin:
    """
    A mixin that adds created_at and updated_at columns to any table.
    Senior Tip: Always track when data was created/modified for auditing.
    """
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
