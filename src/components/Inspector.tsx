import React from 'react';
import { AlgorithmStep, VisualState } from '../engine/types';
import '../styles/app.css';

interface InspectorProps {
  step: AlgorithmStep | null;
  state: VisualState;
}

const Inspector: React.FC<InspectorProps> = ({ step, state }) => {
  const vars = step?.vars || {};
  const stack = step?.stack || [];
  const counters = state.counters || {};

  return (
    <div className="panel" aria-label="Variable inspector">
      <h3>Inspector</h3>
      <div className="inspector">
        <div className="inspector-card">
          <div className="label-row">
            <span>Variables</span>
            <span className="tag">live</span>
          </div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {Object.keys(vars).length === 0 && <li style={{ color: '#6b7280' }}>No locals</li>}
            {Object.entries(vars).map(([k, v]) => (
              <li key={k} style={{ fontSize: 13 }}>
                <strong>{k}:</strong> {JSON.stringify(v)}
              </li>
            ))}
          </ul>
        </div>
        <div className="inspector-card">
          <div className="label-row">
            <span>Call Stack</span>
            <span className="tag">depth {stack.length}</span>
          </div>
          <ol style={{ margin: 0, paddingLeft: 18 }}>
            {stack.length === 0 && <li style={{ color: '#6b7280' }}>Idle</li>}
            {stack.map((frame, idx) => (
              <li key={`${frame.name}-${idx}`} style={{ fontSize: 13 }}>
                {frame.name}({Object.entries(frame.params || {})
                  .map(([k, v]) => `${k}=${v}`)
                  .join(', ')})
              </li>
            ))}
          </ol>
        </div>
        <div className="inspector-card">
          <div className="label-row">
            <span>Metrics</span>
            <span className="tag">counters</span>
          </div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {Object.keys(counters).length === 0 && <li style={{ color: '#6b7280' }}>No metrics yet</li>}
            {Object.entries(counters).map(([k, v]) => (
              <li key={k} style={{ fontSize: 13 }}>
                {k}: {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Inspector;
