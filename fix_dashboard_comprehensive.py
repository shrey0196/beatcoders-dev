#!/usr/bin/env python3
"""
Comprehensive fix for dashboard.html modal indentation issue.
This script will:
1. Remove excessive indentation from the modal HTML
2. Ensure proper structure
"""

def fix_dashboard_comprehensive():
    file_path = 'dashboard.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find where the modal comment starts
    modal_start_idx = None
    for i, line in enumerate(lines):
        if '<!-- Code Editor Modal -->' in line:
            modal_start_idx = i
            print(f"Found modal at line {i + 1}")
            break
    
    if modal_start_idx is None:
        print("ERROR: Could not find modal start")
        return
    
    # Process lines
    fixed_lines = []
    
    # Keep everything before the modal as-is
    for i in range(modal_start_idx):
        fixed_lines.append(lines[i])
    
    # Fix modal and everything after
    for i in range(modal_start_idx, len(lines)):
        line = lines[i]
        
        # Count leading spaces
        leading_spaces = len(line) - len(line.lstrip(' '))
        
        # If line has 8 or more leading spaces, remove 8
        if leading_spaces >= 8 and line.strip():  # Only if line has content
            line = line[8:]  # Remove 8 spaces
        
        fixed_lines.append(line)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)
    
    print(f"Fixed {len(lines) - modal_start_idx} lines starting from line {modal_start_idx + 1}")
    print("Modal indentation has been corrected")

if __name__ == '__main__':
    fix_dashboard_comprehensive()
