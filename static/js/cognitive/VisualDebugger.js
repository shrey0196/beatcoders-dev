/**
 * VisualDebugger - Generates visual diagrams from code
 * Uses Mermaid.js to render flowcharts and variable analysis
 */

class VisualDebugger {
  constructor() {
    this.isInitialized = false;
    this.currentDiagram = null;
  }

  /**
   * Initialize the Visual Debugger
   */
  async init() {
    console.log('[VisualDebugger] Initializing...');

    // Wait for Mermaid to be available (retry up to 5 times)
    let retries = 0;
    while (typeof mermaid === 'undefined' && retries < 5) {
      console.log('[VisualDebugger] Waiting for Mermaid.js...');
      await new Promise(r => setTimeout(r, 500));
      retries++;
    }

    if (typeof mermaid === 'undefined') {
      console.error('[VisualDebugger] Mermaid.js failed to load!');
      // Don't return, allow UI to be created anyway so we can show error there
    } else {
      // Configure Mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        }
      });
      this.isInitialized = true;
    }

    this.createDebuggerUI();
    console.log('[VisualDebugger] Ready (Initialized:', this.isInitialized, ')');
  }

  /**
   * Create the Visual Debugger UI panel
   */
  createDebuggerUI() {
    // Force recreation: Remove if exists
    const existing = document.getElementById('visual-debugger-section');
    if (existing) {
      existing.remove();
    }

    const editorModal = document.getElementById('code-editor-modal');
    if (!editorModal) {
      console.warn('[VisualDebugger] code-editor-modal not found yet');
      return;
    }

    const modalBody = editorModal.querySelector('.modal-body');
    if (!modalBody) {
      console.warn('[VisualDebugger] modal-body not found');
      return;
    }

    // Create debugger section
    const debuggerSection = document.createElement('div');
    debuggerSection.id = 'visual-debugger-section';
    debuggerSection.style.cssText = `
      margin-top: 20px;
      padding: 20px;
      background: var(--card);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
    `;

    debuggerSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <div>
            <h3 style="margin: 0; color: var(--text-primary);">📊 Visual Debugger</h3>
            <div id="debugger-status" style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                Status: <span id="mermaid-status">Checking...</span>
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button id="debug-test-btn" class="submit-btn" style="padding: 8px 16px; font-size: 14px; background: #555;">
              Test Click
            </button>
            <button id="generate-diagram-btn" class="submit-btn" style="padding: 8px 16px; font-size: 14px;">
              Generate Flowchart
            </button>
        </div>
      </div>
      
      <div id="diagram-container" style="
        background: white;
        padding: 20px;
        border-radius: 8px;
        min-height: 200px;
        display: none;
        overflow-x: auto;
      ">
        <div id="mermaid-diagram"></div>
      </div>
      
      <!-- ... (rest of HTML) ... -->
    `;

    // Restore the rest of the HTML structure (loading, error, variables, complexity)
    debuggerSection.innerHTML += `
      <div id="diagram-loading" style="text-align: center; padding: 40px; color: var(--text-secondary); display: none;">
        <div style="font-size: 24px; margin-bottom: 10px;">⚙️</div>
        <div>Analyzing code structure...</div>
      </div>

      <div id="diagram-error" style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--red); border-radius: 8px; padding: 15px; color: var(--text-primary); display: none;">
        <strong>Error:</strong> <span id="diagram-error-message"></span>
      </div>

      <div id="variables-section" style="margin-top: 20px; display: none;">
        <h4 style="color: var(--text-primary); margin-bottom: 10px;">📝 Variables</h4>
        <div id="variables-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;"></div>
      </div>

      <div id="complexity-section" style="margin-top: 15px; padding: 12px; background: var(--hover-bg); border-radius: 8px; display: none;">
        <strong style="color: var(--text-primary);">Complexity Score:</strong>
        <span id="complexity-score" style="color: var(--accent1); font-size: 1.2rem; margin-left: 10px;"></span>
        <span id="complexity-label" style="color: var(--text-secondary); margin-left: 10px;"></span>
      </div>
    `;

    modalBody.appendChild(debuggerSection);

    // Update status
    const statusEl = document.getElementById('mermaid-status');
    if (statusEl) {
      statusEl.textContent = typeof mermaid !== 'undefined' ? 'Ready' : 'Loading Library...';
      statusEl.style.color = typeof mermaid !== 'undefined' ? '#4ade80' : '#facc15';
    }

    console.log('[VisualDebugger] UI created, binding events...');

    // Bind events
    const generateBtn = document.getElementById('generate-diagram-btn');
    if (generateBtn) {
      generateBtn.onclick = async () => {
        try {
          alert('Button Clicked! Starting generation...');
          console.log('[VisualDebugger] Generate button clicked');
          await this.generateDiagram();
        } catch (e) {
          alert('Error in click handler: ' + e.message);
          console.error(e);
        }
      };
      console.log('[VisualDebugger] Generate button bound');
    } else {
      console.error('[VisualDebugger] Generate button not found!');
    }

    const testBtn = document.getElementById('debug-test-btn');
    if (testBtn) {
      testBtn.onclick = () => alert('Test Click working! Mermaid Status: ' + (typeof mermaid));
    }
  }

  /**
   * Show the Visual Debugger panel
   */
  show() {
    const section = document.getElementById('visual-debugger-section');
    if (section) {
      section.style.display = 'block';
    }
  }

  /**
   * Hide the Visual Debugger panel
   */
  hide() {
    const section = document.getElementById('visual-debugger-section');
    if (section) {
      section.style.display = 'none';
    }
  }

  /**
   * Generate flowchart from current code
   */
  async generateDiagram() {
    console.log('[VisualDebugger] Generating diagram...');

    if (!this.isInitialized) {
      console.log('[VisualDebugger] Not initialized, attempting lazy init...');
      await this.init();
      if (!this.isInitialized) {
        alert('Visual Debugger failed to initialize. Mermaid.js is not available.');
        return;
      }
    }

    // Get code from Monaco editor
    const code = window.editorInstance ? window.editorInstance.getValue() : '';
    console.log('[VisualDebugger] Code length:', code.length);

    if (!code.trim()) {
      alert('No code found in editor!');
      this.showError('No code to analyze. Please write some code first.');
      return;
    }

    // Show loading
    this.showLoading();

    try {
      // Call backend API
      const response = await fetch('http://localhost:8001/api/visualization/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: 'python'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }

      const result = await response.json();

      if (!result.success) {
        this.showError(result.error || 'Analysis failed');
        return;
      }

      // Render diagram
      await this.renderDiagram(result.mermaid_diagram);

      // Show variables
      this.displayVariables(result.variables);

      // Show complexity
      this.displayComplexity(result.complexity);

    } catch (error) {
      console.error('[VisualDebugger] Error:', error);
      this.showError('Failed to generate diagram. Make sure the backend server is running.');
    }
  }

  /**
   * Render Mermaid diagram
   */
  async renderDiagram(mermaidCode) {
    const container = document.getElementById('diagram-container');
    const diagramDiv = document.getElementById('mermaid-diagram');
    const loading = document.getElementById('diagram-loading');
    const errorDiv = document.getElementById('diagram-error');

    if (!container || !diagramDiv) return;

    try {
      // Hide loading, show container
      loading.style.display = 'none';
      errorDiv.style.display = 'none';
      container.style.display = 'block';

      // Clear previous diagram
      diagramDiv.innerHTML = mermaidCode;
      diagramDiv.removeAttribute('data-processed');

      // Render with Mermaid
      await mermaid.run({
        nodes: [diagramDiv]
      });

      this.currentDiagram = mermaidCode;

    } catch (error) {
      console.error('[VisualDebugger] Render error:', error);
      this.showError('Failed to render diagram');
    }
  }

  /**
   * Display variables list
   */
  displayVariables(variables) {
    const section = document.getElementById('variables-section');
    const list = document.getElementById('variables-list');

    if (!section || !list || !variables || variables.length === 0) {
      if (section) section.style.display = 'none';
      return;
    }

    section.style.display = 'block';

    list.innerHTML = variables.map(v => `
      < div style = "
    background: var(--hover - bg);
    padding: 10px;
    border - radius: 6px;
    border - left: 3px solid var(--accent1);
    ">
      < div style = "font-weight: 600; color: var(--text-primary);" > ${v.name}</div >
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          ${v.type} • ${v.scope}
        </div>
      </div >
      `).join('');
  }

  /**
   * Display complexity score
   */
  displayComplexity(complexity) {
    const section = document.getElementById('complexity-section');
    const scoreEl = document.getElementById('complexity-score');
    const labelEl = document.getElementById('complexity-label');

    if (!section || !scoreEl || !labelEl) return;

    section.style.display = 'block';
    scoreEl.textContent = complexity;

    // Label based on complexity
    let label = '';
    let color = '';
    if (complexity <= 5) {
      label = '(Simple)';
      color = 'var(--green)';
    } else if (complexity <= 10) {
      label = '(Moderate)';
      color = 'var(--yellow)';
    } else {
      label = '(Complex)';
      color = 'var(--red)';
    }

    labelEl.textContent = label;
    scoreEl.style.color = color;
  }

  /**
   * Show loading state
   */
  showLoading() {
    const container = document.getElementById('diagram-container');
    const loading = document.getElementById('diagram-loading');
    const errorDiv = document.getElementById('diagram-error');

    if (container) container.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';
    if (loading) loading.style.display = 'block';
  }

  /**
   * Show error message
   */
  showError(message) {
    const container = document.getElementById('diagram-container');
    const loading = document.getElementById('diagram-loading');
    const errorDiv = document.getElementById('diagram-error');
    const errorMsg = document.getElementById('diagram-error-message');

    if (container) container.style.display = 'none';
    if (loading) loading.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'block';
    if (errorMsg) errorMsg.textContent = message;
  }
}

// Export for use in other modules
window.VisualDebugger = VisualDebugger;
