import React, { useCallback, useEffect, useMemo, useState } from 'react';
import VisualizerEngine from './engine/VisualizerEngine';
import { AlgorithmDefinition, AlgorithmStep, VisualState, VisualizerInput } from './engine/types';
import { algorithms, categories } from './algorithms';
import LeftPanel from './components/LeftPanel';
import Visualizer from './components/Visualizer';
import CodeViewer from './components/CodeViewer';
import ControlsBar from './components/ControlsBar';
import Inspector from './components/Inspector';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './styles/app.css';

const App: React.FC = () => {
  const [engine] = useState(() => new VisualizerEngine());
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [selectedId, setSelectedId] = useState(algorithms[0].id);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp'>('cpp');
  const algorithm = useMemo<AlgorithmDefinition>(
    () => algorithms.find((a) => a.id === selectedId) || algorithms[0],
    [selectedId]
  );
  const [input, setInput] = useState<VisualizerInput>(algorithm.defaults);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [currentState, setCurrentState] = useState<VisualState>({});
  const [position, setPosition] = useState({ index: -1, total: 0 });
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [scale, setScale] = useState(1);
  const permalinkHydrated = React.useRef(false);
  const [colSizes, setColSizes] = useState({ inspect: 300, visual: 720, code: 360 });
  const dragRef = React.useRef<{
    handle: 'inspect' | 'code';
    startX: number;
    startSizes: { inspect: number; visual: number; code: number };
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('state');
    if (encoded) {
      try {
        const payload = JSON.parse(atob(encoded));
        if (payload.algorithmId) setSelectedId(payload.algorithmId);
        if (payload.input) setInput(payload.input);
        permalinkHydrated.current = true;
      } catch (err) {
        console.warn('Failed to parse permalink', err);
      }
    }
  }, []);

  useEffect(() => {
    if (permalinkHydrated.current) {
      permalinkHydrated.current = false;
      return;
    }
    setInput(algorithm.defaults);
  }, [algorithm]);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const startDrag = (handle: 'inspect' | 'code') => (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { handle, startX: e.clientX, startSizes: colSizes };
    const onMove = (evt: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = evt.clientX - dragRef.current.startX;
      const { inspect, visual, code } = dragRef.current.startSizes;
      if (dragRef.current.handle === 'inspect') {
        const newInspect = clamp(inspect + dx, 200, 520);
        const newVisual = clamp(visual - (newInspect - inspect), 320, 1400);
        setColSizes({ inspect: newInspect, visual: newVisual, code });
      } else if (dragRef.current.handle === 'code') {
        const newVisual = clamp(visual + dx, 320, 1400);
        const newCode = clamp(code - dx, 240, 640);
        setColSizes({ inspect, visual: newVisual, code: newCode });
      }
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const rebuild = useCallback(() => {
    const { steps, initial } = algorithm.generator(input || algorithm.defaults);
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

  const randomArray = (size: number, min: number, max: number) => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    setInput((prev) => ({ ...prev, array: arr }));
  };

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
    (language === 'python' && algorithm.code.python) ||
    (language === 'cpp' && algorithm.code.cpp) ||
    algorithm.code.javascript;

  const exportSnapshot = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgRef.current?.clientWidth || 900;
      canvas.height = svgRef.current?.clientHeight || 500;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f5f7fb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'visualizer.png';
        link.href = pngUrl;
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const copyPermalink = async () => {
    const payload = { algorithmId: selectedId, input };
    const encoded = btoa(JSON.stringify(payload));
    const link = `${window.location.origin}${window.location.pathname}?state=${encoded}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link);
    }
    alert('Permalink copied to clipboard');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo" aria-hidden>
            Δ
          </div>
          <div>
            <div>DSA Visualizer</div>
            <small style={{ color: '#6b7280' }}>Deterministic, reversible steps</small>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#4b5565' }}>Space: Play/Pause · ←/→ Step · Export coming soon</div>
      </header>

      <main className="app-grid">
        <div className="area-alg">
          <LeftPanel
            algorithms={algorithms}
            categories={categories}
            selectedId={selectedId}
            onSelect={setSelectedId}
            input={input}
            onInputChange={setInput}
            onGenerateRandom={randomArray}
            onLoadExample={() => setInput(algorithm.defaults)}
            language={language}
            onLanguageChange={(lang) => setLanguage(lang)}
          />
        </div>
        <div
          className="pane-grid"
        >
          <div className="area-inspect">
            <Inspector step={currentStep} state={currentState} />
          </div>
          <div className="resize-handle" style={{ gridArea: 'handle1' }} />
          <div className="panel split-panel area-visual" aria-label="Visualizer">
            <div className="label-row" style={{ marginBottom: 6 }}>
              <h3 style={{ margin: 0 }}>{algorithm.name}</h3>
              <span className="tag">{algorithm.category}</span>
            </div>
            <Visualizer state={currentState} step={currentStep} svgRef={svgRef} scale={scale} />
          </div>
          <div className="resize-handle" style={{ gridArea: 'handle2' }} />
          <div className="panel split-panel area-code">
            <div className="label-row" style={{ marginBottom: 6 }}>
              <h3 style={{ margin: 0 }}>Code & Stack</h3>
              <span className="tag">{language}</span>
            </div>
            <CodeViewer code={currentCode} language={language} highlightLine={currentStep?.codeLine} />
          </div>
        </div>
      </main>

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
        onSnapshot={exportSnapshot}
        onPermalink={copyPermalink}
        scale={scale}
        onScaleChange={(v) => setScale(v)}
      />
    </div>
  );
};

export default App;
