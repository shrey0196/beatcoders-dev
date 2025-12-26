#!/usr/bin/env python3
"""
Script to add visual polish features back to dashboard.html
"""

def add_visual_polish():
    with open('dashboard.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add neon glow effect for active nav item
    nav_active_css = """
/* Neon glow effect for active nav */
.nav-item.active {
  background: var(--accent1); color: #001428;
  font-weight: 600;
  box-shadow: 0 0 20px rgba(78, 168, 255, 0.5), 0 0 40px rgba(78, 168, 255, 0.3);
}
"""
    
    # 2. Add gradient text utility
    gradient_text_css = """
/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, var(--accent1), var(--accent2), var(--accent3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
"""
    
    # Find .nav-item.active and replace it
    old_nav_active = """.nav-item.active {
  background: var(--accent1); color: #001428;
  font-weight: 600;
}"""
    
    if old_nav_active in content:
        content = content.replace(old_nav_active, nav_active_css.strip())
        print("✅ Added neon glow effect to active nav")
    
    # Add gradient text utility before closing </style>
    style_close = content.rfind('</style>')
    if style_close != -1:
        content = content[:style_close] + '\n' + gradient_text_css + content[style_close:]
        print("✅ Added gradient text utility")
    
    # Write back
    with open('dashboard.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✨ Visual polish features added successfully!")

if __name__ == '__main__':
    add_visual_polish()
