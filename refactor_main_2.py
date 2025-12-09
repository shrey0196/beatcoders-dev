
import os
import re

MAIN_JS_PATH = r"c:\Users\shrey\PycharmProjects\BeatCoders\static\js\main.js"

def refactor():
    with open(MAIN_JS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Define global currentProblemTitle at top
    if "let currentProblemTitle = null;" not in content:
        content = content.replace("let problemsData = [", "let currentProblemTitle = null;\nlet problemsData = [")
    
    # 2. Update openCodeEditor to set currentProblemTitle
    # Look for: const problem = problemsDataMap[title];
    # Replace with: const problem = problemsDataMap[title];\n  window.currentProblemTitle = title;
    content = content.replace("const problem = problemsDataMap[title];", "const problem = problemsDataMap[title];\n  window.currentProblemTitle = title;")

    # 3. Extract displayTestResult
    # It starts with "function displayTestResult(result, container) {"
    # It ends with "}"
    # I'll use regex or simple string matching if possible. 
    # Since I know the structure from view_file:
    match_display = re.search(r'(// Helper function to display test result\s+function displayTestResult\(.*?^    })', content, re.MULTILINE | re.DOTALL)
    
    display_func_code = ""
    if match_display:
        display_func_code = match_display.group(1)
        # Comment out original
        content = content.replace(display_func_code, "// displayTestResult moved to global")
        
        # Make it window.displayTestResult for clarity or just keep function definition in global scope
    else:
        print("Could not find displayTestResult")

    # 4. Create window.runCode
    # I will construct it manually based on the known logic rather than extracting, to avoid parsing complex nested listeners.
    # The logic is standard: get value, fetch /api/run-code, update results.
    
    run_code_logic = """
window.runCode = async function() {
    console.log('[runCode] Triggered');
    const runBtn = document.getElementById('run-code-btn');
    
    if (!editorInstance || !window.currentProblemTitle) {
        alert('Editor or Problem not initialized');
        return;
    }

    const code = editorInstance.getValue();
    const problem = problemsDataMap[window.currentProblemTitle];

    if (!problem || !problem.testCases) {
        alert('No test cases available for this problem');
        return;
    }

    // Show loading state
    if(runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = '<span style="margin-right: 5px;">⏳</span> Running...';
    }

    try {
        const response = await fetch('http://localhost:8001/api/run-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: code,
                language: 'python',
                testCases: problem.testCases,
                problemId: window.currentProblemTitle
            })
        });

        const data = await response.json();

        // Store results globally
        if (data.results) {
            window.lastTestResults = data.results;
        }

        // Update test case tabs with results
        const testCaseTabs = document.querySelectorAll('.test-case-tab');
        const testCaseContent = document.querySelector('.test-case-content');

        if (data.results) {
            data.results.forEach((result, index) => {
                const tab = testCaseTabs[index];
                if (tab) {
                    tab.classList.remove('test-passed', 'test-failed');
                    if (result.passed) {
                        tab.innerHTML = `Case ${index + 1} <span style="color: #22c55e; margin-left: 5px;">✓</span>`;
                    } else {
                        tab.innerHTML = `Case ${index + 1} <span style="color: #ef4444; margin-left: 5px;">✗</span>`;
                    }
                }
            });

            // Show first test case result
            if (data.results.length > 0 && typeof displayTestResult === 'function') {
                displayTestResult(data.results[0], testCaseContent);
            }
        }

    } catch (error) {
        console.error('Error running code:', error);
        alert('Failed to run code.');
    } finally {
        if(runBtn) {
            runBtn.disabled = false;
            runBtn.innerHTML = '▶ Run Code';
        }
    }
};
"""

    # 5. Inject globals (runCode + displayTestResult)
    # Insert after "window.initPracticeView = initPracticeView;" line
    injection_point = "window.initPracticeView = initPracticeView;"
    code_to_inject = "\n" + display_func_code + "\n" + run_code_logic + "\n"
    
    if injection_point in content:
        content = content.replace(injection_point, injection_point + code_to_inject)
    else:
        print("Could not find injection point")
        return

    with open(MAIN_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Refactor 2 complete.")

if __name__ == "__main__":
    refactor()
