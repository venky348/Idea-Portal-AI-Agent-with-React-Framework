import React from 'react';
import IdeaScoreChart from './IdeaScoreChart';

const IdeaCard = ({ idea, rank }) => {
  const handleFeedback = async (vote) => {
    await fetch('http://localhost:8000/feedback/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idea_id: idea.idea_id,
        feedback: vote,
      }),
    });
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 space-y-4">
      {/* Rank Badge */}
      <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full font-medium shadow-sm">
        Rank #{rank}
      </div>

      {/* Title + Description */}
      <div>
        <h2 className="text-lg font-bold text-slate-800">{idea.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
      </div>

      {/* Meta Info */}
      <div className="text-xs text-gray-500">
        <span className="block mb-1">
          <strong>Department:</strong> {idea.department}
        </span>
        <span>
          <strong>Submitted by:</strong> {idea.submitted_by}
        </span>
      </div>

      {/* Score Overview */}
      <div className="text-sm grid grid-cols-2 gap-2 mt-2">
        <p><strong>ROI Score:</strong> {idea.feature_roi_score}</p>
        <p><strong>Effort Difficulty:</strong> {idea.estimated_effort_difficulty}</p>
        <p><strong>Alignment:</strong> {idea.strategic_alignment_score}</p>
        <p><strong>Impact:</strong> {idea.business_impact}</p>
      </div>

      {/* Score Chart */}
      <IdeaScoreChart idea={idea} />

      {/* AI Reasoning */}
      <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm">
        <p className="text-gray-700 font-semibold mb-1">AI Reasoning</p>
        <p className="text-gray-600 whitespace-pre-line italic">{idea.reasoning || 'No reasoning available.'}</p>
      </div>

      {/* Feedback Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => handleFeedback('up')}
          className="bg-green-100 hover:bg-green-200 text-green-800 text-xs font-semibold py-1 px-3 rounded-full transition"
        >
          Helpful
        </button>
        <button
          onClick={() => handleFeedback('down')}
          className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold py-1 px-3 rounded-full transition"
        >
          Not Relevant
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;
