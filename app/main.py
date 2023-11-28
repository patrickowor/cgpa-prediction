from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import init_db
from app.models import *
from app.views import app as views_router

app = FastAPI()

app.add_middleware(
CORSMiddleware,
allow_origins=["*"], # Allows all origins
allow_credentials=True,
allow_methods=["*"], # Allows all methods
allow_headers=["*"], # Allows all headers
)


app.include_router(views_router)

# @app.on_event("startup")
# async def on_startup():
#     pass
#     # init_db()       
