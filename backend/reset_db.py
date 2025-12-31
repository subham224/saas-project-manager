from app.core.database import engine, Base
from app.models import user, organization, project, task

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Database reset complete!")
