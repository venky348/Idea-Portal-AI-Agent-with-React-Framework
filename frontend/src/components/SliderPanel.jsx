import React from 'react';

const LabeledSlider = ({ label, value, onChange }) => {
  const gradientPercentage = value * 100;

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between">
        <label className="form-label fw-semibold text-primary">{label}</label>
        <span className="badge bg-primary">{value.toFixed(2)}</span>
      </div>
      <div className="position-relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={onChange}
          className="form-range"
          style={{
            background: `linear-gradient(90deg, #0d6efd ${gradientPercentage}%, #dee2e6 ${gradientPercentage}%)`
          }}
        />
      </div>
    </div>
  );
};

const DiscreteSlider = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between">
        <label className="form-label fw-semibold text-primary">{label}</label>
        <span className="badge bg-info text-dark">{options[value]}</span>
      </div>
      <input
        type="range"
        min="0"
        max={options.length - 1}
        step="1"
        value={value}
        onChange={onChange}
        className="form-range"
      />
      <div className="d-flex justify-content-between small text-muted px-1">
        {options.map((opt, index) => (
          <span key={index}>{opt}</span>
        ))}
      </div>
    </div>
  );
};

const SliderPanel = ({ weights, setWeights }) => {
  const updateWeight = (key, newValue) => {
    setWeights(prev => ({ ...prev, [key]: parseFloat(newValue) }));
  };

  const impactOptions = ['Low', 'Moderate', 'High'];
  const effortOptions = ['Low', 'Moderate', 'High'];

  return (
    <div>
      <LabeledSlider
        label="ROI Weight"
        value={weights.roi_weight}
        onChange={(e) => updateWeight('roi_weight', e.target.value)}
      />
      <LabeledSlider
        label="Alignment Weight"
        value={weights.alignment_weight}
        onChange={(e) => updateWeight('alignment_weight', e.target.value)}
      />
      <DiscreteSlider
        label="Impact"
        value={Math.round(weights.impact_weight * 2)}
        onChange={(e) =>
          updateWeight('impact_weight', (parseInt(e.target.value) / 2).toFixed(2))
        }
        options={impactOptions}
      />
      <DiscreteSlider
        label="Effort Difficulty"
        value={Math.round(weights.effort_weight * 2)}
        onChange={(e) =>
          updateWeight('effort_weight', (parseInt(e.target.value) / 2).toFixed(2))
        }
        options={effortOptions}
      />
    </div>
  );
};

export default SliderPanel;
