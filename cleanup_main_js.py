import os
import re

# Fix main.js - Remove redundant reset logic
js_path = 'static/js/main.js'
try:
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # We want to remove the redundant reset logic inside openCodeEditor
    # It starts after "currentProblemTitle = problemTitle;"
    # And ends before "console.log('openCodeEditor called with:', problemTitle);"
    
    # The block to remove:
    #     // Reset Test Case UI
    #     const tabs = document.querySelectorAll('.test-case-tab');
    #     tabs.forEach((tab, index) => {
    #       tab.classList.remove('test-passed', 'test-failed', 'active');
    #       // Reset icon/text if needed (assuming structure is simple text or span)
    #       // If we added icons, we might need to remove them. 
    #       // Based on previous code, we just add classes.
    #       if (index === 0) tab.classList.add('active');
    #     });
    #     
    #     // Reset Submit Button
    #     const submitBtn = document.getElementById('submit-solution-btn');
    #     if (submitBtn) {
    #       submitBtn.style.display = 'none';
    #       submitBtn.style.opacity = '0';
    #     }
    #     
    #     // Reset Results Panel
    #     const resultsPanel = document.getElementById('test-results-panel');
    #     if (resultsPanel) resultsPanel.innerHTML = '';

    # We can use a regex or string replacement.
    # Let's find the start and end points.
    
    start_str = "currentProblemTitle = problemTitle;"
    end_str = "console.log('openCodeEditor called with:', problemTitle);"
    
    if start_str in js_content and end_str in js_content:
        start_idx = js_content.find(start_str) + len(start_str)
        end_idx = js_content.find(end_str)
        
        # Keep the start and end, remove everything in between
        # But we want to keep "resetEditorState();" if it's there (it is before currentProblemTitle)
        
        # The content between these two strings is the redundant logic
        # We should replace it with just newlines
        
        js_content = js_content[:start_idx] + "\n\n    " + js_content[end_idx:]
        
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print("Successfully removed redundant reset logic from main.js")
    else:
        print("Could not find boundaries for redundant logic")

except Exception as e:
    print(f"Error updating main.js: {e}")
