"""
Script to fix the dashboard.html code leak issue by removing duplicate JavaScript
that's incorrectly placed inside the modal HTML structure.
"""

with open('dashboard.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with the leaked code start
# It should be after "<!-- Hidden textarea for fallback/form submission if needed -->"
# and before the actual modal closing tags

leaked_code_start = None
leaked_code_end = None

for i, line in enumerate(lines):
    # Find where the leak starts (after the textarea comment, there's leaked JS)
    if '<!-- Hidden textarea for fallback/form submission if needed -->' in line:
        # Check if next line has JavaScript code instead of HTML
        if i + 1 < len(lines) and 'const isCurrentUser' in lines[i + 1]:
            leaked_code_start = i + 1
            print(f"Found leaked code start at line {leaked_code_start + 1}")
    
    # Find where the proper modal structure resumes
    # Look for the textarea and submit button that should be there
    if leaked_code_start and '<textarea id="code-editor"' in line:
        leaked_code_end = i
        print(f"Found proper modal structure at line {leaked_code_end + 1}")
        break

if leaked_code_start and leaked_code_end:
    # Remove the leaked code
    fixed_lines = lines[:leaked_code_start] + lines[leaked_code_end:]
    
    with open('dashboard.html', 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)
    
    print(f"✓ Removed {leaked_code_end - leaked_code_start} lines of leaked code")
    print(f"✓ dashboard.html fixed successfully")
else:
    print("✗ Could not find leaked code pattern")
    print(f"leaked_code_start: {leaked_code_start}")
    print(f"leaked_code_end: {leaked_code_end}")
