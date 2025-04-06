def get_top_ideas(
    roi_weight=0.4,
    alignment_weight=0.3,
    impact_weight=0.2,
    effort_weight=0.1,
    use_ai=False
):
    from backend.config import AI_DATASET_PATH, ORIGINAL_DATASET_PATH
    import json
    import pandas as pd

    # Choose dataset path
    path = AI_DATASET_PATH if use_ai else ORIGINAL_DATASET_PATH

    with open(path, "r") as f:
        data = json.load(f)

    df = pd.DataFrame(data)

    # Convert values
    impact_map = {"Low": 1, "Medium": 2, "High": 3}
    df["impact_score"] = df["business_impact"].map(impact_map)
    df["normalized_effort"] = (df["estimated_effort_hours"] - df["estimated_effort_hours"].min()) / (
        df["estimated_effort_hours"].max() - df["estimated_effort_hours"].min() + 1e-5
    )

    # Calculate priority score
    df["priority_score"] = (
        roi_weight * df["feature_roi_score"]
        + alignment_weight * df["strategic_alignment_score"]
        + impact_weight * df["impact_score"]
        - effort_weight * df["normalized_effort"]
    )

    top_ideas = df.sort_values("priority_score", ascending=False).head(3)
    result = top_ideas.to_dict(orient="records")

    # Choose which reasoning to show
    for idea in result:
        if use_ai and "ai_reasoning" in idea:
            idea["reasoning"] = idea["ai_reasoning"]
        elif "react_reasoning" in idea:
            idea["reasoning"] = idea["react_reasoning"]
        else:
            idea["reasoning"] = "Reasoning not available."

    return result
