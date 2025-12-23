
// profile.js - User Profile & Friend Logic
import { userSettings } from './auth.js';
import { showToast } from './ui.js';

// --- Helpers ---
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
}

// --- HTML Generators ---
function createPublicProfileModal() {
    if (document.getElementById('public-profile-modal')) return;

    const modalHTML = `
      <div id="public-profile-modal" class="modal-overlay" style="z-index: 2000;">
        <div class="modal-container" style="max-width: 400px; text-align: center; position: relative; overflow: hidden; background: var(--bg1); border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 120px; background: linear-gradient(135deg, var(--accent1), var(--accent2)); opacity: 0.2;"></div>
            
            <button class="close-btn" onclick="document.getElementById('public-profile-modal').classList.remove('active')" 
                style="position: absolute; top: 15px; right: 15px; z-index: 10; background: rgba(0,0,0,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: background 0.2s ease;">
                &times;
            </button>
            
            <div style="margin-top: 40px; position: relative;">
                <div id="public-profile-avatar" style="width: 100px; height: 100px; border-radius: 50%; background: var(--bg2); border: 4px solid var(--bg1); box-shadow: 0 5px 15px rgba(0,0,0,0.3); margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 800; color: var(--text-primary);">
                    ?
                </div>
            </div>

            <h2 id="public-profile-username" style="margin-top: 15px; font-size: 1.8rem; color: var(--text-primary);">Loading...</h2>
            <p id="public-profile-joined" style="color: var(--text-secondary); font-size: 0.9rem;">Joined: ...</p>

            <div style="display: flex; justify-content: center; gap: 30px; margin: 25px 0;">
                <div>
                    <div id="public-profile-elo" style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">1200</div>
                    <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary);">Elo Rating</div>
                </div>
                <div>
                    <div id="public-profile-views" style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">0</div>
                    <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary);">Profile Views</div>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; padding: 0 20px;">
                <button id="add-friend-btn" class="solve-btn" style="padding: 10px 20px; font-size: 0.9rem; flex: 1;">Add Friend</button>
            </div>
            <p id="friend-status-msg" style="font-size: 0.9rem; min-height: 20px; display: none;"></p>

        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

export async function openUserProfile(username) {
    createPublicProfileModal();
    const modal = document.getElementById('public-profile-modal');
    const avatarEl = document.getElementById('public-profile-avatar');
    const usernameEl = document.getElementById('public-profile-username');
    const joinedEl = document.getElementById('public-profile-joined');
    const eloEl = document.getElementById('public-profile-elo');
    const viewsEl = document.getElementById('public-profile-views');
    const addFriendBtn = document.getElementById('add-friend-btn');
    const statusMsg = document.getElementById('friend-status-msg');

    addFriendBtn.style.display = 'inline-block';
    addFriendBtn.disabled = false;
    addFriendBtn.textContent = 'Add Friend';
    addFriendBtn.onclick = null;
    statusMsg.style.display = 'none';

    modal.classList.add('active');
    usernameEl.innerHTML = '<span style="color: var(--text-primary)">Loading...</span>';

    const myID = userSettings.userID || 'guest';

    try {
        const res = await fetch(`/api/profile/${username}?current_user_id=${myID}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();

        usernameEl.style.color = 'var(--text-primary)';
        usernameEl.style.setProperty('color', 'var(--text-primary)', 'important');
        usernameEl.textContent = data.username;
        avatarEl.textContent = data.username.charAt(0).toUpperCase();

        const joinedDate = new Date(data.created_at).toLocaleDateString();
        joinedEl.style.color = 'var(--text-primary)';
        joinedEl.style.setProperty('color', 'var(--text-primary)', 'important');
        joinedEl.textContent = `Joined: ${joinedDate}`;
        eloEl.textContent = data.elo_rating;
        viewsEl.textContent = data.stats.profile_views;

        if (data.username === userSettings.name) {
            addFriendBtn.style.display = 'none';
        } else if (data.is_friend) {
            setupChallengeButton(addFriendBtn, data.username);
        } else if (data.friend_request_sent) {
            addFriendBtn.textContent = 'Request Sent';
            addFriendBtn.disabled = true;
        } else if (data.friend_request_received) {
            addFriendBtn.textContent = 'Accept Request';
            addFriendBtn.onclick = () => acceptFriendRequest(data.username, addFriendBtn, statusMsg);
        } else {
            addFriendBtn.onclick = () => sendFriendRequest(data.username, addFriendBtn, statusMsg);
        }

    } catch (e) {
        console.error(e);
        usernameEl.textContent = 'Error';
    }
}

function setupChallengeButton(btn, username) {
    btn.disabled = false;
    btn.textContent = 'Challenge ⚔️';
    btn.style.setProperty('pointer-events', 'auto', 'important');
    btn.style.setProperty('cursor', 'pointer', 'important');
    btn.style.setProperty('background', 'rgba(34, 197, 94, 0.2)', 'important');
    btn.style.setProperty('color', '#4ade80', 'important');
    btn.style.setProperty('border', '1px solid #22c55e', 'important');
    btn.style.setProperty('opacity', '1', 'important');

    btn.onclick = () => {
        if (typeof window.sendChallenge === 'function') {
            window.sendChallenge(username);
        } else {
            showToast("Please open the 'Battle' tab first to connect to the lobby!");
        }
    };
}

