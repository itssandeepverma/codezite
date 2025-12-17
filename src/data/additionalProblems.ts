import { ProblemConfig } from './problems';

export const additionalProblems: ProblemConfig[] = [
  {
    id: 'ds-merge-sort',
    title: 'Merge Sort',
    difficulty: 'Medium',
    topic: 'Arrays',
    statement: 'Sort an array using merge sort (divide and conquer).',
    constraints: ['1 <= n <= 10^4'],
    samples: [{ input: '[5,1,4,2,8]', output: '[1,2,4,5,8]', explanation: 'Stable merge sort' }],
    solution: {
      summary: 'Divide the array, sort halves recursively, merge sorted halves.',
      steps: ['Split at mid', 'Recursively sort left/right', 'Merge two sorted halves'],
      approaches: ['Naive: selection/bubble O(n^2)', 'Optimal: merge sort O(n log n) stable']
    },
    code: { javascript: '', python: '', java: '', cpp: '' },
    complexity: { time: 'O(n log n)', space: 'O(n)', rationale: 'Each level merges n elements over log n levels.' },
    visualsAvailable: true,
    algorithmId: 'merge-sort',
    sampleInput: { array: [5, 1, 4, 2, 8, 3] }
  },
  {
    id: 'ds-bfs',
    title: 'Breadth-First Search',
    difficulty: 'Easy',
    topic: 'Graphs',
    statement: 'Traverse a graph level by level starting from a source.',
    constraints: ['Graph may be disconnected', 'Use queue for frontier'],
    samples: [{ input: 'Graph with edges A-B, A-C, B-D', output: 'A,B,C,D', explanation: 'Layered traversal' }],
    solution: {
      summary: 'Use a queue to visit neighbors layer by layer, marking visited nodes.',
      steps: ['Initialize queue with start node', 'Pop node, visit neighbors', 'Push unseen neighbors; repeat'],
      approaches: ['Naive: DFS stack (loses layering)', 'Preferred: queue for correct breadth order']
    },
    code: { javascript: '', python: '', java: '', cpp: '' },
    complexity: { time: 'O(V+E)', space: 'O(V)', rationale: 'Visit each node/edge once; queue/visited sets.' },
    visualsAvailable: true,
    algorithmId: 'bfs',
    sampleInput: { graph: { nodes: ['A', 'B', 'C', 'D'], edges: [['A', 'B'], ['A', 'C'], ['B', 'D']], start: 'A' } }
  },
  {
    id: 'ds-dfs',
    title: 'Depth-First Search',
    difficulty: 'Easy',
    topic: 'Graphs',
    statement: 'Traverse a graph depth-first recursively.',
    constraints: ['Graph may be disconnected', 'Use recursion or stack'],
    samples: [{ input: 'Graph with edges A-B, A-C, B-D', output: 'A,B,D,C', explanation: 'One possible DFS order' }],
    solution: {
      summary: 'Recurse (or push stack) from each node to its unvisited neighbors.',
      steps: ['Visit node, mark visited', 'Recurse on each neighbor not visited'],
      approaches: ['Recursive DFS (simple)', 'Iterative stack-based DFS']
    },
    code: { javascript: '', python: '', java: '', cpp: '' },
    complexity: { time: 'O(V+E)', space: 'O(V)', rationale: 'Visit each node/edge; recursion/stack depth up to V.' },
    visualsAvailable: true,
    algorithmId: 'dfs',
    sampleInput: { graph: { nodes: ['A', 'B', 'C', 'D'], edges: [['A', 'B'], ['A', 'C'], ['B', 'D']], start: 'A' } }
  },
  {
    id: 'ds-tree-traversal',
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    topic: 'Trees',
    statement: 'Traverse a binary tree in inorder (left, node, right).',
    constraints: ['0 <= n <= 10^4'],
    samples: [{ input: 'Tree [7,3,9,1,5]', output: '[1,3,5,7,9]', explanation: 'Inorder yields sorted for BST' }],
    solution: {
      summary: 'Recursive inorder: left subtree, visit node, right subtree.',
      steps: ['Recurse left', 'Process node', 'Recurse right'],
      approaches: ['Naive: store values unsorted', 'Preferred: inorder yields sorted for BST']
    },
    code: { javascript: '', python: '', java: '', cpp: '' },
    complexity: { time: 'O(n)', space: 'O(h)', rationale: 'Visit each node once; recursion stack height h.' },
    visualsAvailable: true,
    algorithmId: 'tree-traversal',
    sampleInput: { tree: [7, 3, 9, 1, 5, 8, 10] }
  },
  {
    id: 'ds-tree-height',
    title: 'Binary Tree Height',
    difficulty: 'Easy',
    topic: 'Trees',
    statement: 'Compute the height (max depth) of a binary tree.',
    constraints: ['0 <= n <= 10^4'],
    samples: [{ input: 'Tree [7,3,9,1,5]', output: '3', explanation: 'Levels from root to deepest leaf' }],
    solution: {
      summary: 'Recursive depth: height(node) = 1 + max(left, right).',
      steps: ['If null -> 0', 'Return 1 + max(height(left), height(right))'],
      approaches: ['Naive: count edges per path manually', 'Preferred: recursive depth with O(n)']
    },
    code: { javascript: '', python: '', java: '', cpp: '' },
    complexity: { time: 'O(n)', space: 'O(h)', rationale: 'Visit each node once; stack height h.' },
    visualsAvailable: true,
    algorithmId: 'tree-height',
    sampleInput: { tree: [7, 3, 9, 1, 5, 8, 10] }
  },
  {
    id: 'ds-stack',
    title: 'Stack Push/Pop',
    difficulty: 'Easy',
    topic: 'Stacks & Queues',
    statement: 'Demonstrate LIFO stack operations push/pop.',
    constraints: ['Sequence length <= 20'],
    samples: [{ input: 'Push 1,2,3 then pop twice', output: 'Stack top moves from 3 to 2 to 1', explanation: 'LIFO behavior' }],
    solution: {
      summary: 'Use an array as stack: push to end, pop from end.',
      steps: ['Push values', 'Pop to remove last inserted'],
      approaches: ['Array-based stack', 'Linked list stack']
    },
    code: { javascript: '', python: '', java: '', cpp: '' },
    complexity: { time: 'O(1) per op', space: 'O(n)', rationale: 'Constant time push/pop; store n items.' },
    visualsAvailable: true,
    algorithmId: 'stack',
    sampleInput: { stack: [1, 2, 3] }
  },
  {
    id: 'ds-queue',
    title: 'Queue Enqueue/Dequeue',
    difficulty: 'Easy',
    topic: 'Stacks & Queues',
    statement: 'Demonstrate FIFO queue operations enqueue/dequeue.',
    constraints: ['Sequence length <= 20'],
    samples: [{ input: 'Enqueue 7,8,9 then dequeue twice', output: 'Queue front moves 7 -> 8 -> 9', explanation: 'FIFO behavior' }],
    solution: {
      summary: 'Use an array with head/tail or shift/pop to model FIFO.',
      steps: ['Enqueue to tail', 'Dequeue from head'],
      approaches: ['Array-based queue', 'Linked list queue']
    },
    code: { javascript: '', python: '', java: '', cpp: '' },
    complexity: { time: 'O(1) per op', space: 'O(n)', rationale: 'Constant time enqueue/dequeue with pointers.' },
    visualsAvailable: true,
    algorithmId: 'queue',
    sampleInput: { queue: [7, 8, 9] }
  }
];
