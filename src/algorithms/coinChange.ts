import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const lines = {
  fn: 1,
  init: 2,
  base: 3,
  outer: 4,
  inner: 5,
  update: 6,
  ret: 9
};

export function coinChangeSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const coins = (input.coins && input.coins.length ? input.coins : [1, 2, 5]).map((c) => Math.max(1, Math.floor(c)));
  const amount = Math.max(1, Math.min(50, input.amount ?? 11));
  const steps: AlgorithmStep[] = [];
  const INF = amount + 1;
  const dp = Array(amount + 1).fill(INF);

  const capture = (highlight: number[] = [], vars: Record<string, unknown> = {}): VisualState => ({
    array: [...dp],
    arrayMode: 'cells' as const,
    highlight: { indices: highlight },
    counters: { amount, coins: coins.length, ...(vars as Record<string, number>) },
    legend: 'Coin Change (min coins)'
  });

  const push = (s: AlgorithmStep) => steps.push({ ...s, stack: s.stack || [] });

  push({
    id: 'start',
    type: 'info',
    codeLine: lines.fn,
    description: `Start coinChange for amount=${amount}`,
    vars: { amount, coins },
    state: capture()
  });

  push({
    id: 'init-dp',
    type: 'info',
    codeLine: lines.init,
    description: 'Init dp with INF',
    vars: { INF, length: amount + 1 },
    state: capture()
  });

  dp[0] = 0;
  push({
    id: 'set-zero',
    type: 'write',
    codeLine: lines.base,
    description: 'dp[0] = 0',
    vars: { index: 0 },
    state: capture([0])
  });

  for (const coin of coins) {
    push({
      id: `coin-${coin}`,
      type: 'info',
      codeLine: lines.outer,
      description: `Use coin ${coin}`,
      vars: { coin },
      state: capture([], { coin })
    });
    for (let a = coin; a <= amount; a++) {
      push({
        id: `try-${coin}-${a}`,
        type: 'compare',
        codeLine: lines.inner,
        description: `Check amount ${a} with coin ${coin}`,
        vars: { coin, amount: a, prev: dp[a - coin] },
        state: capture([a, a - coin], { coin, a })
      });
      const candidate = 1 + dp[a - coin];
      if (candidate < dp[a]) {
        dp[a] = candidate;
        push({
          id: `update-${coin}-${a}`,
          type: 'write',
          codeLine: lines.update,
          description: `Update dp[${a}] = ${candidate}`,
          vars: { coin, a, value: candidate },
          state: capture([a, a - coin], { coin, a })
        });
      }
    }
  }

  const result = dp[amount] >= INF ? -1 : dp[amount];
  push({
    id: 'return',
    type: 'return',
    codeLine: lines.ret,
    description: `Return ${result}`,
    vars: { result },
    state: capture([amount], { result })
  });

  const initial: VisualState = {
    array: Array(amount + 1).fill(0),
    arrayMode: 'cells' as const,
    highlight: { indices: [] },
    counters: { amount },
    legend: 'Coin Change (min coins)'
  };
  return { steps, initial };
}
