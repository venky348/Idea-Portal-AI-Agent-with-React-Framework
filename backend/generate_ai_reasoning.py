# backend/generate_ai_reasoning.py

import json
from llm_agent import generate_reasoning
from config import ORIGINAL_DATASET_PATH,AI_DATASET_PATH

with open(ORIGINAL_DATASET_PATH) as f:
    ideas = json.load(f)

for i, idea in enumerate(ideas):
    print(f"[{i+1}] ✅ {idea['title']}")
    if "ai_reasoning" not in idea:  # Avoid overwriting
        idea["ai_reasoning"] = generate_reasoning(idea)
        # print(f"[{i+1}] ✅ {idea['title']}")

# Save to a new file
with open(AI_DATASET_PATH, "w") as f:
    json.dump(ideas, f, indent=2)