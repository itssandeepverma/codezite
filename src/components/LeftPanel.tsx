import React, { useMemo, useState } from 'react';
import { AlgorithmDefinition, VisualizerInput } from '../engine/types';
import '../styles/app.css';

interface LeftPanelProps {
  algorithms: AlgorithmDefinition[];
  categories: string[];
  selectedId: string;
  onSelect: (id: string) => void;
  input: VisualizerInput;
  onInputChange: (input: VisualizerInput) => void;
  onGenerateRandom: (size: number, min: number, max: number) => void;
  onLoadExample: () => void;
  language: 'javascript' | 'python' | 'cpp';
  onLanguageChange: (lang: 'javascript' | 'python' | 'cpp') => void;
}

const groupByCategory = (items: AlgorithmDefinition[]) =>
  items.reduce<Record<string, AlgorithmDefinition[]>>((acc, algo) => {
    acc[algo.category] = acc[algo.category] || [];
    acc[algo.category].push(algo);
    return acc;
  }, {});

const LeftPanel: React.FC<LeftPanelProps> = ({
  algorithms,
  categories,
  selectedId,
  onSelect,
  input,
  onInputChange,
  onGenerateRandom,
  onLoadExample,
  language,
  onLanguageChange
}) => {
  const grouped = useMemo(() => groupByCategory(algorithms), [algorithms]);
  const [size, setSize] = useState(8);
  const [range, setRange] = useState<[number, number]>([1, 99]);
  const [manual, setManual] = useState('');

  const selectedAlgo = algorithms.find((a) => a.id === selectedId);

  const handleManualSubmit = () => {
    const numbers = manual
      .split(/[,\s]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n));
    if (!numbers.length) return;
    if (selectedAlgo?.inputKind === 'array') {
      onInputChange({ ...input, array: numbers });
    } else if (selectedAlgo?.inputKind === 'list') {
      onInputChange({ ...input, list: numbers });
    } else if (selectedAlgo?.inputKind === 'tree') {
      onInputChange({ ...input, tree: numbers });
    } else if (selectedAlgo?.id === 'stack') {
      onInputChange({ ...input, stack: numbers });
    } else if (selectedAlgo?.id === 'queue') {
      onInputChange({ ...input, queue: numbers });
    } else if (selectedAlgo?.inputKind === 'nqueen') {
      if (numbers[0]) {
        onInputChange({ ...input, nQueens: numbers[0] });
      }
    }
  };

  return (
    <div className="panel compact-panel" aria-label="Algorithm settings">
      <div className="top-controls">
        <div className="inline-field">
          <label htmlFor="algo-select">Algorithm</label>
          <select
            id="algo-select"
            className="selector"
            aria-label="Select algorithm"
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
          >
            {categories.map((cat) => (
              <optgroup key={cat} label={cat}>
                {grouped[cat]?.map((algo) => (
                  <option key={algo.id} value={algo.id}>
                    {algo.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {selectedAlgo?.inputKind === 'array' && (
          <>
            <div className="inline-field small">
              <label htmlFor="array-size">Array size</label>
              <input
                id="array-size"
                aria-label="Array size"
                type="number"
                min={2}
                max={50}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </div>
            <div className="inline-field small">
              <label>Value range</label>
              <div className="range-pair">
                <input
                  type="number"
                  aria-label="Min value"
                  value={range[0]}
                  onChange={(e) => setRange([Number(e.target.value), range[1]])}
                />
                <input
                  type="number"
                  aria-label="Max value"
                  value={range[1]}
                  onChange={(e) => setRange([range[0], Number(e.target.value)])}
                />
              </div>
            </div>
            <button className="control-button ghost" onClick={() => onGenerateRandom(size, range[0], range[1])}>
              Random
            </button>
            <button className="control-button ghost" onClick={onLoadExample}>
              Example
            </button>
          </>
        )}

        {['array', 'list', 'stackQueue', 'tree', 'nqueen'].includes(selectedAlgo?.inputKind || '') && (
          <div className="inline-field grow">
            <label htmlFor="manual-input">Manual input</label>
            <div className="manual-row">
              <input
                id="manual-input"
                className="text-inline"
                aria-label="Manual input"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder={selectedAlgo?.inputKind === 'nqueen' ? 'Enter N (e.g., 8)' : '4, 2, 7, 1'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleManualSubmit();
                }}
              />
              <button className="control-button ghost" onClick={handleManualSubmit}>
                Apply
              </button>
            </div>
          </div>
        )}

        {selectedAlgo?.inputKind === 'nqueen' && (
          <div className="inline-field small">
            <label htmlFor="nq-size">Board size (N)</label>
            <input
              id="nq-size"
              type="number"
              min={4}
              max={12}
              value={input.nQueens ?? 4}
              onChange={(e) => onInputChange({ ...input, nQueens: Number(e.target.value) || 4 })}
            />
          </div>
        )}

        <div className="inline-field">
          <label>Code language</label>
          <div className="field-row">
            <label>
              <input
                type="radio"
                name="language"
                value="javascript"
                checked={language === 'javascript'}
                onChange={() => onLanguageChange('javascript')}
              />
              JS
            </label>
            <label>
              <input
                type="radio"
                name="language"
                value="python"
                checked={language === 'python'}
                onChange={() => onLanguageChange('python')}
              />
              Py
            </label>
            <label>
              <input
                type="radio"
                name="language"
                value="cpp"
                checked={language === 'cpp'}
                onChange={() => onLanguageChange('cpp')}
              />
              C++
            </label>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#4b5565' }}>{selectedAlgo?.description}</p>
    </div>
  );
};

export default LeftPanel;
