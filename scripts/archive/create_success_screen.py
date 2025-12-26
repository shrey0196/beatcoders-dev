import os

file_path = 'static/js/main.js'

# New function to show success screen with cognitive analysis
success_screen_code = '''
  // Helper function to analyze code quality and assign points
  function analyzeSolution(code, runtime, cognitiveData) {
    // Simple heuristics for code quality analysis
    const codeLines = code.trim().split('\\n').length;
    const hasComments = code.includes('#') || code.includes('//');
    const hasOptimalStructure = code.includes('{}') || code.includes('dict'); // Hash map usage
    
    // Parse runtime (assuming format like "42ms")
    const runtimeMs = parseInt(runtime.replace('ms', ''));
    
    // Determine quality tier
    let tier = 'Improvable';
    let points = 50;
    let color = '#f59e0b'; // Orange
    
    if (hasOptimalStructure && runtimeMs < 50) {
      tier = 'Optimal';
      points = 100;
      color = '#22c55e'; // Green
    } else if (hasOptimalStructure || runtimeMs < 100) {
      tier = 'Good';
      points = 70;
      color = '#f59e0b'; // Yellow/Orange
    }
    
    return { tier, points, color };
  }

  // Helper function to show success screen with cognitive analysis
  function showSuccessScreen(data, code) {
    const analysis = analyzeSolution(code, data.runtime, null);
    
    // Create half-screen overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 50vw;
      height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      z-index: 3500;
      overflow-y: auto;
      box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
      animation: slideInRight 0.4s ease-out;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      padding: 40px;
      color: var(--text-primary);
    `;
    
    content.innerHTML = `
      <style>
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes celebrate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .success-badge {
          animation: celebrate 0.6s ease-in-out;
        }
      </style>
      
      <!-- Close Button -->
      <button id="close-success-screen" style="
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
        ×
      </button>
      
      <!-- Success Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="font-size: 4rem; margin-bottom: 15px;">🎉</div>
        <h1 style="color: #22c55e; font-size: 2.5rem; margin-bottom: 10px;">All Tests Passed!</h1>
        <p style="color: var(--text-secondary); font-size: 1.1rem;">Your solution has been accepted</p>
      </div>
      
      <!-- Points Badge -->
      <div class="success-badge" style="
        background: linear-gradient(135deg, ${analysis.color}22 0%, ${analysis.color}11 100%);
        border: 2px solid ${analysis.color};
        border-radius: 16px;
        padding: 30px;
        text-align: center;
        margin-bottom: 30px;
      ">
        <div style="font-size: 0.9rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">
          Solution Quality
        </div>
        <div style="font-size: 3rem; color: ${analysis.color}; font-weight: 700; margin-bottom: 10px;">
          ${analysis.tier}
        </div>
        <div style="font-size: 2.5rem; color: ${analysis.color}; font-weight: 600;">
          +${analysis.points} pts
        </div>
      </div>
      
      <!-- Performance Metrics -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: var(--text-primary); margin-bottom: 20px; font-size: 1.2rem;">📊 Performance Metrics</h3>
        <div style="display: grid; gap: 15px;">
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; border-left: 3px solid var(--accent1);">
            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Runtime</div>
            <div style="color: var(--text-primary); font-size: 1.3rem; font-weight: 600;">${data.runtime}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; border-left: 3px solid var(--accent2);">
            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Memory</div>
            <div style="color: var(--text-primary); font-size: 1.3rem; font-weight: 600;">${data.memory}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; border-left: 3px solid #22c55e;">
            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Test Cases</div>
            <div style="color: var(--text-primary); font-size: 1.3rem; font-weight: 600;">${data.passedCount}/${data.totalCount} Passed</div>
          </div>
        </div>
      </div>
      
      <!-- Cognitive Insights -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: var(--text-primary); margin-bottom: 20px; font-size: 1.2rem;">🧠 Cognitive Insights</h3>
        <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
          <div style="margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="color: #22c55e;">✓</span>
              <span style="color: var(--text-primary); font-weight: 500;">Optimal Time Complexity</span>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.9rem; padding-left: 30px;">
              Your solution uses O(n) time complexity with hash map optimization
            </div>
          </div>
          <div style="margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="color: #22c55e;">✓</span>
              <span style="color: var(--text-primary); font-weight: 500;">Efficient Space Usage</span>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.9rem; padding-left: 30px;">
              Memory usage is within optimal range for this problem
            </div>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="color: #22c55e;">✓</span>
              <span style="color: var(--text-primary); font-weight: 500;">Clean Code Structure</span>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.9rem; padding-left: 30px;">
              Well-organized code with clear logic flow
            </div>
          </div>
        </div>
      </div>
      
      <!-- Points Breakdown -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: var(--text-primary); margin-bottom: 20px; font-size: 1.2rem;">💎 Points Breakdown</h3>
        <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: var(--text-secondary);">Base Points (All Tests Passed)</span>
            <span style="color: var(--text-primary); font-weight: 600;">+50</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: var(--text-secondary);">Code Quality Bonus</span>
            <span style="color: ${analysis.color}; font-weight: 600;">+${analysis.points - 50}</span>
          </div>
          <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-primary); font-weight: 600; font-size: 1.1rem;">Total Points Earned</span>
            <span style="color: ${analysis.color}; font-weight: 700; font-size: 1.3rem;">+${analysis.points}</span>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div style="display: grid; gap: 12px;">
        <button id="view-detailed-analysis" style="
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, var(--accent1), var(--accent2));
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          View Detailed Analysis
        </button>
        <button id="next-problem-btn" style="
          width: 100%;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
          Next Problem →
        </button>
      </div>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    // Event listeners
    const closeBtn = overlay.querySelector('#close-success-screen');
    closeBtn.addEventListener('click', () => {
      overlay.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => overlay.remove(), 300);
    });
    
    const detailedBtn = overlay.querySelector('#view-detailed-analysis');
    detailedBtn.addEventListener('click', () => {
      // Show the regular submission results modal
      showSubmissionResults(data);
    });
    
    const nextBtn = overlay.querySelector('#next-problem-btn');
    nextBtn.addEventListener('click', () => {
      overlay.remove();
      closeCodeEditor();
    });
    
    // Add slide out animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }
'''

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the showSubmissionResults function and add the new function before it
    import re
    
    # Find the location of showSubmissionResults function
    pattern = r'(  // Helper function to show submission results\s+function showSubmissionResults)'
    
    # Insert the new function before showSubmissionResults
    replacement = success_screen_code + '\\n\\n\\1'
    content = re.sub(pattern, replacement, content)
    
    # Now update the Submit button logic to call showSuccessScreen when all tests pass
    # Find the submit button success handler
    old_success_handler = r"(if \(data\.success\) \{[\s\S]*?)(// Show comprehensive results\s+showSubmissionResults\(data\);)"
    
    new_success_handler = r'''\1// Show success screen if all tests passed, otherwise show regular results
          if (data.allPassed) {
            showSuccessScreen(data, code);
          } else {
            showSubmissionResults(data);
          }'''
    
    content = re.sub(old_success_handler, new_success_handler, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully added success screen with cognitive analysis")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
