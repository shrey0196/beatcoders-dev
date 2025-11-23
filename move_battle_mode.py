#!/usr/bin/env python3
"""
Script to move Battle Mode to Contests view and create contests-view if needed
"""

def move_battle_mode_to_contests():
    with open('dashboard.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # First, remove Battle Mode from dashboard
    battle_mode_start = content.find('<div class="card">\n          <h3>\n            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent3);">\n              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>\n              <line x1="3" y1="6" x2="21" y2="6"></line>\n              <path d="M16 10a4 4 0 0 1-8 0"></path>\n            </svg>\n            Battle Mode\n          </h3>')
    
    if battle_mode_start != -1:
        # Find the end of this card
        battle_mode_end = content.find('</div>\n', battle_mode_start)
        # Find the actual end (need to count divs)
        temp_pos = battle_mode_start
        div_count = 1
        while div_count > 0 and temp_pos < len(content):
            temp_pos = content.find('<div', temp_pos + 1)
            close_pos = content.find('</div>', temp_pos if temp_pos != -1 else battle_mode_end)
            if close_pos < temp_pos or temp_pos == -1:
                div_count -= 1
                temp_pos = close_pos + 6
            else:
                div_count += 1
        
        # Simpler approach - just find the card with Battle Mode
        battle_card = '''        <div class="card">
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
'''
        
        # Remove from current location
        content = content.replace(battle_card, '')
        print("✅ Removed Battle Mode from dashboard")
    
    # Now create or find contests-view and add Battle Mode there
    # Find where to insert contests-view (after practice-view)
    practice_view_end = content.find('</div>\n\n  <div id="submissions-view"')
    
    if practice_view_end != -1:
        contests_view = '''

  <div id="contests-view" class="hidden">
    <div class="card">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent1);">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        Contests & Battles
      </h3>
      <p style="color: var(--text-secondary); margin-bottom: 20px;">Compete in timed contests or challenge friends to 1v1 battles.</p>
    </div>

''' + battle_card + '''
    <div class="card">
      <h3>Upcoming Contests</h3>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">No upcoming contests at the moment. Check back soon!</p>
    </div>
  </div>
'''
        
        content = content[:practice_view_end] + contests_view + content[practice_view_end:]
        print("✅ Created Contests view with Battle Mode")
    
    # Write back
    with open('dashboard.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✨ Battle Mode successfully moved to Contests view!")

if __name__ == '__main__':
    move_battle_mode_to_contests()
