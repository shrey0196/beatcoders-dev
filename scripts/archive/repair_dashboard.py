import os

dashboard_path = r'c:\Users\shrey\PycharmProjects\BeatCoders\dashboard.html'

def repair_dashboard():
    if not os.path.exists(dashboard_path):
        print(f"Error: {dashboard_path} not found.")
        return

    with open(dashboard_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_index = -1
    end_index = -1

    # Find start: window.fetchAndRestoreLatestCode = async function (problemId) {
    for i, line in enumerate(lines):
        if 'window.fetchAndRestoreLatestCode = async function (problemId) {' in line:
            start_index = i
            break
    
    if start_index == -1:
        print("Could not find start of fetchAndRestoreLatestCode function.")
        return

    # Find end: looking for the catch block close
    # The corrupted block ends around line 1606 with `      };` after `    }`
    # We can look for `console.error('Failed to restore code:', e);`
    
    for i in range(start_index, len(lines)):
        if "console.error('Failed to restore code:', e);" in lines[i]:
            # The function ends a few lines after this
            # catch (e) { console... } };
            # Let's look for the closing };
            for j in range(i, len(lines)):
                if lines[j].strip() == '};':
                    end_index = j
                    break
            break
            
    if end_index == -1:
         print("Could not find end of fetchAndRestoreLatestCode function.")
         # Fallback: try to find the next function definition or something
         return

    print(f"Replacing corrupted block from line {start_index+1} to {end_index+1}")

    new_code = [
        "      window.fetchAndRestoreLatestCode = async function (problemId) {\n",
        "        if (!userSettings.userID || !window.editorInstance) return;\n",
        "        try {\n",
        "          const response = await fetch(`/api/submissions/history/${userSettings.userID}/${encodeURIComponent(problemId)}`);\n",
        "          if (response.ok) {\n",
        "            const history = await response.json();\n",
        "            if (history.length > 0) {\n",
        "              const latest = history[0];\n",
        "              console.log('[Restore] Restoring latest submission:', latest);\n",
        "              \n",
        "              // Use setValue to update editor content - wrapped with Restoring flag\n",
        "              if (window.cognitiveObserver && typeof window.cognitiveObserver.setRestoring === 'function') {\n",
        "                window.cognitiveObserver.setRestoring(true);\n",
        "              }\n",
        "\n",
        "              window.editorInstance.setValue(latest.code);\n",
        "\n",
        "              setTimeout(() => {\n",
        "                if (window.cognitiveObserver && typeof window.cognitiveObserver.setRestoring === 'function') {\n",
        "                  window.cognitiveObserver.setRestoring(false);\n",
        "                }\n",
        "              }, 800);\n",
        "            }\n",
        "          }\n",
        "        } catch (e) {\n",
        "          console.error('Failed to restore code:', e);\n",
        "        }\n",
        "      };\n"
    ]

    # Replace
    new_lines = lines[:start_index] + new_code + lines[end_index+1:]

    with open(dashboard_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("Successfully repaired dashboard.html")

if __name__ == "__main__":
    repair_dashboard()
