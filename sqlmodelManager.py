import os 
from uuid import uuid4
BASE_DIR = __file__.replace("sqlmodelManager.py", "")
app_folder = os.path.join(BASE_DIR, "app")
installer = ""
database_url = ""

def createNew():
    global BASE_DIR
    global app_folder
    global installer
    global database_url
    if not os.path.exists(app_folder):
        os.makedirs(app_folder)
    if not os.path.exists(os.path.join(BASE_DIR, "migrations")):
        os.makedirs(os.path.join(BASE_DIR, "migrations"))
    if not os.path.exists(os.path.join(BASE_DIR,"migrations", "versions")):
        os.makedirs(os.path.join(BASE_DIR,"migrations", "versions"))
    with open(os.path.join(app_folder, "authentication.py"), "w") as authFile:
        authFile.write('''import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
MINUTES = 30 

class AuthHandler():
    security = HTTPBearer()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    secret = os.environ.get("SECRET")

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    def encode_token(self, user_id):
        payload = {
            'exp': datetime.utcnow() + timedelta(days=0, minutes=MINUTES),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm='HS256'
        )

    def decode_token(self, token):
        try:
            payload = jwt.decode(token, self.secret, algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail='Signature has expired')
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=401, detail='Invalid token')

    def auth_wrapper(self, auth: HTTPAuthorizationCredentials = Security(security)):
        return self.decode_token(auth.credentials)
    
auth_handler = AuthHandler()        
"""
::: to encode a token  -> 
token = auth_handler.encode_token(user['username'])

::: jwt protected route
def protected(username=Depends(auth_handler.auth_wrapper)):
    return { 'name': username }
"""
''')

    with open(os.path.join(BASE_DIR, ".env"), "w") as envFile:
        envFile.write(f"""DATABASE_URL = {database_url}
SECRET = {str(uuid4())}""")

    with open(os.path.join(app_folder, "models.py"), "w") as modelFile:
        modelFile.write("""from sqlmodel import SQLModel, Field

#class User(SQLModel, table=True):
#    ''' this is an example user model for sqlmodel'''
#    id: int = Field(default=None, primary_key=True)
#    name: str
#    email: str
    
""")
    with open(os.path.join(app_folder, "db.py"), "w") as dbFile:
        dbFile.write("""import os

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from dotenv import load_dotenv
load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, echo=True, future=True)


async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
""")
    with open(os.path.join(app_folder, "main.py"), "w") as mainFile:
        mainFile.write("""from fastapi import FastAPI

from app.db import init_db
from app.models import *

app = FastAPI()


@app.on_event("startup")
async def on_startup():
    pass
    # init_db()       
""")


    with open(os.path.join(BASE_DIR, "migrations", "script.py.mako"), "w") as makoScript:
        makoScript.write('''"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
import sqlalchemy_utils
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade() -> None:
    ${upgrades if upgrades else "pass"}


def downgrade() -> None:
    ${downgrades if downgrades else "pass"}
''')

    with open(os.path.join(BASE_DIR, "alembic.ini"), "w") as alembicFile:
        alembicFile.write('''# A generic, single database configuration.

[alembic]
# path to migration scripts
script_location = migrations

# template used to generate migration file names; The default value is %%(rev)s_%%(slug)s
# Uncomment the line below if you want the files to be prepended with date and time
# file_template = %%(year)d_%%(month).2d_%%(day).2d_%%(hour).2d%%(minute).2d-%%(rev)s_%%(slug)s

# sys.path path, will be prepended to sys.path if present.
# defaults to the current working directory.
prepend_sys_path = .

# timezone to use when rendering the date within the migration file
# as well as the filename.
# If specified, requires the python-dateutil library that can be
# installed by adding `alembic[tz]` to the pip requirements
# string value is passed to dateutil.tz.gettz()
# leave blank for localtime
# timezone =

# max length of characters to apply to the
# "slug" field
# truncate_slug_length = 40

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false

# set to 'true' to allow .pyc and .pyo files without
# a source .py file to be detected as revisions in the
# versions/ directory
# sourceless = false

# version location specification; This defaults
# to migrations/versions.  When using multiple version
# directories, initial revisions must be specified with --version-path.
# The path separator used here should be the separator specified by "version_path_separator" below.
# version_locations = %(here)s/bar:%(here)s/bat:migrations/versions

# version path separator; As mentioned above, this is the character used to split
# version_locations. The default within new alembic.ini files is "os", which uses os.pathsep.
# If this key is omitted entirely, it falls back to the legacy behavior of splitting on spaces and/or commas.
# Valid values for version_path_separator are:
#
# version_path_separator = :
# version_path_separator = ;
# version_path_separator = space
version_path_separator = os  # Use os.pathsep. Default configuration used for new projects.

# the output encoding used when revision files
# are written from script.py.mako
# output_encoding = utf-8

sqlalchemy.url = '''+ database_url +'''


[post_write_hooks]
# post_write_hooks defines scripts or Python functions that are run
# on newly generated revision scripts.  See the documentation for further
# detail and examples

# format using "black" - use the console_scripts runner, against the "black" entrypoint
# hooks = black
# black.type = console_scripts
# black.entrypoint = black
# black.options = -l 79 REVISION_SCRIPT_FILENAME

# Logging configuration
[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S''')
        

    with open(os.path.join(BASE_DIR, "migrations", "env.py"), "w") as envFile:
        envFile.write('''import asyncio
from logging.config import fileConfig
from logging import Logger
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from sqlmodel import SQLModel    
from alembic import context
from app.models import *
# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = SQLModel.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

# https://alembic.sqlalchemy.org/en/latest/autogenerate.html#affecting-the-rendering-of-types-themselves
def render_item(type_, obj, autogen_context):
    """Apply rendering for custom sqlalchemy types"""
    if type_ == "type":
        module_name =  obj.__class__.__module__
        if module_name.startswith("sqlalchemy_utils."):
            return render_sqlalchemy_utils_type(obj, autogen_context)

    # render default
    return False

def render_sqlalchemy_utils_type(obj, autogen_context):
    class_name = obj.__class__.__name__
    import_statement = f"from sqlalchemy_utils.types import {class_name}"
    autogen_context.imports.add(import_statement)
    if class_name == 'ChoiceType':
        return render_choice_type(obj, autogen_context)
    return f"{class_name}()"

def render_choice_type(obj, autogen_context):
    choices = obj.choices
    if obj.type_impl.__class__.__name__ == 'EnumTypeImpl':
        choices = obj.type_impl.enum_class.__name__
        import_statement = f"from app.models import {choices}"
        autogen_context.imports.add(import_statement)
    impl_stmt = f"sa.{obj.impl.__class__.__name__}()"
    return f"{obj.__class__.__name__}(choices={choices}, impl={impl_stmt})"

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                print('No changes in schema detected.')
    context.configure(connection=connection, 
            target_metadata=target_metadata,
            process_revision_directives=process_revision_directives,
            render_item=render_item,
        )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )


    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

''')

