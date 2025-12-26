import os
import re

# 1. Fix dashboard.html - Enforce dark mode for examples and submit button
html_path = 'dashboard.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Fix Example Card visibility
    # Current: .example-card { background: #050505; ... }
    # We need to ensure text inside is also light color
    if ".example-card {" in html_content:
        html_content = html_content.replace(
            ".example-card {",
            ".example-card {\n      color: #e5e7eb; /* Force light text */"
        )

    # Fix Submit Button visibility
    # We need to find the .submit-btn class and enforce dark mode styling
    # It might be relying on variables that change in light mode
    if ".submit-btn {" in html_content:
        # Add specific overrides to ensure it's visible
        # Assuming it uses var(--accent1) which is fine, but maybe text color or background is issue
        # Let's force it to be visible
        pass # It seems submit button styling is not in the snippet I viewed, I'll add a specific rule for #submit-solution-btn

    # Add a specific rule for #submit-solution-btn to ensure visibility
    submit_btn_style = """
    #submit-solution-btn {
      background: #22c55e !important; /* Force green */
      color: white !important;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      /* Ensure it's not hidden by light mode variables */
    }
    """
    
    # Insert this style before </style>
    html_content = html_content.replace("</style>", submit_btn_style + "\n    </style>")

    # Bump version
    html_content = html_content.replace('main.js?v=15', 'main.js?v=16')

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("Successfully updated dashboard.html for light mode visibility")

except Exception as e:
    print(f"Error updating dashboard.html: {e}")


# 2. Fix main.js - Robust Test Case Reset
js_path = 'static/js/main.js'
try:
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # We need to ensure that when a problem is opened, the test cases are reset.
    # The previous fix might have been inserted but maybe not working as expected or overwritten.
    # Let's look for the reset logic we added and make it more robust.
    
    # We'll create a helper function for resetting and call it
    reset_helper = """
    function resetEditorState() {
      // Reset Test Case Tabs
      const tabs = document.querySelectorAll('.test-case-tab');
      tabs.forEach((tab, index) => {
        tab.classList.remove('test-passed', 'test-failed', 'active');
        // Reset icon to default if needed (though CSS handles color)
        if (index === 0) tab.classList.add('active');
      });
      
      // Reset Test Case Content to first case
      const testCaseContent = document.querySelector('.test-case-content');
      if (testCaseContent) {
         // We can't easily reset content without problem data, but we can clear status text
      }

      // Reset Submit Button
      const submitBtn = document.getElementById('submit-solution-btn');
      if (submitBtn) {
        submitBtn.style.display = 'none';
        submitBtn.style.opacity = '0';
      }
      
      // Reset Results Panel
      const resultsPanel = document.getElementById('test-results-panel');
      if (resultsPanel) resultsPanel.innerHTML = '';
    }
    """
    
    # Add this function before openCodeEditor
    if "function openCodeEditor(problemTitle) {" in js_content:
        js_content = js_content.replace(
            "function openCodeEditor(problemTitle) {",
            reset_helper + "\n\n  function openCodeEditor(problemTitle) {"
        )
        
        # Now call it inside openCodeEditor
        # We'll add the call at the very beginning of openCodeEditor
        js_content = js_content.replace(
            "function openCodeEditor(problemTitle) {",
            "function openCodeEditor(problemTitle) {\n    resetEditorState();"
        )
        
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print("Successfully updated main.js with robust reset logic")

except Exception as e:
    print(f"Error updating main.js: {e}")
