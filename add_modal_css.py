#!/usr/bin/env python3
"""Add modal CSS to dashboard.html to fix the code leaking issue."""

def add_modal_css():
    file_path = 'dashboard.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the closing </style> tag
    style_close_pos = content.find('  </style>')
    
    if style_close_pos == -1:
        print("Could not find </style> tag")
        return
    
    # Modal CSS to insert
    modal_css = '''
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      z-index: 9999;
      display: none;
      justify-content: center;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal-overlay.active {
      display: flex;
      opacity: 1;
      visibility: visible;
    }

    .modal-container {
      background: var(--card);
      border-radius: var(--card-radius);
      max-width: 1200px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .modal-header {
      padding: 20px 30px;
      border-bottom: 1px solid var(--glass);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-close-btn {
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 32px;
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .modal-close-btn:hover {
      background: var(--glass);
    }

    .modal-body {
      padding: 30px;
    }

    .problem-section {
      margin-bottom: 30px;
    }

    .problem-meta {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .editor-section {
      margin-bottom: 20px;
    }

    .submit-btn {
      margin-top: 15px;
      padding: 12px 30px;
      background: linear-gradient(135deg, var(--accent1), var(--accent2));
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(78, 168, 255, 0.3);
    }

    .feedback-section {
      margin-top: 30px;
      padding: 20px;
      background: var(--glass);
      border-radius: 8px;
    }
'''
    
    # Insert the modal CSS before </style>
    new_content = content[:style_close_pos] + modal_css + content[style_close_pos:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Added modal CSS to {file_path}")

if __name__ == '__main__':
    add_modal_css()
