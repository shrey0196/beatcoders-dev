
import os

file_path = 'dashboard.html'
target_block_start = "    /* Modern Problem Description Styles */"
target_block_end = "    .constraint-item code {"

# We need to find the end of the previous block to replace it entirely.
# The previous block ended with .constraint-item code { ... }
# I will look for the start and a sufficiently far end point, or just replace the whole style section if easier.
# Better strategy: Find the start marker and replace until the closing </style> tag, 
# but we have other styles before. 
# Let's target the specific block we added last time.

replacement_css = """    /* Cyber-HUD Unique Problem Description Styles */
    .problem-statement {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.95rem;
      color: var(--text-primary);
      margin-bottom: 30px;
      line-height: 1.8;
      border-left: 2px solid var(--accent1);
      padding-left: 15px;
      background: linear-gradient(90deg, rgba(78, 168, 255, 0.05) 0%, transparent 100%);
    }

    .section-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--accent2);
      margin-top: 40px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .section-title::before {
      content: '>';
      color: var(--accent1);
      font-weight: bold;
    }

    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: repeating-linear-gradient(
        90deg,
        var(--accent2),
        var(--accent2) 2px,
        transparent 2px,
        transparent 8px
      );
      opacity: 0.5;
    }

    .example-card {
      background: #050505;
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      padding: 20px;
      margin-bottom: 25px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }

    /* Cyber Corner Accents */
    .example-card::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      width: 10px;
      height: 10px;
      border-top: 2px solid var(--accent1);
      border-left: 2px solid var(--accent1);
    }

    .example-card::after {
      content: '';
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 10px;
      height: 10px;
      border-bottom: 2px solid var(--accent1);
      border-right: 2px solid var(--accent1);
    }

    .io-group {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 15px;
      margin-bottom: 15px;
      align-items: baseline;
    }

    .io-group:last-child {
      margin-bottom: 0;
    }

    .io-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      text-align: right;
      letter-spacing: 0.05em;
    }

    .io-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      color: var(--text-strong);
      background: rgba(255, 255, 255, 0.03);
      padding: 6px 10px;
      border-radius: 2px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .constraint-list {
      list-style: none;
      padding: 0;
      display: grid;
      gap: 12px;
      border: 1px dashed rgba(255, 255, 255, 0.1);
      padding: 20px;
      background: rgba(0, 0, 0, 0.3);
    }

    .constraint-item {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .constraint-item::before {
      content: '0x' counter(list-item);
      counter-increment: list-item;
      color: var(--accent1);
      font-size: 0.7rem;
      opacity: 0.7;
    }

    .constraint-item code {
      background: rgba(78, 168, 255, 0.1);
      padding: 2px 6px;
      border-radius: 2px;
      color: var(--accent1);
      font-family: 'JetBrains Mono', monospace;
      border: 1px solid rgba(78, 168, 255, 0.2);
    }"""

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = -1
    end_idx = -1

    for i, line in enumerate(lines):
        if target_block_start in line:
            start_idx = i
        # The previous block ended with .constraint-item code { ... }
        # We need to find the closing brace for that block.
        if target_block_end in line:
            # Assuming standard formatting, the closing brace is 2-3 lines down
            # Let's scan for the next closing brace at indentation level 4 or 2
            for j in range(i, len(lines)):
                if lines[j].strip() == "}":
                    end_idx = j
                    break
            break
    
    if start_idx != -1 and end_idx != -1:
        print(f"Found block lines {start_idx} to {end_idx}")
        new_lines = lines[:start_idx] + replacement_css.splitlines(True) + ["\n"] + lines[end_idx+1:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("Successfully applied Cyber-HUD styles")
    else:
        print("Could not find start or end markers")
        print(f"Start: {start_idx}, End: {end_idx}")

except Exception as e:
    print(f"Error: {e}")
