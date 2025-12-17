import { AlgorithmDefinition } from '../engine/types';
import { bubbleSortSteps } from './bubbleSort';
import { mergeSortSteps } from './mergeSort';
import { quickSortSteps } from './quickSort';
import { bfsSteps } from './bfs';
import { dfsSteps } from './dfs';
import { reverseLinkedListSteps, reverseLinkedListRecursiveSteps } from './linkedList';
import { stackSteps, queueSteps } from './stackQueue';
import { treeTraversalSteps } from './treeTraversal';
import { treeHeightSteps } from './treeHeight';
import { nQueenSteps } from './nQueen';
import { climbStairsSteps } from './climbStairs';
import { coinChangeSteps } from './coinChange';
import { twoSumSteps } from './twoSum';
import { containerWaterSteps } from './containerWater';
import { codeSnippets } from '../data/codeSnippets';
import {
  exampleArrays,
  exampleGraph,
  exampleList,
  exampleQueue,
  exampleStack,
  exampleTree,
  exampleNQueens,
  exampleStairs,
  exampleCoins
} from '../data/examples';

export const algorithms: AlgorithmDefinition[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Arrays',
    description: 'Simple adjacent swap sorting',
    generator: (input) => bubbleSortSteps(input),
    code: codeSnippets.bubbleSort,
    inputKind: 'array',
    defaults: { array: exampleArrays.small }
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Arrays',
    description: 'Divide and conquer stable sort',
    generator: (input) => mergeSortSteps(input),
    code: codeSnippets.mergeSort,
    inputKind: 'array',
    defaults: { array: exampleArrays.nearlySorted }
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Arrays',
    description: 'In-place partition sort',
    generator: (input) => quickSortSteps(input),
    code: codeSnippets.quickSort,
    inputKind: 'array',
    defaults: { array: exampleArrays.reversed }
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'Graphs',
    description: 'Layered traversal',
    generator: (input) => bfsSteps(input),
    code: codeSnippets.bfs,
    inputKind: 'graph',
    defaults: { graph: exampleGraph }
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'Graphs',
    description: 'Recursive traversal',
    generator: (input) => dfsSteps(input),
    code: codeSnippets.dfs,
    inputKind: 'graph',
    defaults: { graph: exampleGraph }
  },
  {
    id: 'linked-list-reverse',
    name: 'Reverse Linked List',
    category: 'Linked List',
    description: 'Pointer rewiring walk',
    generator: (input) => reverseLinkedListSteps(input),
    code: codeSnippets.linkedListReverse,
    inputKind: 'list',
    defaults: { list: exampleList }
  },
  {
    id: 'linked-list-reverse-recursive',
    name: 'Reverse Linked List (Recursive)',
    category: 'Linked List',
    description: 'Recursive pointer reversal',
    generator: (input) => reverseLinkedListRecursiveSteps(input),
    code: codeSnippets.linkedListReverseRecursive,
    inputKind: 'list',
    defaults: { list: exampleList }
  },
  {
    id: 'stack',
    name: 'Stack Push/Pop',
    category: 'Stacks & Queues',
    description: 'LIFO push/pop demo',
    generator: (input) => stackSteps(input),
    code: codeSnippets.stack,
    inputKind: 'stackQueue',
    defaults: { stack: exampleStack }
  },
  {
    id: 'queue',
    name: 'Queue Enqueue/Dequeue',
    category: 'Stacks & Queues',
    description: 'FIFO enqueue/dequeue demo',
    generator: (input) => queueSteps(input),
    code: codeSnippets.queue,
    inputKind: 'stackQueue',
    defaults: { queue: exampleQueue }
  },
  {
    id: 'tree-traversal',
    name: 'Binary Tree Traversal (Inorder)',
    category: 'Trees',
    description: 'Inorder traversal of a binary tree',
    generator: (input) => treeTraversalSteps(input),
    code: codeSnippets.treeTraversal,
    inputKind: 'tree',
    defaults: { tree: exampleTree }
  },
  {
    id: 'tree-height',
    name: 'Binary Tree Height (Recursive)',
    category: 'Trees',
    description: 'Compute height using recursive max depth',
    generator: (input) => treeHeightSteps(input),
    code: codeSnippets.treeHeight,
    inputKind: 'tree',
    defaults: { tree: exampleTree }
  },
  {
    id: 'n-queens',
    name: 'N-Queens',
    category: 'Backtracking',
    description: 'Place N queens on an N×N board with no conflicts',
    generator: (input) => nQueenSteps(input),
    code: codeSnippets.nQueens,
    inputKind: 'nqueen',
    defaults: { nQueens: exampleNQueens }
  },
  {
    id: 'climb-stairs',
    name: 'Climbing Stairs',
    category: 'Dynamic Programming',
    description: 'Count ways to climb 1 or 2 steps at a time',
    generator: (input) => climbStairsSteps(input),
    code: codeSnippets.climbStairs,
    inputKind: 'dp-number',
    defaults: { n: exampleStairs }
  },
  {
    id: 'coin-change',
    name: 'Coin Change (Min Coins)',
    category: 'Dynamic Programming',
    description: 'Min coins to make an amount',
    generator: (input) => coinChangeSteps(input),
    code: codeSnippets.coinChange,
    inputKind: 'coin-change',
    defaults: { coins: exampleCoins.coins, amount: exampleCoins.amount }
  },
  {
    id: 'two-sum',
    name: 'Two Sum',
    category: 'Arrays',
    description: 'Find two indices that sum to target using one-pass map',
    generator: (input) => twoSumSteps(input),
    code: codeSnippets.twoSum,
    inputKind: 'array',
    defaults: { array: exampleArrays.small, target: 9 }
  },
  {
    id: 'container-water',
    name: 'Container With Most Water',
    category: 'Arrays',
    description: 'Two-pointer shrink to maximize area',
    generator: (input) => containerWaterSteps(input),
    code: codeSnippets.containerWater,
    inputKind: 'array',
    defaults: { array: [1, 8, 6, 2, 5, 4, 8, 3, 7] }
  }
];

export const categories = ['Arrays', 'Linked List', 'Stacks & Queues', 'Trees', 'Graphs', 'Backtracking', 'Dynamic Programming'];
