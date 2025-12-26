import os

# Add "View Hint" button to showFailureScreen
js_path = 'static/js/main.js'

try:
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find and replace the Actions section in showFailureScreen
    old_actions = '''          <button onclick="showDetailedCognitiveAnalysis(window.lastSubmissionData, window.lastSubmissionCode)" style="
            flex: 1;
            padding: 15px;
            background: rgba(78, 168, 255, 0.1);
            color: #4ea8ff;
            border: 1px solid rgba(78, 168, 255, 0.2);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">View Analysis</button>'''

    new_actions = '''          <button onclick="showVisualHint()" style="
            flex: 1;
            padding: 15px;
            background: rgba(168, 85, 247, 0.1);
            color: #a855f7;
            border: 1px solid rgba(168, 85, 247, 0.2);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">💡 View Hint</button>
          <button onclick="showDetailedCognitiveAnalysis(window.lastSubmissionData, window.lastSubmissionCode)" style="
            flex: 1;
            padding: 15px;
            background: rgba(78, 168, 255, 0.1);
            color: #4ea8ff;
            border: 1px solid rgba(78, 168, 255, 0.2);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">View Analysis</button>'''

    if old_actions in content:
        content = content.replace(old_actions, new_actions)
        print("Added 'View Hint' button to showFailureScreen")
    else:
        print("Could not find the actions section in showFailureScreen")

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated main.js")

except Exception as e:
    print(f"Error: {e}")
