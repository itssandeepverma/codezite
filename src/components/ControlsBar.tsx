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
      <div className="glass-deck">
        <div className="deck-glow" aria-hidden />

        <div className="transport">
          <button className="glass-button ghost" onClick={onStepBackward} aria-label="Step backward">
            <span className="icon">⏮</span>
          </button>

          <button className="glass-button primary" onClick={onPlayPause} aria-label={playing ? 'Pause' : 'Play'}>
            <span className="icon">{playing ? '⏸' : '▶'}</span>
          </button>

          <button className="glass-button ghost" onClick={onStepForward} aria-label="Step forward">
            <span className="icon">⏭</span>
          </button>

          <button className="glass-button ghost" onClick={onReset} aria-label="Stop / Reset">
            <span className="icon">⏹</span>
          </button>
        </div>

        <div className="meters">
          <label className="slider" aria-label="Playback speed">
            <span className="label">Speed</span>
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.1}
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
            />
            <span className="chip">{speed.toFixed(1)}x</span>
          </label>

          <label className="slider" aria-label="Canvas scale">
            <span className="label">Scale</span>
            <input
              type="range"
              min={0.7}
              max={1.5}
              step={0.05}
              value={scale}
              onChange={(e) => onScaleChange(Number(e.target.value))}
            />
            <span className="chip">{scale.toFixed(2)}x</span>
          </label>

          <label className="chip toggle">
            <input type="checkbox" checked={loop} onChange={(e) => onLoopChange(e.target.checked)} aria-label="Loop playback" />
            <span>Loop</span>
          </label>

          <div className="chip subtle">
            Step {Math.max(0, position.index + 1)} / {position.total}
          </div>
        </div>

        <div className="actions">
          <button className="glass-button ghost" onClick={onSnapshot} aria-label="Export snapshot">
            Capture
          </button>
          <button className="glass-button ghost" onClick={onPermalink} aria-label="Copy link with state">
            Permalink
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlsBar;
