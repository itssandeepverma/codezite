import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const lines = {
  prev: 2,
  current: 3,
  loop: 4,
  nextNode: 5,
  link: 6,
  advancePrev: 7,
  advanceCurrent: 8
};

const recursionLines = {
  def: 1,
  base: 2,
  recurse: 3,
  rewire: 4,
  nullify: 5,
  ret: 6
};

interface ListNodeState {
  id: string;
  value: number;
  next?: string | null;
  role?: 'head' | 'tail' | 'current';
}

export function reverseLinkedListSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const values = input.list || [];
  const nodes: ListNodeState[] = values.map((v, idx) => ({ id: `n${idx}`, value: v, next: idx < values.length - 1 ? `n${idx + 1}` : null, pos: idx }));
  let prev: string | null = null;
  let current: string | null = nodes[0]?.id ?? null;
  let head: string | null = nodes[0]?.id ?? null;
  const steps: AlgorithmStep[] = [];

  const captureState = (): VisualState => {
    const tailId = nodes.find((n) => !n.next)?.id || null;
    return {
      list: nodes.map((n) => ({
        ...n,
        role: n.id === current ? 'current' : n.id === head ? 'head' : n.id === tailId ? 'tail' : undefined
      })),
      legend: 'Reverse Linked List',
      counters: { rewired: steps.filter((s) => s.type === 'write').length }
    };
  };

  const initial = captureState();

  while (current) {
    const currNode = nodes.find((n) => n.id === current)!;
    steps.push({
      id: `next-${current}`,
      type: 'read',
      codeLine: lines.nextNode,
      description: `Store next of ${current}`,
      vars: { current, next: currNode.next, head, prev },
      state: captureState()
    });
    const nextNode = currNode.next;
    currNode.next = prev;
    steps.push({
      id: `rewire-${current}`,
      type: 'write',
      codeLine: lines.link,
      description: `Point ${current}.next to ${prev ?? 'null'}`,
      vars: { current, prev, head },
      state: captureState()
    });
    prev = current;
    head = prev; // current prev becomes new head of reversed portion
    steps.push({
      id: `advance-prev-${current}`,
      type: 'info',
      codeLine: lines.advancePrev,
      description: `Move prev to ${current}`,
      vars: { prev, head },
      state: captureState()
    });
    current = nextNode;
    steps.push({
      id: `advance-curr-${current ?? 'null'}`,
      type: 'info',
      codeLine: lines.advanceCurrent,
      description: `Move current to ${current ?? 'null'}`,
      vars: { current, head, prev },
      state: captureState()
    });
  }

  return { steps, initial };
}

export function reverseLinkedListRecursiveSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const values = input.list || [];
  const nodes: ListNodeState[] = values.map((v, idx) => ({ id: `n${idx}`, value: v, next: idx < values.length - 1 ? `n${idx + 1}` : null, pos: idx }));
  const steps: AlgorithmStep[] = [];
  let head: string | null = nodes[0]?.id ?? null;
  const map = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const stackFrames: Array<{ name: string; params: Record<string, unknown> }> = [];

  const captureState = (current?: string, prev?: string): VisualState => {
    const tailId = nodes.find((n) => !n.next)?.id || null;
    return {
      list: nodes.map((n) => ({
        ...n,
        role: n.id === current ? 'current' : n.id === head ? 'head' : n.id === tailId ? 'tail' : undefined
      })),
      legend: 'Reverse Linked List (Recursive)',
      counters: { rewired: steps.filter((s) => s.type === 'write').length }
    };
  };

  const reverseRec = (nodeId: string | null): string | null => {
    stackFrames.push({ name: 'reverseList', params: { node: nodeId } });
    steps.push({
      id: `enter-${nodeId ?? 'null'}`,
      type: 'info',
      codeLine: recursionLines.def,
      description: `Call reverseList(${nodeId ?? 'null'})`,
      vars: { node: nodeId, head },
      state: captureState(nodeId || undefined, undefined),
      stack: [...stackFrames]
    });

    steps.push({
      id: `guard-${nodeId ?? 'null'}`,
      type: 'info',
      codeLine: recursionLines.base,
      description: 'Check base case (null or tail)',
      vars: { node: nodeId, head },
      state: captureState(nodeId || undefined, undefined),
      stack: [...stackFrames]
    });

    if (!nodeId || !map[nodeId]) {
      steps.push({
        id: `return-null-${nodeId ?? 'null'}`,
        type: 'return',
        codeLine: recursionLines.base,
        description: 'Return node (base)',
        vars: { node: nodeId, head },
        state: captureState(nodeId || undefined, undefined),
        stack: [...stackFrames]
      });
      stackFrames.pop();
      return nodeId;
    }

    const node = map[nodeId];
    if (!node.next) {
      head = nodeId;
      steps.push({
        id: `return-tail-${nodeId}`,
        type: 'return',
        codeLine: recursionLines.base,
      description: 'Tail reached, return as new head',
      vars: { node: nodeId, head },
      state: captureState(nodeId, undefined),
      stack: [...stackFrames]
    });
      stackFrames.pop();
      return nodeId;
    }

    const nextNode = node.next;
    steps.push({
      id: `recurse-${nodeId}`,
      type: 'recurse',
      codeLine: recursionLines.recurse,
      description: `rest = reverseList(${nextNode})`,
      vars: { node: nodeId, next: nextNode, head },
      state: captureState(nodeId, undefined),
      stack: [...stackFrames]
    });

    const resHead = reverseRec(nextNode);
    head = resHead;
    steps.push({
      id: `after-recurse-${nodeId}`,
      type: 'info',
      codeLine: recursionLines.recurse,
      description: `Recurse returned head=${resHead}`,
      vars: { node: nodeId, next: nextNode, head },
      state: captureState(nodeId, undefined),
      stack: [...stackFrames]
    });

    const child = map[nextNode];
    if (child) child.next = nodeId;
    steps.push({
      id: `rewire-${nodeId}`,
      type: 'write',
      codeLine: recursionLines.rewire,
      description: `Set ${nextNode}.next = ${nodeId}`,
      vars: { node: nodeId, next: nextNode, head },
      state: captureState(nodeId, undefined),
      stack: [...stackFrames]
    });

    node.next = null;
    steps.push({
      id: `nullify-${nodeId}`,
      type: 'write',
      codeLine: recursionLines.nullify,
      description: `Set ${nodeId}.next = null`,
      vars: { node: nodeId, head },
      state: captureState(nodeId, undefined),
      stack: [...stackFrames]
    });

    steps.push({
      id: `return-${nodeId}`,
      type: 'return',
      codeLine: recursionLines.ret,
      description: `Return head=${resHead}`,
      vars: { node: nodeId, head: resHead },
      state: captureState(nodeId, undefined),
      stack: [...stackFrames]
    });

    stackFrames.pop();
    return resHead;
  };

  const initial = captureState();
  reverseRec(head);
  return { steps, initial };
}
