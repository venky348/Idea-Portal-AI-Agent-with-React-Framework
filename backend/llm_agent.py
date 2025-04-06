# backend/llm_agent.py

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

def generate_reasoning(idea):
    prompt = f"""
You are an AI Agent assisting with idea prioritization from an innovation portal. Each idea has associated data including Estimated Implementation Effort and Feature ROI.
Your task is to:
Evaluate each idea using these factors.
Provide a ranked list of ideas from most to least promising.
For each idea, explicitly walk through your reasoning using the ReAct framework — first "Think" (analyze and reason), then "Act" (decide on the rank).
Justify why some ideas are ranked higher or lower by referencing trade-offs between ROI and Effort.

Title: {idea['title']}
ROI Score: {idea['feature_roi_score']}
Effort: {idea['estimated_effort_difficulty']} ({idea['estimated_effort_hours']} hrs)
Strategic Alignment Score: {idea['strategic_alignment_score']}
Business Impact: {idea['business_impact']}

Response:"""

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_length=200,
        temperature=0.7,
        do_sample=True,
        top_p=0.9,
        pad_token_id=tokenizer.eos_token_id
    )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response.split("Response:")[-1].strip()
