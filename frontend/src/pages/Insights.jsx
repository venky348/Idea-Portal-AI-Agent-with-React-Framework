// src/pages/Insights.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/insights-summary')
      .then(res => setInsights(res.data))
      .catch(() => setError('Failed to load insights.'));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!insights) return <div className="text-center">Loading insights...</div>;

  return (
    <div className="container py-5">
      <h2 className="text-primary text-center mb-4">📊 Idea Portal Insights</h2>

      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Total Ideas: {insights.total_ideas}</h5>
            <p>📈 Average ROI: {insights.avg_roi.toFixed(2)}</p>
            <p>🎯 Average Alignment: {insights.avg_alignment.toFixed(2)}</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Effort Distribution</h5>
            <Pie data={{
              labels: Object.keys(insights.effort_distribution),
              datasets: [{
                data: Object.values(insights.effort_distribution),
                backgroundColor: ['#198754', '#ffc107', '#dc3545']
              }]
            }} />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h4 className="text-secondary">Impact Distribution</h4>
        <Bar data={{
          labels: Object.keys(insights.impact_distribution),
          datasets: [{
            label: 'Impact Count',
            data: Object.values(insights.impact_distribution),
            backgroundColor: '#0d6efd'
          }]
        }} />
      </div>

      <div className="card p-4 bg-light">
        <h4 className="text-success">Top 3 AI-Inspired Ideas</h4>
        {insights.top_ai_ideas.map((idea, idx) => (
          <div key={idx} className="mb-3">
            <h5>#{idx + 1}: {idea.title}</h5>
            <p><strong>Department:</strong> {idea.department}</p>
            <p className="fst-italic">🧠 {idea.ai_reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
