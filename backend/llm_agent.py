# backend/llm_agent.py

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

def generate_reasoning(idea):
    prompt = f"""
You are a helpful product strategist AI.
Analyze the following business idea and explain whether it should be prioritized and why.

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
