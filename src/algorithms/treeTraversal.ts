import { AlgorithmStep, VisualState, VisualizerInput } from '../engine/types';

type TreeNode = {
  id: string;
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  level: number;
  pos: number;
};

const lines = { guard: 2, left: 3, visit: 4, right: 5 };

const buildTree = (values: number[]): TreeNode | null => {
  if (!values.length) return null;
  const nodes: Array<TreeNode | null> = values.map((v, idx) => ({ id: `t${idx}`, value: v, level: Math.floor(Math.log2(idx + 1)), pos: idx }));
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

export function treeTraversalSteps(input: VisualizerInput): { steps: AlgorithmStep[]; initial: VisualState } {
  const values = input.tree || [];
  const root = buildTree(values);
  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>();
  const order: Array<TreeNode> = [];

  const collectNodes = (node: TreeNode | null, list: TreeNode[] = []) => {
    if (!node) return list;
    list.push(node);
    collectNodes(node.left || null, list);
    collectNodes(node.right || null, list);
    return list;
  };

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
      edges: edges.map((e) => ({ ...e, active: e.from === active }))
    },
    legend: 'Binary Tree Traversal',
    counters: { visited: visited.size }
  });

  const traverse = (node: TreeNode | null) => {
    if (!node) return;
    steps.push({
      id: `left-${node.id}`,
      type: 'recurse',
      codeLine: lines.left,
      description: `Go left from ${node.value}`,
      vars: { node: node.value },
      state: capture(node.id)
    });
    traverse(node.left || null);
    visited.add(node.id);
    order.push(node);
    steps.push({
      id: `visit-${node.id}`,
      type: 'visit',
      codeLine: lines.visit,
      description: `Visit ${node.value}`,
      vars: { node: node.value },
      state: capture(node.id)
    });
    steps.push({
      id: `right-${node.id}`,
      type: 'recurse',
      codeLine: lines.right,
      description: `Go right from ${node.value}`,
      vars: { node: node.value },
      state: capture(node.id)
    });
    traverse(node.right || null);
  };

  const initial: VisualState = capture();
  traverse(root);
  return { steps, initial };
}
