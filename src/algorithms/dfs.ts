import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const lines = {
  guard: 2,
  mark: 3,
  loop: 4,
  recurse: 5
};

interface Frame {
  name: string;
  params: Record<string, unknown>;
  returnTo?: number;
}

export function dfsSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const graphInput = input.graph || { nodes: [], edges: [] };
  const { nodes, edges, start = graphInput.nodes[0] } = graphInput;
  const adjacency: Record<string, string[]> = {};
  nodes.forEach((n) => {
    adjacency[n] = [];
  });
  edges.forEach(([from, to]) => {
    adjacency[from] = adjacency[from] || [];
    adjacency[to] = adjacency[to] || [];
    adjacency[from].push(to);
    adjacency[to].push(from);
  });

  const visited = new Set<string>();
  const steps: AlgorithmStep[] = [];
  const callStack: Frame[] = [];

  const captureState = (current?: string, neighbor?: string): VisualState => ({
    graph: {
      nodes: nodes.map((id) => ({
        id,
        label: id,
        visited: visited.has(id),
        frontier: callStack.some((f) => f.params.node === id),
        active: id === current || id === neighbor
      })),
      edges: edges.map(([from, to], idx) => ({
        id: `${from}-${to}-${idx}`,
        from,
        to,
        visited: visited.has(from) && visited.has(to),
        active: (from === current && to === neighbor) || (to === current && from === neighbor)
      }))
    },
    legend: 'DFS',
    counters: { visited: visited.size, depth: callStack.length }
  });

  const initial: VisualState = {
    graph: {
      nodes: nodes.map((n) => ({ id: n, label: n, visited: false })),
      edges: edges.map(([from, to], idx) => ({ id: `${from}-${to}-${idx}`, from, to }))
    },
    legend: 'DFS',
    counters: { visited: 0, depth: 0 }
  };

  const dfsRec = (node: string) => {
    callStack.push({ name: 'dfs', params: { node }, returnTo: lines.recurse });
    steps.push({
      id: `enter-${node}`,
      type: 'info',
      codeLine: lines.guard,
      description: `Visit ${node}`,
      vars: { node },
      state: captureState(node),
      stack: [...callStack]
    });
    if (visited.has(node)) {
      steps.push({
        id: `already-${node}`,
        type: 'return',
        codeLine: lines.guard,
        description: `${node} already visited`,
        vars: { node },
        state: captureState(node),
        stack: [...callStack]
      });
      callStack.pop();
      return;
    }
    visited.add(node);
    steps.push({
      id: `mark-${node}`,
      type: 'mark',
      codeLine: lines.mark,
      description: `Mark ${node} visited`,
      vars: { node },
      state: captureState(node),
      stack: [...callStack]
    });
    for (const neighbor of adjacency[node] || []) {
      steps.push({
        id: `loop-${node}-${neighbor}`,
        type: 'visit',
        codeLine: lines.loop,
        description: `Explore neighbor ${neighbor}`,
        vars: { node, neighbor },
        state: captureState(node, neighbor),
        stack: [...callStack]
      });
      dfsRec(neighbor);
    }
    callStack.pop();
  };

  dfsRec(start || nodes[0]);

  return { steps, initial };
}
