# backend/llm_agent.py

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

tokenizer = AutoTokenizer.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
model = AutoModelForCausalLM.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")

def generate_reasoning(idea):
    prompt = f"""
You are a helpful product strategist AI.
Evaluate the following idea and explain its business priority:

Title: {idea['title']}
ROI Score: {idea['feature_roi_score']}
Effort: {idea['estimated_effort_difficulty']} ({idea['estimated_effort_hours']} hrs)
Strategic Alignment Score: {idea['strategic_alignment_score']}
Business Impact: {idea['business_impact']}

Response:"""

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_length=500,
        temperature=0.7,
        do_sample=True,
        top_p=0.9,
        pad_token_id=tokenizer.eos_token_id
    )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response.split("Response:")[-1].strip()

def select_top_ideas_with_ai(ideas):
    prompt = (
        "You are an AI prioritization assistant. Your job is to read the following product ideas "
        "and return the top 3 ideas based on strategic alignment, ROI, business impact, and ease of implementation.\n\n"
        "Ideas:\n"
    )
    for idx, idea in enumerate(ideas):
        prompt += f"{idx+1}. {idea['title']}: {idea['description']}\n"
        prompt += f"   ROI: {idea['feature_roi_score']}, "
        prompt += f"Alignment: {idea['strategic_alignment_score']}, "
        prompt += f"Impact: {idea['business_impact']}, "
        prompt += f"Effort: {idea['estimated_effort_difficulty']}\n\n"

    prompt += "Return only the top 3 idea numbers (e.g., 1, 5, 7) and a brief reason for each.\n"

    # Generate output (you’ll need OpenAI or TinyLLaMA)
    outputs = model(prompt)
    return outputs
