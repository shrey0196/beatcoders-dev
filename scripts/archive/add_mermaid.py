import os

# Add Mermaid.js script to dashboard.html
html_path = 'dashboard.html'

try:
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add Mermaid.js script in the head section
    mermaid_script = '  <script src="static/js/lib/mermaid.min.js"></script>\n  <script>mermaid.initialize({ startOnLoad: true, theme: \'dark\' });</script>'
    
    # Find the closing </head> tag and insert before it
    if '</head>' in content:
        content = content.replace('</head>', mermaid_script + '\n</head>')
        print("Added Mermaid.js script to dashboard.html")
    else:
        print("Could not find </head> tag")

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated dashboard.html")

except Exception as e:
    print(f"Error: {e}")
