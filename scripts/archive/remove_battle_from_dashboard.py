#!/usr/bin/env python3
"""
Script to remove Battle Mode card from main dashboard
"""

with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove the Battle Mode card
battle_mode_start = content.find('        <div class="card">\n          <h3>\n            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent3);">\n              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>\n              <line x1="3" y1="6" x2="21" y2="6"></line>\n              <path d="M16 10a4 4 0 0 1-8 0"></path>\n            </svg>\n            Battle Mode')

if battle_mode_start != -1:
    # Find the end of this card (find the closing </div> after "Coming soon")
    battle_mode_end = content.find('</div>\n</div>\n      </div>\n      <div class="side-column">', battle_mode_start)
    
    if battle_mode_end != -1:
        # Remove the entire Battle Mode card
        content = content[:battle_mode_start] + content[battle_mode_end + 7:]  # +7 to skip the first </div>
        print("✅ Removed Battle Mode card from main dashboard")
    else:
        print("❌ Could not find end of Battle Mode card")
        exit(1)
else:
    print("ℹ️  Battle Mode card not found in dashboard (may already be removed)")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✨ Dashboard cleaned up successfully!")
print("Battle Mode is now only in the Contests page where it belongs.")