async function sendFriendRequest(targetUsername, btn, msgEl) {
    const myID = userSettings.userID;
    try {
        btn.disabled = true;
        btn.textContent = 'Sending...';
        const req = await fetch(`/api/friends/request/${targetUsername}?current_user_id=${myID}`, { method: 'POST' });
        if (req.ok) {
            btn.textContent = 'Request Sent';
            msgEl.textContent = 'Friend request sent!';
            msgEl.style.display = 'block';
            msgEl.style.color = 'var(--accent-success)';
        } else {
            const err = await req.json();
            btn.textContent = 'Add Friend';
            btn.disabled = false;
            msgEl.textContent = err.detail || 'Failed';
            msgEl.style.display = 'block';
            msgEl.style.color = 'var(--accent-danger)';
        }
    } catch (e) {
        console.error(e);
        btn.disabled = false;
        btn.textContent = 'Error';
    }
}

// Global exposure
window.openUserProfile = openUserProfile;

// --- Leaderboard & Friend Request Logic ---
export async function generateLeaderboard() {
    const leaderboardPodium = document.getElementById('leaderboard-podium');
    const leaderboardList = document.getElementById('leaderboard-list');
    if (!leaderboardPodium || !leaderboardList) return;

    // Inject Toggle if missing
    if (!document.getElementById('leaderboard-toggle-container')) {
        const toggleHTML = `
      <div id="leaderboard-toggle-container" style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
          <div style="background: var(--glass); padding: 4px; border-radius: 8px; display: flex; gap: 4px;">
              <button id="lb-toggle-global" class="btn-sm active" style="padding: 4px 12px; border-radius: 6px; border: none; background: var(--accent1); color: white; cursor: pointer; font-size: 0.8rem;">Global</button>
              <button id="lb-toggle-friends" class="btn-sm" style="padding: 4px 12px; border-radius: 6px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 0.8rem;">Friends</button>
          </div>
      </div>
      `;
        leaderboardPodium.insertAdjacentHTML('beforebegin', toggleHTML);

        document.getElementById('lb-toggle-global').addEventListener('click', () => {
            window.leaderboardFilter = 'global';
            updateToggleUI();
            generateLeaderboard();
        });
        document.getElementById('lb-toggle-friends').addEventListener('click', () => {
            window.leaderboardFilter = 'friends';
            updateToggleUI();
            generateLeaderboard();
        });
    }

    function updateToggleUI() {
        const globalBtn = document.getElementById('lb-toggle-global');
        const friendsBtn = document.getElementById('lb-toggle-friends');
        if (window.leaderboardFilter === 'friends') {
            friendsBtn.style.background = 'var(--accent1)';
            friendsBtn.style.color = 'white';
            globalBtn.style.background = 'transparent';
            globalBtn.style.color = 'var(--text-secondary)';
        } else {
            globalBtn.style.background = 'var(--accent1)';
            globalBtn.style.color = 'white';
            friendsBtn.style.background = 'transparent';
            friendsBtn.style.color = 'var(--text-secondary)';
        }
    }

    // Handle Friend Requests
    const myID = userSettings.userID || 'guest';
    if (window.leaderboardFilter === 'friends' || true) {
        // Always check for friend requests when loading leaderboard for better UX
        checkFriendRequests(myID);
    }

    const currentFilter = window.leaderboardFilter || 'global';
    leaderboardList.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-secondary);">Loading...</div>';

    let users = [];
    try {
        if (currentFilter === 'friends') {
            // Correct Endpoint: /api/friends?current_user_id=...
            const res = await fetch(`/api/friends?current_user_id=${myID}`);
            if (res.ok) {
                const friendsList = await res.json();
                // API returns list directly: [{"username":..., "elo_rating":...}, ...]
                users = friendsList.sort((a, b) => (b.elo_rating || 1200) - (a.elo_rating || 1200));
            }
        } else {
            const res = await fetch('/api/battle/leaderboard');
            const data = await res.json();
            users = data.leaderboard;
        }
    } catch (e) { console.error(e); }

    if (users.length === 0) {
        leaderboardList.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-secondary);">No active players found.</div>';
        return;
    }

    // Transform data to expected format if needed
    // (Assuming API returns array of objects with username, elo_rating/rating)
    const formattedUsers = users.map(u => ({
        id: u.username,
        name: u.username,
        score: u.elo_rating || u.rating || 1200
    })).sort((a, b) => b.score - a.score);

    // Assign Ranks
    formattedUsers.forEach((u, i) => u.rank = i + 1);

    // Clear Containers
    leaderboardPodium.innerHTML = '';
    leaderboardList.innerHTML = '';

    const topThree = formattedUsers.slice(0, 3);
    const rest = formattedUsers.slice(3);

    // Render Podium (Top 3)
    const podiumClasses = ['silver', 'gold', 'bronze'];
    // Re-order for visual display: Silver (left), Gold (center), Bronze (right) if using flex order, 
    // but usually simple appending works if CSS flexflow handles it. 
    // Original code used podiumOrder logic index based
    // let's stick to simple append if CSS handles order, or replicate order:
    // Original: podiumOrder = [1, 0, 2] -> index 0 is gold, 1 is silver, 2 is bronze.
    // Wait, original: podiumClasses index 0=silver, 1=gold, 2=bronze.
    // topThree[0] is #1 (Gold). podiumOrder.findIndex(o => o === 0) -> index 1 in podiumClasses -> 'gold'. Correct.
    // Let's just manually assign based on rank for simplicity.

    topThree.forEach((user) => {
        let pClass = '';
        if (user.rank === 1) pClass = 'gold';
        else if (user.rank === 2) pClass = 'silver';
        else if (user.rank === 3) pClass = 'bronze';

        const isMe = user.id === userSettings.name;
        const item = document.createElement('div');
        item.className = `podium-item ${pClass} ${isMe ? 'user-rank' : ''}`;

        const icons = {
            gold: `<svg class="podium-icon" width="40" height="40" viewBox="0 0 24 24" fill="var(--gold)" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.5 8.5H3L8.5 12.5L6.5 19L12 15L17.5 19L15.5 12.5L21 8.5H14.5L12 2Z"/></svg>`,
            silver: `<svg class="podium-icon" width="32" height="32" viewBox="0 0 24 24" fill="var(--silver)" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.5 8.5H3L8.5 12.5L6.5 19L12 15L17.5 19L15.5 12.5L21 8.5H14.5L12 2Z"/></svg>`,
            bronze: `<svg class="podium-icon" width="32" height="32" viewBox="0 0 24 24" fill="var(--bronze)" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.5 8.5H3L8.5 12.5L6.5 19L12 15L17.5 19L15.5 12.5L21 8.5H14.5L12 2Z"/></svg>`
        };

        item.innerHTML = `
          ${isMe ? '<span class="user-badge">You</span>' : ''}
          ${icons[pClass]}
          <div class="podium-name" onclick="window.openUserProfile('${escapeHTML(user.name)}')" style="cursor: pointer; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.3);">${escapeHTML(user.name)}</div>
          <div class="podium-score">${user.score.toLocaleString()} RP</div>
      `;
        leaderboardPodium.appendChild(item);
    });

    // Render Rest (List)
    rest.forEach(user => {
        const isMe = user.id === userSettings.name;
        const li = document.createElement('li');
        li.className = `leaderboard-item ${isMe ? 'user-rank' : ''}`;
        if (isMe) li.id = 'user-rank-list-item';

        li.innerHTML = `
        <div class="rank">${user.rank}</div>
        <div class="avatar">${escapeHTML(user.name).charAt(0).toUpperCase()}</div>
        <div class="name-wrap">
            <div class="name" onclick="window.openUserProfile('${escapeHTML(user.name)}')" style="cursor: pointer;">${escapeHTML(user.name)}</div>
            ${isMe ? '<span class="user-badge">You</span>' : ''}
        </div>
        <div class="score">${user.score.toLocaleString()} RP</div>
      `;
        leaderboardList.appendChild(li);
    });
}

