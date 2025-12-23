
// ui.js - UI Interactions, Themes, Animations

// --- Theme Logic ---
export function applyTheme(themeName) {
    if (themeName === 'light') {
        document.body.classList.add('light-mode');
        // Optional: Update toggle state if logic was here, but purely UI now
    } else {
        document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', themeName);
}

// --- Toast Notifications ---
export function showToast(message = "Operation successful!") {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

window.showToast = showToast; // Expose for legacy/inline usage

// --- Dashboard Animations ---
export function runDashboardAnimations() {
    document.querySelectorAll('.stats-grid .card, .main-column .card, .side-column .card').forEach((el, index) => {
        el.classList.add('anim-hidden', 'animate-in');
        el.style.animationDelay = `${100 + index * 100}ms`;
    });
}

// --- Navigation Logic ---
export function initNavigation() {
    const views = {
        'dashboard-btn': 'dashboard-view',
        'practice-btn': 'dashboard-view', // Practice is part of main dashboard
        'contests-btn': 'contests-view',
        'rewards-btn': 'rewards-view',
        'settings-btn': 'settings-view'
    };

    const buttons = Object.keys(views).map(id => document.getElementById(id)).filter(el => el);
    const viewElements = [...new Set(Object.values(views))].map(id => document.getElementById(id)).filter(el => el);

    // Sidebar Mobile Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.onclick = () => {
            sidebar.classList.toggle('active');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        };
    }
    if (sidebarOverlay) {
        sidebarOverlay.onclick = () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        };
    }

    // View Switching
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update Active State
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');

            // Hide all views
            viewElements.forEach(v => v.classList.add('hidden'));

            // Show target view
            const targetId = views[btn.id];
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.classList.remove('hidden');

            // Close mobile sidebar
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            }
        });
    });

    // Handle initial state if needed, or rely on HTML defaults (Dashboard active)
}

// --- Rewards Logic ---
export function generateRewards() {
    const rewardsGrid = document.getElementById('rewards-grid');
    if (!rewardsGrid) return;

    const rewardsData = [
        { icon: '📅', title: 'Week Warrior', description: 'Maintain a 7-day coding streak.' },
        { icon: '🔥', title: 'Grind Master', description: 'Maintain a 30-day coding streak.' },
        { icon: '🏆', title: 'Contest King', description: 'Win a weekly coding contest.' },
        { icon: '🧠', title: 'AlgoQueen', description: 'Solve 10 hard algorithm problems.' },
        { icon: '🚀', title: 'Speed Racer', description: 'Solve a problem in under 5 minutes.' },
        { icon: '💡', title: 'Optimization Expert', description: 'Submit a solution with optimal complexity.' },
        { icon: '💻', title: 'DP Dynamo', description: 'Solve 5 Dynamic Programming problems.' },
        { icon: '🔗', title: 'Graph Guru', description: 'Solve 5 Graph theory problems.' },
    ];

    rewardsGrid.innerHTML = rewardsData.map(badge => `
      <div class="badge-card">
          <div class="badge-icon" style="font-size: 32px;">${badge.icon}</div>
          <div class="badge-title">${badge.title}</div>
          <div class="badge-description">${badge.description}</div>
      </div>
  `).join('');
}

// --- Canvas Background (Wave Effect) ---
let waveCanvas, waveCtx, waveTime = 0;
export function initCanvas() {
    waveCanvas = document.getElementById('bg-canvas');
    if (waveCanvas) {
        waveCtx = waveCanvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        animationLoop();
    }
}

function resizeCanvas() {
    if (!waveCanvas) return;
    waveCanvas.width = window.innerWidth;
    waveCanvas.height = window.innerHeight;
}

function animationLoop() {
    if (!waveCanvas || !waveCtx) return;
    waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
    waveTime += 0.01;

    const documentStyles = getComputedStyle(document.documentElement);
    const accent1 = documentStyles.getPropertyValue('--accent1').trim();

    waveCtx.beginPath();
    for (let i = 0; i < waveCanvas.width; i += 10) {
        const y = Math.sin(i * 0.01 + waveTime) * 50 + Math.cos(i * 0.005 + waveTime) * 30;
        waveCtx.lineTo(i, waveCanvas.height / 2 + y);
    }
    waveCtx.strokeStyle = accent1 || '#38bdf8';
    waveCtx.globalAlpha = 0.1;
    waveCtx.stroke();

    requestAnimationFrame(animationLoop);
}