def main():
    global BASE_DIR
    global app_folder
    global installer
    global database_url

    print("#" * 50)
    print(" " * 17, "SQLModel MANAGER")
    print("#"* 50)
    installer = input("pkg manager (e.g 'python -m pip' , 'pipenv', 'apt'):: ")
    database_url = input("enter your database connection with format -> (driver://username:password@localhost/dbname ):")
    print(f"running : {installer} install asyncpg fastapi sqlmodel uvicorn alembic")
    if installer.strip() != "":
        os.system(f"{installer} install asyncpg fastapi sqlmodel uvicorn alembic")
    createNew()
    print("#"* 50)
    print(" "*21, "SUCCESS ")
    print("#"* 50)
    print("after updating your 'app/models.py' file with yourprefered model. ")
    print("run: ", 'alembic revision --autogenerate -m "init"')
    print("\nto make the migrations run: ", "alembic upgrade head\n")
    print('\nto create a new migration:  alembic revision --autogenerate -m "add year"')
    print("")
    print("Update the upgrade and downgrade functions from the auto generated migration file after every migration")
    print("""\nhere is an example
def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('song', sa.Column('year', sa.Integer(), nullable=True))
    op.create_index(op.f('ix_song_year'), 'song', ['year'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_song_year'), table_name='song')
    op.drop_column('song', 'year')
    # ### end Alembic commands ### 
""")


    
if __name__ == "__main__":
    main()