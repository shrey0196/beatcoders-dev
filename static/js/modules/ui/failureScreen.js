/**
 * Failure Screen UI Module
 * Displays the failure screen when code submission fails tests
 */

const FailureScreen = (function () {
    'use strict';

    /**
     * Show failure screen with test results and cognitive analysis
     * @param {Object} data - Test results data
     * @param {string} code - User's submitted code
     * @param {Function} analyzeSolution - Function to analyze the solution
     */
    function show(data, code, analyzeSolution) {
        // Track attempts
        const problemId = window.currentProblemTitle || 'unknown';
        const attemptsKey = `attempts_${problemId}`;
        let attempts = parseInt(localStorage.getItem(attemptsKey) || '0') + 1;
        localStorage.setItem(attemptsKey, attempts);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'success-overlay';
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

        // Analyze code for insights
        const analysis = analyzeSolution(code, data.runtime || '0ms', null);

        // Calculate stats
        const totalTests = data.totalCount || data.results.length;
        const passedTests = data.passedCount || data.results.filter(r => r.passed).length;
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
              <h1 style="margin: 0; font-size: 2rem; color: #ef4444;">Tests Failed</h1>
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

        <!-- Cognitive Insights -->
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
                <div style="color: #ef4444; font-weight: 600; margin-bottom: 5px;">Case ${r.caseNumber || i + 1} ${r.hidden ? '(Hidden)' : ''}</div>
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
          <button onclick="showVisualHint()" style="
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
        </div>
      </div>
    `;

        document.body.appendChild(overlay);

        // Animate in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.children[0].style.transform = 'translateX(0)';
        });
    }

    // Public API
    return {
        show: show
    };
})();

// Make globally accessible
window.showFailureScreen = function (data, code) {
    // Access analyzeSolution from global scope
    if (typeof window.analyzeSolution === 'function') {
        FailureScreen.show(data, code, window.analyzeSolution);
    } else {
        console.error('analyzeSolution function not found');
    }
};
