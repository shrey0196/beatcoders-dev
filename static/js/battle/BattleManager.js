class BattleManager {
    constructor() {
        this.ws = null;
        // Use sessionStorage so tabs have unique IDs, or force random if guest
        // For testing, always append random to ensure uniqueness across tabs
        // Check for guest param from battle_join.html
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('guest_name');

        // Fix: Use correct localStorage key used by main.js (beatCodersUserID)
        const storedId = localStorage.getItem('beatCodersUserID') || localStorage.getItem('beatcoders_uid');
        const baseId = guestName ? guestName.replace(/[^a-zA-Z0-9]/g, '') : (storedId || 'guest');

        // Fix: For Private Matches, we MUST use the exact same ID as the Lobby/Dashboard
        // otherwise the backend rejects us.
        // For Random Queue, we can use random suffix to allow multiple tabs.
        // Note: urlParams is already declared above (line 7)
        const matchIdParam = urlParams.get('match_id');

        if (matchIdParam) {
            this.userId = baseId;
        } else {
            this.userId = baseId + '_' + Math.floor(Math.random() * 10000);
        }

        this.matchId = urlParams.get('match_id'); // Read from URL
        this.isHost = urlParams.get('is_host') === 'true'; // Check if this user is creating the match
        this.opponentId = null;
        this.isMatchActive = false;

        // UI Elements
        this.statusText = document.getElementById('battle-status');
        this.joinBtn = document.getElementById('join-battle-btn');
        this.myHealthBar = document.getElementById('my-health-bar');
        this.myHealthText = document.getElementById('my-health-value');
        this.oppHealthBar = document.getElementById('opp-health-bar');
        this.oppHealthText = document.getElementById('opp-health-value');
        this.battleLog = document.getElementById('battle-log-content');

        this.init();
    }

    init() {
        if (this.joinBtn) {
            this.joinBtn.addEventListener('click', () => this.joinQueue());
        }
        this.connect();
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host; // e.g. localhost:8001
        // Use port 8001 explicitly if running on 8001 backend, otherwise dynamic
        // Since dashboard connects to backend API on same origin usually, we use window.location.host
        // But backend is definitely on 8001. If dashboard is on 8000, we might need to hardcode 8001.
        // For MVP, assuming user is on 8001 or hardcoding. Let's try explicit 8001 for safety as backend log said so.
        const wsUrl = `ws://localhost:8001/ws/battle/${this.userId}`;

        console.log(`[Battle] Connecting to ${wsUrl}`);
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log("[Battle] Connected");
            this.log("Connected to Battle Server");
            if (this.statusText) this.statusText.textContent = "Connected. Ready to join.";

            // Auto-join or create if match_id is present
            if (this.matchId) {
                if (this.isHost) {
                    this.createPrivateMatch(this.matchId);
                } else {
                    this.joinPrivateMatch(this.matchId);
                }
            }
        };

        this.ws.onmessage = (event) => this.handleMessage(JSON.parse(event.data));

        this.ws.onclose = () => {
            console.log("[Battle] Disconnected");
            this.log("Disconnected from server");
            if (this.statusText) this.statusText.textContent = "Disconnected";
        };
    }

    joinQueue() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "JOIN_QUEUE" }));
            this.statusText.textContent = "Searching for opponent...";
            this.log("Joined matchmaking queue...");
            if (this.joinBtn) this.joinBtn.disabled = true;
        }
    }

    joinPrivateMatch(matchId) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "JOIN_MATCH", match_id: matchId }));
            this.statusText.textContent = "Joining Private Battle...";
            this.log(`Joining match ${matchId}...`);
            if (this.joinBtn) this.joinBtn.disabled = true;
        }
    }

    createPrivateMatch(matchId) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "CREATE_PRIVATE_MATCH", match_id: matchId }));
            this.statusText.textContent = "Waiting for opponent to join...";
            this.log(`Created private match ${matchId}. Waiting for opponent...`);
            if (this.joinBtn) this.joinBtn.disabled = true;
        }
    }

    handleMessage(data) {
        console.log("[Battle] Received:", data);

        switch (data.type) {
            case 'MATCH_FOUND':
                this.startMatch(data);
                break;
            case 'ATTACK':
                this.handleAttack(data);
                break;
            case 'SUBMIT_RESULT':
                this.handleSubmissionResult(data);
                break;
            case 'GAME_OVER':
                this.endMatch(data);
                break;
        }
    }

    startMatch(data) {
        this.isMatchActive = true;
        this.matchId = data.match_id;
        this.opponentId = data.opponent;

        this.statusText.textContent = `VS ${data.opponent}`;
        this.log(`Match found against ${data.opponent}!`);

        // Dynamic Problem Loading
        if (data.problem) {
            const titleEl = document.getElementById('problem-title');
            const descEl = document.getElementById('problem-description');

            if (titleEl) titleEl.textContent = `Problem: ${data.problem.title}`;
            if (descEl) descEl.innerHTML = data.problem.description;

            if (window.editor) {
                window.editor.setValue(data.problem.starterCode);
            }
            this.log(`Loaded problem: ${data.problem.title}`);
        } else {
            this.log(`Problem: ${data.problem_id}`); // Fallback
        }

        // Reset Health
        this.updateHealth('me', 100);
        this.updateHealth('opp', 100);

        // Hide overlay
        document.getElementById('battle-overlay').style.display = 'none';

        // Reset Test Cases UI if needed
    }

    handleSubmissionResult(data) {
        // data: { passed: int, total: int, damage_dealt: int, results: [] }
        const { passed, total, damage_dealt, results } = data;

        if (damage_dealt > 0) {
            this.log(`✅ Passed ${passed}/${total} tests. You dealt ${damage_dealt} damage!`);
        } else {
            this.log(`❌ Failed. Passed ${passed}/${total} tests.`);
        }

        // Update Test Cases UI (simple visual log for now)
        if (results && results.length > 0) {
            const latest = results[results.length - 1];
            if (latest.error) {
                this.log(`Error: ${latest.error}`);
            }
        }
    }

    // ... handleAttack ...


    handleAttack(data) {
        const isMe = data.target === this.userId;
        const targetName = isMe ? "You" : "Opponent";

        this.log(`${data.attacker} dealt ${data.damage} damage!`);

        if (isMe) {
            this.updateHealth('me', data.new_health);
            // Shake effect?
            document.body.classList.add('shake');
            setTimeout(() => document.body.classList.remove('shake'), 500);
        } else {
            this.updateHealth('opp', data.new_health);
        }
    }

    updateHealth(who, value) {
        const bar = who === 'me' ? this.myHealthBar : this.oppHealthBar;
        const text = who === 'me' ? this.myHealthText : this.oppHealthText;

        if (bar) bar.style.width = `${value}%`;
        if (text) text.textContent = `${value}/100`;

        // Color change based on health
        if (value < 30) bar.style.backgroundColor = '#ef4444'; // Red
        else if (value < 60) bar.style.backgroundColor = '#f59e0b'; // Orange
        else bar.style.backgroundColor = '#22c55e'; // Green
    }

    endMatch(data) {
        this.isMatchActive = false;
        const won = data.winner === this.userId;
        const result = data.result || (won ? "VICTORY" : "DEFEAT");
        const ratingChange = data.rating_change !== undefined ? data.rating_change : (won ? '+25' : '-25');
        const newRating = data.new_rating !== undefined ? data.new_rating : (won ? '1225' : '1175');

        this.statusText.textContent = result;
        this.log(`Match Over. Winner: ${data.winner}`);

        // Show Game Over Modal
        const modal = document.getElementById('game-over-modal');
        if (modal) {
            const resultTitle = document.getElementById('game-result-title');
            const ratingChangeEl = document.getElementById('rating-change-value');
            const newRatingEl = document.getElementById('new-rating-value');
            const overlay = document.getElementById('battle-overlay');

            // Hide Main Overlay just in case
            if (overlay) overlay.style.display = 'none';

            // Set Title
            resultTitle.textContent = result;
            resultTitle.style.background = won ?
                "linear-gradient(to right, #4ade80, #22c55e)" :
                "linear-gradient(to right, #f87171, #ef4444)";
            resultTitle.style.webkitBackgroundClip = "text";
            resultTitle.style.webkitTextFillColor = "transparent";

            // Set Stats
            if (ratingChangeEl) {
                const changeVal = parseInt(ratingChange);
                ratingChangeEl.textContent = (changeVal > 0 ? '+' : '') + changeVal;
                ratingChangeEl.style.color = changeVal > 0 ? 'var(--accent-success)' : 'var(--accent-danger)';
            }
            if (newRatingEl) newRatingEl.textContent = newRating;

            modal.style.display = 'flex';
        } else {
            // Fallback to old overlay logic if modal doesn't exist
            const overlay = document.getElementById('battle-overlay');
            if (overlay) {
                overlay.querySelector('h1').textContent = result;
                overlay.style.display = 'flex';
            }
        }
    }

    // Called by main.js or submit button logic
    submitCode(code) {
        if (!this.isMatchActive) return;

        this.statusText.textContent = "Running tests...";
        this.log("Submitting code...");

        this.ws.send(JSON.stringify({
            type: "SUBMIT_CODE",
            code: code
        }));
    }

    log(msg) {
        const div = document.createElement('div');
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        div.style.marginBottom = '4px';
        div.style.fontSize = '0.85rem';
        div.style.color = 'var(--text-secondary)';
        if (this.battleLog) {
            this.battleLog.prepend(div);
        }
    }
}

// Global instance
window.battleManager = new BattleManager();
