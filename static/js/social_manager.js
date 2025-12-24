/**
 * Social Manager - Simply Add Friends & Manage Requests
 * Simplifies the friend manager to just adding friends, but shows pending requests if any.
 */

// Debug flag
const SOCIAL_DEBUG = true;

function log(msg) {
    if (SOCIAL_DEBUG) console.log(`[SocialManager] ${msg}`);
}

// Global state
window.socialState = {
    initialized: false,
    pollInterval: null
};

// --- Simplified Modal HTML Template ---
const MODAL_HTML = `
  <div class="profile-modal-overlay" id="friend-modal-overlay"
    style="display:none; opacity:0; transition:opacity 0.3s ease; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10001; align-items:center; justify-content:center;">
    <div class="profile-modal" id="friend-modal"
      style="background:var(--card-bg, #1a1a1a); width:90%; max-width:400px; border-radius:12px; border:1px solid var(--border-color, #333); overflow:hidden; font-family: 'Inter', sans-serif;">

      <div class="modal-header"
        style="padding:20px; border-bottom:1px solid var(--border-color, #333); display:flex; justify-content:space-between; align-items:center; background:var(--bg2, #252525);">
        <h2 style="margin:0; font-size:1.2rem; color:var(--text-primary, #fff);">Add Friend</h2>
        <button class="btn-icon" onclick="window.closeFriendModal()" style="background:none; border:none; color:inherit; cursor:pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body" style="padding:25px; background:var(--card-bg, #1a1a1a); max-height:70vh; overflow-y:auto;">
        
        <p style="color:var(--text-secondary, #888); margin-bottom:15px; font-size:0.9rem;">
          Enter username to send request:
        </p>

        <div style="display:flex; gap:10px; margin-bottom:10px;">
          <input type="text" id="add-friend-input" placeholder="e.g. Coder123"
            style="flex:1; padding:12px; pointer-events:auto; background:var(--bg2, #252525); border:1px solid var(--border-color, #333); border-radius:6px; color:var(--text-primary, #fff); outline:none;">
          <button onclick="window.sendFriendRequestUI()"
            style="padding:10px 20px; background:linear-gradient(135deg, var(--accent1, #3b82f6), var(--accent2, #60a5fa)); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;">Add</button>
        </div>
        
        <div id="add-friend-msg" style="min-height:20px; font-size:0.9rem; margin-bottom:20px;"></div>

        <!-- Pending Requests Section (Hidden if empty) -->
        <div id="pending-requests-container" style="display:none; border-top:1px solid var(--border-color, #333); padding-top:15px; margin-top:10px;">
             <h4 style="margin:0 0 15px 0; color:var(--text-primary, #fff); font-size:1rem; display:flex; align-items:center; gap:8px;">
                Incoming Requests
                <span id="pending-badge" style="background:#ef4444; color:white; font-size:0.75rem; padding:2px 8px; border-radius:12px;">0</span>
             </h4>
             <ul id="requests-simple-ul" style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px;">
                <!-- Populated via JS -->
             </ul>
        </div>

      </div>
    </div>
  </div>
`;

// --- Global Functions ---

window.openFriendManager = function () {
    log('openFriendManager called');

    // Ensure modal exists
    let modal = document.getElementById('friend-modal-overlay');
    if (!modal) {
        log('Modal not found, injecting...');
        ensureModalExists();
        modal = document.getElementById('friend-modal-overlay');
    }

    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '10001';
        modal.style.pointerEvents = 'auto'; // FIX: Enable interaction

        // Force opacity transition
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);

        // Prep UI
        const input = document.getElementById('add-friend-input');
        const msg = document.getElementById('add-friend-msg');
        if (input) input.value = '';
        if (msg) msg.innerHTML = '';

        if (input) setTimeout(() => input.focus(), 50);

        // Check for requests
        fetchFriendRequests();

    } else {
        alert('Could not open Add Friend modal. Please reload.');
    }
};

window.closeFriendModal = function () {
    const modal = document.getElementById('friend-modal-overlay');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none'; // Disable interaction
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
};

