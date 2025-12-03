import os
import re

file_path = 'static/js/main.js'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace CSS variable references with explicit dark mode colors
    replacements = {
        'var(--text-primary)': '#e5e7eb',
        'var(--text-secondary)': '#9ca3af',
        'var(--text-strong)': '#f9fafb',
        'var(--bg1)': '#0a0a0a',
        'var(--bg2)': '#1a1a1a',
        'var(--bg-secondary)': '#1a1a1a',
        'var(--hover-bg)': '#2a2a2a',
        'var(--accent1)': '#4ea8ff',
        'var(--accent2)': '#a855f7',
    }
    
    # Find the showSuccessScreen function and replace all CSS variables
    # Pattern to find the function
    success_screen_start = content.find('function showSuccessScreen(data, code) {')
    if success_screen_start == -1:
        print("Could not find showSuccessScreen function")
        exit(1)
    
    # Find the end of the function (next function definition)
    success_screen_end = content.find('\n  // Helper function to show detailed cognitive analysis', success_screen_start)
    if success_screen_end == -1:
        success_screen_end = content.find('\n  function ', success_screen_start + 100)
    
    success_screen_section = content[success_screen_start:success_screen_end]
    
    # Replace all CSS variables in this section
    for var, color in replacements.items():
        success_screen_section = success_screen_section.replace(var, color)
    
    # Replace in main content
    content = content[:success_screen_start] + success_screen_section + content[success_screen_end:]
    
    # Now do the same for showDetailedCognitiveAnalysis
    detailed_start = content.find('async function showDetailedCognitiveAnalysis(data, code) {')
    if detailed_start == -1:
        print("Could not find showDetailedCognitiveAnalysis function")
    else:
        detailed_end = content.find('\n  // Helper to render cognitive flow chart', detailed_start)
        if detailed_end == -1:
            detailed_end = content.find('\n  function ', detailed_start + 100)
        
        detailed_section = content[detailed_start:detailed_end]
        
        # Replace all CSS variables in this section
        for var, color in replacements.items():
            detailed_section = detailed_section.replace(var, color)
        
        # Replace in main content
        content = content[:detailed_start] + detailed_section + content[detailed_end:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully enforced dark mode on success and analysis screens")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
