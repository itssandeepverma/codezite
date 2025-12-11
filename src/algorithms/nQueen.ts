import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const lines = {
  solve: 1,
  setup: 2,
  guard: 8,
  forLoop: 11,
  conflictCheck: 12,
  place: 13,
  markCol: 14,
  markDiag1: 15,
  markDiag2: 16,
  recurse: 17,
  unplace: 18,
  unmarkCol: 19,
  unmarkDiag1: 20,
  unmarkDiag2: 21,
  done: 26,
  returnBoard: 27
};

interface Frame {
  name: string;
  params: Record<string, unknown>;
  returnTo?: number;
}

export function nQueenSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const n = Math.max(4, Math.min(10, input.nQueens ?? 4));
  const steps: AlgorithmStep[] = [];
  const queens: Array<{ row: number; col: number }> = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();
  const stack: Frame[] = [];
  let solutions = 0;

  const captureState = (
    attempt?: { row: number; col: number },
    conflictCell?: { row: number; col: number },
    solved = false
  ): VisualState => ({
    board: {
      size: n,
      attempt,
      solved,
      queens: queens.map((q, idx) => ({
        ...q,
        active: idx === queens.length - 1,
        conflict: conflictCell && conflictCell.row === q.row && conflictCell.col === q.col
      }))
    },
    legend: 'N-Queens backtracking',
    counters: { queens: queens.length, solutions }
  });

  const pushStep = (payload: {
    id: string;
    type: AlgorithmStep['type'];
    codeLine: number;
    description: string;
    vars?: Record<string, unknown>;
    attempt?: { row: number; col: number };
    conflictCell?: { row: number; col: number };
    solved?: boolean;
  }) => {
    steps.push({
      id: payload.id,
      type: payload.type,
      codeLine: payload.codeLine,
      description: payload.description,
      vars: payload.vars || {},
      state: captureState(payload.attempt, payload.conflictCell, payload.solved),
      stack: [...stack]
    });
  };

  const backtrack = (row: number) => {
    stack.push({ name: 'backtrack', params: { row }, returnTo: lines.forLoop });
    pushStep({
      id: `enter-${row}`,
      type: 'info',
      codeLine: lines.solve,
      description: `Explore row ${row}`,
      vars: { row }
    });

    if (row === n) {
      solutions += 1;
      pushStep({
        id: `solution-${solutions}`,
        type: 'return',
        codeLine: lines.guard,
        description: `Solution #${solutions} found`,
        vars: { solutions },
        solved: true
      });
      stack.pop();
      return;
    }

    for (let col = 0; col < n; col++) {
      const conflict = cols.has(col) || diag1.has(row - col) || diag2.has(row + col);
      pushStep({
        id: `try-${row}-${col}`,
        type: conflict ? 'compare' : 'info',
        codeLine: conflict ? lines.conflictCheck : lines.forLoop,
        description: conflict ? `Conflict at (${row}, ${col})` : `Try placing at (${row}, ${col})`,
        vars: { row, col },
        attempt: { row, col }
      });
      if (conflict) continue;

      pushStep({
        id: `place-line-${row}-${col}`,
        type: 'info',
        codeLine: lines.place,
        description: `Place queen at (${row}, ${col})`,
        vars: { row, col },
        attempt: { row, col }
      });

      queens.push({ row, col });
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);

      pushStep({
        id: `place-${row}-${col}`,
        type: 'write',
        codeLine: lines.place,
        description: `Place queen at row ${row}, col ${col}`,
        vars: { row, col }
      });

      pushStep({
        id: `mark-col-${row}-${col}`,
        type: 'info',
        codeLine: lines.markCol,
        description: `Mark column ${col}`,
        vars: { col }
      });

      pushStep({
        id: `mark-diag1-${row}-${col}`,
        type: 'info',
        codeLine: lines.markDiag1,
        description: `Mark diag1 ${row - col}`,
        vars: { diag1: row - col }
      });

      pushStep({
        id: `mark-diag2-${row}-${col}`,
        type: 'info',
        codeLine: lines.markDiag2,
        description: `Mark diag2 ${row + col}`,
        vars: { diag2: row + col }
      });

      pushStep({
        id: `recurse-${row}-${col}`,
        type: 'recurse',
        codeLine: lines.recurse,
        description: `Recurse to row ${row + 1}`,
        vars: { nextRow: row + 1 }
      });

      backtrack(row + 1);

      pushStep({
        id: `unplace-line-${row}-${col}`,
        type: 'info',
        codeLine: lines.unplace,
        description: `Backtrack from (${row}, ${col})`,
        vars: { row, col }
      });

      queens.pop();
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);

      pushStep({
        id: `backtrack-${row}-${col}`,
        type: 'pop',
        codeLine: lines.unplace,
        description: `Remove queen from row ${row}, col ${col}`,
        vars: { row, col }
      });

      pushStep({
        id: `unmark-col-${row}-${col}`,
        type: 'info',
        codeLine: lines.unmarkCol,
        description: `Unmark column ${col}`,
        vars: { col }
      });

      pushStep({
        id: `unmark-diag1-${row}-${col}`,
        type: 'info',
        codeLine: lines.unmarkDiag1,
        description: `Unmark diag1 ${row - col}`,
        vars: { diag1: row - col }
      });

      pushStep({
        id: `unmark-diag2-${row}-${col}`,
        type: 'info',
        codeLine: lines.unmarkDiag2,
        description: `Unmark diag2 ${row + col}`,
        vars: { diag2: row + col }
      });
    }

    stack.pop();
  };

  // Entry setup
  pushStep({
    id: 'start-solve',
    type: 'info',
    codeLine: lines.solve,
    description: `Start solveNQueens with n=${n}`
  });
  pushStep({
    id: 'init-sets',
    type: 'info',
    codeLine: lines.setup,
    description: 'Initialize tracking sets',
    vars: { n }
  });

  const initial = captureState();
  backtrack(0);

  if (solutions === 0) {
    pushStep({
      id: 'no-solution',
      type: 'info',
      codeLine: lines.done,
      description: 'No solution found',
      vars: { n }
    });
  } else {
    pushStep({
      id: 'done',
      type: 'return',
      codeLine: lines.done,
      description: `Completed with ${solutions} solution${solutions > 1 ? 's' : ''}`,
      vars: { solutions },
      solved: true
    });
  }

  pushStep({
    id: 'return-board',
    type: 'return',
    codeLine: lines.returnBoard,
    description: 'Return board positions',
    vars: { board: queens.map((q) => ({ row: q.row, col: q.col })) },
    solved: solutions > 0
  });

  return { steps, initial };
}
