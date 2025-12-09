// BeatCoders Problem Database
// A comprehensive collection of practice problems categorized by topic.

window.FULL_PROBLEM_SET = [
  // --- ARRAYS & HASHING ---
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    acceptance: "60.1%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [1,2,3,1]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">true</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [1,2,3,4]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">false</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [1,1,1,3,3,4,3,2,4,2]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">true</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= nums.length <= 10^5</code></li>
        <li class="constraint-item"><code>-10^9 <= nums[i] <= 10^9</code></li>
      </ul>
    `,
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, output: true },
      { input: { nums: [1, 2, 3, 4] }, output: false },
      { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, output: true }
    ],
    template: "def containsDuplicate(nums):\n    # Write your code here\n    pass"
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    acceptance: "62.4%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "anagram", t = "nagaram"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">true</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "rat", t = "car"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">false</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "a", t = "ab"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">false</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= s.length, t.length <= 5 * 10^4</code></li>
        <li class="constraint-item"><code>s</code> and <code>t</code> consist of lowercase English letters.</li>
      </ul>
    `,
    testCases: [
      { input: { s: "anagram", t: "nagaram" }, output: true },
      { input: { s: "rat", t: "car" }, output: false },
      { input: { s: "ab", t: "pi" }, output: false }
    ],
    template: "def isAnagram(s, t):\n    # Write your code here\n    pass"
  },
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    acceptance: "49.2%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [2,7,11,15], target = 9</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[0,1]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [3,2,4], target = 6</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[1,2]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [3,3], target = 6</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[0,1]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>2 <= nums.length <= 10^4</code></li>
        <li class="constraint-item"><code>-10^9 <= nums[i] <= 10^9</code></li>
        <li class="constraint-item"><code>-10^9 <= target <= 10^9</code></li>
        <li class="constraint-item"><strong>Only one valid answer exists.</strong></li>
      </ul>
    `,
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
    ],
    template: "def twoSum(nums, target):\n    # Write your code here\n    pass"
  },
  {
    title: "Group Anagrams",
    difficulty: "Medium",
    topic: "Arrays & Hashing",
    acceptance: "66.2%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in any order.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">strs = ["eat","tea","tan","ate","nat","bat"]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[["bat"],["nat","tan"],["ate","eat","tea"]]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">strs = [""]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[[""]]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">strs = ["a"]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[["a"]]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= strs.length <= 10^4</code></li>
        <li class="constraint-item"><code>0 <= strs[i].length <= 100</code></li>
        <li class="constraint-item"><code>strs[i]</code> consists of lowercase English letters.</li>
      </ul>
    `,
    testCases: [
      { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, output: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
      { input: { strs: [""] }, output: [[""]] },
      { input: { strs: ["a"] }, output: [["a"]] }
    ],
    template: "def groupAnagrams(strs):\n    # Write your code here\n    pass"
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    topic: "Arrays & Hashing",
    acceptance: "64.1%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [1,1,1,2,2,3], k = 2</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[1,2]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [1], k = 1</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[1]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [4,4,4,1], k = 1</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[4]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= nums.length <= 10^5</code></li>
        <li class="constraint-item"><code>k</code> is in the range <code>[1, the number of unique elements in the array]</code>.</li>
        <li class="constraint-item">It is <strong>guaranteed</strong> that the answer is unique.</li>
      </ul>
    `,
    testCases: [
      { input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, output: [1, 2] },
      { input: { nums: [1], k: 1 }, output: [1] },
      { input: { nums: [4, 4, 4, 1], k: 1 }, output: [4] }
    ],
    template: "def topKFrequent(nums, k):\n    # Write your code here\n    pass"
  },

  // --- TWO POINTERS ---
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    topic: "Two Pointers",
    acceptance: "43.5%",
    htmlDescription: `
      <div class="problem-statement">
        <p>A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "A man, a plan, a canal: Panama"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">true</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "race a car"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">false</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = " "</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">true</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= s.length <= 2 * 10^5</code></li>
        <li class="constraint-item"><code>s</code> consists only of printable ASCII characters.</li>
      </ul>
    `,
    testCases: [
      { input: { s: "A man, a plan, a canal: Panama" }, output: true },
      { input: { s: "race a car" }, output: false },
      { input: { s: " " }, output: true }
    ],
    template: "def isPalindrome(s):\n    # Write your code here\n    pass"
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    topic: "Two Pointers",
    acceptance: "32.1%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [-1,0,1,2,-1,-4]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[[-1,-1,2],[-1,0,1]]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [0,1,1]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [0,0,0]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[[0,0,0]]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>3 <= nums.length <= 3000</code></li>
        <li class="constraint-item"><code>-10^5 <= nums[i] <= 10^5</code></li>
      </ul>
    `,
    testCases: [
      { input: { nums: [-1, 0, 1, 2, -1, -4] }, output: [[-1, -1, 2], [-1, 0, 1]] },
      { input: { nums: [0, 1, 1] }, output: [] },
      { input: { nums: [0, 0, 0] }, output: [[0, 0, 0]] }
    ],
    template: "def threeSum(nums):\n    # Write your code here\n    pass"
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    topic: "Two Pointers",
    acceptance: "54.0%",
    htmlDescription: `
      <div class="problem-statement">
        <p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i</code>th line are <code>(i, 0)</code> and <code>(i, height[i])</code>. Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">height = [1,8,6,2,5,4,8,3,7]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">49</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">height = [1,1]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">1</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">height = [4,3,2,1,4]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">16</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>n == height.length</code></li>
        <li class="constraint-item"><code>2 <= n <= 10^5</code></li>
        <li class="constraint-item"><code>0 <= height[i] <= 10^4</code></li>
      </ul>
    `,
    testCases: [
      { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, output: 49 },
      { input: { height: [1, 1] }, output: 1 },
      { input: { height: [4, 3, 2, 1, 4] }, output: 16 }
    ],
    template: "def maxArea(height):\n    # Write your code here\n    pass"
  },

  // --- SLIDING WINDOW ---
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Sliding Window",
    acceptance: "54.3%",
    htmlDescription: `
      <div class="problem-statement">
        <p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i</code>th day. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return <code>0</code>.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">prices = [7,1,5,3,6,4]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">5</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">prices = [7,6,4,3,1]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">0</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">prices = [1,2,7,1,3]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">6</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= prices.length <= 10^5</code></li>
        <li class="constraint-item"><code>0 <= prices[i] <= 10^4</code></li>
      </ul>
    `,
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, output: 5 },
      { input: { prices: [7, 6, 4, 3, 1] }, output: 0 },
      { input: { prices: [1, 2, 7, 1, 3] }, output: 6 }
    ],
    template: "def maxProfit(prices):\n    # Write your code here\n    pass"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",
    acceptance: "33.8%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "abcabcbb"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">3</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "bbbbb"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">1</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "pwwkew"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">3</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>0 <= s.length <= 5 * 10^4</code></li>
        <li class="constraint-item"><code>s</code> consists of English letters, digits, symbols and spaces.</li>
      </ul>
    `,
    testCases: [
      { input: { s: "abcabcbb" }, output: 3 },
      { input: { s: "bbbbb" }, output: 1 },
      { input: { s: "pwwkew" }, output: 3 }
    ],
    template: "def lengthOfLongestSubstring(s):\n    # Write your code here\n    pass"
  },

  // --- STACK ---
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    acceptance: "40.5%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "()[]{}"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">true</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "(]"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">false</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">s = "([)]"</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">false</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= s.length <= 10^4</code></li>
        <li class="constraint-item"><code>s</code> consists of parentheses only '()[]{}'.</li>
      </ul>
    `,
    testCases: [
      { input: { s: "()[]{}" }, output: true },
      { input: { s: "(]" }, output: false },
      { input: { s: "([)]" }, output: false }
    ],
    template: "def isValid(s):\n    # Write your code here\n    pass"
  },
  {
    title: "Min Stack",
    difficulty: "Medium",
    topic: "Stack",
    acceptance: "52.3%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.</p>
      </div>
      <div class="section-title">Examples</div>
        <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">["MinStack","push","push","push","getMin","pop","top","getMin"]</code></div>
        <div class="io-group"><span class="io-label">Args</span><code class="io-value">[[],[-2],[0],[-3],[],[],[],[]]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[null,null,null,null,-3,null,0,-2]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item">O(1) time complexity for all operations</li>
      </ul>
    `,
    testCases: [],
    template: "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        pass\n    def getMin(self) -> int:\n        pass"
  },

  // --- BINARY SEARCH ---
  {
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    acceptance: "55.0%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, return its index. Otherwise, return <code>-1</code>.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [-1,0,3,5,9,12], target = 9</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">4</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [-1,0,3,5,9,12], target = 2</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">-1</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [5], target = 5</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">0</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= nums.length <= 10^4</code></li>
        <li class="constraint-item"><code>nums</code> is sorted in ascending order.</li>
      </ul>
    `,
    testCases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, output: 4 },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, output: -1 },
      { input: { nums: [5], target: 5 }, output: 0 }
    ],
    template: "def search(nums, target):\n    # Write your code here\n    pass"
  },
  {
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    topic: "Binary Search",
    acceptance: "48.2%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Write an efficient algorithm that searches for a value <code>target</code> in an <code>m x n</code> integer matrix <code>matrix</code>. This matrix has the following properties: Integers in each row are sorted from left to right. The first integer of each row is greater than the last integer of the previous row.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">true</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">false</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">matrix = [[1]], target = 1</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">true</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>m == matrix.length</code></li>
        <li class="constraint-item"><code>n == matrix[i].length</code></li>
      </ul>
    `,
    testCases: [
      { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 3 }, output: true },
      { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 13 }, output: false },
      { input: { matrix: [[1]], target: 1 }, output: true }
    ],
    template: "def searchMatrix(matrix, target):\n    # Write your code here\n    pass"
  },

  // --- LINKED LIST ---
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    acceptance: "72.4%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">head = [1,2,3,4,5]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[5,4,3,2,1]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">head = [1,2]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[2,1]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">head = []</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item">The number of nodes in the list is the range <code>[0, 5000]</code>.</li>
      </ul>
    `,
    testCases: [],
    template: "def reverseList(head):\n    # Write your code here\n    pass"
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    acceptance: "61.8%",
    htmlDescription: `
      <div class="problem-statement">
        <p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>. Merge the two lists in a one <strong>sorted</strong> linked list.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">list1 = [1,2,4], list2 = [1,3,4]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[1,1,2,3,4,4]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">list1 = [], list2 = []</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">list1 = [], list2 = [0]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[0]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item">The number of nodes in both lists is in the range <code>[0, 50]</code>.</li>
      </ul>
    `,
    testCases: [],
    template: "def mergeTwoLists(list1, list2):\n    # Write your code here\n    pass"
  },

  // --- TREES ---
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    topic: "Trees",
    acceptance: "74.8%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given the <code>root</code> of a binary tree, invert the tree, and return <em>its root</em>.</p>
      </div>
        <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">root = [4,2,7,1,3,6,9]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[4,7,2,9,6,3,1]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item">The number of nodes in the tree is in the range <code>[0, 100]</code>.</li>
      </ul>
    `,
    testCases: [],
    template: "def invertTree(root):\n    # Write your code here\n    pass"
  },
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topic: "Trees",
    acceptance: "73.2%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given the <code>root</code> of a binary tree, return <em>its maximum depth</em>.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">root = [3,9,20,null,null,15,7]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">3</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">root = [1,null,2]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">2</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item">The range of nodes in the tree is in the range <code>[0, 10^4]</code>.</li>
      </ul>
    `,
    testCases: [],
    template: "def maxDepth(root):\n    # Write your code here\n    pass"
  },

  // --- GRAPHS ---
  {
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs",
    acceptance: "56.4%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return <em>the number of islands</em>.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">1</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>m == grid.length</code></li>
        <li class="constraint-item"><code>n == grid[i].length</code></li>
      </ul>
    `,
    testCases: [],
    template: "def numIslands(grid):\n    # Write your code here\n    pass"
  },
  {
    title: "Clone Graph",
    difficulty: "Medium",
    topic: "Graphs",
    acceptance: "51.1%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given a reference of a node in a <strong>connected</strong> undirected graph. Return a <strong>deep copy</strong> (clone) of the graph.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">adjList = [[2,4],[1,3],[2,4],[1,3]]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[[2,4],[1,3],[2,4],[1,3]]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item">The number of nodes is in the range <code>[0, 100]</code>.</li>
      </ul>
    `,
    testCases: [],
    template: "def cloneGraph(node):\n    # Write your code here\n    pass"
  },

  // --- DYNAMIC PROGRAMMING ---
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "1-D DP",
    acceptance: "52.0%",
    htmlDescription: `
      <div class="problem-statement">
        <p>You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">n = 2</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">2</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">n = 3</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">3</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">n = 4</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">5</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= n <= 45</code></li>
      </ul>
    `,
    testCases: [{ input: { n: 2 }, output: 2 }, { input: { n: 3 }, output: 3 }, { input: { n: 4 }, output: 5 }],
    template: "def climbStairs(n):\n    # Write your code here\n    pass"
  },
  {
    title: "House Robber",
    difficulty: "Medium",
    topic: "1-D DP",
    acceptance: "48.9%",
    htmlDescription: `
      <div class="problem-statement">
        <p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you is that adjacent houses have security systems connected and <strong>it will automatically contact the police if two adjacent houses were broken into on the same night</strong>.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [1,2,3,1]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">4</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [2,7,9,3,1]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">12</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [2,1]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">2</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= nums.length <= 100</code></li>
        <li class="constraint-item"><code>0 <= nums[i] <= 400</code></li>
      </ul>
    `,
    testCases: [{ input: { nums: [1, 2, 3, 1] }, output: 4 }, { input: { nums: [2, 7, 9, 3, 1] }, output: 12 }, { input: { nums: [2, 1] }, output: 2 }],
    template: "def rob(nums):\n    # Write your code here\n    pass"
  }
];

if (typeof window !== 'undefined') {
  console.log('[Problems DB] Loaded ' + window.FULL_PROBLEM_SET.length + ' problems.');
}
