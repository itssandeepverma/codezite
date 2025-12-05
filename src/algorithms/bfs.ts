import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

const lines = {
  initVisited: 2,
  initQueue: 3,
  markVisited: 4,
  loop: 5,
  dequeue: 6,
  iterateNeighbors: 7,
  checkVisited: 8,
  enqueue: 10
};

export function bfsSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
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
  const queue: string[] = [];
  const steps: AlgorithmStep[] = [];

  const captureState = (current?: string, neighbor?: string): VisualState => ({
    graph: {
      nodes: nodes.map((id) => ({
        id,
        label: id,
        visited: visited.has(id),
        frontier: queue.includes(id),
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
    legend: 'BFS',
    counters: { visited: visited.size, queue: queue.length }
  });

  const initial: VisualState = {
    graph: {
      nodes: nodes.map((n) => ({ id: n, label: n, visited: false, frontier: false })),
      edges: edges.map(([from, to], idx) => ({ id: `${from}-${to}-${idx}`, from, to }))
    },
    legend: 'BFS',
    counters: { visited: 0, queue: 0 }
  };

  queue.push(start);
  steps.push({
    id: 'init-queue',
    type: 'enqueue',
    codeLine: lines.initQueue,
    description: `Queue start ${start}`,
    vars: { start },
    state: captureState(),
    stack: []
  });
  visited.add(start);
  steps.push({
    id: 'mark-start',
    type: 'mark',
    codeLine: lines.markVisited,
    description: `Mark ${start} visited`,
    vars: { start },
    state: captureState(start),
    stack: []
  });

  while (queue.length) {
    const node = queue.shift() as string;
    steps.push({
      id: `dequeue-${node}`,
      type: 'dequeue',
      codeLine: lines.dequeue,
      description: `Dequeue ${node}`,
      vars: { node },
      state: captureState(node)
    });

    for (const neighbor of adjacency[node] || []) {
      steps.push({
        id: `neighbor-${node}-${neighbor}`,
        type: 'visit',
        codeLine: lines.iterateNeighbors,
        description: `Inspect neighbor ${neighbor} of ${node}`,
        vars: { node, neighbor },
        state: captureState(node, neighbor)
      });
      if (!visited.has(neighbor)) {
        steps.push({
          id: `check-${neighbor}`,
          type: 'compare',
          codeLine: lines.checkVisited,
          description: `${neighbor} not visited`,
          vars: { neighbor },
          state: captureState(node, neighbor)
        });
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push({
          id: `enqueue-${neighbor}`,
          type: 'enqueue',
          codeLine: lines.enqueue,
          description: `Enqueue ${neighbor}`,
          vars: { neighbor },
          state: captureState(node, neighbor)
        });
      }
    }
  }

  return { steps, initial };
}
