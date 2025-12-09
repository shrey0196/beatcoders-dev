import os

file_path = 'dashboard.html'

def fix_chart_loading():
    print(f"Reading {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Find indices of the script tags
    monaco_idx = -1
    chart_idx = -1

    for i, line in enumerate(lines):
        if 'monaco-editor' in line and 'loader.min.js' in line:
            monaco_idx = i
        elif 'chart.js' in line:
            chart_idx = i

    if monaco_idx != -1 and chart_idx != -1:
        print(f"Found Monaco loader at line {monaco_idx + 1}")
        print(f"Found Chart.js at line {chart_idx + 1}")
        
        # We want Chart.js BEFORE Monaco to avoid AMD conflict
        if chart_idx > monaco_idx:
            print("Chart.js is loaded AFTER Monaco. Swapping order...")
            
            # Get the lines
            monaco_line = lines[monaco_idx]
            chart_line = lines[chart_idx]
            
            # Swap them in the list
            # Note: This simple swap assumes they are the only things on their lines, which is true for this file
            lines[monaco_idx] = chart_line
            lines[chart_idx] = monaco_line
            
            # Write back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print("Successfully swapped script tags.")
        else:
            print("Chart.js is already loaded BEFORE Monaco. No change needed.")
    else:
        print("Error: Could not find both script tags.")
        if monaco_idx == -1: print("- Monaco loader not found")
        if chart_idx == -1: print("- Chart.js not found")

if __name__ == "__main__":
    fix_chart_loading()
