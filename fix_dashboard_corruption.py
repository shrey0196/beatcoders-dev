#!/usr/bin/env python3
"""
Fix dashboard.html by removing identified corrupted blocks.
Block 1 to remove: Lines 2901 to 3126 (Duplicate/Broken Logic)
Block 2 to remove: Lines 3193 to 3409 (Leaked Modal & JS)
"""

def fix_dashboard_corruption():
    file_path = 'dashboard.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Indices are 0-based, line numbers are 1-based.
    # Remove 2901-3126 -> Indices 2900 to 3126 (exclusive of end index in slice?)
    # Line 2901 is index 2900.
    # Line 3126 is index 3125.
    
    # Remove 3193-3409 -> Indices 3192 to 3409.
    # Line 3193 is index 3192.
    # Line 3409 is index 3408.
    
    # We will construct the new content by keeping the good parts.
    
    # Part 1: Start to Line 2900 (Index 0 to 2900)
    part1 = lines[:2900]
    
    # Part 2: Line 3127 to Line 3192 (Index 3126 to 3192)
    # Line 3127 is index 3126.
    # Line 3192 is index 3191. (Line 3191 is </script>, Line 3192 is empty)
    # We want to keep up to 3192.
    part2 = lines[3126:3192]
    
    # Part 3: Line 3410 to End (Index 3409 to End)
    # Line 3410 is index 3409.
    part3 = lines[3409:]
    
    new_lines = part1 + part2 + part3
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"Fixed {file_path}. Original lines: {len(lines)}, New lines: {len(new_lines)}")
    print("Removed corrupted blocks.")

if __name__ == '__main__':
    fix_dashboard_corruption()
