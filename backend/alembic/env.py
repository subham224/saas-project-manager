from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import sys
import os
# ... previous imports ...
from app.models.user import User
from app.models.organization import Organization, OrganizationMember
from app.models.task import Project, Task  # <--- ADD THIS LINE
# --------------------------------------
# 1. Add the project root to the path
#    (This lets us import from "app")
# --------------------------------------
sys.path.append(os.getcwd())

# --------------------------------------
# 2. Import your configuration and models
# --------------------------------------
from app.core.config import settings
from app.models.base import Base
# MUST import all models here so Alembic detects them
from app.models.user import User
from app.models.organization import Organization, OrganizationMember

# this is the Alembic Config object
config = context.config

# --------------------------------------
# 3. OVERRIDE the Database URL
#    (We take the URL from our .env settings)
# --------------------------------------
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --------------------------------------
# 4. Set the Metadata
#    (This tells Alembic what the tables *should* look like)
# --------------------------------------
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()