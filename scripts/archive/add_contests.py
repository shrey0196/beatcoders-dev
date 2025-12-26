#!/usr/bin/env python3
"""
Quick script to add contests view with battle features
"""

contests_view_html = """
  <div id="contests-view" class="hidden">
    <div class="card">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent1);">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        Contests & Battles
      </h3>
      <p style="color: var(--text-secondary); margin-bottom: 20px;">Compete in timed contests or challenge friends to epic 1v1 coding battles!</p>
    </div>

    <!-- 1v1 Rap Battle Coding -->
    <div class="card">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent3);">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        1v1 Rap Battle Coding
      </h3>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">
        Challenge a friend to a real-time coding battle! Pass test cases to deal "damage" to your opponent. 
        First to solve all problems or deal maximum damage wins! 🎤⚔️
      </p>
      
      <!-- Email Invite System -->
      <div style="background: var(--glass); padding: 20px; border-radius: 12px; margin-bottom: 16px;">
        <h4 style="color: var(--text-primary); margin-bottom: 12px; font-size: 1rem;">
          📧 Invite a Friend to Battle
        </h4>
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
          <input 
            type="email" 
            id="invite-email-input" 
            placeholder="friend@example.com" 
            style="flex: 1; padding: 12px; background: var(--bg2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--text-primary); font-size: 14px;"
          >
          <button 
            id="invite-friend-btn" 
            style="padding: 12px 24px; background: linear-gradient(135deg, var(--accent1), var(--accent2)); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; white-space: nowrap;"
          >
            Send Invite
          </button>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">
          💡 Your friend will receive an email with a battle link. They can join even if they don't have an account!
        </p>
      </div>

      <!-- Battle Stats -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        <div style="background: var(--glass); padding: 16px; border-radius: 10px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent1);">0</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">Battles Won</div>
        </div>
        <div style="background: var(--glass); padding: 16px; border-radius: 10px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent2);">0</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">Win Streak</div>
        </div>
        <div style="background: var(--glass); padding: 16px; border-radius: 10px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent3);">0%</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">Win Rate</div>
        </div>
      </div>

      <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 16px; padding: 12px; background: rgba(78, 168, 255, 0.1); border-radius: 8px; border-left: 3px solid var(--accent1);">
        <strong style="color: var(--accent1);">🚀 Coming Soon:</strong> Real-time battles with live leaderboards, damage animations, and victory celebrations!
      </p>
    </div>

    <!-- Upcoming Contests -->
    <div class="card">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent2);">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Upcoming Contests
      </h3>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">
        No scheduled contests at the moment. Check back soon for weekly coding competitions!
      </p>
      <div style="text-align: center; padding: 40px 20px; background: var(--glass); border-radius: 12px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🏆</div>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          Want to host a contest? Contact us to organize a community event!
        </p>
      </div>
    </div>
  </div>

"""

with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the insertion point (after practice-view, before submissions-view)
insertion_point = content.find('  <div id="submissions-view" class="hidden">')

if insertion_point != -1:
    content = content[:insertion_point] + contests_view_html + content[insertion_point:]
    print("✅ Added Contests view with 1v1 Rap Battle and Email Invite features")
else:
    print("❌ Could not find insertion point")
    exit(1)

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✨ Contests page created successfully!")
