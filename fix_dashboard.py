#!/usr/bin/env python3
"""
Script to fix the corrupted dashboard.html by removing duplicate code blocks
"""

def fix_dashboard():
    with open('dashboard.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find where the corruption starts (around line 2530)
    # We need to find the first occurrence of the broken initSettingsView
    corruption_start = None
    for i, line in enumerate(lines):
        if i > 2520 and 'if (viewId) showMainView(viewId)' in line:
            corruption_start = i
            break
    
    if corruption_start is None:
        print("Could not find corruption point")
        return
    
    print(f"Found corruption starting at line {corruption_start + 1}")
    
    # Keep everything up to the corruption point
    fixed_lines = lines[:corruption_start]
    
    # Add the correct ending
    correct_ending = """              userSettings.location = locationInput.value.trim();
              userSettings.github = githubInput.value.trim();
              userSettings.linkedin = linkedinInput.value.trim();
              saveUserSettings();
              updateHeaderUI();
              showToast();
            });
            settingsViewInitialized = true;
          }

          function showToast() {
            const toast = document.getElementById('toast-notification');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
          }

          function runDashboardAnimations() {
            document.querySelectorAll('.stats-grid .card, .main-column .card, .side-column .card').forEach((el, index) => {
              el.classList.add('anim-hidden', 'animate-in');
              el.style.animationDelay = `${100 + index * 100}ms`;
            });
          }

          // --- INITIALIZATION ---
          function initializeDashboard() {
            const storedTheme = localStorage.getItem('theme') || 'dark';
            applyTheme(storedTheme);

            loadUserSettings();
            updateHeaderUI();

            if (waveCanvas) resizeCanvas();
            animationLoop();
            runDashboardAnimations();
          }

          initializeDashboard();
        });
      </script>
      <script src="static/js/main.js"></script>
</body>

</html>
"""
    
    fixed_lines.append(correct_ending)
    
    # Write the fixed file
    with open('dashboard.html', 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)
    
    print(f"Fixed dashboard.html - removed {len(lines) - len(fixed_lines)} duplicate lines")
    print(f"New file has {len(fixed_lines)} lines")

if __name__ == '__main__':
    fix_dashboard()
