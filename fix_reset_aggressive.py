import os
import re

# Fix main.js - Aggressive Reset for Test Case Tabs
js_path = 'static/js/main.js'
try:
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # We need to replace the resetEditorState function with a more robust version
    # The key is to completely clear innerHTML to remove icons, and force class reset
    
    new_reset_logic = """
    function resetEditorState() {
      // Reset Test Case Tabs
      const tabs = document.querySelectorAll('.test-case-tab');
      tabs.forEach((tab, index) => {
        // Remove all status classes
        tab.classList.remove('test-passed', 'test-failed', 'active');
        
        // Force clear content and set plain text
        tab.innerHTML = ''; 
        tab.textContent = `Case ${index + 1}`;
        
        // Set first tab as active by default
        if (index === 0) tab.classList.add('active');
      });
      
      // Reset Test Case Content to first case placeholder or clear it
      const testCaseContent = document.querySelector('.test-case-content');
      if (testCaseContent) {
         // We can't easily reset content without problem data, but we can clear status text
         // Let's just leave it, as clicking the tab will update it.
      }

      // Reset Submit Button
      const submitBtn = document.getElementById('submit-solution-btn');
      if (submitBtn) {
        submitBtn.style.display = 'none';
        submitBtn.style.opacity = '0';
        submitBtn.setAttribute('style', 'display: none; transition: all 0.3s ease; opacity: 0;');
      }
      
      // Reset Results Panel
      const resultsPanel = document.getElementById('test-results-panel');
      if (resultsPanel) resultsPanel.innerHTML = '';
    }
    """

    # Replace the existing resetEditorState function
    # We'll use regex to find the function block again.
    # Since we modified it before, we need to be careful.
    
    # Let's find the start of the function
    start_marker = "function resetEditorState() {"
    end_marker = "function openCodeEditor"
    
    if start_marker in js_content and end_marker in js_content:
        start_idx = js_content.find(start_marker)
        end_idx = js_content.find(end_marker, start_idx)
        
        if start_idx != -1 and end_idx != -1:
            # Replace the block
            js_content = js_content[:start_idx] + new_reset_logic.strip() + "\n\n  " + js_content[end_idx:]
            
            # Also, let's make sure openCodeEditor calls it at the very start
            # It should already be there from previous fix, but let's verify/ensure
            if "function openCodeEditor(problemTitle) {\n    resetEditorState();" not in js_content:
                 # If it's just "function openCodeEditor(problemTitle) {", replace it
                 js_content = js_content.replace(
                     "function openCodeEditor(problemTitle) {",
                     "function openCodeEditor(problemTitle) {\n    resetEditorState();"
                 )
            
            with open(js_path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            print("Successfully updated main.js with aggressive reset logic")
        else:
            print("Could not find function boundaries")
    else:
        print("Could not find resetEditorState or openCodeEditor")

except Exception as e:
    print(f"Error updating main.js: {e}")
