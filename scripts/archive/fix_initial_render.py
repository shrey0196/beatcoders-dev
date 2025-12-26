import os
import re

# Fix main.js - Render initial test case content on open
js_path = 'static/js/main.js'
try:
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # We need to add logic to openCodeEditor to render the first test case
    # This should happen after we get the 'problem' object
    
    # Logic to insert:
    # 1. Get the first test case from problem.testCases (if available)
    # 2. Render it into .test-case-content
    
    render_logic = """
    // Render Initial Test Case Content
    const testCaseContent = document.querySelector('.test-case-content');
    if (testCaseContent && problem.testCases && problem.testCases.length > 0) {
      const firstCase = problem.testCases[0];
      testCaseContent.innerHTML = `
        <div style="margin-bottom: 10px;">
          <span style="color: var(--text-secondary);">Input:</span>
          <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(firstCase.input)}</code>
        </div>
        <div>
          <span style="color: var(--text-secondary);">Expected Output:</span>
          <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(firstCase.output)}</code>
        </div>
      `;
    } else if (testCaseContent) {
       testCaseContent.innerHTML = '<div style="color: var(--text-secondary); padding: 20px; text-align: center;">No test cases available</div>';
    }
    """
    
    # Insert this into openCodeEditor
    # A good place is after "const problem = problemsDataMap[problemTitle] ... ;"
    # We need to find where 'problem' is defined.
    
    # Search for: const problem = problemsDataMap[problemTitle] || {
    # And find the end of that block (semicolon or closing brace of object)
    
    # Let's look for the line:
    # acceptance: "-"
    # };
    
    # And insert after that.
    
    insert_marker = 'acceptance: "-"\n    };'
    
    if insert_marker in js_content:
        # Insert after
        js_content = js_content.replace(
            insert_marker,
            insert_marker + "\n\n    " + render_logic
        )
        
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print("Successfully updated main.js to render initial test case content")
    else:
        print("Could not find insertion point for render logic")

except Exception as e:
    print(f"Error updating main.js: {e}")