async function checkFriendRequests(myID) {
    if (!myID || myID.startsWith('guest')) return;
    const containerId = 'friend-requests-container';
    const existing = document.getElementById(containerId);
    if (existing) existing.remove();

    try {
        const res = await fetch(`/api/friends/requests?current_user_id=${myID}`);
        if (!res.ok) return;
        const requests = await res.json();

        if (requests.length > 0) {
            const lbPodium = document.getElementById('leaderboard-podium');
            const div = document.createElement('div');
            div.id = containerId;
            div.style.marginBottom = '20px';
            div.style.background = 'var(--bg2)';
            div.style.padding = '15px';
            div.style.borderRadius = '12px';
            div.style.border = '1px solid var(--accent1)';
            div.innerHTML = `<h3 style="margin-top:0; font-size:1rem; color:var(--accent1);">Pending Friend Requests</h3>`;

            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';
            ul.style.margin = '10px 0 0 0';

            requests.forEach(req => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.padding = '8px 0';
                li.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                li.innerHTML = `
                  <div style="display:flex;align-items:center;gap:10px;">
                      <div style="width:32px;height:32px;background:var(--bg3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;">${req.sender_username.charAt(0).toUpperCase()}</div>
                      <span>${req.sender_username}</span>
                  </div>
                  <button class="btn-xs" onclick="acceptRequest('${req.id}')" style="background:var(--success);border:none;color:white;padding:4px 10px;border-radius:4px;cursor:pointer;">Accept</button>
              `;
                ul.appendChild(li);
            });
            div.appendChild(ul);
            lbPodium.parentNode.insertBefore(div, lbPodium);
        }
    } catch (e) { console.error(e); }
}

window.acceptRequest = async function (reqId) {
    try {
        await fetch(`/api/friends/accept/${reqId}`, { method: 'POST' });
        showToast("Friend request accepted!");
        generateLeaderboard(); // Refresh
    } catch (e) { console.error(e); }
};

window.generateLeaderboard = generateLeaderboard;
