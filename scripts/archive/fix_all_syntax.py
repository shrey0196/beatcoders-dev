import os
import re

file_path = 'static/js/main.js'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Replace the broken split line (line 1483-1484)
    content = re.sub(
        r"const codeLines = code\.trim\(\)\.split\('[\r\n]+'\)\.length;",
        "const codeLines = code.trim().split('\\\\n').length;",
        content
    )
    
    # Fix 2: Replace the template literal with regular string concatenation (line 1533)
    content = content.replace(
        "{ icon: '✓', title: 'Decent Performance', desc: \\`Achieves \\${timeComplexity} time complexity\\`, positive: true },",
        "{ icon: '✓', title: 'Decent Performance', desc: 'Achieves ' + timeComplexity + ' time complexity', positive: true },"
    )
    
    # Also fix any other template literals that might be broken
    content = content.replace("\\`", "`")
    content = content.replace("\\${", "${")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Fixed all syntax errors")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
