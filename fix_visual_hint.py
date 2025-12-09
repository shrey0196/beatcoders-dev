import os

# Properly add showVisualHint function to main.js
js_path = 'static/js/main.js'

try:
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if problemHints exists
    if 'problemHints' not in content:
        print("problemHints not found, need to add it first")
        # Add it at the beginning of the file after the initial comments
        hint_data = """
// Visual Hints (Mermaid Flowcharts) for each problem
const problemHints = {
  'Two Sum': \`graph TD
    A[Start with array and target] --> B{Use Hash Map?}
    B -->|Yes| C[Create empty hash map]
    C --> D[Iterate through array]
    D --> E{complement = target - current}
    E --> F{Is complement in map?}
    F -->|Yes| G[Return indices]
    F -->|No| H[Store current in map]
    H --> D
    G --> I[End - O n time]
    
    style C fill:#22c55e
    style F fill:#4ea8ff
    style I fill:#22c55e\`,
    
  'Valid Anagram': \`graph TD
    A[Start with two strings] --> B{Same length?}
    B -->|No| C[Return false]
    B -->|Yes| D[Count character frequencies]
    D --> E[Use hash map or array]
    E --> F[Compare frequencies]
    F --> G{All match?}
    G -->|Yes| H[Return true]
    G -->|No| I[Return false]
    
    style D fill:#22c55e
    style E fill:#4ea8ff
    style H fill:#22c55e\`,
    
  'Contains Duplicate': \`graph TD
    A[Start with array] --> B{Use Set?}
    B -->|Yes| C[Create empty set]
    C --> D[Iterate through array]
    D --> E{Element in set?}
    E -->|Yes| F[Return true - duplicate found]
    E -->|No| G[Add to set]
    G --> D
    F --> H[End - O n time]
    
    style C fill:#22c55e
    style E fill:#4ea8ff
    style H fill:#22c55e\`
};

"""
        # Find a good insertion point - after DOMContentLoaded
        if "document.addEventListener('DOMContentLoaded'" in content:
            content = content.replace(
                "document.addEventListener('DOMContentLoaded'",
                hint_data + "\ndocument.addEventListener('DOMContentLoaded'"
            )
            print("Added problemHints data")
    else:
        print("problemHints already exists")

    # Now add the showVisualHint function
    hint_function = """
  function showVisualHint() {
    const problemTitle = currentProblemTitle || 'Two Sum';
    const hintDiagram = problemHints[problemTitle];
    
    if (!hintDiagram) {
      alert('No hint available for this problem yet!');
      return;
    }
    
    // Create hint modal
    const hintModal = document.createElement('div');
    hintModal.id = 'hint-modal';
    hintModal.style.cssText = \`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 11000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    \`;
    
    hintModal.innerHTML = \`
      <div style="
        background: #0a0a0a;
        border: 1px solid rgba(168, 85, 247, 0.3);
        border-radius: 16px;
        padding: 40px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <h2 style="color: #e5e7eb; font-size: 1.8rem; display: flex; align-items: center; gap: 10px;">
            <span>💡</span> Algorithm Hint: \${problemTitle}
          </h2>
          <button onclick="document.getElementById('hint-modal').remove()" style="
            background: none;
            border: none;
            color: #9ca3af;
            font-size: 2rem;
            cursor: pointer;
            line-height: 1;
          ">×</button>
        </div>
        
        <div style="
          background: #1a1a1a;
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        ">
          <div class="mermaid">
\${hintDiagram}
          </div>
        </div>
        
        <div style="
          margin-top: 20px;
          padding: 15px;
          background: rgba(168, 85, 247, 0.1);
          border-left: 3px solid #a855f7;
          border-radius: 8px;
          color: #e5e7eb;
        ">
          <strong>💡 Tip:</strong> This flowchart shows the optimal approach. Try implementing it step by step!
        </div>
      </div>
    \`;
    
    document.body.appendChild(hintModal);
    
    // Re-initialize Mermaid for the new diagram
    setTimeout(() => {
      if (window.mermaid) {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      }
    }, 100);
  }

"""

    # Find where to insert - before showFailureScreen
    if 'function showFailureScreen' in content and 'function showVisualHint' not in content:
        content = content.replace('function showFailureScreen', hint_function + '  function showFailureScreen')
        print("Added showVisualHint function")
    elif 'function showVisualHint' in content:
        print("showVisualHint already exists")
    else:
        print("Could not find insertion point")

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated main.js")

except Exception as e:
    print(f"Error: {e}")
