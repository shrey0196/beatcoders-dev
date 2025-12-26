#!/usr/bin/env python3
"""
Script to add Online Users section to Battle Mode
"""

online_users_section = """
      <!-- Battle with Online Users -->
      <div style="background: var(--glass); padding: 20px; border-radius: 12px; margin-top: 16px;">
        <h4 style="color: var(--text-primary); margin-bottom: 12px; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite;"></span>
          Online Users Ready to Battle
        </h4>
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 16px;">
          Challenge someone who's online right now for an instant battle!
        </p>
        
        <div id="online-users-list" style="display: flex; flex-direction: column; gap: 10px; max-height: 300px; overflow-y: auto;">
          <!-- Online users will be dynamically populated -->
          <div class="online-user-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent1), var(--accent2)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;">
                A
              </div>
              <div>
                <div style="color: var(--text-primary); font-weight: 600;">AlexCode</div>
                <div style="color: var(--text-secondary); font-size: 0.8rem;">Rating: 1450 • Win Rate: 65%</div>
              </div>
            </div>
            <button class="challenge-btn" data-user="AlexCode" style="padding: 8px 16px; background: linear-gradient(135deg, var(--accent1), var(--accent2)); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 0.9rem;">
              Challenge
            </button>
          </div>

          <div class="online-user-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent2), var(--accent3)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;">
                B
              </div>
              <div>
                <div style="color: var(--text-primary); font-weight: 600;">BitMaster</div>
                <div style="color: var(--text-secondary); font-size: 0.8rem;">Rating: 1520 • Win Rate: 72%</div>
              </div>
            </div>
            <button class="challenge-btn" data-user="BitMaster" style="padding: 8px 16px; background: linear-gradient(135deg, var(--accent1), var(--accent2)); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 0.9rem;">
              Challenge
            </button>
          </div>

          <div class="online-user-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent3), var(--accent1)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;">
                S
              </div>
              <div>
                <div style="color: var(--text-primary); font-weight: 600;">SyntaxSavvy</div>
                <div style="color: var(--text-secondary); font-size: 0.8rem;">Rating: 1380 • Win Rate: 58%</div>
              </div>
            </div>
            <button class="challenge-btn" data-user="SyntaxSavvy" style="padding: 8px 16px; background: linear-gradient(135deg, var(--accent1), var(--accent2)); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 0.9rem;">
              Challenge
            </button>
          </div>
        </div>

        <p style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 12px; text-align: center; opacity: 0.7;">
          🔄 List updates automatically • <span style="color: var(--accent1);">3 users online</span>
        </p>
      </div>
"""

# Add pulse animation for online indicator
pulse_animation = """
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
"""

with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the Email Invite System section and add Online Users after it
insertion_point = content.find('      <!-- Battle Stats -->')

if insertion_point != -1:
    content = content[:insertion_point] + online_users_section + '\n' + content[insertion_point:]
    print("✅ Added Online Users section to Battle Mode")
else:
    print("❌ Could not find insertion point")
    exit(1)

# Add pulse animation to CSS
style_close = content.rfind('</style>')
if style_close != -1:
    content = content[:style_close] + pulse_animation + '\n  ' + content[style_close:]
    print("✅ Added pulse animation for online indicator")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✨ Online Users feature added successfully!")
print("Users can now:")
print("  • See who's online and ready to battle")
print("  • View opponent ratings and win rates")
print("  • Challenge online users instantly")
