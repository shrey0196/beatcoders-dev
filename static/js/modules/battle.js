
// battle.js - Battle Mode & Lobby Logic
import { userSettings } from './auth.js';
import { showToast } from './ui.js';

let lobbyWs = null;

export function initContestsView() {
    setupInviteButton();
    setupActiveUsersList();
    connectLobby(); // Connect immediately when checking contests view

    // Setup Modal buttons (Accept/Decline)
    const acceptBtn = document.getElementById('accept-challenge-btn');
    const declineBtn = document.getElementById('decline-challenge-btn');
    const challengeModal = document.getElementById('challenge-modal');

    if (acceptBtn) {
        // Clear old listeners to prevent duplicates (if re-init)
        const newAccept = acceptBtn.cloneNode(true);
        acceptBtn.parentNode.replaceChild(newAccept, acceptBtn);

        newAccept.addEventListener('click', () => {
            if (lobbyWs && window.currentChallengerId) {
                lobbyWs.send(JSON.stringify({
                    type: 'ACCEPT_CHALLENGE',
                    challenger_id: window.currentChallengerId
                }));
                challengeModal.classList.remove('active');
            }
        });
    }

    if (declineBtn) {
        // Simple close
        declineBtn.onclick = () => challengeModal.classList.remove('active');
    }
}

function setupInviteButton() {
    const inviteBtn = document.getElementById('invite-friend-btn');
    const emailInput = document.getElementById('invite-email-input');

    if (inviteBtn) {
        inviteBtn.onclick = () => {
            const email = emailInput.value.trim();
            // Not strictly validating email for MVP
            const matchId = 'match_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const inviterName = userSettings.name || userSettings.userID;
            const link = `${window.location.origin}/battle_join.html?match_id=${matchId}&inviter=${encodeURIComponent(inviterName)}`;

            navigator.clipboard.writeText(link).then(() => {
                showToast(`Invite Link copied! Redirecting...`);
            }).catch(() => {
                showToast(`Invite link generated! Redirecting...`);
            }).finally(() => {
                setTimeout(() => {
                    window.location.href = `/battle.html?match_id=${matchId}&is_host=true`;
                }, 1000);
            });
        };
    }
}

function connectLobby() {
    if (lobbyWs && (lobbyWs.readyState === WebSocket.OPEN || lobbyWs.readyState === WebSocket.CONNECTING)) return;

    const userId = userSettings.name || userSettings.userID;
    // Assume port 8001 or standard ws path
    const wsUrl = `ws://localhost:8001/ws/lobby/${userId}`;

    lobbyWs = new WebSocket(wsUrl);

    lobbyWs.onopen = () => {
        console.log("[Lobby] Connected as", userId);
    };

    lobbyWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'CHALLENGE_RECEIVED') {
            showChallengeModal(data.from_id);
        } else if (data.type === 'MATCH_START') {
            showMatchReadyModal(data.match_id);
        }
    };

    lobbyWs.onclose = () => {
        // Reconnect logic inside initContestsView context or simple timeout
        setTimeout(connectLobby, 5000);
    };
}

// Global Challenge Function
window.sendChallenge = function (targetId) {
    if (lobbyWs && lobbyWs.readyState === WebSocket.OPEN) {
        lobbyWs.send(JSON.stringify({
            type: 'SEND_CHALLENGE',
            target_id: targetId
        }));
        showToast(`Challenge sent to ${targetId}...`);
    } else {
        showToast("Lobby connection lost. Reconnecting...");
        connectLobby();
        // Optimistic retry
        setTimeout(() => {
            if (lobbyWs.readyState === WebSocket.OPEN) {
                window.sendChallenge(targetId);
            }
        }, 1500);
    }
};

window.currentChallengerId = null;
function showChallengeModal(challengerId) {
    const modal = document.getElementById('challenge-modal');
    if (modal) {
        window.currentChallengerId = challengerId;
        document.getElementById('challenger-name').textContent = challengerId;
        modal.classList.add('active');
    }
}

function showMatchReadyModal(matchId) {
    // Check if duplicate modal exists
    if (document.querySelector('.match-ready-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay match-ready-overlay'; // Add specific class
    overlay.style.display = 'flex';

    overlay.innerHTML = `
        <div class="modal-container" style="text-align: center; padding: 40px; border: 1px solid var(--accent1); box-shadow: 0 0 20px rgba(78, 168, 255, 0.2);">
            <div style="font-size: 3rem; margin-bottom: 20px;">⚔️</div>
            <h2 style="margin-bottom: 10px; color: var(--text-primary);">Match Ready!</h2>
            <p style="color: var(--text-secondary); margin-bottom: 30px;">Your opponent is ready. Enter the arena?</p>
            <button id="manual-join-btn" class="solve-btn" style="width: 100%; font-size: 1.2rem; padding: 15px;">ENTER BATTLE</button>
            <div style="margin-top: 15px; font-size: 0.9rem; color: var(--text-secondary); cursor: pointer; text-decoration: underline;" onclick="this.closest('.modal-overlay').remove()">Cancel</div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('manual-join-btn').onclick = () => {
        window.location.href = `/battle.html?match_id=${matchId}`;
    };
}

function setupActiveUsersList() {
    const onlineList = document.getElementById('online-users-list');
    if (!onlineList) return;

    // Use interval to poll
    fetchActiveUsers();
    setInterval(fetchActiveUsers, 5000);

    async function fetchActiveUsers() {
        try {
            const res = await fetch('/api/battle/active_users');
            const data = await res.json();
            const users = data.users || [];
            const myName = userSettings.name || userSettings.userID;

            onlineList.innerHTML = users.length === 0
                ? '<div style="text-align:center; color:var(--text-secondary); padding:20px;">No users online.</div>'
                : users.filter(u => u.user_id !== myName).map(u => `
                    <div class="online-user-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px;">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 5px; background: linear-gradient(135deg, var(--accent1), var(--accent2)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;">
                          ${u.user_id.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style="color: var(--text-primary); font-weight: 600;">${u.user_id}</div>
                          <div style="color: var(--text-secondary); font-size: 0.8rem;">${u.status} • ${u.rating}</div>
                        </div>
                      </div>
                      ${u.status === 'battling' ?
                        `<button style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 0.8rem; cursor: not-allowed; opacity: 0.7;">Battling</button>` :
                        `<button onclick="window.sendChallenge('${u.user_id}')" style="padding: 6px 12px; background: linear-gradient(135deg, var(--accent1), var(--accent2)); color: white; border: none; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">Challenge</button>`
                    }
                    </div>
                `).join('');

            // Update count
            const countEl = document.querySelector('.online-users-header span'); // Heuristic selector
            if (countEl) countEl.textContent = `${users.length} users online`;

        } catch (e) {
            console.error("Fetch active users failed", e);
        }
    }
}
