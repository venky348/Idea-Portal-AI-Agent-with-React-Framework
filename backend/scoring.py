import json
import pandas as pd
from backend.config import AI_DATASET_PATH

# Helper mappings
IMPACT_MAP = {"Low": 1, "Medium": 2, "High": 3}
EFFORT_SCALE = {"Low": 1, "Medium": 2, "High": 3}

def map_impact(value):
    return IMPACT_MAP.get(value, 0)

def normalize_effort(effort_series):
    return (effort_series - effort_series.min()) / (effort_series.max() - effort_series.min() + 1e-5)

# ✅ MAIN FUNCTION
def get_top_ideas(roi_weight=0.4, alignment_weight=0.3, impact_weight=0.2, effort_weight=0.1, top_n=3):
    with open(AI_DATASET_PATH) as f:
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
    top_ideas = df.sort_values("priority_score", ascending=False).head(top_n)
    result = top_ideas.to_dict(orient="records")

    # Use cached AI reasoning
    for idea in result:
        idea["reasoning"] = idea.get("ai_reasoning", "AI reasoning not available.")

    return result