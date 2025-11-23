#!/usr/bin/env python3
"""
Script to add Battle Mode / Invite Friend card to dashboard
"""

def add_battle_mode_card():
    with open('dashboard.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the closing of the main-column div in dashboard-view
    # We'll add the Battle Mode card before the closing of main-column
    
    battle_mode_card = """
        <div class="card">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent3);">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Battle Mode
          </h3>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">Challenge a friend to a 1v1 coding battle!</p>
          <div style="display: flex; gap: 12px; align-items: center;">
            <input type="email" id="invite-email-input" placeholder="Friend's email" style="flex: 1; padding: 10px; background: var(--glass); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; color: var(--text-primary);">
            <button id="invite-friend-btn" style="padding: 10px 20px; background: linear-gradient(135deg, var(--accent1), var(--accent2)); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.2s ease;">
              Invite Friend
            </button>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 12px; opacity: 0.7;">Coming soon: Real-time coding battles with friends!</p>
        </div>
"""
    
    # Find the Problem of the Day card and add Battle Mode after it
    problem_card_end = content.find('</div>\n      </div>\n      <div class="side-column">')
    
    if problem_card_end != -1:
        # Insert before the side-column
        content = content[:problem_card_end] + battle_mode_card + content[problem_card_end:]
        print("✅ Added Battle Mode card with Invite Friend feature")
    else:
        print("❌ Could not find insertion point")
        return
    
    # Write back
    with open('dashboard.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✨ Battle Mode feature added successfully!")

if __name__ == '__main__':
    add_battle_mode_card()
