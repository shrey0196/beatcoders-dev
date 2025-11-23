
def repair_dashboard():
    file_path = 'dashboard.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 1. Header (Lines 1-31, 0-indexed 0-30)
    # Line 31 is <style>, we keep it.
    header = lines[:31]
    
    # 2. CSS (Lines 189-1510, 0-indexed 188-1509)
    # Line 189 in 1-based is index 188.
    # We need to handle the start of CSS manually because line 188 (index 187) is mixed.
    # Index 187: "    </script><style> :root {\n"
    # We'll just add ":root {" manually and then take the rest.
    
    css_content = ["    :root {\n"]
    
    # CSS Body: Index 188 to 1510 (exclusive of </style> at 1510)
    # Line 1511 (index 1510) is "  </style>"
    for i in range(188, 1510):
        line = lines[i]
        # De-indent by 4 spaces
        if line.startswith("    "):
            css_content.append(line[4:])
        else:
            css_content.append(line)
            
    # Close CSS
    css_content.append("  </style>\n")
    
    # 3. Body (Lines 1514-2680, 0-indexed 1513-2679)
    # Line 1514 (index 1513) is "<body>"
    # Line 2680 (index 2679) is "</html>"
    body_content = []
    for i in range(1513, len(lines)):
        line = lines[i]
        # De-indent by 4 spaces
        if line.startswith("    "):
            body_content.append(line[4:])
        else:
            body_content.append(line)
            
    # Combine
    new_content = header + css_content + body_content
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_content)
    
    print(f"Repaired dashboard.html. New line count: {len(new_content)}")

if __name__ == "__main__":
    repair_dashboard()
