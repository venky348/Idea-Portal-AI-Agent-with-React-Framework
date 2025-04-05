import React from 'react';

const SliderPanel = ({ weights, setWeights }) => {
  const handleChange = (key, value) => {
    setWeights(prev => ({
      ...prev,
      [key]: parseFloat(value)
    }));
  };

  return (
    <div className="mb-6 p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">⚖️ Adjust AI Weights</h3>

      {Object.keys(weights).map((key, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-1 capitalize text-gray-700">
            {key.replace('_', ' ')}: {weights[key]}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weights[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default SliderPanel;
