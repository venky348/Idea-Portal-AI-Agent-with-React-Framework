# backend/app.py

from fastapi import Request, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from backend.llm_agent import generate_reasoning as generate_ai_reasoning, select_top_ideas_with_ai
from backend.react_agent import generate_reasoning as generate_rule_reasoning
from backend.config import ORIGINAL_DATASET_PATH, AI_DATASET_PATH
from backend.scoring import get_top_ideas
from backend.insights import get_insights_summary
from fastapi.responses import FileResponse
import matplotlib.pyplot as plt
import pandas as pd


app = FastAPI(title="Idea Portal AI Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Internal state
USE_AI_MODE = False

@app.get("/")
def root():
    return {"message": "AI Agent API is running"}

@app.get("/top-ideas/")
def top_ideas(
    roi_weight: float = Query(0.4),
    alignment_weight: float = Query(0.3),
    impact_weight: float = Query(0.2),
    effort_weight: float = Query(0.1),
):
    return get_top_ideas(
        roi_weight=roi_weight,
        alignment_weight=alignment_weight,
        impact_weight=impact_weight,
        effort_weight=effort_weight,
        use_ai=USE_AI_MODE
    )

@app.post("/feedback/")
async def collect_feedback(request: Request):
    feedback_data = await request.json()
    with open("backend/data/feedback_log.json", "a") as f:
        json.dump(feedback_data, f)
        f.write("\n")
    return {"message": "Feedback recorded"}

@app.post("/generate-reasoning")
def generate_reasoning():
    import os
    try:
        if not os.path.exists(AI_DATASET_PATH):
            with open(ORIGINAL_DATASET_PATH, "r") as f:
                ideas = json.load(f)

            for idea in ideas:
                idea["ai_reasoning"] = generate_ai_reasoning(idea)
                idea["react_reasoning"] = generate_rule_reasoning(idea)

            with open(AI_DATASET_PATH, "w") as f:
                json.dump(ideas, f, indent=2)

            print("✅ AI dataset created at:", AI_DATASET_PATH)
        else:
            print("⚠️ AI dataset already exists, skipping regeneration.")

        return {"message": "Reasoning ready", "path": AI_DATASET_PATH}

    except Exception as e:
        return {"error": str(e)}

class AIModeRequest(BaseModel):
    mode: str

@app.post("/set-ai-mode")
def set_ai_mode(req: AIModeRequest):
    global USE_AI_MODE
    if req.mode == "ai":
        if not os.path.exists(AI_DATASET_PATH):
            return {"error": "AI reasoning file not found. Please generate reasoning first."}
        USE_AI_MODE = True
    elif req.mode == "rule":
        USE_AI_MODE = False
    else:
        return {"error": "Invalid mode. Use 'ai' or 'rule'."}
    return {"message": f"Mode set to {req.mode}"}

@app.get("/ai-top-ideas-direct/")
def ai_top_ideas_direct():
    try:
        if not os.path.exists(AI_DATASET_PATH):
            return {"error": "AI dataset not found. Please generate reasoning first."}

        with open(AI_DATASET_PATH, "r") as f:
            ideas = json.load(f)

        top_ideas = select_top_ideas_with_ai(ideas)
        return {"top_ideas": top_ideas}
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/insights-summary")
def insights_summary():
    try:
        with open(AI_DATASET_PATH) as f:
            data = json.load(f)

        df = pd.DataFrame(data)

        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        fig.suptitle("AI-Powered Idea Insights", fontsize=16, fontweight="bold")

        # ROI vs Strategic Alignment by Department
        axes[0, 0].scatter(df["feature_roi_score"], df["strategic_alignment_score"], c='blue')
        axes[0, 0].set_title("ROI vs Strategic Alignment")
        axes[0, 0].set_xlabel("ROI Score")
        axes[0, 0].set_ylabel("Strategic Alignment")

        # Business Impact vs Effort
        effort_map = {"Low": 1, "Medium": 2, "High": 3}
        df["effort_numeric"] = df["estimated_effort_difficulty"].map(effort_map)
        axes[0, 1].scatter(df["effort_numeric"], df["business_impact"].map({"Low":1, "Moderate":2, "High":3}), c='green')
        axes[0, 1].set_title("Effort vs Business Impact")
        axes[0, 1].set_xlabel("Effort Difficulty")
        axes[0, 1].set_ylabel("Impact Level")

        # Count by Department
        dept_counts = df["department"].value_counts()
        axes[1, 0].bar(dept_counts.index, dept_counts.values, color="purple")
        axes[1, 0].set_title("Ideas by Department")
        axes[1, 0].tick_params(axis='x', rotation=45)

        # ROI Score Distribution
        axes[1, 1].hist(df["feature_roi_score"], bins=5, color="orange")
        axes[1, 1].set_title("Distribution of ROI Scores")

        plt.tight_layout(rect=[0, 0, 1, 0.95])
        output_path = "backend/data/ai_insights_summary.png"
        plt.savefig(output_path)
        plt.close()

        return FileResponse(output_path, media_type="image/png", filename="ai_insights_summary.png")

    except Exception as e:
        return {"error": str(e)}
