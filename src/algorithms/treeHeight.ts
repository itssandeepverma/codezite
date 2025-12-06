import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

type TreeNode = {
  id: string;
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  level: number;
  pos: number;
};

const lines = {
  enter: 1,
  guard: 2,
  leaf: 3,
  left: 4,
  right: 5,
  ret: 6
};

const buildTree = (values: number[]): TreeNode | null => {
  if (!values.length) return null;
  const nodes: Array<TreeNode | null> = values.map((v, idx) => ({
    id: `t${idx}`,
    value: v,
    level: Math.floor(Math.log2(idx + 1)),
    pos: idx
  }));
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (!node) continue;
    const leftIdx = 2 * i + 1;
    const rightIdx = 2 * i + 2;
    node.left = nodes[leftIdx] || null;
    node.right = nodes[rightIdx] || null;
  }
  return nodes[0];
};

const collectNodes = (node: TreeNode | null, list: TreeNode[] = []) => {
  if (!node) return list;
  list.push(node);
  collectNodes(node.left || null, list);
  collectNodes(node.right || null, list);
  return list;
};

interface Frame {
  name: string;
  params: Record<string, unknown>;
  returnTo?: number;
}

export function treeHeightSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const values = input.tree || [];
  const root = buildTree(values);
  const steps: AlgorithmStep[] = [];

  if (!root) {
    const empty: VisualState = {
      tree: { nodes: [], edges: [] },
      legend: 'Tree Height (Recursive DFS)',
      counters: { computed: 0, stack: 0 }
    };
    steps.push({
      id: 'empty-tree',
      type: 'return',
      codeLine: lines.guard,
      description: 'Empty tree -> depth 0',
      vars: { depth: 0 },
      state: empty
    });
    return { steps, initial: empty };
  }

  const visited = new Set<string>();
  const callStack: Frame[] = [];

  const nodesFlat = collectNodes(root, []);
  const edges = nodesFlat
    .flatMap((n) => {
      const links: { from: string; to: string }[] = [];
      if (n.left) links.push({ from: n.id, to: n.left.id });
      if (n.right) links.push({ from: n.id, to: n.right.id });
      return links;
    })
    .map((e, idx) => ({ id: `${e.from}-${e.to}-${idx}`, ...e }));

  const capture = (active?: string): VisualState => ({
    tree: {
      nodes: nodesFlat.map((n) => ({
        id: n.id,
        label: `${n.value}`,
        level: n.level,
        x: n.pos,
        y: n.level,
        visited: visited.has(n.id),
        active: active === n.id
      })),
      edges: edges.map((e) => ({ ...e, active: e.from === active || e.to === active }))
    },
    legend: 'Tree Height (Recursive DFS)',
    counters: { computed: visited.size, stack: callStack.length }
  });

  const dfs = (node: TreeNode | null): number => {
    callStack.push({ name: 'maxDepth', params: { node: node?.value ?? null }, returnTo: lines.ret });
    steps.push({
      id: `enter-${node?.id ?? 'null'}-${callStack.length}`,
      type: 'info',
      codeLine: lines.enter,
      description: node ? `Call maxDepth(${node.value})` : 'Call maxDepth(null)',
      vars: { node: node?.value ?? null },
      state: capture(node?.id),
      stack: [...callStack]
    });

    steps.push({
      id: `guard-${node?.id ?? 'null'}-${callStack.length}`,
      type: node ? 'info' : 'return',
      codeLine: lines.guard,
      description: node ? `Node ${node.value} exists` : 'Null -> depth 0',
      vars: { node: node?.value ?? null, depth: node ? undefined : 0 },
      state: capture(node?.id),
      stack: [...callStack]
    });

    if (!node) {
      callStack.pop();
      return 0;
    }

    if (!node.left && !node.right) {
      visited.add(node.id);
      steps.push({
        id: `leaf-${node.id}`,
        type: 'return',
        codeLine: lines.leaf,
        description: `Leaf ${node.value} -> depth 1`,
        vars: { node: node.value, depth: 1 },
        state: capture(node.id),
        stack: [...callStack]
      });
      callStack.pop();
      return 1;
    }

    steps.push({
      id: `not-leaf-${node.id}`,
      type: 'info',
      codeLine: lines.leaf,
      description: `${node.value} is not a leaf`,
      vars: { node: node.value },
      state: capture(node.id),
      stack: [...callStack]
    });

    steps.push({
      id: `recurse-left-${node.id}`,
      type: 'recurse',
      codeLine: lines.left,
      description: `Recurse left of ${node.value}`,
      vars: { node: node.value },
      state: capture(node.id),
      stack: [...callStack]
    });
    const leftDepth = dfs(node.left || null);

    steps.push({
      id: `recurse-right-${node.id}`,
      type: 'recurse',
      codeLine: lines.right,
      description: `Recurse right of ${node.value}`,
      vars: { node: node.value },
      state: capture(node.id),
      stack: [...callStack]
    });
    const rightDepth = dfs(node.right || null);

    const nodeDepth = 1 + Math.max(leftDepth, rightDepth);
    visited.add(node.id);
    steps.push({
      id: `return-${node.id}`,
      type: 'return',
      codeLine: lines.ret,
      description: `Return 1 + max(${leftDepth}, ${rightDepth}) = ${nodeDepth}`,
      vars: { node: node.value, left: leftDepth, right: rightDepth, depth: nodeDepth },
      state: capture(node.id),
      stack: [...callStack]
    });
    callStack.pop();
    return nodeDepth;
  };

  const initial: VisualState = capture();
  dfs(root);
  return { steps, initial };
}
