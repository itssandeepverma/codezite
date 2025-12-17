import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const lines = {
  fn: 1,
  guard: 2,
  init: 3,
  base0: 4,
  base1: 5,
  loop: 6,
  rec: 7,
  ret: 9
};

export function climbStairsSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const n = Math.max(1, Math.min(25, input.n ?? input.array?.[0] ?? 5));
  const steps: AlgorithmStep[] = [];
  const dp = Array(n + 1).fill(0);

  const capture = (highlight: number[] = [], vars: Record<string, unknown> = {}): VisualState => ({
    array: [...dp],
    arrayMode: 'cells' as const,
    highlight: { indices: highlight },
    counters: { n, ...(vars as Record<string, number>) },
    legend: 'Climbing Stairs (DP)'
  });

  const push = (s: AlgorithmStep) => steps.push({ ...s, stack: s.stack || [] });

  push({
    id: 'start',
    type: 'info',
    codeLine: lines.fn,
    description: `Start climbStairs with n=${n}`,
    vars: { n },
    state: capture()
  });

  if (n <= 1) {
    dp[n] = 1;
    push({
      id: 'base',
      type: 'return',
      codeLine: lines.guard,
      description: 'Base case n <= 1',
      vars: { n },
      state: capture([n])
    });
    return { steps, initial: capture() };
  }

  push({
    id: 'init-array',
    type: 'info',
    codeLine: lines.init,
    description: 'Initialize dp array',
    vars: { n },
    state: capture()
  });

  dp[0] = 1;
  push({
    id: 'set-0',
    type: 'write',
    codeLine: lines.base0,
    description: 'dp[0] = 1',
    vars: { index: 0 },
    state: capture([0])
  });

  dp[1] = 1;
  push({
    id: 'set-1',
    type: 'write',
    codeLine: lines.base1,
    description: 'dp[1] = 1',
    vars: { index: 1 },
    state: capture([1])
  });

  for (let i = 2; i <= n; i++) {
    push({
      id: `loop-${i}`,
      type: 'info',
      codeLine: lines.loop,
      description: `Compute dp[${i}]`,
      vars: { i },
      state: capture([i, i - 1, i - 2], { i })
    });
    dp[i] = dp[i - 1] + dp[i - 2];
    push({
      id: `dp-${i}`,
      type: 'write',
      codeLine: lines.rec,
      description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}`,
      vars: { i, left: dp[i - 1], right: dp[i - 2], value: dp[i] },
      state: capture([i, i - 1, i - 2], { i })
    });
  }

  push({
    id: 'return',
    type: 'return',
    codeLine: lines.ret,
    description: `Return dp[${n}] = ${dp[n]}`,
    vars: { result: dp[n] },
    state: capture([n])
  });

  const initial = {
    array: Array(n + 1).fill(0),
    arrayMode: 'cells' as const,
    highlight: { indices: [] },
    counters: { n },
    legend: 'Climbing Stairs (DP)'
  };
  return { steps, initial };
}
