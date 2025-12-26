import os

file_path = 'static/js/main.js'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the broken split line
    # The issue is that split('\n') got broken across lines
    content = content.replace("split('\r\n').length", "split('\\n').length")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully fixed syntax error in main.js")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
