import os
import re

# Fix main.js - Ensure Submit Button becomes visible (Opacity + Display)
js_path = 'static/js/main.js'
try:
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # 1. Update runCodeBtn logic to set opacity = 1
    # Find the block where we set display = 'inline-flex'
    if "submitBtn.style.display = 'inline-flex';" in js_content:
        js_content = js_content.replace(
            "submitBtn.style.display = 'inline-flex';",
            "submitBtn.style.display = 'inline-flex';\n              submitBtn.style.opacity = '1';"
        )
        print("Updated runCodeBtn logic to set opacity=1")
    else:
        print("Could not find runCodeBtn display logic")

    # 2. Update resetEditorState to be cleaner
    # We previously used setAttribute which might be too aggressive.
    # Let's just use style properties.
    if "submitBtn.setAttribute('style', 'display: none; transition: all 0.3s ease;');" in js_content:
        js_content = js_content.replace(
            "submitBtn.setAttribute('style', 'display: none; transition: all 0.3s ease;');",
            "submitBtn.style.display = 'none';\n        submitBtn.style.opacity = '0';"
        )
        print("Updated resetEditorState to use style properties instead of setAttribute")

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("Successfully updated main.js")

except Exception as e:
    print(f"Error updating main.js: {e}")
