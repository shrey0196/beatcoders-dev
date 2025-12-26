
import os

file_path = 'dashboard.html'
target_block_start = "    /* Problem Description Styles */"
target_block_end = "    #editor-problem-description li {"

replacement_block = """    /* Modern Problem Description Styles */
    .problem-statement {
      font-size: 1.05rem;
      color: var(--text-primary);
      margin-bottom: 25px;
      line-height: 1.7;
    }

    .section-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-secondary);
      font-weight: 700;
      margin-top: 30px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .example-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .io-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }

    .io-group:last-child {
      margin-bottom: 0;
    }

    .io-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .io-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      color: var(--text-primary);
      background: rgba(0, 0, 0, 0.3);
      padding: 8px 12px;
      border-radius: 6px;
      border-left: 2px solid var(--accent1);
      display: block;
    }

    .constraint-list {
      list-style: none;
      padding: 0;
      display: grid;
      gap: 10px;
    }

    .constraint-item {
      background: rgba(255, 255, 255, 0.02);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.9rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .constraint-item::before {
      content: '•';
      color: var(--accent2);
      font-weight: bold;
    }

    .constraint-item code {
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text-primary);
      font-family: monospace;
    }"""

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = -1
    end_idx = -1

    for i, line in enumerate(lines):
        if target_block_start in line:
            start_idx = i
        if target_block_end in line:
            # We need to include the closing brace of this block
            # Assuming standard formatting, it's 2 lines down
            end_idx = i + 2 
            break
    
    if start_idx != -1 and end_idx != -1:
        print(f"Found block lines {start_idx} to {end_idx}")
        new_lines = lines[:start_idx] + replacement_block.splitlines(True) + ["\n"] + lines[end_idx+1:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("Successfully updated CSS styles")
    else:
        print("Could not find start or end markers")
        print(f"Start: {start_idx}, End: {end_idx}")

except Exception as e:
    print(f"Error: {e}")
