import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaCard from '../components/IdeaCard';
import SliderPanel from '../components/SliderPanel';
import IdeaChart from '../components/IdeaChart';

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [weights, setWeights] = useState({
    roi_weight: 0.4,
    alignment_weight: 0.3,
    impact_weight: 0.2,
    effort_weight: 0.1,
    top_n: 3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(weights).toString();
      const res = await axios.get(`http://localhost:8000/top-ideas/?${query}`);
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ideas. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [weights]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top Prioritized Ideas</h1>
      <SliderPanel weights={weights} setWeights={setWeights} />

      {loading && <p className="text-blue-500 font-semibold">Loading ideas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4 mt-4">
        {!loading && !error && ideas.map(idea => (
          <IdeaCard key={idea.idea_id} idea={idea} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
