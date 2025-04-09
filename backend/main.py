from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from core.db import init_db
from backend.api.routes import router

# Initialize the FastAPI app
app = FastAPI(
    title="RPN Calculator API",
    description="A REST API for Reverse Polish Notation calculations",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router
app.include_router(router, prefix="/api")

# Initialize the database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {
        "message": "RPN Calculator API",
        "docs": "/docs",
        "version": "1.0.0"
    }