window.sendFriendRequestUI = async function () {
    const input = document.getElementById('add-friend-input');
    const msg = document.getElementById('add-friend-msg');

    if (!input || !msg) return;

    const username = input.value.trim();
    const userId = getUserId();

    if (!username) {
        msg.innerHTML = '<span style="color:#ef4444;">Please enter a username.</span>';
        return;
    }
    if (!userId) {
        msg.innerHTML = '<span style="color:#ef4444;">You must be logged in.</span>';
        return;
    }

    msg.innerHTML = '<span style="color:var(--text-secondary);">Sending request...</span>';

    try {
        const res = await fetch(`/api/friends/request/${username}?current_user_id=${userId}`, { method: 'POST' });
        const data = await res.json();

        if (res.ok) {
            msg.innerHTML = `<span style="color:#22c55e;">✅ ${data.message || 'Request Sent!'}</span>`;
            input.value = '';
        } else {
            msg.innerHTML = `<span style="color:#ef4444;">❌ ${data.detail || 'Failed to send.'}</span>`;
        }
    } catch (e) {
        console.error(e);
        msg.innerHTML = `<span style="color:#ef4444;">❌ Network error.</span>`;
    }
};

window.acceptRequestUI = async function (id) {
    const userId = getUserId();
    if (!userId) return;

    // Find the btn to show loading state
    const btn = document.getElementById(`btn-accept-${id}`);
    if (btn) btn.innerText = '...';

    try {
        const res = await fetch(`/api/friends/accept/${id}?current_user_id=${userId}`, { method: 'POST' });
        if (res.ok) {
            fetchFriendRequests(); // Refresh list
            showToastSuccess('Friend added!');
        } else {
            const data = await res.json();
            alert(data.detail || 'Failed to accept');
            if (btn) btn.innerText = 'Accept';
        }
    } catch (e) {
        console.error(e);
        if (btn) btn.innerText = 'Accept';
    }
};

async function fetchFriendRequests() {
    const container = document.getElementById('pending-requests-container');
    const list = document.getElementById('requests-simple-ul');
    const badge = document.getElementById('pending-badge');

    const userId = getUserId();
    if (!userId) return;

    try {
        const res = await fetch(`/api/friends/requests?current_user_id=${userId}`);
        if (res.ok) {
            const reqs = await res.json();

            if (reqs.length > 0) {
                // Show container
                if (container) container.style.display = 'block';
                if (badge) badge.textContent = reqs.length;
                if (list) renderRequestsList(list, reqs);
            } else {
                // Hide container
                if (container) container.style.display = 'none';
            }
        }
    } catch (e) {
        console.error("Error fetching requests", e);
    }
}

function renderRequestsList(container, requests) {
    container.innerHTML = requests.map(r => `
        <li style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:var(--bg1, #1e1e1e); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
            <div>
                <div style="font-weight:600; color:var(--text-primary); font-size:0.95rem;">${r.sender_username}</div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">Sent ${new Date(r.created_at).toLocaleDateString()}</div>
            </div>
            <button id="btn-accept-${r.id}" onclick="acceptRequestUI(${r.id})" style="padding:6px 16px; background:#22c55e; color:white; border:none; border-radius:6px; cursor:pointer; font-size:0.85rem; font-weight:600; transition:all 0.2s;">Accept</button>
        </li>
    `).join('');
}


// --- Initialization & Setup ---

function ensureModalExists() {
    const old = document.getElementById('friend-modal-overlay');
    if (old) {
        // If old one doesn't have the pending-requests-container, replace it
        if (!old.innerHTML.includes('pending-requests-container')) {
            console.log("Replacing outdated Friend Modal...");
            old.remove();
        } else {
            return;
        }
    }

    log('Injecting simplified modal (w/ requests) HTML...');
    const div = document.createElement('div');
    div.innerHTML = MODAL_HTML;
    document.body.appendChild(div.firstElementChild);
}

function initSocialManager() {
    if (window.socialState.initialized) return;

    ensureModalExists();

    const modal = document.getElementById('friend-modal-overlay');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) window.closeFriendModal();
        });
    }

    // Start polling if we have a user
    if (window.socialState.pollInterval) clearInterval(window.socialState.pollInterval);
    window.socialState.pollInterval = setInterval(fetchFriendRequests, 15000);

    window.socialState.initialized = true;
    log('Initialized (Simpler + Requests Mode).');
}

document.addEventListener('DOMContentLoaded', initSocialManager);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initSocialManager();
}

// --- Helpers ---

function getUserId() {
    if (window.userSettings && window.userSettings.userID) return window.userSettings.userID;
    try {
        const stored = localStorage.getItem('beatCodersUserSettings');
        if (stored) return JSON.parse(stored).userID;
    } catch (e) { }
    return null;
}

function showToastSuccess(msg) {
    if (window.showToast) window.showToast(msg);
    else alert(msg);
}

// Keep helper to prevent reference errors if used elsewhere
window.switchFriendTab = function () { }; 
