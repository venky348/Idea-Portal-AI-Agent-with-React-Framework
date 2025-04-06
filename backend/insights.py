# backend/insights.py

import json
from collections import Counter
from backend.config import AI_DATASET_PATH


def get_insights_summary():
    try:
        with open(AI_DATASET_PATH, "r") as f:
            ideas = json.load(f)

        total_ideas = len(ideas)
        avg_roi = sum(i["feature_roi_score"] for i in ideas) / total_ideas
        avg_alignment = sum(i["strategic_alignment_score"] for i in ideas) / total_ideas

        efforts = [i["estimated_effort_difficulty"] for i in ideas]
        impact_levels = [i["business_impact"] for i in ideas]

        effort_dist = dict(Counter(efforts))
        impact_dist = dict(Counter(impact_levels))

        top_ai_reasoning = sorted(
            [i for i in ideas if "ai_reasoning" in i],
            key=lambda x: x["feature_roi_score"] + x["strategic_alignment_score"],
            reverse=True
        )[:3]

        return {
            "total_ideas": total_ideas,
            "average_roi": round(avg_roi, 2),
            "average_alignment": round(avg_alignment, 2),
            "effort_distribution": effort_dist,
            "impact_distribution": impact_dist,
            "top_ai_reasoning_examples": [
                {"title": i["title"], "reasoning": i.get("ai_reasoning")}
                for i in top_ai_reasoning
            ]
        }

    except Exception as e:
        return {"error": str(e)}
