# backend/scoring.py

import json
import pandas as pd
import os
from backend.react_agent import generate_reasoning
from backend.config import AI_DATASET_PATH, ORIGINAL_DATASET_PATH

ACTIVE_DATASET_PATH = ORIGINAL_DATASET_PATH

IMPACT_MAP = {"Low": 1, "Medium": 2, "High": 3}
EFFORT_SCALE = {"Low": 1, "Medium": 2, "High": 3}

def map_impact(value):
    return IMPACT_MAP.get(value, 0)

def normalize_effort(effort_series):
    return (effort_series - effort_series.min()) / (effort_series.max() - effort_series.min() + 1e-5)

# ✅ MAIN FUNCTION
def get_top_ideas(roi_weight=0.4, alignment_weight=0.3, impact_weight=0.2, effort_weight=0.1):
    path = ACTIVE_DATASET_PATH if os.path.exists(ACTIVE_DATASET_PATH) else ORIGINAL_DATASET_PATH

    with open(path) as f:
        data = json.load(f)

    df = pd.DataFrame(data)

    # Clean or convert fields
    df["impact_score"] = df["business_impact"].map(map_impact)
    df["normalized_effort"] = normalize_effort(df["estimated_effort_hours"])

    # Calculate priority score
    df["priority_score"] = (
        roi_weight * df["feature_roi_score"] +
        alignment_weight * df["strategic_alignment_score"] +
        impact_weight * df["impact_score"] -
        effort_weight * df["normalized_effort"]
    )

    # Sort and select top ideas
    top_ideas = df.sort_values("priority_score", ascending=False).head(3)  # ⬅ fixed top 3
    result = top_ideas.to_dict(orient="records")

    for idea in result:
        idea["reasoning"] = idea.get("ai_reasoning", "AI reasoning not available.")

    return result

# Optional: switch the scoring to use AI mode

def set_use_ai_mode(active: bool, path: str):
    global ACTIVE_DATASET_PATH
    ACTIVE_DATASET_PATH = path if active else ORIGINAL_DATASET_PATH
