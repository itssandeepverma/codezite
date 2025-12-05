import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const lines = {
  outer: 3,
  inner: 4,
  compare: 5,
  swap: 6
};

export function bubbleSortSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const source = input.array || [];
  const arr = [...source];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const makeState = (highlight: number[] = []): VisualState => ({
    array: [...arr],
    highlight: { indices: highlight },
    counters: { comparisons, swaps },
    legend: 'Bubble Sort'
  });
  const initial = makeState();

  for (let i = 0; i < arr.length; i += 1) {
    steps.push({
      id: `outer-${i}`,
      type: 'info',
      codeLine: lines.outer,
      description: `Outer loop i=${i}`,
      vars: { i },
      state: makeState(),
      stack: []
    });
    for (let j = 0; j < arr.length - i - 1; j += 1) {
      comparisons += 1;
      steps.push({
        id: `compare-${i}-${j}`,
        type: 'compare',
        codeLine: lines.compare,
        description: `Compare indices ${j} and ${j + 1}`,
        vars: { i, j, a: arr[j], b: arr[j + 1], comparisons, swaps },
        state: makeState([j, j + 1])
      });
      if (arr[j] > arr[j + 1]) {
        swaps += 1;
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          id: `swap-${i}-${j}`,
          type: 'swap',
          codeLine: lines.swap,
          description: `Swap ${arr[j + 1]} and ${arr[j]}`,
          vars: { i, j, arr: [...arr], comparisons, swaps },
          state: makeState([j, j + 1])
        });
      }
    }
  }

  return { steps, initial };
}
