export const codeSnippets = {
  bubbleSort: {
    javascript: `function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}`,
    python: `def bubble_sort(arr):
  a = list(arr)
  for i in range(len(a)):
    for j in range(len(a) - i - 1):
      if a[j] > a[j + 1]:
        a[j], a[j + 1] = a[j + 1], a[j]
  return a`,
    cpp: `std::vector<int> bubbleSort(std::vector<int> arr) {
  for (size_t i = 0; i < arr.size(); i++) {
    for (size_t j = 0; j + 1 < arr.size() - i; j++) {
      if (arr[j] > arr[j + 1]) {
        std::swap(arr[j], arr[j + 1]);
      }
    }
  }
  return arr;
}`
  },
  mergeSort: {
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    python: `def merge_sort(arr):
  if len(arr) <= 1:
    return arr
  mid = len(arr) // 2
  left = merge_sort(arr[:mid])
  right = merge_sort(arr[mid:])
  return merge(left, right)

def merge(left, right):
  result = []
  i = 0
  j = 0
  while i < len(left) and j < len(right):
    if left[i] <= right[j]:
      result.append(left[i])
      i += 1
    else:
      result.append(right[j])
      j += 1
  return result + left[i:] + right[j:]`,
    cpp: `std::vector<int> mergeVec(const std::vector<int>& left, const std::vector<int>& right) {
  std::vector<int> res;
  size_t i = 0, j = 0;
  while (i < left.size() && j < right.size()) {
    if (left[i] <= right[j]) res.push_back(left[i++]);
    else res.push_back(right[j++]);
  }
  while (i < left.size()) res.push_back(left[i++]);
  while (j < right.size()) res.push_back(right[j++]);
  return res;
}

std::vector<int> mergeSort(std::vector<int> arr) {
  if (arr.size() <= 1) return arr;
  size_t mid = arr.size() / 2;
  std::vector<int> left(arr.begin(), arr.begin() + mid);
  std::vector<int> right(arr.begin() + mid, arr.end());
  return mergeVec(mergeSort(left), mergeSort(right));
}`
  },
  quickSort: {
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const p = partition(arr, low, high);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}`,
    python: `def quick_sort(arr, low=0, high=None):
  if high is None:
    high = len(arr) - 1
  if low < high:
    p = partition(arr, low, high)
    quick_sort(arr, low, p - 1)
    quick_sort(arr, p + 1, high)
  return arr

def partition(arr, low, high):
  pivot = arr[high]
  i = low
  for j in range(low, high):
    if arr[j] < pivot:
      arr[i], arr[j] = arr[j], arr[i]
      i += 1
  arr[i], arr[high] = arr[high], arr[i]
  return i`,
    cpp: `int partition(std::vector<int>& arr, int low, int high) {
  int pivot = arr[high];
  int i = low;
  for (int j = low; j < high; j++) {
    if (arr[j] < pivot) {
      std::swap(arr[i], arr[j]);
      i++;
    }
  }
  std::swap(arr[i], arr[high]);
  return i;
}

void quickSort(std::vector<int>& arr, int low, int high) {
  if (low < high) {
    int p = partition(arr, low, high);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
  }
}`
  },
  bfs: {
    javascript: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  while (queue.length) {
    const node = queue.shift();
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    python: `from collections import deque

def bfs(graph, start):
  visited = set([start])
  queue = deque([start])
  while queue:
    node = queue.popleft()
    for neighbor in graph.get(node, []):
      if neighbor not in visited:
        visited.add(neighbor)
        queue.append(neighbor)`,
    cpp: `void bfs(const std::unordered_map<std::string, std::vector<std::string>>& graph, const std::string& start) {
  std::unordered_set<std::string> visited;
  std::queue<std::string> q;
  q.push(start);
  visited.insert(start);
  while (!q.empty()) {
    std::string node = q.front();
    q.pop();
    for (const auto& nei : graph.at(node)) {
      if (!visited.count(nei)) {
        visited.insert(nei);
        q.push(nei);
      }
    }
  }
}`
  },
  dfs: {
    javascript: `function dfs(graph, start, visited = new Set()) {
  if (visited.has(start)) return;
  visited.add(start);
  for (const neighbor of graph[start] || []) {
    dfs(graph, neighbor, visited);
  }
}`,
    python: `def dfs(graph, start, visited=None):
  if visited is None:
    visited = set()
  if start in visited:
    return
  visited.add(start)
  for neighbor in graph.get(start, []):
    dfs(graph, neighbor, visited)`,
    cpp: `void dfs(const std::unordered_map<std::string, std::vector<std::string>>& graph, const std::string& start, std::unordered_set<std::string>& visited) {
  if (visited.count(start)) return;
  visited.insert(start);
  for (const auto& nei : graph.at(start)) {
    dfs(graph, nei, visited);
  }
}`
  },
  linkedListReverse: {
    javascript: `function reverseList(head) {
  let prev = null;
  let current = head;
  while (current) {
    const nextNode = current.next;
    current.next = prev;
    prev = current;
    current = nextNode;
  }
  return prev;
}`,
    python: `def reverse_list(head):
  prev = None
  current = head
  while current:
    next_node = current.next
    current.next = prev
    prev = current
    current = next_node
  return prev`,
    cpp: `struct Node { int val; Node* next; };

Node* reverseList(Node* head) {
  Node* prev = nullptr;
  Node* curr = head;
  while (curr) {
    Node* next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`
  },
  linkedListReverseRecursive: {
    javascript: `function reverseList(head) {
  if (!head || !head.next) return head;
  const rest = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return rest;
}`,
    python: `def reverseList(head):
  if head is None or head.next is None:
    return head
  rest = reverseList(head.next)
  head.next.next = head
  head.next = None
  return rest`,
    cpp: `ListNode* reverseList(ListNode* head) {
  if (!head || !head->next) return head;
  ListNode* rest = reverseList(head->next);
  head->next->next = head;
  head->next = nullptr;
  return rest;
}`
  },
  stack: {
    javascript: `class Stack {
  constructor() {
    this.items = [];
  }
  push(value) {
    this.items.push(value);
  }
  pop() {
    return this.items.pop();
  }
}`,
    cpp: `class Stack {
 public:
  void push(int v) { items.push_back(v); }
  int pop() {
    int v = items.back();
    items.pop_back();
    return v;
  }
 private:
  std::vector<int> items;
};`
  },
  queue: {
    javascript: `class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(value) {
    this.items.push(value);
  }
  dequeue() {
    return this.items.shift();
  }
}`,
    cpp: `class Queue {
 public:
  void enqueue(int v) { items.push_back(v); }
  int dequeue() {
    int v = items.front();
    items.erase(items.begin());
    return v;
  }
 private:
  std::vector<int> items;
};`
  },
  treeTraversal: {
    javascript: `function inorder(node, visit) {
  if (!node) return;
  inorder(node.left, visit);
  visit(node);
  inorder(node.right, visit);
}`,
    python: `def inorder(node, visit):
  if not node:
    return
  inorder(node.left, visit)
  visit(node)
  inorder(node.right, visit)`,
    cpp: `struct Node { int val; Node* left; Node* right; };

void inorder(Node* node, std::function<void(Node*)> visit) {
  if (!node) return;
  inorder(node->left, visit);
  visit(node);
  inorder(node->right, visit);
}`
  }
};
