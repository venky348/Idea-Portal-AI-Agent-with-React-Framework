# backend/scoring.py

import json
import pandas as pd

def map_impact(value):
    return {"Low": 3, "Moderate": 6, "High": 10}.get(value, 0)

def normalize_effort(column):
    return (column.max() - column) / (column.max() - column.min())

def get_top_ideas():
    with open("data/finance_idea_portal_dataset_5000.json") as f:
        ideas = json.load(f)

    df = pd.DataFrame(ideas)
    df["impact_score"] = df["business_impact"].map(map_impact)
    df["normalized_effort"] = normalize_effort(df["estimated_effort_hours"])

    # Calculate priority score
    df["priority_score"] = (
        0.4 * df["feature_roi_score"] +
        0.3 * df["strategic_alignment_score"] +
        0.2 * df["impact_score"] -
        0.1 * df["normalized_effort"]
    )

    top_ideas = df.sort_values("priority_score", ascending=False).head(3)
    return top_ideas.to_dict(orient="records")
