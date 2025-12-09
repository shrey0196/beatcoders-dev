#!/usr/bin/env python3
"""
Script to add Code Editor Modal to dashboard.html
"""

def add_modal():
    with open('dashboard.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # CSS for the modal (add before closing </style> tag)
    modal_css = """
    /* Code Editor Modal Styles */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      z-index: 10000;
      align-items: center;
      justify-content: center;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal-container {
      background: var(--card-bg);
      border-radius: 16px;
      width: 90%;
      max-width: 1200px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 1px solid var(--border-color);
    }

    .modal-header {
      padding: 20px 30px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: var(--text-primary);
      font-size: 24px;
    }

    .modal-close-btn {
      background: none;
      border: none;
      font-size: 32px;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .modal-close-btn:hover {
      background: var(--hover-bg);
      color: var(--text-primary);
    }

    .modal-body {
      padding: 30px;
      overflow-y: auto;
      max-height: calc(90vh - 80px);
    }

    .problem-section {
      margin-bottom: 30px;
    }

    .problem-section h3 {
      color: var(--text-primary);
      margin-bottom: 15px;
    }

    .problem-section p {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .problem-meta {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .problem-topic {
      padding: 6px 12px;
      background: var(--hover-bg);
      border-radius: 6px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .editor-section {
      margin-bottom: 30px;
    }

    .editor-section h3 {
      color: var(--text-primary);
      margin-bottom: 15px;
    }

    #code-editor {
      width: 100%;
      min-height: 300px;
      padding: 15px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      font-family: 'Courier New', monospace;
      font-size: 14px;
      resize: vertical;
    }

    .submit-btn {
      margin-top: 15px;
      padding: 12px 30px;
      background: linear-gradient(135deg, var(--accent1), var(--accent2));
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(var(--accent1-rgb), 0.4);
    }

    .feedback-section {
      margin-top: 30px;
      padding: 20px;
      background: var(--hover-bg);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .feedback-section h3 {
      color: var(--text-primary);
      margin-bottom: 15px;
    }

    #feedback-content {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .feedback-item {
      margin-bottom: 15px;
      padding: 15px;
      background: var(--card-bg);
      border-radius: 8px;
      border-left: 4px solid var(--accent1);
    }

    .feedback-item h4 {
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .feedback-item p {
      color: var(--text-secondary);
      margin: 5px 0;
    }
    """
    
    # Find the closing </style> tag and insert CSS before it
    style_close_index = content.rfind('</style>')
    if style_close_index != -1:
        content = content[:style_close_index] + modal_css + '\n  ' + content[style_close_index:]
    
    # Modal HTML (add before closing </body> tag)
    modal_html = """
<!-- Code Editor Modal -->
<div id="code-editor-modal" class="modal-overlay">
  <div class="modal-container">
    <div class="modal-header">
      <h2 id="modal-problem-title">Problem Title</h2>
      <button class="modal-close-btn" id="close-modal-btn">&times;</button>
    </div>
    <div class="modal-body">
      <div class="problem-section">
        <h3>Problem Description</h3>
        <p id="modal-problem-description"></p>
        <div class="problem-meta">
          <span class="difficulty-tag" id="modal-problem-difficulty"></span>
          <span class="problem-topic" id="modal-problem-topic"></span>
        </div>
      </div>
      <div class="editor-section">
        <h3>Your Solution</h3>
        <textarea id="code-editor" placeholder="Write your code here..."></textarea>
        <button class="submit-btn" id="submit-code-btn">Submit Solution</button>
      </div>
      <div class="feedback-section" id="feedback-section" style="display: none;">
        <h3>Analysis Results</h3>
        <div id="feedback-content"></div>
      </div>
    </div>
  </div>
</div>

<script src="static/js/main.js"></script>
"""
    
    # Find the closing </body> tag and insert modal HTML before it
    body_close_index = content.rfind('</body>')
    if body_close_index != -1:
        content = content[:body_close_index] + modal_html + content[body_close_index:]
    
    # Write the updated content
    with open('dashboard.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully added Code Editor Modal to dashboard.html")

if __name__ == '__main__':
    add_modal()
