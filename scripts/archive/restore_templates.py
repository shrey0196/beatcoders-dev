# Restore function templates and openCodeEditor to main.js
import re

path = 'static/js/main.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the insertion point (before initPracticeView() at the end)
insertion_code = '''
  // Problem Data and Function Templates
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

  function openCodeEditor(problemTitle) {
    console.log('openCodeEditor called with:', problemTitle);
    const problem = problemsDataMap[problemTitle] || {
      description: "Problem description not available.",
      difficulty: "Unknown",
      topic: "General",
      acceptance: "-"
    };

    document.getElementById('modal-problem-title').textContent = problemTitle;

    const diffTag = document.getElementById('modal-problem-difficulty');
    if (diffTag) {
        diffTag.textContent = problem.difficulty;
        diffTag.className = `difficulty-tag ${problem.difficulty.toLowerCase()}`;
    }

    const topicTag = document.getElementById('modal-problem-topic');
    if (topicTag) topicTag.textContent = problem.topic;

    // Initialize or Update Monaco Editor
    if (codeEditorModal) codeEditorModal.classList.add('active');
    document.body.style.overflow = 'hidden';

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

          document.dispatchEvent(new CustomEvent('monaco-loaded', { detail: { editor: editorInstance } }));
        } else {
            editorInstance.setValue(template);
        }
        
        const isDark = document.documentElement.classList.contains('dark');
        monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
      });
    } else {
      const textArea = document.getElementById('code-editor');
      if (textArea) {
          textArea.style.display = 'block';
          document.getElementById('code-editor-container').style.display = 'none';
          textArea.value = template;
      }
    }

    if (feedbackSection) feedbackSection.style.display = 'none';
  }

  function closeCodeEditor() {
    if (codeEditorModal) codeEditorModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeCodeEditorBtn) closeCodeEditorBtn.addEventListener('click', closeCodeEditor);
  if (codeEditorModal) codeEditorModal.addEventListener('click', (e) => {
    if (e.target === codeEditorModal) closeCodeEditor();
  });

  // Initialize Practice Problems Click Handlers
  const problemsTableBody = document.getElementById('problems-table-body');
  if (problemsTableBody) {
    problemsTableBody.addEventListener('click', (e) => {
      console.log('Table clicked', e.target);
      const row = e.target.closest('tr');
      if (row) {
        const title = row.cells[0].textContent;
        console.log('Row clicked, title:', title);
        openCodeEditor(title);
      } else {
        console.log('No row found for click');
      }
    });
  } else {
    console.error('problems-table-body not found!');
  }

  // Also handle "Solve Problem" button in Dashboard view
  const solveProblemBtn = document.getElementById('solve-problem-btn');
  if (solveProblemBtn) {
    solveProblemBtn.addEventListener('click', () => {
      const title = document.querySelector('.problem-title').textContent;
      openCodeEditor(title);
    });
  }

'''

# Replace the last initPracticeView() call with the full code
if '  initPracticeView();\n});' in content:
    content = content.replace('  initPracticeView();\n});', insertion_code + '  initPracticeView();\n});')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully restored function templates and openCodeEditor to main.js")
else:
    print("Could not find insertion point")
