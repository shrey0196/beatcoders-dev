
import os

file_path = 'dashboard.html'
target_block = """    /* Full Screen Editor */
    #full-screen-editor {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: var(--bg1);
      z-index: 2000;
      display: none;
      flex-direction: column;
    }"""

replacement_block = """    /* Full Screen Editor */
    #full-screen-editor {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #000000; /* Force Black */
      color: #e8f0ff; /* Force Light Text */
      z-index: 2000;
      display: none;
      flex-direction: column;
      /* Enforce dark mode variables locally */
      --bg1: #000000;
      --bg2: #0a0a0a;
      --card: #111111;
      --text-primary: #e8f0ff;
      --text-secondary: #9aa7c7;
      --border-color: #333;
    }"""

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Normalize line endings for comparison if needed, but simple replace might work
    if target_block in content:
        new_content = content.replace(target_block, replacement_block)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully updated CSS in dashboard.html")
    else:
        # Try a more flexible approach if exact match fails (e.g. line by line)
        print("Exact block match failed. Trying line-by-line search...")
        lines = content.splitlines()
        start_idx = -1
        end_idx = -1
        
        for i, line in enumerate(lines):
            if "#full-screen-editor {" in line:
                start_idx = i - 1 # Include comment line if present
                break
        
        if start_idx != -1:
            # Find closing brace
            for i in range(start_idx, len(lines)):
                if "}" in lines[i] and lines[i].strip() == "}":
                    end_idx = i
                    break
            
            if end_idx != -1:
                print(f"Found block lines {start_idx} to {end_idx}")
                # Replace lines
                new_lines = lines[:start_idx] + replacement_block.splitlines() + lines[end_idx+1:]
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(new_lines))
                print("Successfully updated CSS via line replacement")
            else:
                print("Could not find closing brace")
        else:
            print("Could not find #full-screen-editor block")

except Exception as e:
    print(f"Error: {e}")
