import os
import re

js_path = 'static/js/main.js'

try:
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add showFailureScreen function
    # We'll add it before showSuccessScreen to keep things organized
    # Or just append it if finding the exact spot is hard. 
    # Let's try to find showSuccessScreen and insert before it.
    
    failure_screen_code = """
  function showFailureScreen(data, code) {
    // Track attempts
    const problemId = currentProblemTitle || 'unknown';
    const attemptsKey = `attempts_${problemId}`;
    let attempts = parseInt(localStorage.getItem(attemptsKey) || '0') + 1;
    localStorage.setItem(attemptsKey, attempts);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'success-overlay'; // Reusing ID for styling, or we can add a class
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      justify-content: flex-end;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    // Analyze code for insights even on failure
    const analysis = analyzeSolution(code, data.runtime || '0ms', null);

    // Calculate stats
    const totalTests = data.totalCount;
    const passedTests = data.passedCount;
    const failedTests = totalTests - passedTests;
    
    // Content
    overlay.innerHTML = `
      <div style="
        width: 50%;
        height: 100%;
        background: #0a0a0a;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        padding: 40px;
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      ">
        <!-- Header -->
        <div style="margin-bottom: 30px;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
            <div style="
              width: 50px; 
              height: 50px; 
              border-radius: 12px; 
              background: rgba(239, 68, 68, 0.2); 
              display: flex; 
              align-items: center; 
              justify-content: center;
              font-size: 24px;
              color: #ef4444;
            ">✗</div>
            <div>
              <h1 style="margin: 0; font-size: 2rem; color: #ef4444;">Submission Failed</h1>
              <p style="margin: 5px 0 0 0; color: #9ca3af;">Keep going, you're learning!</p>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
          <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 5px;">Test Cases Passed</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: #e5e7eb;">${passedTests} <span style="font-size: 1rem; color: #9ca3af;">/ ${totalTests}</span></div>
            <div style="font-size: 0.8rem; color: #ef4444; margin-top: 5px;">${failedTests} Failed</div>
          </div>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 5px;">Total Attempts</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: #e5e7eb;">${attempts}</div>
            <div style="font-size: 0.8rem; color: #4ea8ff; margin-top: 5px;">Don't give up!</div>
          </div>
        </div>

        <!-- Cognitive Insights (Even on Failure) -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #e5e7eb; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
            <span>🧠</span> Cognitive Analysis
          </h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${analysis.insights.map(insight => `
              <div style="
                background: #1a1a1a; 
                padding: 15px; 
                border-radius: 8px; 
                border-left: 3px solid ${insight.positive ? '#22c55e' : '#f59e0b'};
                display: flex;
                align-items: flex-start;
                gap: 12px;
              ">
                <span style="font-size: 1.2rem;">${insight.icon}</span>
                <div>
                  <div style="color: #e5e7eb; font-weight: 600; margin-bottom: 2px;">${insight.title}</div>
                  <div style="color: #9ca3af; font-size: 0.9rem;">${insight.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Failed Test Cases Detail -->
        <div style="margin-bottom: 30px; flex: 1;">
          <h3 style="color: #e5e7eb; margin-bottom: 15px;">Failed Test Cases</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${data.results.filter(r => !r.passed).slice(0, 3).map((r, i) => `
              <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 15px;">
                <div style="color: #ef4444; font-weight: 600; margin-bottom: 5px;">Case ${r.caseNumber} ${r.hidden ? '(Hidden)' : ''}</div>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; font-size: 0.9rem;">
                  <span style="color: #9ca3af;">Input:</span>
                  <code style="color: #e5e7eb; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(r.input)}</code>
                  <span style="color: #9ca3af;">Expected:</span>
                  <code style="color: #e5e7eb; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(r.expected)}</code>
                  <span style="color: #9ca3af;">Actual:</span>
                  <code style="color: #ef4444; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">${r.error || JSON.stringify(r.actual)}</code>
                </div>
              </div>
            `).join('')}
            ${data.results.filter(r => !r.passed).length > 3 ? `<div style="text-align: center; color: #9ca3af; font-style: italic;">+ ${data.results.filter(r => !r.passed).length - 3} more failed cases</div>` : ''}
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 15px; margin-top: auto;">
          <button onclick="document.getElementById('success-overlay').remove()" style="
            flex: 1;
            padding: 15px;
            background: #2a2a2a;
            color: #e5e7eb;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">Try Again</button>
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
          ">View Analysis</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Store data for detailed analysis
    window.lastSubmissionData = data;
    window.lastSubmissionCode = code;

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      overlay.children[0].style.transform = 'translateX(0)';
    });
  }
    """

    if "function showSuccessScreen" in content:
        content = content.replace(
            "function showSuccessScreen",
            failure_screen_code + "\n\n  function showSuccessScreen"
        )
        print("Inserted showFailureScreen function")
    else:
        print("Could not find showSuccessScreen to insert before")

    # 2. Update submit button logic to use showFailureScreen
    # Look for: showSubmissionResults(data);
    if "showSubmissionResults(data);" in content:
        content = content.replace(
            "showSubmissionResults(data);",
            "showFailureScreen(data, code);"
        )
        print("Updated submit logic to use showFailureScreen")
    else:
        print("Could not find showSubmissionResults call")

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated main.js")

except Exception as e:
    print(f"Error: {e}")
