"""
Script to safely add cognitive insights panel HTML to dashboard.html
"""
import re

# Read the file
with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

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
                    </div>'''

# Check if already added
if 'id="cognitive-insights-panel"' in content:
    print("! Insights panel already exists")
else:
    # Find the insertion point using regex to handle whitespace
    # We look for the closing div of the cognitive chart container
    # <div style="height: 250px; width: 100%;"> ... <canvas ...> </canvas> ... </div>
    
    pattern = r'(<canvas id="cognitive-chart"></canvas>\s*</div>)'
    match = re.search(pattern, content)
    
    if match:
        insertion_point = match.end()
        content = content[:insertion_point] + insights_panel_html + content[insertion_point:]
        print("✓ Successfully added cognitive insights panel")
    else:
        print("✗ Could not find insertion marker")
        exit(1)

# Update main.js version
# Replace static/js/main.js or static/js/main.js?v=X
content = re.sub(r'static/js/main\.js(\?v=\d+)?', 'static/js/main.js?v=6', content)
print("✓ Updated main.js version to v=6")

# Write the modified content back
with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ dashboard.html updated successfully")
