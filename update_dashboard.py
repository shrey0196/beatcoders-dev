
import os

file_path = 'dashboard.html'
new_content = """  <!-- Full Screen Editor Overlay -->
  <div id="full-screen-editor">
    <!-- Navbar -->
    <div id="editor-navbar">
      <div style="display: flex; align-items: center; gap: 15px;">
        <button id="close-editor-btn" class="btn-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <div style="display: flex; flex-direction: column;">
          <h3 id="editor-problem-title" style="margin: 0; font-size: 1.1rem; color: var(--text-primary);">Problem Title</h3>
          <div style="display: flex; gap: 10px; align-items: center; margin-top: 2px;">
            <span id="editor-difficulty" class="difficulty-badge difficulty-medium">Medium</span>
            <span id="editor-topic" style="font-size: 0.8rem; color: var(--text-secondary);">Topic</span>
          </div>
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        <button id="run-code-btn" class="submit-btn"
          style="background: var(--bg2); border: 1px solid var(--accent1); color: var(--accent1);">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 5px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z">
            </path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
          </svg>
          Run
        </button>
        <button id="submit-solution-btn" class="submit-btn">
          Submit
        </button>
      </div>
    </div>

    <!-- Main Layout -->
    <div id="editor-main-layout">
      <!-- Left: Problem Description -->
      <div id="problem-pane">
        <div id="editor-problem-description" style="line-height: 1.6; color: var(--text-secondary);">
          <!-- Content injected via JS -->
        </div>
        
        <!-- Feedback Section (moved here) -->
        <div class="feedback-section" id="feedback-section" style="display: none; margin-top: 20px;">
            <h3>Analysis Results</h3>
            <div id="feedback-content"></div>
            
            <!-- Cognitive Analysis Section -->
            <div id="cognitive-analysis-section" style="margin-top: 30px; border-top: 1px solid var(--border-color); padding-top: 20px;">
                <h3>🧠 Cognitive Analysis</h3>
                <div id="cognitive-summary" style="margin-bottom: 20px;">Loading analysis...</div>
                <div style="height: 250px; width: 100%;">
                    <canvas id="cognitive-chart"></canvas>
                </div>
                <!-- Cognitive Insights Panel -->
                <div id="cognitive-insights-panel" class="cognitive-insights-panel" style="margin-top: 30px; display: none;">
                    <!-- Content will be injected here -->
                </div>
            </div>
        </div>
      </div>

      <!-- Right: Code Editor -->
      <div id="coding-pane">
        <!-- Toolbar -->
        <div id="editor-toolbar">
          <select id="language-selector"
            style="background: var(--bg2); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 4px;">
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <div style="flex: 1;"></div>
          <button class="btn-icon" title="Reset Code" id="reset-code-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
          </button>
        </div>

        <!-- Monaco Editor -->
        <div id="monaco-editor-container"></div>

        <!-- Test Cases / Console -->
        <div id="test-case-panel">
          <div class="panel-header">
            Test Cases
          </div>
          <div class="test-case-tabs">
            <div class="test-case-tab active">Case 1</div>
            <div class="test-case-tab">Case 2</div>
            <div class="test-case-tab">Case 3</div>
          </div>
          <div class="test-case-content">
            <div style="margin-bottom: 10px;">
              <span style="color: var(--text-secondary);">Input:</span>
              <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">nums = [2,7,11,15], target = 9</code>
            </div>
            <div>
              <span style="color: var(--text-secondary);">Expected Output:</span>
              <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">[0,1]</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
"""

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_index = -1
    end_index = -1

    for i, line in enumerate(lines):
        if '<!-- Code Editor Modal -->' in line:
            start_index = i
        if '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>' in line:
            end_index = i
            break
    
    if start_index != -1 and end_index != -1:
        # Find the actual end of the modal div before the script tag
        # We want to replace everything from start_index up to end_index (exclusive of script tag)
        # But we need to be careful about the empty lines before script tag
        
        # Look backwards from end_index to find the closing div of the modal
        # The modal ends with 3 closing divs
        
        print(f"Found block from line {start_index+1} to {end_index+1}")
        
        # Replace the range
        new_lines = lines[:start_index] + [new_content + "\n\n"] + lines[end_index:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        
        print("Successfully updated dashboard.html")
    else:
        print("Could not find start or end markers")
        print(f"Start index: {start_index}")
        print(f"End index: {end_index}")

except Exception as e:
    print(f"Error: {e}")
