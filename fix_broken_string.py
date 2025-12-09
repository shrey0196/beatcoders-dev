import os
import re

file_path = 'static/js/main.js'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find line 1483 and fix the broken string
    # The problem is: split('\r\n').length is broken across two lines
    # Line 1483: const codeLines = code.trim().split('\r
    # Line 1484: ').length;
    
    # Join these lines properly
    for i in range(len(lines)):
        if i == 1482:  # Line 1483 (0-indexed)
            # Check if this line has the broken split
            if "split('" in lines[i] and lines[i].strip().endswith("'"):
                # This line is broken, fix it
                lines[i] = "    const codeLines = code.trim().split('\\n').length;\r\n"
                # Remove the next line if it's just the closing part
                if i + 1 < len(lines) and lines[i+1].strip().startswith("').length"):
                    lines[i+1] = ""  # Remove this line
                break
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("Successfully fixed broken string literal")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
