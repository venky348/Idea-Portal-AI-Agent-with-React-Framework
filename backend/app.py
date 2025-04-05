# backend/app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.scoring import get_top_ideas

app = FastAPI(title="Idea Portal AI Agent")

# Allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Agent API is running"}

@app.get("/top-ideas/")
def top_ideas():
    return get_top_ideas()
