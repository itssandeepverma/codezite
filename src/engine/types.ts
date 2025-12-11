export type StepType =
  | 'compare'
  | 'swap'
  | 'write'
  | 'read'
  | 'visit'
  | 'enqueue'
  | 'dequeue'
  | 'push'
  | 'pop'
  | 'merge'
  | 'partition'
  | 'recurse'
  | 'return'
  | 'mark'
  | 'info';

export type VisualState = {
  array?: number[];
  list?: Array<{ id: string; value: number; next?: string | null; role?: 'head' | 'tail' | 'current'; pos?: number }>;
  stack?: number[];
  queue?: number[];
  board?: {
    size: number;
    queens: Array<{ row: number; col: number; active?: boolean; conflict?: boolean }>;
    attempt?: { row: number; col: number };
    solved?: boolean;
  };
  graph?: {
    nodes: Array<{ id: string; label?: string; active?: boolean; visited?: boolean; frontier?: boolean }>;
    edges: Array<{ id: string; from: string; to: string; active?: boolean; visited?: boolean }>;
  };
  tree?: {
    nodes: Array<{ id: string; label: string; level: number; x: number; y: number; active?: boolean; visited?: boolean }>;
    edges: Array<{ id: string; from: string; to: string; active?: boolean }>;
  };
  highlight?: {
    indices?: number[];
    nodes?: string[];
    edges?: string[];
  };
  legend?: string;
  counters?: Record<string, number>;
};

export interface AlgorithmStep {
  id: string;
  type: StepType;
  payload?: Record<string, unknown>;
  codeLine: number;
  description: string;
  vars: Record<string, unknown>;
  state: VisualState;
  stack?: Array<{ name: string; params?: Record<string, unknown>; returnTo?: number }>;
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  generator: (input: VisualizerInput) => { steps: AlgorithmStep[]; initial: VisualState };
  code: {
    javascript: string;
    python?: string;
    cpp?: string;
  };
  inputKind: 'array' | 'graph' | 'list' | 'stackQueue' | 'tree' | 'nqueen';
  defaults: VisualizerInput;
}

export interface VisualizerInput {
  array?: number[];
  graph?: {
    nodes: string[];
    edges: Array<[string, string]>;
    directed?: boolean;
    start?: string;
  };
  list?: number[];
  stack?: number[];
  queue?: number[];
  tree?: number[];
  nQueens?: number;
}

export interface EngineCallbacks {
  onStep?: (payload: { step: AlgorithmStep | null; index: number; state: VisualState }) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}
