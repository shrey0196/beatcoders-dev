import os
import re

# 1. Fix main.js - Reset Tab Content (Text)
js_path = 'static/js/main.js'
try:
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # Update resetEditorState to also reset text content
    new_reset_logic = """
    function resetEditorState() {
      // Reset Test Case Tabs
      const tabs = document.querySelectorAll('.test-case-tab');
      tabs.forEach((tab, index) => {
        tab.classList.remove('test-passed', 'test-failed', 'active');
        // Reset text content to remove any icons added during run
        tab.textContent = `Case ${index + 1}`;
        if (index === 0) tab.classList.add('active');
      });
      
      // Reset Test Case Content to first case
      const testCaseContent = document.querySelector('.test-case-content');
      if (testCaseContent) {
         // Optional: Clear content or reset to default message
      }

      // Reset Submit Button
      const submitBtn = document.getElementById('submit-solution-btn');
      if (submitBtn) {
        submitBtn.style.display = 'none';
        submitBtn.style.opacity = '0';
        // Ensure it's hidden even if inline styles were messed up
        submitBtn.setAttribute('style', 'display: none; transition: all 0.3s ease;');
      }
      
      // Reset Results Panel
      const resultsPanel = document.getElementById('test-results-panel');
      if (resultsPanel) resultsPanel.innerHTML = '';
    }
    """

    # Replace the existing resetEditorState function
    # We'll use regex to find the function block
    pattern = r'function resetEditorState\(\) \{[\s\S]*?^\s\s\s\s\}'
    # This regex is a bit risky if braces aren't balanced or indentation varies. 
    # Let's try a safer replacement by finding the start and assuming structure from previous read.
    
    if "function resetEditorState() {" in js_content:
        start_idx = js_content.find("function resetEditorState() {")
        end_idx = js_content.find("function openCodeEditor", start_idx)
        if end_idx != -1:
            # Replace the block
            js_content = js_content[:start_idx] + new_reset_logic.strip() + "\n\n  " + js_content[end_idx:]
            
            with open(js_path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            print("Successfully updated main.js with text reset logic")
        else:
            print("Could not find end of resetEditorState")
    else:
        print("Could not find resetEditorState function")

except Exception as e:
    print(f"Error updating main.js: {e}")


# 2. Fix dashboard.html - Force CSS with !important
html_path = 'dashboard.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # We will append a style block at the end of the body to ensure it overrides everything
    override_styles = """
  <style>
    /* FORCE OVERRIDES FOR LIGHT MODE VISIBILITY */
    
    /* 1. Example Cards: Force dark background and light text */
    .example-card {
      background-color: #050505 !important;
      color: #e5e7eb !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    .example-card code, .example-card pre {
      color: #e5e7eb !important;
      background: rgba(255, 255, 255, 0.1) !important;
    }
    .io-label {
      color: #9ca3af !important;
    }
    .io-value {
      color: #e5e7eb !important;
    }

    /* 2. Submit Button: Force Green/White */
    #submit-solution-btn {
      background-color: #22c55e !important;
      color: #ffffff !important;
      border: none !important;
      opacity: 1; /* Ensure opacity is 1 when visible */
      /* Note: display property is handled by JS */
    }
    
    /* 3. Run Button: Force Visibility */
    #run-code-btn {
      background-color: #1a1a1a !important;
      color: #4ea8ff !important;
      border: 1px solid #4ea8ff !important;
    }
    
    /* 4. Problem Description Text */
    #editor-problem-description, #editor-problem-description p, #editor-problem-description li {
      color: #e5e7eb !important;
    }
  </style>
    """
    
    # Insert before closing body tag
    if "</body>" in html_content:
        html_content = html_content.replace("</body>", override_styles + "\n</body>")
        
        # Bump version
        html_content = html_content.replace('main.js?v=16', 'main.js?v=17')
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print("Successfully updated dashboard.html with forced CSS overrides")
    else:
        print("Could not find closing body tag")

except Exception as e:
    print(f"Error updating dashboard.html: {e}")
