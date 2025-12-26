import os

html_file = 'dashboard.html'

# CSS to add for test status
css_addition = """
    /* Test Case Status Styles */
    .test-case-tab.test-passed {
      border-color: #22c55e;
      background: rgba(34, 197, 94, 0.1);
    }

    .test-case-tab.test-failed {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
"""

try:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add CSS before closing </style> tag (find the last one before </head>)
    # Look for the closing style tag in the head section
    import re
    
    # Find the last </style> in the head section
    head_end = content.find('</head>')
    if head_end == -1:
        print("ERROR: Could not find </head> tag")
        exit(1)
    
    # Find the last </style> before </head>
    style_end = content.rfind('</style>', 0, head_end)
    if style_end == -1:
        print("ERROR: Could not find </style> tag")
        exit(1)
    
    # Insert CSS before </style>
    content = content[:style_end] + css_addition + "\n  " + content[style_end:]
    
    # Update Submit button to be hidden by default
    content = content.replace(
        '<button id="submit-solution-btn" class="submit-btn">',
        '<button id="submit-solution-btn" class="submit-btn" style="display: none; transition: all 0.3s ease;">'
    )
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully added CSS and updated Submit button")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
