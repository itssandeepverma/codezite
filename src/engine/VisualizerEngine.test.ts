import { describe, expect, it, vi } from 'vitest';
import VisualizerEngine from './VisualizerEngine';
import { AlgorithmStep, VisualState } from './types';

const makeSteps = (count: number): { steps: AlgorithmStep[]; initial: VisualState } => {
  const initial: VisualState = { array: [0] };
  const steps: AlgorithmStep[] = [];
  for (let i = 0; i < count; i += 1) {
    steps.push({
      id: `s${i}`,
      type: 'info',
      payload: {},
      codeLine: i + 1,
      description: `step ${i}`,
      vars: { i },
      state: { array: [i + 1] }
    });
  }
  return { steps, initial };
};

describe('VisualizerEngine', () => {
  it('steps forward and backward deterministically', () => {
    const { steps, initial } = makeSteps(3);
    const engine = new VisualizerEngine();
    const onStep = vi.fn();
    engine.load(steps, initial, { onStep });

    engine.stepForward();
    engine.stepForward();
    engine.stepBackward();

    expect(onStep).toHaveBeenCalledTimes(4);
    const lastCall = onStep.mock.calls.at(-1)?.[0];
    expect(lastCall?.index).toBe(0);
    expect(lastCall?.state.array).toEqual([1]);
  });

  it('reset returns to initial state', () => {
    const { steps, initial } = makeSteps(2);
    const engine = new VisualizerEngine();
    const onStep = vi.fn();
    engine.load(steps, initial, { onStep });

    engine.stepForward();
    engine.reset();

    const last = onStep.mock.calls.at(-1)?.[0];
    expect(last?.index).toBe(-1);
    expect(last?.state).toEqual(initial);
  });
});
