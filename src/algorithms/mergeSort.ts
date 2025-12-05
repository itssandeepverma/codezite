import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const lines = {
  fn: 1,
  base: 2,
  mid: 3,
  left: 4,
  right: 5,
  mergeCall: 6,
  mergeWhile: 13,
  mergeIf: 14,
  mergePushLeft: 15,
  mergePushRight: 18,
  mergeConcat: 22
};

interface Frame {
  name: string;
  params: Record<string, unknown>;
  returnTo?: number;
}

export function mergeSortSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const source = input.array || [];
  const arr = [...source];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  const stack: Frame[] = [];
  const treeLinks: Array<{ id: string; label: string; parent?: string }> = [];

  const captureState = (highlight: number[] = []): VisualState => ({
    array: [...arr],
    highlight: { indices: highlight },
    counters: { comparisons },
    legend: 'Merge Sort',
    tree: {
      nodes: treeLinks.map((n, idx) => ({
        id: n.id,
        label: n.label,
        level: n.id.split('-').length - 1,
        x: idx,
        y: n.id.split('-').length - 1,
        visited: true
      })),
      edges: treeLinks
        .filter((n) => n.parent)
        .map((n, idx) => ({
          id: `edge-${idx}`,
          from: n.parent as string,
          to: n.id
        }))
    }
  });

  const pushStep = (payload: Partial<AlgorithmStep> & { id: string; type: AlgorithmStep['type']; codeLine: number; description: string; vars?: Record<string, unknown>; highlight?: number[] }) => {
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

  const mergeSortRec = (l: number, r: number, path = `n-${l}-${r}`) => {
    treeLinks.push({ id: path, label: `${l}-${r}` });
    stack.push({ name: 'mergeSort', params: { l, r }, returnTo: lines.mergeCall });
    pushStep({
      id: `call-${l}-${r}`,
      type: 'info',
      codeLine: lines.fn,
      description: `Call mergeSort(${l}, ${r})`,
      vars: { l, r, path }
    });

    if (l >= r) {
      pushStep({
        id: `base-${l}-${r}`,
        type: 'return',
        codeLine: lines.base,
        description: 'Base case reached',
        vars: { l, r, path }
      });
      stack.pop();
      return;
    }

    const mid = Math.floor((l + r) / 2);
    pushStep({
      id: `mid-${l}-${r}`,
      type: 'info',
      codeLine: lines.mid,
      description: `mid=${mid}`,
      vars: { l, r, mid, path }
    });

    pushStep({
      id: `left-${l}-${mid}`,
      type: 'recurse',
      codeLine: lines.left,
      description: `Recurse left half`,
      vars: { l, mid, path }
    });
    mergeSortRec(l, mid, `${path}-L`);

    pushStep({
      id: `right-${mid + 1}-${r}`,
      type: 'recurse',
      codeLine: lines.right,
      description: `Recurse right half`,
      vars: { mid: mid + 1, r, path }
    });
    mergeSortRec(mid + 1, r, `${path}-R`);

    pushStep({
      id: `merge-${l}-${r}`,
      type: 'merge',
      codeLine: lines.mergeCall,
      description: `Merge halves l=${l}, mid=${mid}, r=${r}`,
      vars: { l, mid, r, path }
    });

    const left = arr.slice(l, mid + 1);
    const right = arr.slice(mid + 1, r + 1);
    let i = 0;
    let j = 0;
    let k = l;

    while (i < left.length && j < right.length) {
      comparisons += 1;
      pushStep({
        id: `compare-${k}`,
        type: 'compare',
        codeLine: lines.mergeIf,
        description: `Compare left[${i}]=${left[i]} and right[${j}]=${right[j]}`,
        vars: { i: l + i, j: mid + 1 + j, k, comparisons },
        highlight: [k, l + i, mid + 1 + j]
      });
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        pushStep({
          id: `write-left-${k}`,
          type: 'write',
          codeLine: lines.mergePushLeft,
          description: `Place ${left[i]} from left into position ${k}`,
          vars: { value: left[i], k, comparisons },
          highlight: [k]
        });
        i += 1;
      } else {
        arr[k] = right[j];
        pushStep({
          id: `write-right-${k}`,
          type: 'write',
          codeLine: lines.mergePushRight,
          description: `Place ${right[j]} from right into position ${k}`,
          vars: { value: right[j], k, comparisons },
          highlight: [k]
        });
        j += 1;
      }
      k += 1;
    }

    while (i < left.length) {
      arr[k] = left[i];
      pushStep({
        id: `concat-left-${k}`,
        type: 'write',
        codeLine: lines.mergeConcat,
        description: `Append remaining left value ${left[i]} to position ${k}`,
        vars: { value: left[i], k },
        highlight: [k]
      });
      i += 1;
      k += 1;
    }

    while (j < right.length) {
      arr[k] = right[j];
      pushStep({
        id: `concat-right-${k}`,
        type: 'write',
        codeLine: lines.mergeConcat,
        description: `Append remaining right value ${right[j]} to position ${k}`,
        vars: { value: right[j], k },
        highlight: [k]
      });
      j += 1;
      k += 1;
    }

    stack.pop();
  };

  const initial = captureState();
  mergeSortRec(0, arr.length - 1);
  return { steps, initial };
}
