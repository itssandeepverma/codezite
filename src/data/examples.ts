export const exampleArrays = {
  small: [5, 1, 4, 2, 8, 3],
  reversed: [9, 8, 7, 6, 5, 4],
  nearlySorted: [1, 2, 3, 5, 4, 6]
};

export const exampleGraph: { nodes: string[]; edges: Array<[string, string]>; start: string } = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    ['A', 'B'],
    ['A', 'C'],
    ['B', 'D'],
    ['C', 'D'],
    ['C', 'E'],
    ['D', 'F']
  ],
  start: 'A'
};

export const exampleList = [3, 1, 4, 1, 5];
export const exampleStack = [1, 2, 3];
export const exampleQueue = [7, 8, 9];
export const exampleTree = [7, 3, 9, 1, 5, 8, 10];
