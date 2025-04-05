# backend/react_agent.py

def generate_reasoning(idea):
    reasoning = []

    if idea["feature_roi_score"] >= 8:
        reasoning.append("high ROI makes this idea valuable.")
    elif idea["feature_roi_score"] >= 6:
        reasoning.append("moderate ROI provides decent business value.")
    else:
        reasoning.append("low ROI reduces its attractiveness.")

    if idea["estimated_effort_difficulty"] == "Low":
        reasoning.append("low effort makes it easy to implement.")
    elif idea["estimated_effort_difficulty"] == "High":
        reasoning.append("high effort could delay implementation.")

    if idea["strategic_alignment_score"] >= 8:
        reasoning.append("strongly aligns with strategic goals.")
    elif idea["strategic_alignment_score"] >= 5:
        reasoning.append("has moderate alignment with strategy.")
    else:
        reasoning.append("does not align well with strategy.")

    if idea["business_impact"] == "High":
        reasoning.append("expected to have significant business impact.")
    elif idea["business_impact"] == "Moderate":
        reasoning.append("may provide moderate value.")
    else:
        reasoning.append("has low projected impact.")

    return "This idea " + ", ".join(reasoning)
