"""
Script to safely add cognitive insights panel to dashboard.html
This script will insert the panel HTML at the correct location without breaking the file structure.
"""

# Read the file
with open('dashboard.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Define the insights panel HTML
insights_panel_html = '''                    
                    <!-- Cognitive Insights Panel -->
                    <div id="cognitive-insights-panel" class="cognitive-insights-panel" style="margin-top: 30px; display: none;">
                      <!-- Session Summary Card -->
                      <div class="session-summary-card" style="background: var(--hover-bg); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 15px 0; color: var(--text-primary); font-size: 1.1rem;">📊 Session Overview</h4>
                        <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                          <div class="metric">
                            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Duration</div>
                            <div id="session-duration" style="color: var(--text-primary); font-size: 1.5rem; font-weight: 600;">--</div>
                          </div>
                          <div class="metric">
                            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Avg WPM</div>
                            <div id="session-wpm" style="color: var(--text-primary); font-size: 1.5rem; font-weight: 600;">--</div>
                          </div>
                          <div class="metric">
                            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Focus Score</div>
                            <div id="session-focus" style="color: var(--text-primary); font-size: 1.5rem; font-weight: 600;">--</div>
                          </div>
                          <div class="metric">
                            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Keystrokes</div>
                            <div id="session-keystrokes" style="color: var(--text-primary); font-size: 1.5rem; font-weight: 600;">--</div>
                          </div>
                        </div>
                      </div>

                      <!-- Coder Type Badge -->
                      <div id="coder-type-badge" class="coder-type-badge" style="background: linear-gradient(135deg, var(--accent1), var(--accent2)); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center; display: none;">
                        <div style="font-size: 2.5rem; margin-bottom: 10px;" id="coder-badge-icon">🎯</div>
                        <div style="color: white; font-size: 1.3rem; font-weight: 600; margin-bottom: 5px;" id="coder-type-text">Analyzing...</div>
                        <div style="color: rgba(255,255,255,0.8); font-size: 0.9rem;" id="coder-type-description">Determining your coding style...</div>
                      </div>

                      <!-- State Timeline -->
                      <div id="state-timeline-container" class="state-timeline-container" style="background: var(--hover-bg); border-radius: 12px; padding: 20px; margin-bottom: 20px; display: none;">
                        <h4 style="margin: 0 0 15px 0; color: var(--text-primary); font-size: 1.1rem;">🎨 Cognitive State Timeline</h4>
                        <div id="state-timeline" style="height: 60px; background: var(--bg-secondary); border-radius: 8px; position: relative; overflow: hidden;">
                          <!-- Will be populated by JS with colored segments -->
                        </div>
                        <div id="timeline-legend" style="display: flex; gap: 15px; margin-top: 15px; flex-wrap: wrap; font-size: 0.85rem;">
                          <div style="display: flex; align-items: center; gap: 5px;">
                            <div style="width: 16px; height: 16px; background: #22c55e; border-radius: 4px;"></div>
                            <span style="color: var(--text-secondary);">Flow State</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 5px;">
                            <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 4px;"></div>
                            <span style="color: var(--text-secondary);">Normal Coding</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 5px;">
                            <div style="width: 16px; height: 16px; background: #f59e0b; border-radius: 4px;"></div>
                            <span style="color: var(--text-secondary);">Thinking</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 5px;">
                            <div style="width: 16px; height: 16px; background: #ef4444; border-radius: 4px;"></div>
                            <span style="color: var(--text-secondary);">Frustration</span>
                          </div>
                        </div>
                      </div>

                      <!-- Recommendations -->
                      <div id="recommendations-section" class="recommendations-section" style="background: var(--hover-bg); border-radius: 12px; padding: 20px; display: none;">
                        <h4 style="margin: 0 0 15px 0; color: var(--text-primary); font-size: 1.1rem;">💡 Insights & Recommendations</h4>
                        <div id="recommendations-list" style="display: flex; flex-direction: column; gap: 10px;">
                          <!-- Will be populated by JS -->
                        </div>
                      </div>
                    </div>
'''

# Find the insertion point - after the cognitive-chart canvas closing div
insertion_line = None
for i, line in enumerate(lines):
    if '<canvas id="cognitive-chart"></canvas>' in line:
        # Look for the next closing div (should be line i+1)
        if i + 1 < len(lines) and '</div>' in lines[i + 1]:
            insertion_line = i + 2  # Insert after the closing div
            print(f"Found insertion point at line {insertion_line + 1}")
            break

if insertion_line:
    # Insert the insights panel HTML
    lines.insert(insertion_line, insights_panel_html + '\n')
    
    # Write back to file
    with open('dashboard.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("✓ Successfully added cognitive insights panel")
    print(f"✓ Inserted at line {insertion_line + 1}")
else:
    print("✗ Could not find insertion point")
