import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const stackLines = { push: 4, pop: 6 };
const queueLines = { enqueue: 4, dequeue: 6 };

export function stackSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const values = input.stack || [];
  const stack: number[] = [];
  const steps: AlgorithmStep[] = [];
  const capture = (): VisualState => ({
    stack: [...stack],
    legend: 'Stack',
    counters: { size: stack.length }
  });

  const initial = capture();
  values.forEach((v, idx) => {
    stack.push(v);
    steps.push({
      id: `push-${idx}`,
      type: 'push',
      codeLine: stackLines.push,
      description: `Push ${v}`,
      vars: { value: v },
      state: capture()
    });
  });

  if (stack.length) {
    const popped = stack.pop() as number;
    steps.push({
      id: `pop-0`,
      type: 'pop',
      codeLine: stackLines.pop,
      description: `Pop ${popped}`,
      vars: { value: popped },
      state: capture()
    });
  }

  return { steps, initial };
}

export function queueSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const values = input.queue || [];
  const queue: number[] = [];
  const steps: AlgorithmStep[] = [];
  const capture = (): VisualState => ({
    queue: [...queue],
    legend: 'Queue',
    counters: { size: queue.length }
  });

  const initial = capture();
  values.forEach((v, idx) => {
    queue.push(v);
    steps.push({
      id: `enqueue-${idx}`,
      type: 'enqueue',
      codeLine: queueLines.enqueue,
      description: `Enqueue ${v}`,
      vars: { value: v },
      state: capture()
    });
  });

  if (queue.length) {
    const v = queue.shift() as number;
    steps.push({
      id: `dequeue-0`,
      type: 'dequeue',
      codeLine: queueLines.dequeue,
      description: `Dequeue ${v}`,
      vars: { value: v },
      state: capture()
    });
  }

  return { steps, initial };
}
