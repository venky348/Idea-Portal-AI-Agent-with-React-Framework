# backend/scoring.py

import json
import pandas as pd
from backend.react_agent import generate_reasoning
from backend.config import DATASET_PATH  # ✅ Import path from config

# Map & normalize helpers
def map_impact(value):
    return {"Low": 3, "Moderate": 6, "High": 10}.get(value, 0)

def normalize_effort(column):
    return (column.max() - column) / (column.max() - column.min())

# Load dataset once using centralized path
with open(DATASET_PATH) as f:
    RAW_IDEAS = json.load(f)

def get_top_ideas(
    roi_weight=0.4,
    alignment_weight=0.3,
    impact_weight=0.2,
    effort_weight=0.1
):
    df = pd.DataFrame(RAW_IDEAS)
    df["impact_score"] = df["business_impact"].map(map_impact)
    df["normalized_effort"] = normalize_effort(df["estimated_effort_hours"])

    df["priority_score"] = (
        roi_weight * df["feature_roi_score"] +
        alignment_weight * df["strategic_alignment_score"] +
        impact_weight * df["impact_score"] -
        effort_weight * df["normalized_effort"]
    )

    top_ideas = df.sort_values("priority_score", ascending=False).head(3)
    result = top_ideas.to_dict(orient="records")

    for idea in result:
        idea["reasoning"] = generate_reasoning(idea)

    return result
