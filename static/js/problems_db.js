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
    
    flowchart: `flowchart TD
    A(["Start"]) --> B{"Is nums empty?"}
    B -- Yes --> C(["Return False"])
    B -- No --> D["Init HashSet seen"]
    D --> E["For each num in nums"]
    E --> F{"num in seen?"}
    F -- Yes --> G(["Return True"])
    F -- No --> H["Add num to seen"]
    H --> E
    E -- Loop End --> I(["Return False"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Start"]) --> B{"Length s != Length t?"}
    B -- Yes --> C(["Return False"])
    B -- No --> D["Sort s and t"]
    D --> E{"Sorted s == Sorted t?"}
    E -- Yes --> F(["Return True"])
    E -- No --> G(["Return False"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["Init HashMap prevMap"]
    B --> C["For i, n in enumerate(nums)"]
    C --> D["diff = target - n"]
    D --> E{"diff in prevMap?"}
    E -- Yes --> F(["Return [prevMap[diff], i]"])
    E -- No --> G["prevMap[n] = i"]
    G --> C
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["Init HashMap groups"]
    B --> C["For s in strs"]
    C --> D["key = sorted(s)"]
    D --> E["groups[key].append(s)"]
    E --> C
    C -- Loop End --> F(["Return groups.values()"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["Count freq of each num"]
    B --> C["Init bucket array of size len(nums)+1"]
    C --> D["Fill buckets with numbers by freq"]
    D --> E["Iterate buckets backwards"]
    E --> F["Add nums to result"]
    F --> G{"res.length == k?"}
    G -- Yes --> H(["Return res"])
    G -- No --> E
    linkStyle default interpolate rectilinear`,
    template: "def topKFrequent(nums, k):\n    # Write your code here\n    pass"
  },

  {
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Arrays & Hashing",
    acceptance: "65.1%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.</p>
        <p>The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</p>
        <p>You must write an algorithm that runs in <code>O(n)</code> time and without using the division operation.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [1,2,3,4]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[24,12,8,6]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [-1,1,0,-3,3]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[0,0,9,0,0]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>2 <= nums.length <= 10^5</code></li>
        <li class="constraint-item"><code>-30 <= nums[i] <= 30</code></li>
      </ul>
    `,
    testCases: [
      { input: { nums: [1, 2, 3, 4] }, output: [24, 12, 8, 6] },
      { input: { nums: [-1, 1, 0, -3, 3] }, output: [0, 0, 9, 0, 0] }
    ],
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["Init result array with 1s"]
    B --> C["prefix = 1"]
    C --> D["Loop i from 0 to len-1"]
    D --> E["result[i] = prefix"]
    E --> F["prefix *= nums[i]"]
    F --> D
    D -- Loop End --> G["postfix = 1"]
    G --> H["Loop i from len-1 to 0"]
    H --> I["result[i] *= postfix"]
    I --> J["postfix *= nums[i]"]
    J --> H
    H -- Loop End --> K(["Return result"])
    linkStyle default interpolate rectilinear`,
    template: "def productExceptSelf(nums):\n    # Write your code here\n    pass"
  },
  {
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    topic: "Arrays & Hashing",
    acceptance: "48.1%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence.</p>
        <p>You must write an algorithm that runs in <code>O(n)</code> time.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [100,4,200,1,3,2]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">4</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [0,3,7,2,5,8,4,6,0,1]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">9</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>0 <= nums.length <= 10^5</code></li>
        <li class="constraint-item"><code>-10^9 <= nums[i] <= 10^9</code></li>
      </ul>
    `,
    testCases: [
      { input: { nums: [100, 4, 200, 1, 3, 2] }, output: 4 },
      { input: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] }, output: 9 }
    ],
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["numSet = set(nums)"]
    B --> C["longest = 0"]
    C --> D["For n in numSet"]
    D --> E{"(n - 1) not in numSet?"}
    E -- No --> D
    E -- Yes --> F["length = 1"]
    F --> G{"(n + length) in numSet?"}
    G -- Yes --> H["length++"]
    H --> G
    G -- No --> I["longest = max(longest, length)"]
    I --> D
    D -- Loop End --> J(["Return longest"])
    linkStyle default interpolate rectilinear`,
    template: "def longestConsecutive(nums):\n    # Write your code here\n    pass"
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
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["Filter non-alphanumeric chars"]
    B --> C["Convert to lowercase"]
    C --> D["Init Left=0, Right=len-1"]
    D --> E{"Left < Right?"}
    E -- Yes --> F{"Chars Match?"}
    F -- Yes --> G["Left++, Right--"]
    G --> E
    F -- No --> H(["Return False"])
    E -- No --> I(["Return True"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Sort nums"]) --> B["Loop i from 0 to len-2"]
    B --> C{"i > 0 and nums[i] == nums[i-1]?"}
    C -- Yes --> B
    C -- No --> D["Init L=i+1, R=len-1"]
    D --> E{"L < R?"}
    E -- No --> B
    E -- Yes --> F["sum = nums[i] + nums[L] + nums[R]"]
    F --> G{"sum < 0?"}
    G -- Yes --> H["L++"]
    G -- No --> I{"sum > 0?"}
    I -- Yes --> J["R--"]
    I -- No --> K["Add to results, L++, Skip dups"]
    H --> E
    J --> E
    K --> E
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Init Left=0, Right=len-1"]) --> B["Init maxArea=0"]
    B --> C{"Left < Right?"}
    C -- No --> D(["Return maxArea"])
    C -- Yes --> E["Calc area = (R-L) * min(h[L], h[R])"]
    E --> F["maxArea = max(maxArea, area)"]
    F --> G{"h[L] < h[R]?"}
    G -- Yes --> H["Left++"]
    G -- No --> I["Right--"]
    H --> C
    I --> C
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Init minPrice=inf, maxPro=0"]) --> B["For price in prices"]
    B --> C{"price < minPrice?"}
    C -- Yes --> D["minPrice = price"]
    C -- No --> E["profit = price - minPrice"]
    E --> F["maxPro = max(maxPro, profit)"]
    D --> B
    F --> B
    B -- Loop End --> G(["Return maxPro"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Init charSet, L=0, res=0"]) --> B["Loop R from 0 to len-1"]
    B --> C{"s[R] in charSet?"}
    C -- Yes --> D["Remove s[L] from charSet, L++"]
    D --> C
    C -- No --> E["Add s[R] to charSet"]
    E --> F["res = max(res, R-L+1)"]
    F --> B
    B -- Loop End --> G(["Return res"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Init Stack"]) --> B["For char c in s"]
    B --> C{"c in Map?"}
    C -- Yes --> D{"Stack not empty & top == Map[c]?"}
    D -- Yes --> E["Stack.pop"]
    D -- No --> F(["Return False"])
    C -- No --> G["Stack.push(c)"]
    G --> B
    E --> B
    B -- Loop End --> H{"Stack empty?"}
    H -- Yes --> I(["Return True"])
    H -- No --> J(["Return False"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Class MinStack"]) --> B["Init: stack=[], minStack=[]"]
    B --> C["Push(val): stack.append(val)"]
    C --> D["minVal = min(val, minStack.top)"]
    D --> E["minStack.append(minVal)"]
    A --> F["Pop: stack.pop, minStack.pop"]
    A --> G["Top: stack[-1]"]
    A --> H["GetMin: minStack[-1]"]
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Init L=0, R=len-1"]) --> B{"L <= R?"}
    B -- No --> C(["Return -1"])
    B -- Yes --> D["mid = (L+R)//2"]
    D --> E{"nums[mid] == target?"}
    E -- Yes --> F(["Return mid"])
    E -- No --> G{"nums[mid] < target?"}
    G -- Yes --> H["L = mid + 1"]
    G -- No --> I["R = mid - 1"]
    H --> B
    I --> B
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Init top=0, bot=m-1"]) --> B{"top <= bot?"}
    B -- No --> C(["Return False"])
    B -- Yes --> D["midRow = (top+bot)//2"]
    D --> E{"target < matrix[midRow][0]?"}
    E -- Yes --> F["bot = midRow - 1"]
    E -- No --> G{"target > matrix[midRow][-1]?"}
    G -- Yes --> H["top = midRow + 1"]
    G -- No --> I["Binary Search in midRow"]
    F --> B
    H --> B
    I --> J(["Return Result"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Init prev=None, curr=head"]) --> B{"curr is None?"}
    B -- Yes --> C(["Return prev"])
    B -- No --> D["next_node = curr.next"]
    D --> E["curr.next = prev"]
    E --> F["prev = curr"]
    F --> G["curr = next_node"]
    G --> B
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["Init dummy node"]) --> B["tail = dummy"]
    B --> C{"list1 and list2?"}
    C -- No --> D["tail.next = list1 or list2"]
    D --> E(["Return dummy.next"])
    C -- Yes --> F{"list1.val < list2.val?"}
    F -- Yes --> G["tail.next = list1, list1 = list1.next"]
    F -- No --> H["tail.next = list2, list2 = list2.next"]
    G --> I["tail = tail.next"]
    H --> I
    I --> C
    linkStyle default interpolate rectilinear`,
    template: "def mergeTwoLists(list1, list2):\n    # Write your code here\n    pass"
  },

  {
    title: "Reorder List",
    difficulty: "Medium",
    topic: "Linked List",
    acceptance: "59.2%",
    htmlDescription: `
      <div class="problem-statement">
        <p>You are given the head of a singly linked-list. The list can be represented as:</p>
        <p><code>L0 → L1 → … → Ln - 1 → Ln</code></p>
        <p><em>Reorder the list to be on the following form:</em></p>
        <p><code>L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …</code></p>
        <p>You may not modify the values in the list's nodes. Only nodes themselves may be changed.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">head = [1,2,3,4]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[1,4,2,3]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">head = [1,2,3,4,5]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[1,5,2,4,3]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item">The number of nodes in the list is in the range <code>[1, 5 * 10^4]</code>.</li>
        <li class="constraint-item"><code>1 <= Node.val <= 1000</code></li>
      </ul>
    `,
    testCases: [
      { input: { head: [1, 2, 3, 4] }, output: [1, 4, 2, 3] },
      { input: { head: [1, 2, 3, 4, 5] }, output: [1, 5, 2, 4, 3] }
    ],
    
    flowchart: `flowchart TD
    A(["Start"]) --> B{"head or head.next is None?"}
    B -- Yes --> C(["Return"])
    B -- No --> D["Find Middle (Slow/Fast)"]
    D --> E["Reverse Second Half"]
    E --> F["Merge Two Halves"]
    F --> G(["End"])
    linkStyle default interpolate rectilinear`,
    template: "def reorderList(head):\n    # Write your code here\n    pass"
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
    
    flowchart: `flowchart TD
    A{"root is None?"} --> B -- Yes --> C(["Return None"])
    A -- No --> D["Swap left and right children"]
    D --> E["invertTree(root.left)"]
    E --> F["invertTree(root.right)"]
    F --> G(["Return root"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A{"root is None?"} --> B -- Yes --> C(["Return 0"])
    A -- No --> D["l_depth = maxDepth(root.left)"]
    D --> E["r_depth = maxDepth(root.right)"]
    E --> F(["Return max(l, r) + 1"])
    linkStyle default interpolate rectilinear`,
    template: "def maxDepth(root):\n    # Write your code here\n    pass"
  },

  {
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    topic: "Trees",
    acceptance: "68.2%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return the <code>k</code>th smallest value (1-indexed) of all the values of the nodes in the tree.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">root = [3,1,4,null,2], k = 1</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">1</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">root = [5,3,6,2,4,null,null,1], k = 3</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">3</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item">The number of nodes in the tree is <code>n</code>.</li>
        <li class="constraint-item"><code>1 <= k <= n <= 10^4</code></li>
        <li class="constraint-item"><code>0 <= Node.val <= 10^4</code></li>
      </ul>
    `,
    testCases: [
      { input: { root: [3, 1, 4, null, 2], k: 1 }, output: 1 },
      { input: { root: [5, 3, 6, 2, 4, null, null, 1], k: 3 }, output: 3 }
    ],
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["Stack = []"]
    B --> C["Result = 0"]
    C --> D{"Root or Stack not empty?"}
    D -- No --> E(["Return Result"])
    D -- Yes --> F{"Root is not None?"}
    F -- Yes --> G["Stack.push(Root)"]
    G --> H["Root = Root.left"]
    H --> F
    F -- No --> I["Root = Stack.pop()"]
    I --> J["k--"]
    J --> K{"k == 0?"}
    K -- Yes --> L(["Return Root.val"])
    K -- No --> M["Root = Root.right"]
    M --> D
    linkStyle default interpolate rectilinear`,
    template: "def kthSmallest(root, k):\n    # Write your code here\n    pass"
  },
  {
    title: "LCA of a Binary Search Tree",
    difficulty: "Medium",
    topic: "Trees",
    acceptance: "60.1%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.</p>
        <p>According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as descendants (where we allow <strong>a node to be a descendant of itself</strong>).”</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">6</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">2</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item">The number of nodes in the tree is in the range <code>[2, 10^5]</code>.</li>
        <li class="constraint-item"><code>-10^9 <= Node.val <= 10^9</code></li>
        <li class="constraint-item">All <code>Node.val</code> are <strong>unique</strong>.</li>
        <li class="constraint-item"><code>p != q</code></li>
        <li class="constraint-item"><code>p</code> and <code>q</code> will exist in the BST.</li>
      </ul>
    `,
    testCases: [
      { input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8 }, output: 6 },
      { input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4 }, output: 2 }
    ],
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["curr = root"]
    B --> C{"curr is not None?"}
    C -- No --> D(["Return None"])
    C -- Yes --> E{"p.val < curr.val and q.val < curr.val?"}
    E -- Yes --> F["curr = curr.left"]
    E -- No --> G{"p.val > curr.val and q.val > curr.val?"}
    G -- Yes --> H["curr = curr.right"]
    G -- No --> I(["Return curr"])
    F --> B
    H --> B
    linkStyle default interpolate rectilinear`,
    template: "def lowestCommonAncestor(root, p, q):\n    # Write your code here\n    pass"
  },

  // --- TRIES ---
  {
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    topic: "Tries",
    acceptance: "61.5%",
    htmlDescription: `
      <div class="problem-statement">
        <p>A <strong>trie</strong> (pronounced as "try") or <strong>prefix tree</strong> is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.</p>
        <p>Implement the <code>Trie</code> class:</p>
        <ul>
        <li><code>Trie()</code> Initializes the trie object.</li>
        <li><code>void insert(String word)</code> Inserts the string <code>word</code> into the trie.</li>
        <li><code>boolean search(String word)</code> Returns <code>true</code> if the string <code>word</code> is in the trie (i.e., was previously inserted), and <code>false</code> otherwise.</li>
        <li><code>boolean startsWith(String prefix)</code> Returns <code>true</code> if there is a previously inserted string <code>word</code> that has the prefix <code>prefix</code>, and <code>false</code> otherwise.</li>
        </ul>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[null, null, true, false, true, null, true]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= word.length, prefix.length <= 2000</code></li>
        <li class="constraint-item"><code>word</code> and <code>prefix</code> consist only of lowercase English letters.</li>
        <li class="constraint-item">At most <code>3 * 10^4</code> calls in total will be made to <code>insert</code>, <code>search</code>, and <code>startsWith</code>.</li>
      </ul>
    `,
    testCases: [],
    
    flowchart: `flowchart TD
    A(["Class Trie"]) --> B["Init: root = TrieNode()"]
    B --> C["Insert(word)"]
    C --> D["curr = root"]
    D --> E["For c in word"]
    E --> F{"c not in curr.children?"}
    F -- Yes --> G["curr.children[c] = TrieNode()"]
    G --> H["curr = curr.children[c]"]
    F -- No --> H
    E -- End --> I["curr.endOfWord = True"]
    A --> J["Search(word)"]
    J --> K["Same loop as Insert"]
    K --> L{"End of loop reached?"}
    L -- Yes --> M(["Return curr.endOfWord"])
    L -- No --> N(["Return False"])
    A --> O["StartsWith(prefix)"]
    O --> P["Same loop as Insert"]
    P -- End --> Q(["Return True"])
    linkStyle default interpolate rectilinear`,
    template: "class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word: str) -> None:\n        pass\n    def search(self, word: str) -> bool:\n        pass\n    def startsWith(self, prefix: str) -> bool:\n        pass"
  },

  // --- HEAPS ---
  {
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    topic: "Heaps",
    acceptance: "53.1%",
    htmlDescription: `
      <div class="problem-statement">
        <p>The <strong>median</strong> is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.</p>
        <p>Implement the MedianFinder class:</p>
        <ul>
        <li><code>MedianFinder()</code> initializes the <code>MedianFinder</code> object.</li>
        <li><code>void addNum(int num)</code> adds the integer <code>num</code> from the data stream to the data structure.</li>
        <li><code>double findMedian()</code> returns the median of all elements so far. Answers within <code>10^-5</code> of the actual answer will be accepted.</li>
        </ul>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[null, null, null, 1.5, null, 2.0]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>-10^5 <= num <= 10^5</code></li>
        <li class="constraint-item">There will be at least one element in the data structure before calling <code>findMedian</code>.</li>
        <li class="constraint-item">At most <code>5 * 10^4</code> calls will be made to <code>addNum</code> and <code>findMedian</code>.</li>
      </ul>
    `,
    testCases: [],
    
    flowchart: `flowchart TD
    A(["Class MedianFinder"]) --> B["Init: small=[-], large=[+]"]
    B --> C["addNum(num)"]
    C --> D["Push to small, then pop max from small to large"]
    D --> E{"len(small) < len(large)?"}
    E -- Yes --> F["Pop min from large to small"]
    F --> G["Return"]
    E -- No --> G
    A --> H["findMedian()"]
    H --> I{"len(small) > len(large)?"}
    I -- Yes --> J(["Return small[0]"])
    I -- No --> K(["Return (small[0] + large[0]) / 2"])
    linkStyle default interpolate rectilinear`,
    template: "class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num: int) -> None:\n        pass\n    def findMedian(self) -> float:\n        pass"
  },
  {
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    topic: "Heaps",
    acceptance: "47.2%",
    htmlDescription: `
      <div class="problem-statement">
        <p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.</p>
        <p><em>Merge all the linked-lists into one sorted linked-list and return it.</em></p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">lists = [[1,4,5],[1,3,4],[2,6]]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[1,1,2,3,4,4,5,6]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">lists = []</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>k == lists.length</code></li>
        <li class="constraint-item"><code>0 <= k <= 10^4</code></li>
        <li class="constraint-item"><code>0 <= lists[i].length <= 500</code></li>
      </ul>
    `,
    testCases: [],
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["Init MinHeap"]
    B --> C["For each list in lists"]
    C --> D{"list is not None?"}
    D -- Yes --> E["Heap.push(list.val, list)"]
    D -- No --> F["Continue"]
    E --> F
    F --> G["Loop end"]
    G --> H["Init dummy, tail"]
    H --> I{"Heap not empty?"}
    I -- No --> J(["Return dummy.next"])
    I -- Yes --> K["Pop (val, node) from Heap"]
    K --> L["tail.next = node"]
    L --> M["tail = tail.next"]
    M --> N{"node.next not None?"}
    N -- Yes --> O["Heap.push(node.next.val, node.next)"]
    N -- No --> I
    O --> I
    linkStyle default interpolate rectilinear`,
    template: "def mergeKLists(lists):\n    # Write your code here\n    pass"
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
    
    flowchart: `flowchart TD
    A(["Init islands = 0"]) --> B["Loop r in rows"]
    B --> C["Loop c in cols"]
    C --> D{"grid[r][c] == '1'?"}
    D -- Yes --> E["islands++"]
    E --> F["DFS to mark neighbors '0'"]
    D -- No --> C
    F --> C
    C -- End Col --> B
    B -- End Row --> G(["Return islands"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A{"node is None?"} --> B -- Yes --> C(["Return None"])
    A -- No --> D["Init HashMap oldToNew"]
    D --> E["DFS(node)"]
    E --> F{"node in oldToNew?"}
    F -- Yes --> G["Return oldToNew[node]"]
    F -- No --> H["copy = Node(node.val)"]
    H --> I["oldToNew[node] = copy"]
    I --> J["For neighbor in node.neighbors"]
    J --> K["copy.neighbors.append(DFS(neighbor))"]
    K --> J
    J -- Done --> L(["Return copy"])
    linkStyle default interpolate rectilinear`,
    template: "def cloneGraph(node):\n    # Write your code here\n    pass"
  },

  {
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    topic: "Graphs",
    acceptance: "56.4%",
    htmlDescription: `
      <div class="problem-statement">
        <p>There is an <code>m x n</code> rectangular island that borders both the <strong>Pacific Ocean</strong> and <strong>Atlantic Ocean</strong>. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.</p>
        <p>The island is partitioned into a grid of square cells. You are given an <code>m x n</code> integer matrix <code>heights</code> where <code>heights[r][c]</code> represents the height above sea level of the cell at coordinate <code>(r, c)</code>.</p>
        <p>Return a list of grid coordinates where water can flow to <strong>both</strong> the Pacific and Atlantic oceans.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">heights = [[1]]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">[[0,0]]</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>m == heights.length</code></li>
        <li class="constraint-item"><code>n == heights[r].length</code></li>
        <li class="constraint-item"><code>1 <= m, n <= 200</code></li>
        <li class="constraint-item"><code>0 <= heights[r][c] <= 10^5</code></li>
      </ul>
    `,
    testCases: [
      { input: { heights: [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]] }, output: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] },
      { input: { heights: [[1]] }, output: [[0, 0]] }
    ],
    
    flowchart: `flowchart TD
    A(["Start"]) --> B["Init Pacific & Atlantic sets"]
    B --> C["DFS from top/left (Pacific)"]
    C --> D["DFS from bottom/right (Atlantic)"]
    D --> E["Find intersection of sets"]
    E --> F(["Return intersection"])
    linkStyle default interpolate rectilinear`,
    template: "def pacificAtlantic(heights):\n    # Write your code here\n    pass"
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
    
    flowchart: `flowchart TD
    A{"n <= 2?"} --> B -- Yes --> C(["Return n"])
    A -- No --> D["one = 1, two = 2"]
    D --> E["Loop 3 to n"]
    E --> F["temp = one + two"]
    F --> G["one = two"]
    G --> H["two = temp"]
    H --> E
    E -- End --> I(["Return two"])
    linkStyle default interpolate rectilinear`,
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
    
    flowchart: `flowchart TD
    A(["rob1 = 0, rob2 = 0"]) --> B["For n in nums"]
    B --> C["temp = max(n + rob1, rob2)"]
    C --> D["rob1 = rob2"]
    D --> E["rob2 = temp"]
    E --> B
    B -- End --> F(["Return rob2"])
    linkStyle default interpolate rectilinear`,
    template: "def rob(nums):\n    # Write your code here\n    pass"
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    topic: "1-D DP",
    acceptance: "41.9%",
    htmlDescription: `
      <div class="problem-statement">
        <p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>
        <p>Return <em>the fewest number of coins that you need to make up that amount</em>. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">coins = [1,2,5], amount = 11</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">3</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">coins = [2], amount = 3</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">-1</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">coins = [1], amount = 0</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">0</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= coins.length <= 12</code></li>
        <li class="constraint-item"><code>0 <= amount <= 10^4</code></li>
      </ul>
    `,
    testCases: [
      { input: { coins: [1, 2, 5], amount: 11 }, output: 3 },
      { input: { coins: [2], amount: 3 }, output: -1 },
      { input: { coins: [1], amount: 0 }, output: 0 }
    ],
    
    flowchart: `flowchart TD
    A(["dp = [amount+1] * (amount + 1)"]) --> B["dp[0] = 0"]
    B --> C["For a from 1 to amount"]
    C --> D["For c in coins"]
    D --> E{"a - c >= 0?"}
    E -- Yes --> F["dp[a] = min(dp[a], 1 + dp[a-c])"]
    E -- No --> D
    F --> D
    D -- End Loop --> C
    C -- End Loop --> G{"dp[amount] != amount+1?"}
    G -- Yes --> H(["Return dp[amount]"])
    G -- No --> I(["Return -1"])
    linkStyle default interpolate rectilinear`,
    template: "def coinChange(coins, amount):\n    # Write your code here\n    pass"
  },
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    topic: "1-D DP",
    acceptance: "53.6%",
    htmlDescription: `
      <div class="problem-statement">
        <p>Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence.</p>
      </div>
      <div class="section-title">Examples</div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [10,9,2,5,3,7,101,18]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">4</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [0,1,0,3,2,3]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">4</code></div>
      </div>
      <div class="example-card">
        <div class="io-group"><span class="io-label">Input</span><code class="io-value">nums = [7,7,7,7,7,7,7]</code></div>
        <div class="io-group"><span class="io-label">Output</span><code class="io-value">1</code></div>
      </div>
      <div class="section-title">Constraints</div>
      <ul class="constraint-list">
        <li class="constraint-item"><code>1 <= nums.length <= 2500</code></li>
        <li class="constraint-item"><code>-10^4 <= nums[i] <= 10^4</code></li>
      </ul>
    `,
    testCases: [
      { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, output: 4 },
      { input: { nums: [0, 1, 0, 3, 2, 3] }, output: 4 },
      { input: { nums: [7, 7, 7, 7, 7, 7, 7] }, output: 1 }
    ],
    
    flowchart: `flowchart TD
    A(["LIS = [1] * len(nums)"]) --> B["Loop i from len-1 to 0"]
    B --> C["Loop j from i+1 to len-1"]
    C --> D{"nums[i] < nums[j]?"}
    D -- Yes --> E["LIS[i] = max(LIS[i], 1 + LIS[j])"]
    E --> C
    D -- No --> C
    C -- End Loop --> B
    B -- End Loop --> F(["Return max(LIS)"])
    linkStyle default interpolate rectilinear`,
    template: "def lengthOfLIS(nums):\n    # Write your code here\n    pass"
  }
];

if (typeof window !== 'undefined') {
  console.log('[Problems DB] Loaded ' + window.FULL_PROBLEM_SET.length + ' problems.');
}
