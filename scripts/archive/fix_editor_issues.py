import os
import re

# 1. Fix main.js - Reset state in openCodeEditor
js_path = 'static/js/main.js'
try:
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # Logic to insert into openCodeEditor
    reset_logic = """
    // Reset Test Case UI
    const tabs = document.querySelectorAll('.test-case-tab');
    tabs.forEach((tab, index) => {
      tab.classList.remove('test-passed', 'test-failed', 'active');
      // Reset icon/text if needed (assuming structure is simple text or span)
      // If we added icons, we might need to remove them. 
      // Based on previous code, we just add classes.
      if (index === 0) tab.classList.add('active');
    });
    
    // Reset Submit Button
    const submitBtn = document.getElementById('submit-solution-btn');
    if (submitBtn) {
      submitBtn.style.display = 'none';
      submitBtn.style.opacity = '0';
    }
    
    // Reset Results Panel
    const resultsPanel = document.getElementById('test-results-panel');
    if (resultsPanel) resultsPanel.innerHTML = '';
    """

    # Insert after "Update Editor UI" comment or similar
    if "openCodeEditor(problemTitle) {" in js_content:
        # Find the start of the function
        start_idx = js_content.find("openCodeEditor(problemTitle) {")
        # Find a good place to insert, e.g., after setting currentProblemTitle
        insert_point = js_content.find("currentProblemTitle = problemTitle;", start_idx)
        if insert_point != -1:
            # Insert after the line
            next_line_idx = js_content.find("\n", insert_point) + 1
            js_content = js_content[:next_line_idx] + reset_logic + js_content[next_line_idx:]
            
            with open(js_path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            print("Successfully updated main.js with reset logic")
        else:
            print("Could not find insertion point in openCodeEditor")
    else:
        print("Could not find openCodeEditor function")

except Exception as e:
    print(f"Error updating main.js: {e}")


# 2. Fix dashboard.html - Enforce Dark Mode Variables in Editor
html_path = 'dashboard.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # We want to add variable overrides to #full-screen-editor
    # Existing:
    # #full-screen-editor {
    #   ...
    #   background-color: #000000;
    #   ...
    # }
    
    # We will replace the existing block or add to it.
    # Let's look for the specific background-color line we added before.
    target_str = "background-color: #000000;"
    
    if target_str in html_content:
        # Add variables after this line
        new_vars = """
      background-color: #000000;
      /* Enforce Dark Mode Variables Locally */
      --text-primary: #e5e7eb;
      --text-secondary: #9ca3af;
      --bg1: #0a0a0a;
      --bg2: #1a1a1a;
      --bg-secondary: #1a1a1a;
      --border-color: rgba(255, 255, 255, 0.1);
      --accent1: #4ea8ff;
      --accent2: #a855f7;
        """
        html_content = html_content.replace(target_str, new_vars)
        
        # Bump version
        html_content = html_content.replace('main.js?v=14', 'main.js?v=15')
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print("Successfully updated dashboard.html with dark mode variables and bumped version")
    else:
        print("Could not find #full-screen-editor background rule to attach variables to")

except Exception as e:
    print(f"Error updating dashboard.html: {e}")
