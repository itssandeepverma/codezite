import React from 'react';
import '../styles/app.css';

interface ControlsBarProps {
  playing: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  loop: boolean;
  onLoopChange: (v: boolean) => void;
  position: { index: number; total: number };
  onSnapshot: () => void;
  onPermalink: () => void;
  scale: number;
  onScaleChange: (v: number) => void;
}

const ControlsBar: React.FC<ControlsBarProps> = ({
  playing,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  speed,
  onSpeedChange,
  loop,
  onLoopChange,
  position,
  onSnapshot,
  onPermalink,
  scale,
  onScaleChange
}) => {
  return (
    <div className="controls-bar" aria-label="Playback controls">
      <button className="control-button" onClick={onPlayPause} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? 'Pause (Space)' : 'Play (Space)'}
      </button>
      <button className="control-button" onClick={onStepBackward} aria-label="Step backward">
        ← Step
      </button>
      <button className="control-button" onClick={onStepForward} aria-label="Step forward">
        Step →
      </button>
      <button className="control-button" onClick={onReset} aria-label="Reset">
        Stop / Reset
      </button>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        Speed
        <input
          type="range"
          min={0.1}
          max={3}
          step={0.1}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          aria-label="Speed"
          style={{ width: 160 }}
        />
        <span className="tag">{speed.toFixed(1)}x</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        Scale
        <input
          type="range"
          min={0.7}
          max={1.5}
          step={0.05}
          value={scale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          aria-label="Canvas scale"
          style={{ width: 140 }}
        />
        <span className="tag">{scale.toFixed(2)}x</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={loop} onChange={(e) => onLoopChange(e.target.checked)} aria-label="Loop playback" />
        Loop
      </label>
      <div style={{ marginLeft: 'auto', fontSize: 13 }}>
        Step {Math.max(0, position.index + 1)} / {position.total}
      </div>
      <button className="control-button" onClick={onSnapshot} aria-label="Export snapshot">
        Snapshot PNG
      </button>
      <button className="control-button" onClick={onPermalink} aria-label="Copy link with state">
        Copy Permalink
      </button>
    </div>
  );
};

export default ControlsBar;
