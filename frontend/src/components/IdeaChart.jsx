import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const IdeaChart = ({ data }) => {
  const formattedData = data.map(idea => ({
    x: idea.estimated_effort_hours,
    y: idea.feature_roi_score,
    title: idea.title,
    impact: idea.business_impact,
    alignment: idea.strategic_alignment_score
  }));

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">📈 ROI vs Effort</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="Effort (hrs)" />
          <YAxis type="number" dataKey="y" name="ROI Score" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => [`${value}`, name]}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <strong>{d.title}</strong>
                    <p>Effort: {d.x} hrs</p>
                    <p>ROI: {d.y}</p>
                    <p>Impact: {d.impact}</p>
                    <p>Alignment: {d.alignment}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Ideas" data={formattedData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IdeaChart;
