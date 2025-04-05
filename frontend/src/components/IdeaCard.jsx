import React from 'react';

const IdeaCard = ({ idea }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      <h2 className="text-xl font-semibold text-blue-600 mb-1">{idea.title}</h2>
      <p className="text-gray-700 mb-2">{idea.description}</p>

      <div className="text-sm text-gray-500 mb-1">
        <strong>Department:</strong> {idea.department} | 
        <strong> Submitted by:</strong> {idea.submitted_by}
      </div>

      <div className="mt-2 text-sm">
        <p>📊 <strong>ROI Score:</strong> {idea.feature_roi_score}</p>
        <p>⚙️ <strong>Effort Difficulty:</strong> {idea.estimated_effort_difficulty}</p>
        <p>🎯 <strong>Strategic Alignment:</strong> {idea.strategic_alignment_score}</p>
        <p>💥 <strong>Business Impact:</strong> {idea.business_impact}</p>
      </div>

      <div className="mt-3 text-sm bg-gray-100 p-2 rounded">
        <strong>🤖 AI Reasoning:</strong>
        <p className="italic">{idea.reasoning}</p>
      </div>
    </div>
  );
};

export default IdeaCard;
