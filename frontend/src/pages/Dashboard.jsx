import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import IdeaCard from '../components/IdeaCard';
import SliderPanel from '../components/SliderPanel';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  useEffect(() => {
    fetchIdeas();
  }, [weights]);

  const resetWeights = () => {
    setWeights({
      roi_weight: 0,
      alignment_weight: 0,
      impact_weight: 0,
      effort_weight: 0,
    });
  };

  return (
    <div className="container py-5 bg-light min-vh-100">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">AI-Powered Idea Prioritization</h1>
        <p className="lead text-muted">
          Discover the top 3 product ideas, ranked by ROI, alignment, impact, and effort.
        </p>
      </div>

      {/* Row 1: Sliders Panel */}
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-primary">Prioritization Weights</h5>
                <div className="btn-group">
                  <button
                    onClick={fetchIdeas}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={resetWeights}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <SliderPanel weights={weights} setWeights={setWeights} />
              <div className="mt-3 small text-muted text-center">
                Slide to fine-tune idea rankings.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2-4: Each IdeaCard in its own row */}
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

                {idea.reasoning && (
                  <div className="bg-light p-3 rounded border border-secondary mb-3">
                    <h6 className="text-secondary fw-bold mb-2">AI Reasoning</h6>
                    <p className="mb-0 text-dark fst-italic">{idea.reasoning}</p>
                  </div>
                )}

                {/* Chart Visualization */}
                <Bar
                  data={{
                    labels: ['ROI', 'Alignment', 'Impact', 'Effort'],
                    datasets: [
                      {
                        label: 'Score',
                        data: [
                          idea.feature_roi_score,
                          idea.strategic_alignment_score,
                          idea.business_impact,
                          idea.estimated_effort_difficulty === 'Low' ? 1 : idea.estimated_effort_difficulty === 'Medium' ? 2 : 3,
                        ],
                        backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545'],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: true, text: 'Score Breakdown', font: { size: 18 } },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
