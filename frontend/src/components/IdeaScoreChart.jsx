import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const IdeaScoreChart = ({ idea }) => {
  const data = [
    { name: 'ROI', value: idea.feature_roi_score },
    { name: 'Alignment', value: idea.strategic_alignment_score },
    { name: 'Impact', value: idea.business_impact },
    { name: 'Effort', value: idea.estimated_effort_hours },
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 Score Breakdown</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IdeaScoreChart;
