import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VisualizerEngine from '../engine/VisualizerEngine';
import { AlgorithmDefinition, AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';
import { algorithms } from '../algorithms';
import Visualizer from './Visualizer';
import Inspector from './Inspector';
import CodeViewer from './CodeViewer';
import ControlsBar from './ControlsBar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface VisualExperienceProps {
  algorithmId?: string;
  sampleInput?: VisualizerInput;
}

const VisualExperience: React.FC<VisualExperienceProps> = ({ algorithmId, sampleInput }) => {
  const [engine] = useState(() => new VisualizerEngine());
  const svgRef = useRef<SVGSVGElement>(null);
  const algorithm = useMemo<AlgorithmDefinition | undefined>(() => algorithms.find((a) => a.id === algorithmId), [algorithmId]);
  const [input, setInput] = useState<VisualizerInput | undefined>(algorithm?.defaults);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [currentState, setCurrentState] = useState<VisualState>({});
  const [position, setPosition] = useState({ index: -1, total: 0 });
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [scale, setScale] = useState(1);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>('cpp');
  const [split, setSplit] = useState(0.5);
  const dragRef = useRef<{ startX: number; startSplit: number } | null>(null);

  useEffect(() => {
    if (algorithm) {
      setInput(sampleInput || algorithm.defaults);
    }
  }, [algorithm, sampleInput]);

  const rebuild = useCallback(() => {
    if (!algorithm || !input) return;
    const { steps, initial } = algorithm.generator(input);
    engine.pause();
    engine.load(steps, initial, {
      onStep: ({ step, state, index }) => {
        setCurrentStep(step);
        setCurrentState(state);
        setPosition({ index, total: steps.length });
      },
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
      onReset: () => setPlaying(false)
    });
  }, [algorithm, engine, input]);

  useEffect(() => {
    rebuild();
  }, [rebuild]);

  const handlePlayPause = () => {
    engine.setSpeed(speed);
    engine.setLoop(loop);
    if (engine.isPlaying()) {
      engine.pause();
    } else {
      engine.play();
    }
  };

  const stepForward = () => engine.stepForward();
  const stepBackward = () => engine.stepBackward();
  const reset = () => engine.reset();

  useKeyboardShortcuts({ onTogglePlay: handlePlayPause, onStepForward: stepForward, onStepBackward: stepBackward });

  const currentCode =
    (language === 'python' && algorithm?.code.python) ||
    (language === 'cpp' && algorithm?.code.cpp) ||
    (language === 'java' && (algorithm as any)?.code?.java) ||
    algorithm?.code.javascript ||
    '';

  const onHandleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { startX: e.clientX, startSplit: split };
    const onMove = (evt: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = evt.clientX - dragRef.current.startX;
      const delta = dx / (window.innerWidth || 1);
      const next = Math.min(0.75, Math.max(0.25, dragRef.current.startSplit + delta));
      setSplit(next);
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!algorithm) {
    return <div className="placeholder-card">No visualizer available for this problem yet.</div>;
  }

  return (
    <div className="visual-wrapper">
      <div className="visual-topbar">
        <Inspector step={currentStep} state={currentState} />
      </div>

      <div className="visual-main">
        <div className="visual-card area-visual" aria-label="Visualizer" style={{ flexBasis: `${split * 100}%` }}>
          <div className="label-row" style={{ marginBottom: 6 }}>
            <h3 style={{ margin: 0 }}>{algorithm.name}</h3>
            <span className="tag">{algorithm.category}</span>
          </div>
          <Visualizer state={currentState} step={currentStep} svgRef={svgRef} scale={scale} />
        </div>
        <div className="v-resize-handle" onMouseDown={onHandleMouseDown} />
        <div className="visual-card area-code" style={{ flexBasis: `${(1 - split) * 100}%` }}>
          <div className="label-row" style={{ marginBottom: 6 }}>
            <h3 style={{ margin: 0 }}>Code & Stack</h3>
            <span className="tag">{language}</span>
          </div>
          <div className="tabs" style={{ marginBottom: 8 }}>
            {[
              { lang: 'cpp', label: '🐹 C++' },
              { lang: 'python', label: '🐍 Py' },
              { lang: 'java', label: '☕ Java' },
              { lang: 'javascript', label: '🟨 JS' }
            ].map(({ lang, label }) => (
              <button
                key={lang}
                className={`tab ${language === lang ? 'active' : ''}`}
                onClick={() => setLanguage(lang as typeof language)}
              >
                {label}
              </button>
            ))}
          </div>
          <CodeViewer code={currentCode} language={language} highlightLine={currentStep?.codeLine} />
        </div>
      </div>

      <ControlsBar
        playing={playing}
        onPlayPause={handlePlayPause}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onReset={reset}
        speed={speed}
        onSpeedChange={(v) => {
          setSpeed(v);
          engine.setSpeed(v);
        }}
        loop={loop}
        onLoopChange={(v) => {
          setLoop(v);
          engine.setLoop(v);
        }}
        position={position}
        onSnapshot={() => {}}
        onPermalink={() => {}}
        scale={scale}
        onScaleChange={(v) => setScale(v)}
      />
    </div>
  );
};

export default VisualExperience;
