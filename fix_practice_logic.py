import re

# Read main.js
with open('static/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Define problemsData and functionTemplates
new_data = """
  const problemsData = [
    { title: "Two Sum", difficulty: "Easy", topic: "Arrays & Hashing", acceptance: "49.2%" },
    { title: "Valid Anagram", difficulty: "Easy", topic: "Arrays & Hashing", acceptance: "62.4%" },
    { title: "Contains Duplicate", difficulty: "Easy", topic: "Arrays & Hashing", acceptance: "60.1%" },
    { title: "Group Anagrams", difficulty: "Medium", topic: "Arrays & Hashing", acceptance: "66.2%" },
    { title: "Top K Frequent Elements", difficulty: "Medium", topic: "Arrays & Hashing", acceptance: "64.1%" },
    { title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays & Hashing", acceptance: "63.8%" }
  ];

  const functionTemplates = {
    "Two Sum": "def twoSum(nums, target):\\n    # Write your code here\\n    pass",
    "Valid Anagram": "def isAnagram(s, t):\\n    # Write your code here\\n    pass",
    "Contains Duplicate": "def containsDuplicate(nums):\\n    # Write your code here\\n    pass",
    "Group Anagrams": "def groupAnagrams(strs):\\n    # Write your code here\\n    pass",
    "Top K Frequent Elements": "def topKFrequent(nums, k):\\n    # Write your code here\\n    pass",
    "Product of Array Except Self": "def productExceptSelf(nums):\\n    # Write your code here\\n    pass"
  };

  const problemsDataMap = problemsData.reduce((acc, curr) => {
    acc[curr.title] = curr;
    return acc;
  }, {});
"""

# 2. Define initPracticeView
init_practice_view = """
  function initPracticeView() {
    const tableBody = document.getElementById('problems-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    problemsData.forEach(problem => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${problem.title}</td>
        <td><span class="difficulty-tag ${problem.difficulty.toLowerCase()}">${problem.difficulty}</span></td>
        <td>${problem.acceptance}</td>
      `;
      row.style.cursor = 'pointer';
      tableBody.appendChild(row);
    });
  }
"""

# 3. Update openCodeEditor to use templates
# We'll replace the existing openCodeEditor function
new_open_code_editor = """
  function openCodeEditor(problemTitle) {
    const problem = problemsDataMap[problemTitle] || {
      description: "Problem description not available.",
      difficulty: "Unknown",
      topic: "General",
      acceptance: "-"
    };

    document.getElementById('modal-problem-title').textContent = problemTitle;
    // document.getElementById('modal-problem-description').textContent = problem.description; // Description might be missing in simple data

    const diffTag = document.getElementById('modal-problem-difficulty');
    if (diffTag) {
        diffTag.textContent = problem.difficulty;
        diffTag.className = `difficulty-tag ${problem.difficulty.toLowerCase()}`;
    }

    const topicTag = document.getElementById('modal-problem-topic');
    if (topicTag) topicTag.textContent = problem.topic;

    // Initialize or Update Monaco Editor
    if (codeEditorModal) codeEditorModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    const template = functionTemplates[problemTitle] || "# Write your code here\\n";

    if (window.require) {
      require(['vs/editor/editor.main'], function () {
        if (!editorInstance) {
          editorInstance = monaco.editor.create(document.getElementById('code-editor-container'), {
            value: template,
            language: 'python',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14
          });

          // Dispatch event for CognitiveObserver
          document.dispatchEvent(new CustomEvent('monaco-loaded', { detail: { editor: editorInstance } }));
        } else {
            editorInstance.setValue(template);
        }
        
        // Update theme based on current app theme
        const isDark = document.documentElement.classList.contains('dark');
        monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
      });
    } else {
      // Fallback to textarea if Monaco fails to load
      const textArea = document.getElementById('code-editor');
      if (textArea) {
          textArea.style.display = 'block';
          document.getElementById('code-editor-container').style.display = 'none';
          textArea.value = template;
      }
    }

    if (feedbackSection) feedbackSection.style.display = 'none';
  }
"""

# Insert new data before openCodeEditor
if 'function openCodeEditor' in content:
    content = content.replace('function openCodeEditor', new_data + '\n' + init_practice_view + '\n' + 'function openCodeEditor_OLD')
    
    # Now replace the old function with the new one
    # We renamed the old one to avoid conflict, but actually we want to replace it entirely
    # Let's use regex to replace the whole function
    pattern = r'function openCodeEditor\(problemTitle\) \{[\s\S]*?\n  \}'
    content = re.sub(pattern, new_open_code_editor.strip(), content)
    
    # Fix the duplicate/renamed issue from above logic
    content = content.replace('function openCodeEditor_OLD', '')

# Call initPracticeView at the end
if 'initPracticeView();' not in content:
    # Insert before the last closing brace/paren of DOMContentLoaded
    # The file ends with "});" usually
    content = content.replace('});', '  initPracticeView();\n});')

with open('static/js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated main.js with practice logic")
