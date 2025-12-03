
import os

file_path = 'static/js/main.js'

# We'll construct the new problemsData array string
new_problems_data = """  const problemsData = [
    { 
      title: "Two Sum", 
      difficulty: "Easy", 
      topic: "Arrays & Hashing", 
      acceptance: "49.2%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
          <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [2,7,11,15], target = 9</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[0,1]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Explanation</span>
            <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">Because nums[0] + nums[1] == 9, we return [0, 1].</div>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [3,2,4], target = 6</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[1,2]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [3,3], target = 6</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[0,1]</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>2 <= nums.length <= 10<sup>4</sup></code></li>
          <li class="constraint-item"><code>-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup></code></li>
          <li class="constraint-item"><code>-10<sup>9</sup> <= target <= 10<sup>9</sup></code></li>
          <li class="constraint-item"><strong>Only one valid answer exists.</strong></li>
        </ul>
      `
    },
    { 
      title: "Valid Anagram", 
      difficulty: "Easy", 
      topic: "Arrays & Hashing", 
      acceptance: "62.4%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> <em>if</em> <code>t</code> <em>is an anagram of</em> <code>s</code><em>, and</em> <code>false</code> <em>otherwise</em>.</p>
          <p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">s = "anagram", t = "nagaram"</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">true</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">s = "rat", t = "car"</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">false</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>1 <= s.length, t.length <= 5 * 10<sup>4</sup></code></li>
          <li class="constraint-item"><code>s</code> and <code>t</code> consist of lowercase English letters.</li>
        </ul>
      `
    },
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
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,2,3,1]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">true</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,2,3,4]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">false</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,1,1,3,3,4,3,2,4,2]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">true</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>1 <= nums.length <= 10<sup>5</sup></code></li>
          <li class="constraint-item"><code>-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup></code></li>
        </ul>
      `
    },
    { 
      title: "Group Anagrams", 
      difficulty: "Medium", 
      topic: "Arrays & Hashing", 
      acceptance: "66.2%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given an array of strings <code>strs</code>, group <strong>the anagrams</strong> together. You can return the answer in <strong>any order</strong>.</p>
          <p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">strs = ["eat","tea","tan","ate","nat","bat"]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[["bat"],["nat","tan"],["ate","eat","tea"]]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">strs = [""]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[[""]]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">strs = ["a"]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[["a"]]</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>1 <= strs.length <= 10<sup>4</sup></code></li>
          <li class="constraint-item"><code>0 <= strs[i].length <= 100</code></li>
          <li class="constraint-item"><code>strs[i]</code> consists of lowercase English letters.</li>
        </ul>
      `
    },
    { 
      title: "Top K Frequent Elements", 
      difficulty: "Medium", 
      topic: "Arrays & Hashing", 
      acceptance: "64.1%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>k</code> <em>most frequent elements</em>. You may return the answer in <strong>any order</strong>.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,1,1,2,2,3], k = 2</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[1,2]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1], k = 1</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[1]</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>1 <= nums.length <= 10<sup>5</sup></code></li>
          <li class="constraint-item"><code>-10<sup>4</sup> <= nums[i] <= 10<sup>4</sup></code></li>
          <li class="constraint-item"><code>k</code> is in the range <code>[1, the number of unique elements in the array]</code>.</li>
          <li class="constraint-item">It is <strong>guaranteed</strong> that the answer is <strong>unique</strong>.</li>
        </ul>
      `
    },
    { 
      title: "Product of Array Except Self", 
      difficulty: "Medium", 
      topic: "Arrays & Hashing", 
      acceptance: "63.8%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given an integer array <code>nums</code>, return <em>an array</em> <code>answer</code> <em>such that</em> <code>answer[i]</code> <em>is equal to the product of all the elements of</em> <code>nums</code> <em>except</em> <code>nums[i]</code>.</p>
          <p>The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</p>
          <p>You must write an algorithm that runs in <code>O(n)</code> time and without using the division operation.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,2,3,4]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[24,12,8,6]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [-1,1,0,-3,3]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[0,0,9,0,0]</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>2 <= nums.length <= 10<sup>5</sup></code></li>
          <li class="constraint-item"><code>-30 <= nums[i] <= 30</code></li>
          <li class="constraint-item">The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</li>
        </ul>
      `
    }
  ];"""

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = -1
    end_idx = -1

    for i, line in enumerate(lines):
        if "const problemsData = [" in line:
            start_idx = i
        if "const functionTemplates = {" in line:
            end_idx = i
            break
    
    # Adjust end_idx to be the line before functionTemplates (the closing bracket of problemsData)
    # We need to find the closing bracket of problemsData. It should be just before functionTemplates.
    # Let's look backwards from functionTemplates
    if end_idx != -1:
        # The line before functionTemplates should be empty or contain the closing bracket
        # Let's just replace from start_idx up to end_idx-1 (assuming there's a blank line)
        
        print(f"Found block lines {start_idx} to {end_idx}")
        
        # We need to be careful not to overwrite functionTemplates
        # The new content ends with ]; so we just need to ensure we replace the old block correctly
        
        new_lines = lines[:start_idx] + [new_problems_data + "\n\n"] + lines[end_idx:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("Successfully updated problemsData in main.js")
    else:
        print("Could not find start or end markers")

except Exception as e:
    print(f"Error: {e}")
