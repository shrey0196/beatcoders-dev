"""
Integration script for Phase 4 features
Adds Phase 4 CSS and JavaScript to dashboard.html
"""

import re

def integrate_phase4():
    # Read dashboard.html
    with open('dashboard.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already integrated
    if 'phase4.css' in content:
        print("Phase 4 already integrated!")
        return
    
    # Find the head section and add CSS link
    css_link = '  <link rel="stylesheet" href="static/css/phase4.css">\n'
    
    # Add CSS after existing style.css link
    content = content.replace(
        '<link rel="stylesheet" href="static/css/style.css?v=4">',
        '<link rel="stylesheet" href="static/css/style.css?v=4">\n' + css_link
    )
    
    # Find Chart.js script tag (if exists) or add it
    if 'chart.js' not in content.lower():
        chartjs_script = '  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>\n'
        # Add before closing </head>
        content = content.replace('</head>', chartjs_script + '</head>')
    
    # Add Phase 4 JavaScript before closing </body>
    phase4_script = '  <script src="static/js/phase4.js"></script>\n'
    content = content.replace('</body>', phase4_script + '</body>')
    
    # Write back
    with open('dashboard.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Phase 4 integration complete!")
    print("Added:")
    print("  - static/css/phase4.css")
    print("  - Chart.js library")
    print("  - static/js/phase4.js")

if __name__ == '__main__':
    integrate_phase4()
