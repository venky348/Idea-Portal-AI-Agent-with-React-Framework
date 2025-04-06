# backend/app.py

from fastapi import Request, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.scoring import get_top_ideas, set_use_ai_mode
import json
from backend.llm_agent import generate_reasoning
from backend.config import ORIGINAL_DATASET_PATH

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

@app.post("/feedback/")
async def collect_feedback(request: Request):
    feedback_data = await request.json()
    with open("backend/data/feedback_log.json", "a") as f:
        json.dump(feedback_data, f)
        f.write("\n")
    return {"message": "Feedback recorded"}

@app.post("/generate-reasoning")
def generate_reasoning_endpoint():
    try:
        # Load original ideas
        with open(ORIGINAL_DATASET_PATH, "r") as f:
            ideas = json.load(f)

        # Generate AI reasoning
        for idea in ideas:
            idea["ai_reasoning"] = generate_reasoning(idea)

        # Save AI-enhanced dataset
        new_path = "backend/data/very_small_tech_with_ai_2.json"
        with open(new_path, "w") as f:
            json.dump(ideas, f, indent=2)

        # Switch to use the AI dataset
        set_use_ai_mode(True, new_path)

        return {"message": "AI reasoning generated and applied", "count": len(ideas)}

    except Exception as e:
        return {"error": str(e)}
