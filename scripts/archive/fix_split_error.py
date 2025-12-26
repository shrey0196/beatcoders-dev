import os

file_path = 'static/js/main.js'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # The problem is the literal newline in the split string
    # We need to find and fix ALL occurrences of broken split statements
    
    # Replace any occurrence of split with a literal newline in the string
    import re
    
    # Pattern to find: split('\r\n or split('\n followed by actual newline
    # Replace with: split('\\n')
    
    # First, let's just read line by line and fix line 1483
    lines = content.split('\n')
    
    for i in range(len(lines)):
        # Check if this line has a broken split
        if "code.trim().split('" in lines[i] and not lines[i].strip().endswith("');"):
            # This line is broken, fix it
            lines[i] = "    const codeLines = code.trim().split('\\\\n').length;"
            # Check if next line is the continuation
            if i + 1 < len(lines) and "').length" in lines[i+1]:
                lines[i+1] = ""  # Remove the broken continuation
    
    # Rejoin
    content = '\n'.join(lines)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Fixed syntax error")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
