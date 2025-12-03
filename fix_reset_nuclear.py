import os
import re

# 1. Check for duplicates in dashboard.html
html_path = 'dashboard.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    tabs_count = html_content.count('class="test-case-tab')
    editor_count = html_content.count('id="full-screen-editor"')
    
    print(f"Found {tabs_count} occurrences of 'class=\"test-case-tab'")
    print(f"Found {editor_count} occurrences of 'id=\"full-screen-editor\"'")
    
    if editor_count > 1:
        print("WARNING: Duplicate editor found! This is likely the cause.")
        # We should remove the duplicate. 
        # Assuming the last one is the correct one (appended recently), or the first one?
        # Actually, if we appended styles to body, we might have messed up.
        # But let's focus on main.js fix first which is safer.

except Exception as e:
    print(f"Error checking html: {e}")

# 2. Fix main.js - Nuclear Reset Option
js_path = 'static/js/main.js'
try:
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # We will replace resetEditorState with a version that:
    # 1. Logs what it finds
    # 2. Removes ALL classes except 'test-case-tab'
    # 3. Removes ALL inline styles
    # 4. Resets content
    
    nuclear_reset = """
    function resetEditorState() {
      console.log('[Reset] Resetting editor state...');
      
      // Reset Test Case Tabs
      const tabs = document.querySelectorAll('.test-case-tab');
      console.log(`[Reset] Found ${tabs.length} tabs`);
      
      tabs.forEach((tab, index) => {
        // Nuke all classes and re-add base class
        tab.className = 'test-case-tab';
        
        // Nuke inline styles
        tab.removeAttribute('style');
        
        // Reset content
        tab.innerHTML = '';
        tab.textContent = `Case ${index + 1}`;
        
        // Set first as active
        if (index === 0) tab.classList.add('active');
      });
      
      // Reset Submit Button
      const submitBtn = document.getElementById('submit-solution-btn');
      if (submitBtn) {
        // Force hide with important style if possible, or just standard
        submitBtn.style.cssText = 'display: none !important; opacity: 0 !important; transition: all 0.3s ease;';
      }
      
      // Reset Results Panel
      const resultsPanel = document.getElementById('test-results-panel');
      if (resultsPanel) resultsPanel.innerHTML = '';
      
      console.log('[Reset] Complete');
    }
    """

    # Replace existing function
    # We'll use the same strategy: find start and end
    start_marker = "function resetEditorState() {"
    end_marker = "function openCodeEditor"
    
    if start_marker in js_content and end_marker in js_content:
        start_idx = js_content.find(start_marker)
        end_idx = js_content.find(end_marker, start_idx)
        
        if start_idx != -1 and end_idx != -1:
            js_content = js_content[:start_idx] + nuclear_reset.strip() + "\n\n  " + js_content[end_idx:]
            
            with open(js_path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            print("Successfully updated main.js with nuclear reset logic")
        else:
            print("Could not find function boundaries")
    else:
        print("Could not find resetEditorState")

except Exception as e:
    print(f"Error updating main.js: {e}")
