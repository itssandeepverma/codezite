import { additionalProblems } from './additionalProblems';

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemConfig {
  id: string;
  number?: number;
  title: string;
  difficulty: ProblemDifficulty;
  topic: string;
  leetcodeUrl?: string;
  statement: string;
  constraints: string[];
  samples: Array<{ input: string; output: string; explanation: string }>;
  solution: { summary: string; steps: string[]; approaches?: string[] };
  code: { javascript: string; python: string; java: string; cpp: string };
  complexity: { time: string; space: string; rationale: string };
  visualsAvailable: boolean;
  sampleInput?: Record<string, unknown>;
  algorithmId?: string;
}

const baseProblems: ProblemConfig[] = [
  {
    id: 'lc-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Assume exactly one solution and no reuse of the same element.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    samples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: '2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '2 + 4 = 6' }
    ],
    solution: {
      summary: 'Use a hash map to track seen numbers and their indices; check the complement as you iterate.',
      steps: [
        'Intuition: need two indices whose values sum to target.',
        'Brute force: try all pairs O(n^2).',
        'Hash map: store value -> index; for each nums[i], need = target - nums[i]; if need in map, return [map[need], i]; else store current.'
      ],
      approaches: [
        'Brute force O(n^2): nested loops over pairs.',
        'Two-pass hash table O(n): build map then scan for complements.',
        'One-pass hash table O(n): check complement before inserting current.'
      ]
    },
    code: {
      javascript: `function twoSum(nums, target) {
  const mp = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (mp.has(need)) return [mp.get(need), i];
    mp.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums, target):
  mp = {}
  for i, v in enumerate(nums):
    need = target - v
    if need in mp:
      return [mp[need], i]
    mp[v] = i
  return []`,
      java: `class Solution {
  public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> mp = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
      int need = target - nums[i];
      if (mp.containsKey(need)) return new int[]{mp.get(need), i};
      mp.put(nums[i], i);
    }
    return new int[0];
  }
}`,
      cpp: `class Solution {
public:
  std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> mp;
    for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
      int need = target - nums[i];
      auto it = mp.find(need);
      if (it != mp.end()) return {it->second, i};
      mp[nums[i]] = i;
    }
    return {};
  }
};`
    },
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
      rationale: 'Hash lookups are amortized O(1); each element is processed once and stored in the map at most once.'
    },
    visualsAvailable: true,
    algorithmId: 'two-sum',
    sampleInput: { array: [2, 7, 11, 15], target: 9 }
  },
  {
    id: 'lc-2',
    number: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    topic: 'Linked List',
    leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/',
    statement: 'You are given two non-empty linked lists representing two non-negative integers in reverse order. Add the two numbers and return the sum as a linked list.',
    constraints: ['Each list node contains a single digit', 'No leading zeros except the number 0 itself'],
    samples: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807' }
    ],
    solution: {
      summary: 'Iterate both lists with carry. Sum digits, create new nodes as you go.',
      steps: ['Use carry=0', 'Traverse while l1 or l2 or carry', 'Sum current digits + carry; push digit node; update carry'],
      approaches: ['Naive: convert to integers and back (overflow issues)', 'Preferred: digit-by-digit addition with carry']
    },
    code: {
      javascript: `function addTwoNumbers(l1, l2) {
  let dummy = { val: 0, next: null }, cur = dummy, carry = 0;
  while (l1 || l2 || carry) {
    const sum = (l1?.val || 0) + (l2?.val || 0) + carry;
    carry = Math.floor(sum / 10);
    cur.next = { val: sum % 10, next: null };
    cur = cur.next;
    l1 = l1?.next; l2 = l2?.next;
  }
  return dummy.next;
}`,
      python: `def addTwoNumbers(l1, l2):
  dummy = ListNode(0)
  cur, carry = dummy, 0
  while l1 or l2 or carry:
    s = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
    carry, digit = divmod(s, 10)
    cur.next = ListNode(digit)
    cur = cur.next
    l1 = l1.next if l1 else None
    l2 = l2.next if l2 else None
  return dummy.next`,
      java: `class Solution {
  public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), cur = dummy;
    int carry = 0;
    while (l1 != null || l2 != null || carry != 0) {
      int sum = (l1 != null ? l1.val : 0) + (l2 != null ? l2.val : 0) + carry;
      carry = sum / 10;
      cur.next = new ListNode(sum % 10);
      cur = cur.next;
      l1 = l1 != null ? l1.next : null;
      l2 = l2 != null ? l2.next : null;
    }
    return dummy.next;
  }
}`,
      cpp: `class Solution {
public:
  ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy(0); ListNode* cur = &dummy; int carry = 0;
    while (l1 || l2 || carry) {
      int sum = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
      carry = sum / 10;
      cur->next = new ListNode(sum % 10);
      cur = cur->next;
      l1 = l1 ? l1->next : nullptr;
      l2 = l2 ? l2->next : nullptr;
    }
    return dummy.next;
  }
};`
    },
    complexity: { time: 'O(max(m,n))', space: 'O(max(m,n))', rationale: 'One pass building output list; extra nodes for result length.' },
    visualsAvailable: false
  },
  {
    id: 'lc-3',
    number: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Strings',
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    statement: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols, and spaces'],
    samples: [
      { input: 's = "abcabcbb"', output: '3', explanation: '"abc" has length 3' },
      { input: 's = "bbbbb"', output: '1', explanation: '"b" has length 1' }
    ],
    solution: {
      summary: 'Sliding window with a map of last positions; move left pointer when duplicates appear.',
      steps: ['Maintain window [l..r]', 'If s[r] seen inside window, move l to seen+1', 'Update best length each step']
    },
    code: {
      javascript: `function lengthOfLongestSubstring(s) {
  const pos = new Map();
  let best = 0, l = 0;
  for (let r = 0; r < s.length; r++) {
    if (pos.has(s[r]) && pos.get(s[r]) >= l) l = pos.get(s[r]) + 1;
    pos.set(s[r], r);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
      python: `def lengthOfLongestSubstring(s):
  pos, best, l = {}, 0, 0
  for r, ch in enumerate(s):
    if ch in pos and pos[ch] >= l:
      l = pos[ch] + 1
    pos[ch] = r
    best = max(best, r - l + 1)
  return best`,
      java: `class Solution {
  public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> pos = new HashMap<>();
    int best = 0, l = 0;
    for (int r = 0; r < s.length(); r++) {
      char c = s.charAt(r);
      if (pos.containsKey(c) && pos.get(c) >= l) l = pos.get(c) + 1;
      pos.put(c, r);
      best = Math.max(best, r - l + 1);
    }
    return best;
  }
}`,
      cpp: `class Solution {
public:
  int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> pos;
    int best = 0, l = 0;
    for (int r = 0; r < s.size(); ++r) {
      char c = s[r];
      if (pos.count(c) && pos[c] >= l) l = pos[c] + 1;
      pos[c] = r;
      best = max(best, r - l + 1);
    }
    return best;
  }
};`
    },
    complexity: { time: 'O(n)', space: 'O(k)', rationale: 'Sliding window with hash map of characters in window.' },
    visualsAvailable: false
  },
  {
    id: 'lc-5',
    number: 5,
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    topic: 'Strings',
    leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/',
    statement: 'Given a string s, return the longest palindromic substring in s.',
    constraints: ['1 <= s.length <= 1000'],
    samples: [
      { input: 's = "babad"', output: '"bab"', explanation: 'Also "aba" works' },
      { input: 's = "cbbd"', output: '"bb"', explanation: 'Longest palindrome is "bb"' }
    ],
    solution: {
      summary: 'Expand around each center (odd and even) and track the best window.',
      steps: ['For each index, expand with same chars outward', 'Check odd and even centers separately', 'Track best length and substring bounds']
    },
    code: {
      javascript: `function longestPalindrome(s) {
  let start = 0, end = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    return [l + 1, r - 1];
  };
  for (let i = 0; i < s.length; i++) {
    const [l1, r1] = expand(i, i);
    const [l2, r2] = expand(i, i + 1);
    const [l, r] = (r1 - l1) > (r2 - l2) ? [l1, r1] : [l2, r2];
    if (r - l > end - start) { start = l; end = r; }
  }
  return s.slice(start, end + 1);
}`,
      python: `def longestPalindrome(s):
  start = end = 0
  def expand(l, r):
    while l >= 0 and r < len(s) and s[l] == s[r]:
      l -= 1; r += 1
    return l + 1, r - 1
  for i in range(len(s)):
    l1, r1 = expand(i, i)
    l2, r2 = expand(i, i + 1)
    l, r = (l1, r1) if r1 - l1 > r2 - l2 else (l2, r2)
    if r - l > end - start:
      start, end = l, r
  return s[start:end + 1]`,
      java: `class Solution {
  public String longestPalindrome(String s) {
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
      int[] a = expand(s, i, i);
      int[] b = expand(s, i, i + 1);
      int[] best = (a[1] - a[0]) > (b[1] - b[0]) ? a : b;
      if (best[1] - best[0] > end - start) {
        start = best[0]; end = best[1];
      }
    }
    return s.substring(start, end + 1);
  }
  private int[] expand(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
    return new int[]{l + 1, r - 1};
  }
}`,
      cpp: `class Solution {
public:
  string longestPalindrome(string s) {
    int start = 0, end = 0;
    auto expand = [&](int l, int r) {
      while (l >= 0 && r < s.size() && s[l] == s[r]) { l--; r++; }
      return pair<int,int>(l + 1, r - 1);
    };
    for (int i = 0; i < s.size(); ++i) {
      auto [l1, r1] = expand(i, i);
      auto [l2, r2] = expand(i, i + 1);
      auto [l, r] = (r1 - l1) > (r2 - l2) ? pair<int,int>(l1, r1) : pair<int,int>(l2, r2);
      if (r - l > end - start) { start = l; end = r; }
    }
    return s.substr(start, end - start + 1);
  }
};`
    },
    complexity: { time: 'O(n^2)', space: 'O(1)', rationale: 'Expand from each center with constant extra space.' },
    visualsAvailable: false
  },
  {
    id: 'lc-6',
    number: 6,
    title: 'Zigzag Conversion',
    difficulty: 'Medium',
    topic: 'Strings',
    leetcodeUrl: 'https://leetcode.com/problems/zigzag-conversion/',
    statement: 'Rearrange the string in a zigzag pattern on numRows and read line by line.',
    constraints: ['1 <= s.length <= 1000', '1 <= numRows <= 1000'],
    samples: [
      { input: 's = "PAYPALISHIRING", numRows = 3', output: '"PAHNAPLSIIGYIR"', explanation: 'Classic zigzag layout' }
    ],
    solution: {
      summary: 'Simulate row-by-row placement moving down then up using a direction flag.',
      steps: ['Create array of rows', 'Iterate chars, append to current row', 'Flip direction at top/bottom', 'Join rows']
    },
    code: {
      javascript: `function convert(s, numRows) {
  if (numRows === 1 || s.length <= numRows) return s;
  const rows = Array(Math.min(numRows, s.length)).fill('').map(() => []);
  let row = 0, down = true;
  for (const ch of s) {
    rows[row].push(ch);
    if (row === 0) down = true;
    else if (row === numRows - 1) down = false;
    row += down ? 1 : -1;
  }
  return rows.map(r => r.join('')).join('');
}`,
      python: `def convert(s, numRows):
  if numRows == 1 or len(s) <= numRows: return s
  rows = ['' for _ in range(min(numRows, len(s)))]
  row, down = 0, True
  for ch in s:
    rows[row] += ch
    if row == 0: down = True
    elif row == numRows - 1: down = False
    row += 1 if down else -1
  return ''.join(rows)`,
      java: `class Solution {
  public String convert(String s, int numRows) {
    if (numRows == 1 || s.length() <= numRows) return s;
    List<StringBuilder> rows = new ArrayList<>();
    for (int i = 0; i < Math.min(numRows, s.length()); i++) rows.add(new StringBuilder());
    int row = 0; boolean down = true;
    for (char c : s.toCharArray()) {
      rows.get(row).append(c);
      if (row == 0) down = true;
      else if (row == numRows - 1) down = false;
      row += down ? 1 : -1;
    }
    return rows.stream().map(StringBuilder::toString).collect(Collectors.joining());
  }
}`,
      cpp: `class Solution {
public:
  string convert(string s, int numRows) {
    if (numRows == 1 || s.size() <= numRows) return s;
    vector<string> rows(min(numRows, (int)s.size()));
    int row = 0; bool down = true;
    for (char c : s) {
      rows[row].push_back(c);
      if (row == 0) down = true;
      else if (row == numRows - 1) down = false;
      row += down ? 1 : -1;
    }
    string out;
    for (auto& r : rows) out += r;
    return out;
  }
};`
    },
    complexity: { time: 'O(n)', space: 'O(n)', rationale: 'Build each row once; store characters in row buffers.' },
    visualsAvailable: false
  },
  {
    id: 'lc-7',
    number: 7,
    title: 'Reverse Integer',
    difficulty: 'Medium',
    topic: 'Math',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-integer/',
    statement: 'Reverse digits of a 32-bit signed integer. Return 0 on overflow.',
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    samples: [
      { input: 'x = 123', output: '321', explanation: 'Reverse digits' },
      { input: 'x = -123', output: '-321', explanation: 'Keep sign' }
    ],
    solution: {
      summary: 'Pop digits and push into result while checking overflow bounds before multiplying by 10.',
      steps: ['Initialize res=0', 'While x!=0: pop last digit', 'Check overflow before res*10+digit', 'Update res']
    },
    code: {
      javascript: `function reverse(x) {
  let res = 0;
  while (x !== 0) {
    const pop = x % 10 | 0;
    x = (x / 10) | 0;
    if (res > 214748364 || res < -214748364) return 0;
    res = res * 10 + pop;
  }
  return res;
}`,
      python: `def reverse(x):
  res = 0
  INT_MAX, INT_MIN = 2**31 - 1, -2**31
  while x:
    pop = int(x % 10)
    x = int(x / 10)
    if res > INT_MAX//10 or (res == INT_MAX//10 and pop > 7): return 0
    if res < INT_MIN//10 or (res == INT_MIN//10 and pop < -8): return 0
    res = res * 10 + pop
  return res`,
      java: `class Solution {
  public int reverse(int x) {
    int res = 0;
    while (x != 0) {
      int pop = x % 10;
      x /= 10;
      if (res > Integer.MAX_VALUE/10 || (res == Integer.MAX_VALUE/10 && pop > 7)) return 0;
      if (res < Integer.MIN_VALUE/10 || (res == Integer.MIN_VALUE/10 && pop < -8)) return 0;
      res = res * 10 + pop;
    }
    return res;
  }
}`,
      cpp: `class Solution {
public:
  int reverse(int x) {
    long res = 0;
    while (x) {
      int pop = x % 10;
      x /= 10;
      res = res * 10 + pop;
      if (res > INT_MAX || res < INT_MIN) return 0;
    }
    return (int)res;
  }
};`
    },
    complexity: { time: 'O(d)', space: 'O(1)', rationale: 'Process each digit once; constant extra state.' },
    visualsAvailable: false
  },
  {
    id: 'lc-8',
    number: 8,
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    topic: 'Strings',
    leetcodeUrl: 'https://leetcode.com/problems/string-to-integer-atoi/',
    statement: 'Implement atoi: read whitespace, optional sign, digits until non-digit; clamp to 32-bit signed range.',
    constraints: ['Input can be empty or contain leading spaces', 'Clamp to [-2^31, 2^31-1]'],
    samples: [
      { input: '"42"', output: '42', explanation: 'Simple parse' },
      { input: '"   -42"', output: '-42', explanation: 'Skip spaces, read sign' }
    ],
    solution: {
      summary: 'Scan left to right: skip spaces, read sign, accumulate digits with overflow checks, stop on non-digit.',
      steps: ['Skip leading spaces', 'Capture sign', 'While digit: update result with overflow guards', 'Apply sign']
    },
    code: {
      javascript: `function myAtoi(s) {
  let i = 0, sign = 1, res = 0;
  while (i < s.length && s[i] === ' ') i++;
  if (s[i] === '+' || s[i] === '-') sign = s[i++] === '-' ? -1 : 1;
  const INT_MAX = 2147483647, INT_MIN = -2147483648;
  while (i < s.length && /[0-9]/.test(s[i])) {
    res = res * 10 + (s[i].charCodeAt(0) - 48);
    if (sign === 1 && res > INT_MAX) return INT_MAX;
    if (sign === -1 && -res < INT_MIN) return INT_MIN;
    i++;
  }
  return sign * res;
}`,
      python: `def myAtoi(s):
  i, sign, res = 0, 1, 0
  INT_MAX, INT_MIN = 2**31 - 1, -2**31
  while i < len(s) and s[i] == ' ': i += 1
  if i < len(s) and s[i] in '+-':
    sign = -1 if s[i] == '-' else 1
    i += 1
  while i < len(s) and s[i].isdigit():
    res = res * 10 + int(s[i])
    if sign == 1 and res > INT_MAX: return INT_MAX
    if sign == -1 and -res < INT_MIN: return INT_MIN
    i += 1
  return sign * res`,
      java: `class Solution {
  public int myAtoi(String s) {
    int i = 0, sign = 1; long res = 0;
    while (i < s.length() && s.charAt(i) == ' ') i++;
    if (i < s.length() && (s.charAt(i) == '+' || s.charAt(i) == '-')) sign = s.charAt(i++) == '-' ? -1 : 1;
    while (i < s.length() && Character.isDigit(s.charAt(i))) {
      res = res * 10 + (s.charAt(i) - '0');
      if (sign == 1 && res > Integer.MAX_VALUE) return Integer.MAX_VALUE;
      if (sign == -1 && -res < Integer.MIN_VALUE) return Integer.MIN_VALUE;
      i++;
    }
    return (int)(sign * res);
  }
}`,
      cpp: `class Solution {
public:
  int myAtoi(string s) {
    long res = 0; int i = 0, sign = 1;
    while (i < s.size() && s[i] == ' ') i++;
    if (i < s.size() && (s[i] == '+' || s[i] == '-')) sign = (s[i++] == '-') ? -1 : 1;
    while (i < s.size() && isdigit(s[i])) {
      res = res * 10 + (s[i] - '0');
      if (sign == 1 && res > INT_MAX) return INT_MAX;
      if (sign == -1 && -res < INT_MIN) return INT_MIN;
      i++;
    }
    return (int)(sign * res);
  }
};`
    },
    complexity: { time: 'O(n)', space: 'O(1)', rationale: 'Single scan with constant state.' },
    visualsAvailable: false
  },
  {
    id: 'lc-9',
    number: 9,
    title: 'Palindrome Number',
    difficulty: 'Easy',
    topic: 'Math',
    leetcodeUrl: 'https://leetcode.com/problems/palindrome-number/',
    statement: 'Given an integer x, return true if x is a palindrome, false otherwise.',
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    samples: [
      { input: 'x = 121', output: 'true', explanation: '121 reads the same forward and backward' },
      { input: 'x = -121', output: 'false', explanation: 'Negative numbers are not palindromes' }
    ],
    solution: {
      summary: 'Reverse half of the number and compare; avoid string conversion.',
      steps: ['Negative -> false; last digit 0 (non-zero number) -> false', 'Reverse last half into rev', 'Stop when rev >= x', 'Check x == rev or x == rev/10']
    },
    code: {
      javascript: `function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let rev = 0;
  while (x > rev) {
    rev = rev * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === rev || x === Math.floor(rev / 10);
}`,
      python: `def isPalindrome(x):
  if x < 0 or (x % 10 == 0 and x != 0): return False
  rev = 0
  while x > rev:
    rev = rev * 10 + x % 10
    x //= 10
  return x == rev or x == rev // 10`,
      java: `class Solution {
  public boolean isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    int rev = 0;
    while (x > rev) {
      rev = rev * 10 + x % 10;
      x /= 10;
    }
    return x == rev || x == rev / 10;
  }
}`,
      cpp: `class Solution {
public:
  bool isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    int rev = 0;
    while (x > rev) {
      rev = rev * 10 + x % 10;
      x /= 10;
    }
    return x == rev || x == rev / 10;
  }
};`
    },
    complexity: { time: 'O(d)', space: 'O(1)', rationale: 'Process digits once, constant extra variables.' },
    visualsAvailable: false
  },
  {
    id: 'lc-11',
    number: 11,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topic: 'Arrays',
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    statement: 'Given heights, find two lines that together with the x-axis form a container with the most water.',
    constraints: ['2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    samples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Best between heights 8 and 7 at distance 7' }
    ],
    solution: {
      summary: 'Two-pointer shrink from ends; move the smaller height inward each step.',
      steps: ['Set l=0, r=n-1, best=0', 'Area = min(h[l], h[r])*(r-l); update best', 'Move the shorter side inward', 'Repeat until l>=r']
    },
    code: {
      javascript: `function maxArea(h) {
  let l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
    if (h[l] < h[r]) l++; else r--;
  }
  return best;
}`,
      python: `def maxArea(h):
  l, r, best = 0, len(h) - 1, 0
  while l < r:
    best = max(best, min(h[l], h[r]) * (r - l))
    if h[l] < h[r]: l += 1
    else: r -= 1
  return best`,
      java: `class Solution {
  public int maxArea(int[] h) {
    int l = 0, r = h.length - 1, best = 0;
    while (l < r) {
      best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
      if (h[l] < h[r]) l++; else r--;
    }
    return best;
  }
}`,
      cpp: `class Solution {
public:
  int maxArea(vector<int>& h) {
    int l = 0, r = h.size() - 1, best = 0;
    while (l < r) {
      best = max(best, min(h[l], h[r]) * (r - l));
      if (h[l] < h[r]) l++; else r--;
    }
    return best;
  }
};`
    },
    complexity: { time: 'O(n)', space: 'O(1)', rationale: 'Two-pointer sweep with constant memory; update best per iteration.' },
    visualsAvailable: true,
    algorithmId: 'container-water',
    sampleInput: { array: [1, 8, 6, 2, 5, 4, 8, 3, 7] }
  },
  {
    id: 'lc-12',
    number: 12,
    title: 'Integer to Roman',
    difficulty: 'Medium',
    topic: 'Strings',
    leetcodeUrl: 'https://leetcode.com/problems/integer-to-roman/',
    statement: 'Convert an integer to a Roman numeral.',
    constraints: ['1 <= num <= 3999'],
    samples: [
      { input: 'num = 1994', output: '"MCMXCIV"', explanation: '1000 + 900 + 90 + 4' }
    ],
    solution: {
      summary: 'Greedy over descending value-symbol pairs, subtracting while possible.',
      steps: ['Define tuples of value/symbol', 'For each pair, append symbol while num >= value', 'Return built string']
    },
    code: {
      javascript: `function intToRoman(num) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const sym =  ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let res = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) { res += sym[i]; num -= vals[i]; }
  }
  return res;
}`,
      python: `def intToRoman(num):
  vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
  sym  = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
  res = []
  for v, s in zip(vals, sym):
    while num >= v:
      res.append(s); num -= v
  return ''.join(res)`,
      java: `class Solution {
  public String intToRoman(int num) {
    int[] vals = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
    String[] sym = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
    StringBuilder res = new StringBuilder();
    for (int i = 0; i < vals.length; i++) {
      while (num >= vals[i]) {
        res.append(sym[i]);
        num -= vals[i];
      }
    }
    return res.toString();
  }
}`,
      cpp: `class Solution {
public:
  string intToRoman(int num) {
    vector<int> vals = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
    vector<string> sym = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
    string res;
    for (int i = 0; i < vals.size(); ++i) {
      while (num >= vals[i]) {
        res += sym[i];
        num -= vals[i];
      }
    }
    return res;
  }
};`
    },
    complexity: { time: 'O(1)', space: 'O(1)', rationale: 'Constant-size value table; loops bounded by Roman digits.' },
    visualsAvailable: false
  }
  ,
  {
    id: 'lc-70',
    number: 70,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    statement: 'You are climbing a staircase. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    constraints: ['1 <= n <= 45'],
    samples: [{ input: 'n = 5', output: '8', explanation: 'Fib pattern of steps' }],
    solution: {
      summary: 'DP bottom-up: dp[i] = dp[i-1] + dp[i-2].',
      steps: ['dp[0]=1, dp[1]=1', 'for i>=2 set dp[i]=dp[i-1]+dp[i-2]', 'answer is dp[n]']
    },
    code: {
      javascript: `function climbStairs(n) {
  if (n <= 1) return 1;
  const dp = Array(n + 1).fill(0);
  dp[0] = dp[1] = 1;
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}`,
      python: `def climb_stairs(n):
  if n <= 1: return 1
  dp = [0] * (n + 1)
  dp[0] = dp[1] = 1
  for i in range(2, n + 1):
    dp[i] = dp[i - 1] + dp[i - 2]
  return dp[n]`,
      java: `class Solution {
  public int climbStairs(int n) {
    if (n <= 1) return 1;
    int[] dp = new int[n + 1];
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
  }
}`,
      cpp: `class Solution {
public:
  int climbStairs(int n) {
    if (n <= 1) return 1;
    vector<int> dp(n + 1, 0);
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; ++i) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
  }
};`
    },
    complexity: { time: 'O(n)', space: 'O(n)', rationale: 'Iterate once, store dp.' },
    visualsAvailable: true,
    algorithmId: 'climb-stairs',
    sampleInput: { n: 5 }
  },
  {
    id: 'lc-322',
    number: 322,
    title: 'Coin Change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    statement: 'Given coins of denominations and an amount, return the fewest coins to make up that amount. If not possible, return -1.',
    constraints: ['1 <= coins.length <= 12', '1 <= amount <= 10^4'],
    samples: [{ input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '5+5+1' }],
    solution: {
      summary: 'Unbounded knap: dp[a] = min(dp[a], 1 + dp[a-coin])',
      steps: ['Init dp with INF, dp[0]=0', 'For each coin, relax amounts from coin..amount', 'Return dp[amount] or -1']
    },
    code: {
      javascript: `function coinChange(coins, amount) {
  const INF = amount + 1;
  const dp = Array(amount + 1).fill(INF);
  dp[0] = 0;
  for (const c of coins) {
    for (let a = c; a <= amount; a++) {
      dp[a] = Math.min(dp[a], 1 + dp[a - c]);
    }
  }
  return dp[amount] === INF ? -1 : dp[amount];
}`,
      python: `def coin_change(coins, amount):
  INF = amount + 1
  dp = [INF] * (amount + 1)
  dp[0] = 0
  for c in coins:
    for a in range(c, amount + 1):
      dp[a] = min(dp[a], 1 + dp[a - c])
  return -1 if dp[amount] == INF else dp[amount]`,
      java: `class Solution {
  public int coinChange(int[] coins, int amount) {
    int INF = amount + 1;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, INF);
    dp[0] = 0;
    for (int c : coins) {
      for (int a = c; a <= amount; a++) {
        dp[a] = Math.min(dp[a], 1 + dp[a - c]);
      }
    }
    return dp[amount] == INF ? -1 : dp[amount];
  }
}`,
      cpp: `class Solution {
public:
  int coinChange(vector<int>& coins, int amount) {
    int INF = amount + 1;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;
    for (int c : coins) {
      for (int a = c; a <= amount; ++a) {
        dp[a] = min(dp[a], 1 + dp[a - c]);
      }
    }
    return dp[amount] == INF ? -1 : dp[amount];
  }
};`
    },
    complexity: { time: 'O(n*amount)', space: 'O(amount)', rationale: 'Nested loops over coins and amounts.' },
    visualsAvailable: true,
    algorithmId: 'coin-change',
    sampleInput: { coins: [1, 2, 5], amount: 11 }
  },
  {
    id: 'lc-206',
    number: 206,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topic: 'Linked List',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    statement: 'Reverse a singly linked list iteratively.',
    constraints: ['0 <= n <= 5000'],
    samples: [{ input: '1->2->3->4', output: '4->3->2->1', explanation: 'Pointers rewired' }],
    solution: {
      summary: 'Iteratively rewire next pointers while walking the list.',
      steps: ['prev=null, cur=head', 'store next; cur.next=prev; move prev, cur', 'return prev']
    },
    code: {
      javascript: `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
      python: `def reverseList(head):
  prev, cur = None, head
  while cur:
    nxt = cur.next
    cur.next = prev
    prev, cur = cur, nxt
  return prev`,
      java: `class Solution {
  public ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
      ListNode nxt = cur.next;
      cur.next = prev;
      prev = cur;
      cur = nxt;
    }
    return prev;
  }
}`,
      cpp: `class Solution {
public:
  ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr; ListNode* cur = head;
    while (cur) {
      ListNode* nxt = cur->next;
      cur->next = prev;
      prev = cur;
      cur = nxt;
    }
    return prev;
  }
};`
    },
    complexity: { time: 'O(n)', space: 'O(1)', rationale: 'Single pass, constant pointers.' },
    visualsAvailable: true,
    algorithmId: 'linked-list-reverse',
    sampleInput: { list: [3, 1, 4, 1, 5] }
  },
  {
    id: 'lc-51',
    number: 51,
    title: 'N-Queens',
    difficulty: 'Hard',
    topic: 'Backtracking',
    leetcodeUrl: 'https://leetcode.com/problems/n-queens/',
    statement: 'Place N queens on an N×N board so that no two queens attack each other.',
    constraints: ['1 <= n <= 9'],
    samples: [{ input: 'n = 4', output: '2 solutions', explanation: 'Standard N-Queens solutions count' }],
    solution: {
      summary: 'Backtracking by row with column and diagonal sets; place, recurse, backtrack.',
      steps: ['Track cols, diag1, diag2', 'Row by row, try each col not in conflicts', 'Place queen, recurse, then unplace']
    },
    code: {
      javascript: `function solveNQueens(n) {
  const cols = new Set(), d1 = new Set(), d2 = new Set();
  const board = Array(n).fill(-1);
  const res = [];
  function backtrack(r) {
    if (r === n) { res.push([...board]); return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      board[r] = c; cols.add(c); d1.add(r - c); d2.add(r + c);
      backtrack(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c);
    }
  }
  backtrack(0);
  return res;
}`,
      python: `def solveNQueens(n):
  cols, d1, d2 = set(), set(), set()
  board, res = [-1]*n, []
  def backtrack(r):
    if r == n:
      res.append(board.copy()); return
    for c in range(n):
      if c in cols or (r-c) in d1 or (r+c) in d2: continue
      board[r] = c; cols.add(c); d1.add(r-c); d2.add(r+c)
      backtrack(r+1)
      cols.remove(c); d1.remove(r-c); d2.remove(r+c)
  backtrack(0)
  return res`,
      java: `class Solution {
  List<List<String>> res = new ArrayList<>();
  boolean[] cols, d1, d2;
  public List<List<String>> solveNQueens(int n) {
    cols = new boolean[n];
    d1 = new boolean[2*n];
    d2 = new boolean[2*n];
    int[] board = new int[n];
    backtrack(0, n, board);
    return res;
  }
  void backtrack(int r, int n, int[] board) {
    if (r == n) { res.add(build(board)); return; }
    for (int c = 0; c < n; c++) {
      if (cols[c] || d1[r-c+n] || d2[r+c]) continue;
      cols[c] = d1[r-c+n] = d2[r+c] = true; board[r] = c;
      backtrack(r+1, n, board);
      cols[c] = d1[r-c+n] = d2[r+c] = false;
    }
  }
  List<String> build(int[] b) {
    List<String> out = new ArrayList<>();
    for (int r = 0; r < b.length; r++) {
      char[] row = new char[b.length];
      Arrays.fill(row, '.'); row[b[r]] = 'Q';
      out.add(new String(row));
    }
    return out;
  }
}`,
      cpp: `class Solution {
public:
  vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> res;
    vector<int> board(n, -1);
    vector<bool> cols(n, false), d1(2*n, false), d2(2*n, false);
    function<void(int)> dfs = [&](int r) {
      if (r == n) { res.push_back(build(board)); return; }
      for (int c = 0; c < n; ++c) {
        if (cols[c] || d1[r-c+n] || d2[r+c]) continue;
        cols[c] = d1[r-c+n] = d2[r+c] = true; board[r] = c;
        dfs(r+1);
        cols[c] = d1[r-c+n] = d2[r+c] = false;
      }
    };
    dfs(0);
    return res;
  }
private:
  vector<string> build(const vector<int>& b) {
    vector<string> out(b.size(), string(b.size(), '.'));
    for (int r = 0; r < b.size(); ++r) out[r][b[r]] = 'Q';
    return out;
  }
};`
    },
    complexity: { time: 'O(n!)', space: 'O(n)', rationale: 'Backtracking search over positions.' },
    visualsAvailable: true,
    algorithmId: 'n-queens',
    sampleInput: { nQueens: 4 }
  }
];

export const problems: ProblemConfig[] = [...baseProblems, ...additionalProblems];
