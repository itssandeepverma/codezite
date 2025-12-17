import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';
import { createStepBuilder } from '../engine/stepBuilder';

const lines = {
  fn: 1,
  mapInit: 2,
  loop: 3,
  need: 4,
  find: 5,
  check: 6,
  insert: 9,
  ret: 7
};

export function twoSumSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const nums = input.array || [];
  const target = input.target ?? 9;
  const steps: AlgorithmStep[] = [];
  const map = new Map<number, number>();

  const mapList = () =>
    Array.from(map.entries()).map(([value, idx], pos) => ({
      id: `${value}-${idx}`,
      value,
      pos,
      role: 'current' as const,
      next: idx.toString()
    }));

  const capture = (highlight: number[] = [], desc = ''): VisualState => ({
    array: [...nums],
    arrayMode: 'cells',
    highlight: { indices: highlight },
    list: mapList(),
    legend: desc || `map size: ${map.size}`,
    counters: { target, map: map.size }
  });

  const push = createStepBuilder(steps, { capture });

  push({ id: 'start', type: 'info', codeLine: lines.fn, description: `Start twoSum target=${target}` });
  push({ id: 'init-map', type: 'info', codeLine: lines.mapInit, description: 'Initialize empty map' });

  let found = false;
  for (let i = 0; i < nums.length && !found; i++) {
    const num = nums[i];
    push({
      id: `loop-${i}`,
      type: 'info',
      codeLine: lines.loop,
      description: `i=${i}, num=${num}`,
      vars: { i, num },
      highlight: [i]
    });

    const need = target - num;
    push({
      id: `need-${i}`,
      type: 'info',
      codeLine: lines.need,
      description: `need=${need}`,
      vars: { need, i },
      highlight: [i]
    });

    push({
      id: `find-${i}`,
      type: 'info',
      codeLine: lines.find,
      description: `lookup need=${need}`,
      vars: { need, i },
      highlight: [i]
    });

    if (map.has(need)) {
      push({
        id: `check-true-${i}`,
        type: 'compare',
        codeLine: lines.check,
        description: `map has ${need} -> true`,
        vars: { need, i },
        highlight: [i, map.get(need)!]
      });
      const j = map.get(need)!;
      push({
        id: `return-${i}`,
        type: 'return',
        codeLine: lines.ret,
        description: `Return indices [${j}, ${i}]`,
        vars: { i, j },
        highlight: [i, j]
      });
      found = true;
      break;
    }
    push({
      id: `check-false-${i}`,
      type: 'compare',
      codeLine: lines.check,
      description: `map has ${need} -> false`,
      vars: { need, i },
      highlight: [i]
    });

    map.set(num, i);
    push({
      id: `insert-${i}`,
      type: 'write',
      codeLine: lines.insert,
      description: `Insert map[${num}]=${i}`,
      vars: { i, num },
      highlight: [i]
    });
  }

  push({
    id: 'no-solution',
    type: 'return',
    codeLine: lines.ret,
    description: 'No solution found',
    vars: {},
    highlight: []
  });

  const initial = capture([], 'Ready to visualize');
  return { steps, initial };
}
