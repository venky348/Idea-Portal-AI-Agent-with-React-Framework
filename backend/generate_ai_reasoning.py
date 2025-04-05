# backend/generate_ai_reasoning.py

import json
from llm_agent import generate_reasoning
from backend.config import ORIGINAL_DATASET_PATH

with open(ORIGINAL_DATASET_PATH) as f:
    ideas = json.load(f)

for i, idea in enumerate(ideas):
    if "ai_reasoning" not in idea:  # Avoid overwriting
        idea["ai_reasoning"] = generate_reasoning(idea)
        print(f"[{i+1}] ✅ {idea['title']}")

# Save to a new file
with open("backend/data/small_tech_with_ai.json", "w") as f:
    json.dump(ideas, f, indent=2)