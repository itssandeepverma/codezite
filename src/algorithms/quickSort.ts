import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const lines = {
  guard: 2,
  partition: 3,
  left: 4,
  right: 5,
  pivot: 10,
  iInit: 11,
  loop: 12,
  lessThan: 13,
  swap: 14,
  pivotSwap: 18
};

interface Frame {
  name: string;
  params: Record<string, unknown>;
  returnTo?: number;
}

export function quickSortSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const source = input.array || [];
  const arr = [...source];
  const steps: AlgorithmStep[] = [];
  const stack: Frame[] = [];
  let swaps = 0;
  let comparisons = 0;

  const captureState = (highlight: number[] = []): VisualState => ({
    array: [...arr],
    highlight: { indices: highlight },
    legend: 'Quick Sort',
    counters: { swaps, comparisons }
  });

  const pushStep = (payload: {
    id: string;
    type: AlgorithmStep['type'];
    codeLine: number;
    description: string;
    vars?: Record<string, unknown>;
    highlight?: number[];
  }) => {
    steps.push({
      id: payload.id,
      type: payload.type,
      codeLine: payload.codeLine,
      description: payload.description,
      vars: payload.vars || {},
      state: captureState(payload.highlight),
      stack: [...stack]
    });
  };

  const partition = (low: number, high: number) => {
    const pivot = arr[high];
    let i = low;
    pushStep({ id: `pivot-${high}`, type: 'info', codeLine: lines.pivot, description: `Pivot ${pivot} at ${high}`, vars: { pivot, low, high }, highlight: [high] });
    pushStep({ id: `i-${low}`, type: 'info', codeLine: lines.iInit, description: `i starts at ${i}`, vars: { i }, highlight: [i] });
    for (let j = low; j < high; j += 1) {
      comparisons += 1;
      pushStep({ id: `loop-${low}-${high}-${j}`, type: 'compare', codeLine: lines.lessThan, description: `Compare arr[${j}] < pivot`, vars: { j, pivot, value: arr[j], comparisons }, highlight: [j, high] });
      if (arr[j] < pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps += 1;
        pushStep({ id: `swap-${i}-${j}`, type: 'swap', codeLine: lines.swap, description: `Swap indices ${i} and ${j}`, vars: { i, j, swaps }, highlight: [i, j] });
        i += 1;
      }
    }
    [arr[i], arr[high]] = [arr[high], arr[i]];
    swaps += 1;
    pushStep({ id: `pivot-swap-${i}-${high}`, type: 'swap', codeLine: lines.pivotSwap, description: `Place pivot at position ${i}`, vars: { i, high, swaps }, highlight: [i, high] });
    return i;
  };

  const quickRec = (low: number, high: number) => {
    stack.push({ name: 'quickSort', params: { low, high }, returnTo: lines.partition });
    if (low < high) {
      pushStep({ id: `partition-${low}-${high}`, type: 'partition', codeLine: lines.partition, description: `Partition range ${low}-${high}`, vars: { low, high } });
      const p = partition(low, high);
      pushStep({ id: `left-${low}-${p - 1}`, type: 'recurse', codeLine: lines.left, description: `Left recursion ${low}-${p - 1}`, vars: { low, high: p - 1 } });
      quickRec(low, p - 1);
      pushStep({ id: `right-${p + 1}-${high}`, type: 'recurse', codeLine: lines.right, description: `Right recursion ${p + 1}-${high}`, vars: { low: p + 1, high } });
      quickRec(p + 1, high);
    }
    stack.pop();
  };

  const initial = captureState();
  quickRec(0, arr.length - 1);
  return { steps, initial };
}
