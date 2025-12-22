/**
 * Problem Hints Module
 * Manages visual hints (Mermaid flowcharts) for coding problems
 */

const ProblemHints = (function () {
  'use strict';

  // Cache for loaded hints
  const hintCache = {};

  /**
   * Fetch hint data from the backend
   * @param {string} problemTitle - The title of the problem
   * @returns {Promise<string|null>} The Mermaid diagram or null
   */
  async function fetchHint(problemTitle) {
    if (hintCache[problemTitle]) {
      return hintCache[problemTitle];
    }

    // 1. Try Local Data First (Synchronous & Fast)
    if (window.FULL_PROBLEM_SET) {
      const problem = window.FULL_PROBLEM_SET.find(p => p.title === problemTitle);
      if (problem && problem.flowchart) {
        console.log(`[ProblemHints] Found local hint for: ${problemTitle}`);
        hintCache[problemTitle] = problem.flowchart;
        return problem.flowchart;
      }
    }

    // 2. Fallback to API
    try {
      const response = await fetch(`http://localhost:8001/api/problems/${encodeURIComponent(problemTitle)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.hints && data.hints.mermaid) {
        hintCache[problemTitle] = data.hints.mermaid;
        return data.hints.mermaid;
      }
    } catch (error) {
      console.warn('[ProblemHints] API hint fetch failed, checking local...', error);
    }
    return null;
  }

  /**
   * Show visual hint modal with Mermaid flowchart
   * @param {string} problemTitle - The title of the current problem
   */
  async function showHint(problemTitle) {
    const hintDiagram = await fetchHint(problemTitle);

    if (!hintDiagram) {
      alert('No hint available for this problem yet!');
      return;
    }

    try {
      // Create hint modal
      const hintModal = document.createElement('div');
      hintModal.id = 'hint-modal';
      hintModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 11000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
      `;

      hintModal.innerHTML = `
        <div style="
          background: #0a0a0a;
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 16px;
          padding: 40px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h2 style="color: #e5e7eb; font-size: 1.8rem; display: flex; align-items: center; gap: 10px;">
              <span>💡</span> Algorithm Hint: ${problemTitle}
            </h2>
            <button onclick="document.getElementById('hint-modal').remove()" style="
              background: none;
              border: none;
              color: #9ca3af;
              font-size: 2rem;
              cursor: pointer;
              line-height: 1;
            ">×</button>
          </div>
          
          <div style="
            background: #1a1a1a;
            padding: 30px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.05);
          ">
            <div class="mermaid">
${hintDiagram}
            </div>
          </div>
          
          <div style="
            margin-top: 20px;
            padding: 15px;
            background: rgba(168, 85, 247, 0.1);
            border-left: 3px solid #a855f7;
            border-radius: 8px;
            color: #e5e7eb;
          ">
            <strong>💡 Tip:</strong> This flowchart shows the optimal approach. Try implementing it step by step!
          </div>
        </div>
      `;

      document.body.appendChild(hintModal);

      // Re-initialize Mermaid for the new diagram
      setTimeout(() => {
        if (window.mermaid) {
          mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        } else {
          console.error('Mermaid not loaded');
          alert('Failed to load hint diagram. Please refresh the page.');
        }
      }, 100);

    } catch (error) {
      console.error('Failed to show hint:', error);
      alert('Failed to display hint. Please try again.');
    }
  }

  // Public API
  return {
    show: showHint
  };
})();

// Make globally accessible for inline onclick handlers
window.showVisualHint = function () {
  const problemTitle = window.currentProblemTitle || 'Two Sum';
  ProblemHints.show(problemTitle);
};
