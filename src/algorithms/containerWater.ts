import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';
import { createStepBuilder } from '../engine/stepBuilder';

const lines = {
  fn: 1,
  init: 2,
  loop: 3,
  area: 4,
  best: 5,
  move: 6,
  ret: 8
};

export function containerWaterSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const h = input.array || [];
  const steps: AlgorithmStep[] = [];
  let l = 0;
  let r = h.length - 1;
  let best = 0;

  const capture = (highlight: number[] = [], desc = '', vars?: Record<string, unknown>): VisualState => {
    const areaVal = vars && typeof vars.area === 'number' ? (vars.area as number) : 0;
    return {
      array: [...h],
      arrayMode: 'bars',
      highlight: { indices: highlight },
      legend: desc || `best=${best}`,
      counters: { l, r, best, area: areaVal }
    };
  };

  const push = createStepBuilder(steps, { capture });

  push({ id: 'start', type: 'info', codeLine: lines.fn, description: 'Start maxArea' });
  push({ id: 'init', type: 'info', codeLine: lines.init, description: `l=0, r=${r}, best=0`, vars: { l, r, best }, highlight: [l, r] });

  while (l < r) {
    push({ id: `loop-${l}-${r}`, type: 'info', codeLine: lines.loop, description: `loop while l(${l}) < r(${r})`, vars: { l, r, best }, highlight: [l, r] });

    const area = Math.min(h[l], h[r]) * (r - l);
    push({
      id: `area-${l}-${r}`,
      type: 'info',
      codeLine: lines.area,
      description: `area=${area}`,
      vars: { l, r, area, hl: h[l], hr: h[r] },
      highlight: [l, r]
    });

    if (area > best) {
      best = area;
      push({
        id: `best-${l}-${r}`,
        type: 'write',
        codeLine: lines.best,
        description: `best=${best}`,
        vars: { best, l, r, area },
        highlight: [l, r]
      });
    } else {
      push({
        id: `best-skip-${l}-${r}`,
        type: 'info',
        codeLine: lines.best,
        description: `best stays ${best}`,
        vars: { best, l, r, area },
        highlight: [l, r]
      });
    }

    if (h[l] < h[r]) {
      push({
        id: `move-left-${l}-${r}`,
        type: 'info',
        codeLine: lines.move,
        description: 'h[l] < h[r], move l++',
        vars: { l, r, hl: h[l], hr: h[r] },
        highlight: [l, r]
      });
      l += 1;
    } else {
      push({
        id: `move-right-${l}-${r}`,
        type: 'info',
        codeLine: lines.move,
        description: 'h[l] >= h[r], move r--',
        vars: { l, r, hl: h[l], hr: h[r] },
        highlight: [l, r]
      });
      r -= 1;
    }
  }

  push({
    id: 'return',
    type: 'return',
    codeLine: lines.ret,
    description: `Return best=${best}`,
    vars: { best },
    highlight: []
  });

  const initial = capture([], 'Ready to visualize');
  return { steps, initial };
}
