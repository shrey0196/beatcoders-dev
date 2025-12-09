import os
import re

file_path = 'static/js/main.js'

# New code to replace the Run button stub
run_button_code = '''  // Run Button Logic
  let currentProblemTitle = null;
  
  const runCodeBtn = document.getElementById('run-code-btn');
  if (runCodeBtn) {
    runCodeBtn.addEventListener('click', async () => {
      if (!editorInstance || !currentProblemTitle) {
        alert('Editor not initialized');
        return;
      }

      const code = editorInstance.getValue();
      const problem = problemsDataMap[currentProblemTitle];
      
      if (!problem || !problem.testCases) {
        alert('No test cases available for this problem');
        return;
      }

      // Show loading state
      runCodeBtn.disabled = true;
      runCodeBtn.innerHTML = '<span style="margin-right: 5px;">⏳</span> Running...';

      try {
        const response = await fetch('http://localhost:8001/api/run-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            language: 'python',
            testCases: problem.testCases,
            problemId: currentProblemTitle
          })
        });

        const data = await response.json();

        // Update test case tabs with results
        const testCaseTabs = document.querySelectorAll('.test-case-tab');
        const testCaseContent = document.querySelector('.test-case-content');

        if (data.success && data.results) {
          data.results.forEach((result, index) => {
            const tab = testCaseTabs[index];
            if (tab) {
              // Remove previous status classes
              tab.classList.remove('test-passed', 'test-failed');
              
              // Add status class
              if (result.passed) {
                tab.classList.add('test-passed');
                tab.innerHTML = `Case ${index + 1} <span style="color: #22c55e; margin-left: 5px;">✓</span>`;
              } else {
                tab.classList.add('test-failed');
                tab.innerHTML = `Case ${index + 1} <span style="color: #ef4444; margin-left: 5px;">✗</span>`;
              }
            }
          });

          // Show first test case result
          if (data.results.length > 0) {
            displayTestResult(data.results[0], testCaseContent);
          }

          // Show/hide Submit button based on all tests passing
          const submitBtn = document.getElementById('submit-solution-btn');
          if (submitBtn) {
            if (data.allPassed) {
              submitBtn.style.display = 'inline-flex';
              submitBtn.style.animation = 'fadeIn 0.3s ease-in';
            } else {
              submitBtn.style.display = 'none';
            }
          }
        }

      } catch (error) {
        console.error('Error running code:', error);
        alert('Failed to run code. Make sure the backend server is running.');
      } finally {
        // Reset button state
        runCodeBtn.disabled = false;
        runCodeBtn.innerHTML = `
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 5px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Run
        `;
      }
    });
  }

  // Submit Button Logic
  const submitBtn = document.getElementById('submit-solution-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      if (!editorInstance || !currentProblemTitle) {
        alert('Editor not initialized');
        return;
      }

      const code = editorInstance.getValue();
      const problem = problemsDataMap[currentProblemTitle];

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span style="margin-right: 5px;">⏳</span> Submitting...';

      try {
        const response = await fetch('http://localhost:8001/api/submit-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            language: 'python',
            problemId: currentProblemTitle,
            testCases: problem.testCases || []
          })
        });

        const data = await response.json();

        if (data.success) {
          // Show comprehensive results
          showSubmissionResults(data);
        }

      } catch (error) {
        console.error('Error submitting code:', error);
        alert('Failed to submit code. Make sure the backend server is running.');
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit';
      }
    });
  }

  // Helper function to display test result
  function displayTestResult(result, container) {
    if (!container) return;

    const statusColor = result.passed ? '#22c55e' : '#ef4444';
    const statusIcon = result.passed ? '✓' : '✗';

    container.innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="color: ${statusColor}; font-size: 1.2rem;">${statusIcon}</span>
          <span style="color: var(--text-primary); font-weight: 600;">${result.passed ? 'Passed' : 'Failed'}</span>
        </div>
        
        <div style="margin-bottom: 10px;">
          <span style="color: var(--text-secondary); font-size: 0.85rem;">Input:</span>
          <code style="display: block; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; margin-top: 5px; color: var(--text-primary);">${JSON.stringify(result.input, null, 2)}</code>
        </div>
        
        <div style="margin-bottom: 10px;">
          <span style="color: var(--text-secondary); font-size: 0.85rem;">Expected Output:</span>
          <code style="display: block; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; margin-top: 5px; color: var(--text-primary);">${JSON.stringify(result.expected, null, 2)}</code>
        </div>
        
        <div style="margin-bottom: 10px;">
          <span style="color: var(--text-secondary); font-size: 0.85rem;">Your Output:</span>
          <code style="display: block; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; margin-top: 5px; color: ${result.passed ? 'var(--text-primary)' : '#ef4444'};">${result.error || JSON.stringify(result.actual, null, 2)}</code>
        </div>
      </div>
    `;
  }

  // Helper function to show submission results
  function showSubmissionResults(data) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: #0a0a0a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 30px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      color: var(--text-primary);
    `;

    const statusColor = data.allPassed ? '#22c55e' : '#ef4444';
    const statusText = data.allPassed ? 'Accepted' : 'Wrong Answer';

    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: ${statusColor}; margin-bottom: 10px;">${statusText}</h2>
        <p style="color: var(--text-secondary);">${data.passedCount} / ${data.totalCount} test cases passed</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
        <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
          <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Runtime</div>
          <div style="color: var(--text-primary); font-size: 1.1rem; font-weight: 600;">${data.runtime}</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
          <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Memory</div>
          <div style="color: var(--text-primary); font-size: 1.1rem; font-weight: 600;">${data.memory}</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: var(--text-primary); margin-bottom: 15px; font-size: 1rem;">Test Results</h3>
        ${data.results.map((result, i) => `
          <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid ${result.passed ? '#22c55e' : '#ef4444'};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: var(--text-secondary);">Test Case ${i + 1}${result.hidden ? ' (Hidden)' : ''}</span>
              <span style="color: ${result.passed ? '#22c55e' : '#ef4444'};">${result.passed ? '✓ Passed' : '✗ Failed'}</span>
            </div>
            ${!result.passed && !result.hidden ? `<div style="color: #ef4444; font-size: 0.85rem; margin-top: 8px;">${result.error || 'Output mismatch'}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <button onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="
        width: 100%;
        padding: 12px;
        background: var(--accent1);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
      ">Close</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }'''

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the Run button stub (lines 1293-1299)
    old_run_code = '''  // Run Button Logic (Stub)
  const runCodeBtn = document.getElementById('run-code-btn');
  if (runCodeBtn) {
    runCodeBtn.addEventListener('click', () => {
      alert('Run functionality coming soon! Use Submit to check your solution.');
    });
  }'''
    
    if old_run_code in content:
        content = content.replace(old_run_code, run_button_code)
        print("Replaced Run button stub")
    else:
        print("Warning: Could not find exact Run button stub, trying alternative approach...")
        # Try to find by pattern
        import re
        pattern = r"// Run Button Logic.*?}\s*}\s*}"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            content = content[:match.start()] + run_button_code + content[match.end():]
            print("Replaced Run button code via pattern matching")
        else:
            print("ERROR: Could not find Run button code to replace")
            exit(1)
    
    # Also need to update openCodeEditor to set currentProblemTitle
    # Find the openCodeEditor function and add currentProblemTitle = problemTitle
    pattern = r"(function openCodeEditor\(problemTitle\) \{[^\n]*\n)"
    replacement = r"\1    currentProblemTitle = problemTitle;\n"
    content = re.sub(pattern, replacement, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully updated Run/Submit button logic in main.js")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
