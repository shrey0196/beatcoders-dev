/**
 * Success Screen UI Module
 * Displays the success screen when code submission passes all tests
 */

const SuccessScreen = (function () {
  'use strict';

  /**
   * Show success screen with test results and cognitive analysis
   * @param {Object} data - Test results data
   * @param {string} code - User's submitted code
   * @param {Function} analyzeSolution - Function to analyze the solution
   */
  function show(data, code, analyzeSolution) {
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

    // Analyze code
    const analysis = analyzeSolution(code, data.runtime || '0ms', null);

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
                  background: rgba(34, 197, 94, 0.2); 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  font-size: 24px;
                  color: #22c55e;
                ">✓</div>
                <div>
                  <h1 style="margin: 0; font-size: 2rem; color: #22c55e;">Success!</h1>
                  <p style="margin: 5px 0 0 0; color: #9ca3af;">Great job! You solved it.</p>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
              <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 5px;">Runtime</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: #e5e7eb;">${data.execution_time_ms ? Math.round(data.execution_time_ms) + 'ms' : (data.runtime || '0ms')}</div>
                <div style="font-size: 0.8rem; color: #22c55e; margin-top: 5px;">Beats 85%</div>
              </div>
              <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 5px;">Quality</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: ${analysis.color || (data.is_optimal ? '#22c55e' : '#f59e0b')};">
                    ${data.feedback_tier ? data.feedback_tier.toUpperCase() : (analysis.tier || 'GOOD')}
                </div>
                <div style="font-size: 0.8rem; color: #9ca3af; margin-top: 5px;">Algorithm Tier</div>
              </div>
            </div>

            <!-- Cognitive Analysis -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #e5e7eb; margin-bottom: 15px;">🧠 Cognitive Analysis</h3>
              <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
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

              <!-- Complexity Analysis -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 5px;">Time Complexity</div>
                  <div style="color: ${data.is_optimal ? '#22c55e' : '#e5e7eb'}; font-size: 1.3rem; font-weight: 600;">${data.timeComplexity || analysis.timeComplexity || 'O(n)'}</div>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 5px;">Space Complexity</div>
                  <div style="color: ${data.is_optimal ? '#22c55e' : '#e5e7eb'}; font-size: 1.3rem; font-weight: 600;">${data.spaceComplexity || analysis.spaceComplexity || 'O(n)'}</div>
                </div>
              </div>
            </div>

            <!-- Points Breakdown -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.2rem;">💎 Points Breakdown</h3>
              <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #9ca3af;">Base Points (All Tests Passed)</span>
                  <span style="color: #e5e7eb; font-weight: 600;">+50</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #9ca3af;">Code Quality Bonus</span>
                  <span style="color: ${data.is_optimal ? '#22c55e' : '#f59e0b'}; font-weight: 600;">+${(data.points || analysis.points || 100) - 50}</span>
                </div>
                <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #e5e7eb; font-weight: 600; font-size: 1.1rem;">Total Points Earned</span>
                  <span style="color: ${data.is_optimal ? '#22c55e' : '#f59e0b'}; font-weight: 700; font-size: 1.3rem;">+${data.points || analysis.points || 100}</span>
                </div>
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
              ">Close</button>
              <button onclick="window.loadNextProblem()" style="
                flex: 1;
                padding: 15px;
                background: #22c55e;
                color: #000;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
              ">Next Problem →</button>
            </div>
          </div>
        `;

    document.body.appendChild(overlay);

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
window.showSuccessScreen = function (data, code) {
  // Access analyzeSolution from global scope
  if (typeof window.analyzeSolution === 'function') {
    SuccessScreen.show(data, code, window.analyzeSolution);
  } else {
    console.error('analyzeSolution function not found');
  }
};
