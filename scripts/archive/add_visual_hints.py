import os

# Add visual hints (Mermaid flowcharts) to main.js
js_path = 'static/js/main.js'

try:
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Create hint data for each problem
    hint_data = """
// Visual Hints (Mermaid Flowcharts) for each problem
const problemHints = {
  'Two Sum': `graph TD
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
    style I fill:#22c55e`,
    
  'Valid Anagram': `graph TD
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
    style H fill:#22c55e`,
    
  'Contains Duplicate': `graph TD
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
    style H fill:#22c55e`
};
"""

    # Insert hint data before problemsData
    if 'const problemsData = [' in content:
        content = content.replace('const problemsData = [', hint_data + '\nconst problemsData = [')
        print("Added problem hints data")
    else:
        print("Could not find problemsData")

    # Now update showFailureScreen to include a "View Hint" button
    # Find the Actions section in showFailureScreen
    old_actions = """        <!-- Actions -->
        <div style="display: flex; gap: 15px; margin-top: auto;">
          <button onclick="document.getElementById('success-overlay').remove()" style="
            flex: 1;
            padding: 15px;
            background: #2a2a2a;
            color: #e5e7eb;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">Try Again</button>
          <button onclick="showDetailedCognitiveAnalysis(window.lastSubmissionData, window.lastSubmissionCode)" style="
            flex: 1;
            padding: 15px;
            background: rgba(78, 168, 255, 0.1);
            color: #4ea8ff;
            border: 1px solid rgba(78, 168, 255, 0.2);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">View Analysis</button>
        </div>"""

    new_actions = """        <!-- Actions -->
        <div style="display: flex; gap: 15px; margin-top: auto;">
          <button onclick="document.getElementById('success-overlay').remove()" style="
            flex: 1;
            padding: 15px;
            background: #2a2a2a;
            color: #e5e7eb;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">Try Again</button>
          <button onclick="showVisualHint()" style="
            flex: 1;
            padding: 15px;
            background: rgba(168, 85, 247, 0.1);
            color: #a855f7;
            border: 1px solid rgba(168, 85, 247, 0.2);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">💡 View Hint</button>
          <button onclick="showDetailedCognitiveAnalysis(window.lastSubmissionData, window.lastSubmissionCode)" style="
            flex: 1;
            padding: 15px;
            background: rgba(78, 168, 255, 0.1);
            color: #4ea8ff;
            border: 1px solid rgba(78, 168, 255, 0.2);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">View Analysis</button>
        </div>"""

    if old_actions in content:
        content = content.replace(old_actions, new_actions)
        print("Added 'View Hint' button to failure screen")
    else:
        print("Could not find actions section")

    # Add showVisualHint function
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
    hintModal.style.cssText = `
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
    `;
    
    hintModal.innerHTML = `
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
            <span>💡</span> Algorithm Hint
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
${hintDiagram}
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
    `;
    
    document.body.appendChild(hintModal);
    
    // Re-initialize Mermaid for the new diagram
    if (window.mermaid) {
      mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }
  }
    """

    # Insert before the closing of the main.js file or after showFailureScreen
    if 'function showSuccessScreen' in content:
        content = content.replace('function showSuccessScreen', hint_function + '\n\n  function showSuccessScreen')
        print("Added showVisualHint function")
    else:
        print("Could not find insertion point for hint function")

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated main.js with visual hints")

except Exception as e:
    print(f"Error: {e}")
