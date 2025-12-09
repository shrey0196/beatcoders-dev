
import os

MAIN_JS_PATH = r"c:\Users\shrey\PycharmProjects\BeatCoders\static\js\main.js"

def refactor():
    with open(MAIN_JS_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find start and end indices
    start_idx = -1
    end_idx = -1
    editor_idx = -1

    for i, line in enumerate(lines):
        if "let problemsData = [" in line:
            start_idx = i
        if "window.initPracticeView = initPracticeView;" in line:
            end_idx = i
        if "let editorInstance = null;" in line:
            editor_idx = i

    if start_idx == -1 or end_idx == -1:
        print("Error: Could not find block boundaries.")
        return

    print(f"Block found: Lines {start_idx+1} to {end_idx+1}")
    
    # Extract Block
    block_lines = lines[start_idx : end_idx+1]
    
    # Create Comment Replacement
    replacement_comment = ["    // [REFACTORED] ProblemsData and Practice Functions moved to Global Scope\n"]
    
    # Modifiy Original Lines: Comment out editorInstance and Remove Block
    new_lines = []
    
    # Header logic: Imports are usually top. We insert AFTER imports (if any), before initApp.
    # initApp is usually line 3.
    # We will insert AT THE VERY TOP (Line 0).
    
    # Construct Global Block
    global_block = []
    global_block.append("// --- GLOBAL SCOPE REFACTOR ---\n")
    global_block.append("let editorInstance = null;\n")
    global_block.extend(block_lines)
    global_block.append("\n// --- INJECTED GLOBAL FUNCTIONS ---\n")
    global_block.append("window.closeCodeEditor = function() {\n")
    global_block.append("    const modal = document.getElementById('code-editor-modal');\n")
    global_block.append("    if (modal) modal.style.display = 'none';\n")
    global_block.append("    const overlay = document.getElementById('full-screen-editor');\n")
    global_block.append("    if (overlay) overlay.style.display = 'none';\n")
    global_block.append("    const body = document.body;\n")
    global_block.append("    if (body) body.classList.remove('modal-open');\n")
    global_block.append("};\n\n")
    global_block.append("window.loadNextProblem = function() {\n")
    global_block.append("    const successOverlay = document.getElementById('success-overlay');\n")
    global_block.append("    if (successOverlay) successOverlay.remove();\n")
    global_block.append("    if (window.closeCodeEditor) window.closeCodeEditor();\n")
    global_block.append("    window.scrollTo({ top: 0, behavior: 'smooth' });\n")
    global_block.append("};\n\n")

    # Reconstruct File
    # 1. Globals
    final_lines = global_block
    
    # 2. Original Content (Modified)
    for i, line in enumerate(lines):
        if i == editor_idx:
            final_lines.append("  // let editorInstance = null; // Moved to global\n")
        elif i >= start_idx and i <= end_idx:
            if i == start_idx: # Insert comment once
                final_lines.extend(replacement_comment)
            # Skip others
        else:
            final_lines.append(line)

    # Write Back
    with open(MAIN_JS_PATH, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)
    
    print("Refactor complete.")

if __name__ == "__main__":
    refactor()
