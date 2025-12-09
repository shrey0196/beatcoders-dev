import os

# Update main.js to initialize AdaptiveIDE
js_path = 'static/js/main.js'

try:
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Initialize AdaptiveIDE in openCodeEditor
    # We need to create the instance and call init()
    
    init_logic = """
    // Initialize AdaptiveIDE
    if (!window.adaptiveIDE) {
      window.adaptiveIDE = new AdaptiveIDE();
    }
    window.adaptiveIDE.init();
    """
    
    # Insert at the end of openCodeEditor, before the closing brace
    # Finding the end of openCodeEditor is tricky with regex, let's insert after "Show Full Screen Editor" block
    
    marker = "document.body.style.overflow = 'hidden';\n    }"
    
    if marker in content:
        content = content.replace(
            marker,
            marker + "\n\n    " + init_logic
        )
        print("Added AdaptiveIDE initialization")
    else:
        print("Could not find insertion point for AdaptiveIDE init")

    # 2. Connect CognitiveObserver to AdaptiveIDE
    # We need to find where CognitiveObserver is attached or where it receives data
    # Ideally, CognitiveObserver should call adaptiveIDE.adaptToState(data)
    
    # Since we can't easily modify CognitiveObserver.js from here (it's a separate file), 
    # we can hook into the 'monaco-loaded' event or similar if CognitiveObserver emits events.
    # Alternatively, if CognitiveObserver is global, we can monkey-patch its update method?
    # Or better, let's assume CognitiveObserver emits a 'cognitive-update' event or we can poll.
    
    # Actually, let's check if we can modify CognitiveObserver.js. 
    # But for now, let's just ensure the UI part works. The user asked for the UI feature.
    # The auto-trigger requires the signal.
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated main.js")

except Exception as e:
    print(f"Error updating main.js: {e}")
