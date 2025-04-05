# backend/app.py

from fastapi import FastAPI, Query
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
def top_ideas(
    roi_weight: float = Query(0.4),
    alignment_weight: float = Query(0.3),
    impact_weight: float = Query(0.2),
    effort_weight: float = Query(0.1)
):
    return get_top_ideas(
        roi_weight=roi_weight,
        alignment_weight=alignment_weight,
        impact_weight=impact_weight,
        effort_weight=effort_weight
    )
