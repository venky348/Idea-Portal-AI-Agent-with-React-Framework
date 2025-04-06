// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import IdeaCard from '../components/IdeaCard';
import SliderPanel from '../components/SliderPanel';

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [weights, setWeights] = useState({
    roi_weight: 0.4,
    alignment_weight: 0.3,
    impact_weight: 0.2,
    effort_weight: 0.1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reasoningGenerated, setReasoningGenerated] = useState(false);
  const [insightsVisible, setInsightsVisible] = useState(false);
  const [insights, setInsights] = useState(null);

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({ ...weights, top_n: 3 }).toString();
      const res = await axios.get(`http://localhost:8000/top-ideas/?${query}`);
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8000/insights-summary', {
        responseType: 'blob'  // important for images
      });
      const url = URL.createObjectURL(res.data);
      setInsights(url);
      setInsightsVisible(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch insights.');
    } finally {
      setLoading(false);
    }
  };

  const generateReasoning = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:8000/generate-reasoning');
      setReasoningGenerated(true);
      alert('Reasoning generated successfully! Now select AI or Rule mode.');
    } catch (err) {
      console.error(err);
      setError('Failed to generate reasoning.');
    } finally {
      setLoading(false);
    }
  };

  const setAIMode = async () => {
    try {
      await axios.post('http://localhost:8000/set-ai-mode', { mode: 'ai' });
      fetchIdeas();
    } catch (err) {
      console.error(err);
      setError('Failed to switch to AI mode.');
    }
  };

  const setRuleMode = async () => {
    try {
      await axios.post('http://localhost:8000/set-ai-mode', { mode: 'rule' });
      fetchIdeas();
    } catch (err) {
      console.error(err);
      setError('Failed to switch to Rule-based mode.');
    }
  };

  const resetWeights = () => {
    setWeights({
      roi_weight: 0,
      alignment_weight: 0,
      impact_weight: 0,
      effort_weight: 0,
    });
  };

  useEffect(() => {
    if (reasoningGenerated) {
      fetchIdeas();
    }
  }, [weights]);

  return (
    <div className="container py-5 bg-light min-vh-100">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">AI-Powered Idea Prioritization</h1>
        <p className="lead text-muted">
          Discover the top 3 product ideas, ranked by ROI, alignment, impact, and effort.
        </p>
      </div>

      <div className="d-flex justify-content-center gap-3 mb-4">
        <button className="btn btn-outline-success" onClick={generateReasoning}>Generate Reasoning</button>
        <button className="btn btn-outline-primary" onClick={setAIMode} disabled={!reasoningGenerated}>AI Top Ideas</button>
        <button className="btn btn-outline-warning" onClick={setRuleMode} disabled={!reasoningGenerated}>Rule-based Top Ideas</button>
        <button className="btn btn-outline-info" onClick={fetchInsights} disabled={!reasoningGenerated}>Show Insights</button>
      </div>

      {insightsVisible && insights && (
        <div className="card bg-white shadow p-4 mb-4 text-center">
          <h5 className="text-secondary fw-bold mb-3">💡 AI Insights Summary</h5>
          <img src={insights} alt="AI Insights" className="img-fluid rounded border border-2" />
        </div>
      )}

      <div className="row mb-4">
        <div className="col">
          <div className="card shadow border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-primary">Prioritization Weights</h5>
                <button onClick={resetWeights} className="btn btn-sm btn-outline-secondary">Reset</button>
              </div>
              <SliderPanel weights={weights} setWeights={setWeights} />
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center text-primary mb-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading top ideas...</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && ideas.map((idea, index) => (
        <div className="row mb-4" key={idea.idea_id || index}>
          <div className="col">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4">
                <h5 className="mb-0">Rank #{index + 1}</h5>
              </div>
              <div className="card-body p-4">
                <h4 className="card-title fw-bold text-dark mb-3">{idea.title}</h4>
                <p className="card-text text-muted mb-4">{idea.description}</p>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Department:</strong> {idea.department}</p>
                    <p className="mb-1"><strong>Submitted by:</strong> {idea.submitted_by}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>ROI Score:</strong> {idea.feature_roi_score}</p>
                    <p className="mb-1"><strong>Effort Difficulty:</strong> {idea.estimated_effort_difficulty}</p>
                    <p className="mb-1"><strong>Alignment:</strong> {idea.strategic_alignment_score}</p>
                    <p className="mb-1"><strong>Impact:</strong> {idea.business_impact}</p>
                  </div>
                </div>

                {(idea.react_reasoning || idea.ai_reasoning) && (
  <div className="bg-light p-3 rounded border border-secondary mb-3">
    <h6 className="text-secondary fw-bold mb-3">🧠 AI Reasoning Breakdown</h6>

    {(idea.ai_reasoning || "").split(/(?=Think:|Do:|ReAct:|Conclusion:)/).map((section, idx) => {
      const [label, ...rest] = section.split(':');
      const content = rest.join(':').trim();
      return (
        <div key={idx} className="mb-3">
          <strong>{label.trim()}:</strong>
          {label.includes("Do") || label.includes("ReAct") ? (
            <ul className="mt-1">
              {content.split(/\d+\.\s+/).filter(Boolean).map((step, i) => (
                <li key={i}>{step.trim().replace(/^\d+\./, '')}</li>
              ))}
            </ul>
          ) : (
            <p className="mb-0 mt-1 text-dark">{content}</p>
          )}
        </div>
      );
    })}
  </div>
)}

              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
