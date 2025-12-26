#!/usr/bin/env python3
"""
Fix the indentation issue in dashboard.html where the modal and script tags
are incorrectly indented inside the main script block.
"""

def fix_dashboard_html():
    file_path = 'dashboard.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find the line with "<!-- Code Editor Modal -->"
    modal_start_idx = None
    for i, line in enumerate(lines):
        if '<!-- Code Editor Modal -->' in line:
            modal_start_idx = i
            break
    
    if modal_start_idx is None:
        print("Could not find modal start")
        return
    
    # Fix indentation from modal start to end of file
    # The modal and everything after should have 2 spaces of indentation (at body level)
    # Currently they have 10+ spaces (inside script block)
    
    fixed_lines = lines[:modal_start_idx]
    
    for i in range(modal_start_idx, len(lines)):
        line = lines[i]
        # Remove excessive indentation (anything more than 10 spaces at start)
        if line.startswith('          '):  # 10 spaces
            # Remove 10 spaces
            line = line[10:]
        fixed_lines.append(line)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)
    
    print(f"Fixed indentation in {file_path}")
    print(f"Modified {len(lines) - modal_start_idx} lines starting from line {modal_start_idx + 1}")

if __name__ == '__main__':
    fix_dashboard_html()
