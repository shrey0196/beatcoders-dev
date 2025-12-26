import os
import re

file_path = 'static/js/main.js'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the problematic close button code
    old_button = r'<button onclick="this\.closest\(\'\[style\*=\\\'position: fixed\\\'\]\'\)\.remove\(\)" style="'
    
    # New button without inline onclick
    new_button = '<button id="close-results-btn" style="'
    
    content = re.sub(old_button, new_button, content)
    
    # Now find the section where modal is appended and add event listener
    old_append = r'(modal\.appendChild\(content\);\s+document\.body\.appendChild\(modal\);)'
    
    new_append = r'''\1

    // Add event listener to close button
    const closeBtn = content.querySelector('#close-results-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.remove();
      });
    }'''
    
    content = re.sub(old_append, new_append, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully fixed close button in submission modal")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
