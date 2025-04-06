
# AI-Powered Idea Prioritization Portal

This is a full-stack web application that helps organizations evaluate, rank, and visualize the top three submitted product ideas. It integrates both rule-based logic and AI-generated reasoning to assess and explain ideas across key business metrics such as ROI, strategic alignment, impact, and effort.

---

## 🚀 Elevator Pitch

The Idea Prioritization Portal empowers teams to make smarter, data-driven product decisions by combining scoring logic with AI-generated justifications. It offers explainable results, real-time visual insights, and interactive prioritization tools—all in one platform.

---

## 📁 Project Structure

```
ai-idea-portal/
├── backend/
│   ├── app.py                  # FastAPI application entry point
│   ├── config.py               # Configuration and dataset paths
│   ├── scoring.py              # Rule-based scoring logic
│   ├── llm_agent.py            # LLM-based reasoning generator
│   ├── react_agent.py          # Rule-based justification generator
│   ├── generate_ai_reasoning.py# Script to create enriched dataset with reasoning
│   └── data/
│       ├── very_small_tech.json         # Original idea dataset
│       ├── very_small_tech_with_ai.json # AI-enhanced dataset
│       └── insights_plot.png            # Visualization plot
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── IdeaCard.jsx
│   │   │   └── SliderPanel.jsx
│   └── public/
├── requirements.txt            # Python backend dependencies
├── package.json                # Node.js frontend dependencies
```

---

## ✨ Features

- **AI and Rule-based Reasoning**: Generate justifications using both logic and AI models.
- **Dynamic Prioritization**: Adjust ROI, impact, alignment, and effort weights.
- **Toggle Scoring Modes**: Switch between AI and rule-based views.
- **Data Visualization**: Line charts for AI top picks over time.
- **Explainable Reasoning**: Full, transparent LLM-generated thoughts.
- **Feedback Logging**: Store user feedback for continuous improvement.

---

## ⚙️ Tech Stack

| Layer       | Technologies |
|-------------|--------------|
| **Frontend** | React, Bootstrap, Chart.js |
| **Backend**  | FastAPI, Uvicorn |
| **AI Models**| Transformers (Hugging Face), Torch |
| **Logic**    | Custom rule-based scoring |
| **Visualization** | Matplotlib (backend), Chart.js (frontend) |
| **Hosting**  | Google Cloud Platform (GCP) |

---

## 🧪 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourname/ai-idea-portal.git
cd ai-idea-portal
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

Make sure your `requirements.txt` includes:

- fastapi  
- uvicorn  
- pydantic  
- transformers  
- torch  
- matplotlib  

### 3. Frontend Setup

```bash
cd frontend
npm install
npm install react-router-dom
npm start
```

Once the backend and frontend servers are running:

- Frontend: http://localhost:3000  
- Backend API: http://localhost:8000  
