/* Refactored Dashboard JS */
/* Block 1: Mermaid Init */
mermaid.initialize({ startOnLoad: true, theme: 'dark' });

/* Block 2: Main Logic */
document.addEventListener('DOMContentLoaded', () => {
  // --- THEME & ANIMATION ---
  let beatOn = true;
  const beatToggle = document.getElementById('beat-toggle');
  const pulseRing = document.getElementById('pulse-ring');
  const solveProblemBtn = document.getElementById('solve-problem-btn');
  const waveCanvas = document.getElementById('wave');
  const bars = Array.from(document.querySelectorAll('.bar'));
  let waveCtx, amplitude = 0.25, t = 0;

  if (waveCanvas) {
    waveCtx = waveCanvas.getContext('2d');
  }

  function applyTheme(theme, persist = false) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      beatOn = false;
      if (beatToggle && beatToggle.type === 'checkbox') beatToggle.checked = false;
    } else {
      document.body.classList.remove('light-mode');
      beatOn = true;
      if (beatToggle && beatToggle.type === 'checkbox') beatToggle.checked = true;
    }

    if (persist) localStorage.setItem('theme', theme);

    // Trigger animation change
    if (beatOn) amplitude = 0.25;
  }

  // --- Animation Engine ---
  function resizeCanvas() {
    if (!waveCanvas || !waveCtx) return;
    const rect = waveCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    waveCanvas.width = rect.width * dpr;
    waveCanvas.height = rect.height * dpr;
    waveCtx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeCanvas);

  function drawWave() {
    if (!waveCtx) return;
    const w = waveCanvas.getBoundingClientRect().width;
    const h = waveCanvas.getBoundingClientRect().height;
    waveCtx.clearRect(0, 0, w, h);
    waveCtx.lineWidth = 2;
    waveCtx.strokeStyle = 'rgba(78,168,255,0.9)';
    waveCtx.beginPath();
    const lines = 160;
    const freq = 0.015 + amplitude * 0.03;
    for (let i = 0; i <= lines; i++) {
      const x = (i / lines) * w;
      const y = h / 2 + Math.sin(i * 0.6 + t * freq) * (h * 0.18 * amplitude) * Math.sin(t * 0.02);
      if (i === 0) waveCtx.moveTo(x, y); else waveCtx.lineTo(x, y);
    }
    waveCtx.stroke();
    t += 1;
  }

  let barPhase = 0;
  function updateBars() {
    if (bars.length === 0) return;
    barPhase += 0.08 + amplitude * 0.04;
    bars.forEach((b, i) => {
      const base = 8 + Math.abs(Math.sin(barPhase + i * 0.9)) * 36 * (0.4 + amplitude * 0.8);
      b.style.height = Math.max(6, Math.floor(base)) + 'px';
    });
  }

  function updateAvatarPulse() {
    if (!pulseRing) return;
    const scale = 1 + amplitude * 0.28;
    pulseRing.style.transform = `scale(${scale})`;
    pulseRing.style.borderColor = `rgba(78,168,255,${0.22 + amplitude * 0.35})`;
    pulseRing.style.filter = `blur(${4 + amplitude * 6}px)`;
  }

  function animationLoop() {
    if (!beatOn) {
      amplitude = Math.max(0.02, amplitude * 0.96);
    }
    amplitude = Math.max(0.02, amplitude - 0.0009);

    drawWave();
    updateBars();
    updateAvatarPulse();

    requestAnimationFrame(animationLoop);
  }

  if (beatToggle) {
    beatToggle.addEventListener('change', (e) => {
      const newTheme = e.target.checked ? 'dark' : 'light'; // Checked = Dark/Beat Mode ON
      applyTheme(newTheme, true);
    });
  }


  // --- Theme Logic ---
  // Init theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);


  if (solveProblemBtn) {
    solveProblemBtn.addEventListener('mouseenter', () => {
      if (beatOn) amplitude = Math.min(0.95, amplitude + 0.35);
    });
  }

  // --- Core Dashboard Logic ---
  let leaderboardFirstView = true;
  const savedEmail = localStorage.getItem('beatCodersEmail');

  // User settings management
  window.userSettings = {};

  function loadUserSettings() {
    const storedSettings = JSON.parse(localStorage.getItem('beatCodersUserSettings'));
    const initialRealName = localStorage.getItem('beatCodersRealName');
    const userID = localStorage.getItem('beatCodersUserID') || 'Coder';

    let finalSettings = {
      userID: userID,
      name: userID, // Default display name is the UserID
      gender: '',
      location: '',
      github: '',
      linkedin: ''
    };

    if (initialRealName) {
      finalSettings.name = initialRealName;
    }

    if (storedSettings) {
      finalSettings = { ...finalSettings, ...storedSettings };
    }
    window.userSettings = finalSettings;
  }

  function saveUserSettings() {
    const settingsToStore = {
      name: userSettings.name,
      gender: userSettings.gender,
      location: userSettings.location,
      github: userSettings.github,
      linkedin: userSettings.linkedin
    };
    localStorage.setItem('beatCodersUserSettings', JSON.stringify(settingsToStore));
    localStorage.setItem('beatCodersRealName', userSettings.name);
  }

  function updateHeaderUI() {
    document.getElementById('username').textContent = userSettings.name;
    document.getElementById('header-avatar').textContent = userSettings.name.charAt(0).toUpperCase();
  }

  // --- UI Elements & Modals ---
  const userAvatarBtn = document.getElementById('user-avatar-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const profileBtn = document.getElementById('profile-btn');
  const signOutBtn = document.getElementById('sign-out-btn');
  const profileModalOverlay = document.getElementById('profile-modal-overlay');
  const closeProfileModalBtn = document.getElementById('close-profile-modal-btn');
  const profileMainView = document.getElementById('profile-main-view');
  const changePasswordView = document.getElementById('change-password-view');
  const passwordUpdatedView = document.getElementById('password-updated-view');
  const allProfileViews = [profileMainView, changePasswordView, passwordUpdatedView];
  const showChangePasswordBtn = document.getElementById('show-change-password-btn');
  const backToProfileBtn = document.getElementById('back-to-profile-btn');
  const changePasswordForm = document.getElementById('change-password-form');
  const newPasswordInput = document.getElementById('new-password');
  const confirmNewPasswordInput = document.getElementById('confirm-new-password');
  const confirmNewPasswordError = document.getElementById('confirm-new-password-error');

  // Mobile Menu Elements
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mobileProfileBtn = document.getElementById('sidebar-profile-btn');
  const mobileSignOutBtn = document.getElementById('sidebar-sign-out-btn');

  // Toggle Mobile Sidebar
  const toggleSidebar = () => {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
  };

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

  // Close sidebar when clicking a nav item on mobile
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
      }
    });
  });

  const showProfileView = (viewToShow) => {
    allProfileViews.forEach(v => v.classList.add('hidden'));
    viewToShow.classList.remove('hidden');
  };

  const openProfileModal = () => {
    document.getElementById('modal-username').textContent = userSettings.name;
    document.getElementById('modal-avatar').textContent = userSettings.name.charAt(0).toUpperCase();
    document.getElementById('modal-userid').textContent = `@${userSettings.userID}`;
    document.getElementById('modal-email').textContent = savedEmail || '';
    profileModalOverlay.classList.add('open');
  };

  if (userAvatarBtn) {
    userAvatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('open');
    });
  }

  document.addEventListener('click', () => {
    if (dropdownMenu && dropdownMenu.classList.contains('open')) {
      dropdownMenu.classList.remove('open');
    }
  });

  if (profileBtn) profileBtn.addEventListener('click', openProfileModal);
  if (mobileProfileBtn) mobileProfileBtn.addEventListener('click', openProfileModal);

  // Rewards and Settings Full-Screen Views
  const rewardsBtn = document.getElementById('rewards-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const logoContainer = document.querySelector('.brand');


  // Function to show full-screen view
  function showFullScreenView(viewName) {
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    // Hide all direct children of main
    Array.from(mainContainer.children).forEach(child => {
      child.classList.add('hidden');
    });

    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'none';

    // Create or show the full-screen view
    let viewElement = document.getElementById(`${viewName}-view`);

    if (!viewElement) {
      viewElement = document.createElement('div');
      viewElement.id = `${viewName}-view`;
      // No 'hidden' class initially as we want to show it
      viewElement.style.cssText = 'padding: 2rem; min-height: 100vh; animation: fadeIn 0.3s ease-in-out; width: 100%;';

      if (viewName === 'rewards') {
        viewElement.innerHTML = `
              <div class="card" style="max-width: 800px; margin: 0 auto;">
                <h1 style="font-size: 2rem; margin-bottom: 1.5rem; color: var(--text-primary);">🏆 Rewards & Achievements</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Track your progress and unlocked milestones.</p>
                <div style="padding: 40px; text-align: center; background: var(--bg2); border-radius: 12px; border: 1px dashed var(--gray-border);">
                  <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                  <h3>Coming Soon</h3>
                  <p>We are building a comprehensive rewards system for you!</p>
                </div>
              </div>
            `;
      } else if (viewName === 'settings') {
        viewElement.innerHTML = `
              <div class="card" style="max-width: 800px; margin: 0 auto;">
                <h1 style="font-size: 2rem; margin-bottom: 1.5rem; color: var(--text-primary);">⚙️ Settings</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Manage your account preferences.</p>
                <div style="padding: 40px; text-align: center; background: var(--bg2); border-radius: 12px; border: 1px dashed var(--gray-border);">
                  <div style="font-size: 3rem; margin-bottom: 1rem;">🛠️</div>
                  <h3>Under Construction</h3>
                  <p>Advanced settings are currently being implemented.</p>
                </div>
              </div>
            `;
      }

      mainContainer.appendChild(viewElement);
    } else {
      viewElement.classList.remove('hidden');
    }

    // Close dropdown menu
    if (dropdownMenu) {
      dropdownMenu.classList.remove('open');
    }
  }

  // Function to return to dashboard
  function returnToDashboard() {
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    // Hide all views
    Array.from(mainContainer.children).forEach(child => {
      child.classList.add('hidden');
    });

    // Show dashboard view
    const dashboardView = document.getElementById('dashboard-view');
    if (dashboardView) {
      dashboardView.classList.remove('hidden');
    }

    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'flex';

    // Reset sidebar active state
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const dashboardLink = document.querySelector('.sidebar-nav .nav-item[data-view="dashboard-view"]');
    if (dashboardLink) dashboardLink.classList.add('active');
  }

  // Add event listeners
  if (rewardsBtn) {
    rewardsBtn.addEventListener('click', () => {
      showFullScreenView('rewards');
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      showFullScreenView('settings');
    });
  }

  if (logoContainer) {
    // Remove href functionality
    logoContainer.removeAttribute('href');
    logoContainer.style.cursor = 'pointer';
    logoContainer.addEventListener('click', (e) => {
      e.preventDefault();
      returnToDashboard();
    });
  }

  const closeProfileModal = () => {
    profileModalOverlay.classList.remove('open');
    setTimeout(() => {
      showProfileView(profileMainView);
      if (changePasswordForm) changePasswordForm.reset();
      if (confirmNewPasswordError) confirmNewPasswordError.textContent = '';
    }, 300);
  };

  if (closeProfileModalBtn) closeProfileModalBtn.addEventListener('click', closeProfileModal);
  if (profileModalOverlay) {
    profileModalOverlay.addEventListener('click', (e) => {
      if (e.target === profileModalOverlay) closeProfileModal();
    });
  }

  const handleSignOut = () => {
    localStorage.removeItem('beatCodersUserID');
    localStorage.removeItem('beatCodersRealName');
    localStorage.removeItem('beatCodersEmail');
    localStorage.removeItem('beatCodersUserSettings');
    localStorage.removeItem('theme');
    window.location.href = 'index.html';
  };

  if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);
  if (mobileSignOutBtn) mobileSignOutBtn.addEventListener('click', handleSignOut);

  if (showChangePasswordBtn) showChangePasswordBtn.addEventListener('click', () => showProfileView(changePasswordView));
  if (backToProfileBtn) backToProfileBtn.addEventListener('click', () => {
    showProfileView(profileMainView);
    if (confirmNewPasswordError) confirmNewPasswordError.textContent = '';
  });

  const validateNewPasswordMatch = () => {
    if (!newPasswordInput || !confirmNewPasswordInput) return true;
    if (newPasswordInput.value !== confirmNewPasswordInput.value) {
      confirmNewPasswordError.textContent = 'Passwords do not match.';
      return false;
    }
    confirmNewPasswordError.textContent = '';
    return true;
  };

  if (newPasswordInput) newPasswordInput.addEventListener('input', validateNewPasswordMatch);
  if (confirmNewPasswordInput) confirmNewPasswordInput.addEventListener('input', validateNewPasswordMatch);

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateNewPasswordMatch()) {
        showProfileView(passwordUpdatedView);
        setTimeout(closeProfileModal, 2000);
      }
    });
  }

  // --- View Switching ---
  const navItems = document.querySelectorAll('.nav-item');
  const dropdownItems = {
    rewardsBtn: document.getElementById('rewards-btn'),
    settingsBtn: document.getElementById('settings-btn')
  };
  const mainViews = document.querySelectorAll('main > div[id$="-view"]');

  // --- Global Submissions Logic ---
  async function fetchGlobalSubmissions() {
    const tableBody = document.querySelector('.submissions-table tbody');
    if (!tableBody) return;

    if (!window.userSettings || !window.userSettings.userID) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Please login to view submissions.</td></tr>';
      return;
    }

    // Show loading state
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-secondary);">Loading submissions...</td></tr>';

    try {
      const response = await fetch(`/api/submissions/all/${window.userSettings.userID}`);
      if (response.ok) {
        const submissions = await response.json();
        if (submissions.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-secondary);">No submissions found.</td></tr>';
          return;
        }

        tableBody.innerHTML = submissions.map(s => {
          const statusClass = s.status === 'accepted' ? 'status-accepted' : 'status-ignored'; // Use existing class or style
          const statusColor = s.status === 'accepted' ? 'var(--green)' : 'var(--red)';
          const statusText = s.status.charAt(0).toUpperCase() + s.status.slice(1);
          const timeString = new Date(s.created_at).toLocaleString();
          const title = s.problem_id || 'Unknown Problem';

          return `
                <tr>
                  <td>${title}</td>
                  <td><span style="color: ${statusColor}; font-weight: 600;">${statusText}</span></td>
                  <td>${s.language}</td>
                  <td style="color: var(--text-secondary);">${timeString}</td>
                  <td class="points-earned" style="color: var(--accent1); font-weight: 700;">${s.points}</td>
                </tr>
              `;
        }).join('');
      } else {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--red);">Failed to load submissions.</td></tr>';
      }
    } catch (e) {
      console.error(e);
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--red);">Error loading submissions.</td></tr>';
    }
  }

  function showMainView(viewId) {
    console.log('[Nav] Switching to view:', viewId);
    navItems.forEach(i => i.classList.remove('active'));
    const correspondingNavItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);
    if (correspondingNavItem) {
      correspondingNavItem.classList.add('active');
    }

    mainViews.forEach(view => {
      view.classList.toggle('hidden', view.id !== viewId);
    });

    // Specific init functions for views
    if (viewId === 'leaderboard-view') generateLeaderboard();
    else if (viewId === 'practice-view') initPracticeView();
    else if (viewId === 'rewards-view') generateRewards();
    else if (viewId === 'settings-view') initSettingsView();
    else if (viewId === 'submissions-view') fetchGlobalSubmissions();
  }
  window.showMainView = showMainView;

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewId = item.getAttribute('data-view');
      if (viewId) showMainView(viewId);
    });
  });

  if (dropdownItems.rewardsBtn) dropdownItems.rewardsBtn.addEventListener('click', () => showMainView('rewards-view'));
  if (dropdownItems.settingsBtn) dropdownItems.settingsBtn.addEventListener('click', () => showMainView('settings-view'));

  // --- Global Submissions Logic ---
  async function fetchGlobalSubmissions() {
    const tableBody = document.querySelector('.submissions-table tbody');
    if (!tableBody) return;

    if (!userSettings.userID) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Please login to view submissions.</td></tr>';
      return;
    }

    // Show loading state
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-secondary);">Loading submissions...</td></tr>';

    try {
      const response = await fetch(`/api/submissions/all/${userSettings.userID}`);
      if (response.ok) {
        const history = await response.json();
        if (history.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-secondary);">No submissions found. Start practicing!</td></tr>';
          return;
        }

        tableBody.innerHTML = history.map(sub => {
          const timeString = new Date(sub.created_at).toLocaleString();
          const statusClass = sub.status === 'accepted' ? 'status-accepted' : 'status-wrong';
          const statusText = sub.status === 'accepted' ? 'Accepted' : (sub.status === 'pending' ? 'Pending' : 'Wrong Answer');
          const points = sub.status === 'accepted' ? `+${sub.points}` : '0';
          const statusColor = sub.status === 'accepted' ? '#22c55e' : '#ef4444';

          // Format logic: Title casing or lookup
          const displayTitle = sub.problem_id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

          return `
                    <tr>
                        <td style="font-weight: 500; color: var(--text-primary);">${displayTitle}</td>
                        <td class="${statusClass}" style="color: ${statusColor}; font-weight: 600;">${statusText}</td>
                        <td style="color: var(--text-secondary);">${sub.language}</td>
                        <td style="color: var(--text-secondary);">${timeString}</td>
                        <td class="points-earned" style="color: var(--accent1); font-weight: 700;">${points}</td>
                    </tr>
                   `;
        }).join('');
      } else {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--red);">Failed to load submissions.</td></tr>';
      }
    } catch (e) {
      console.error(e);
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--red);">Error loading submissions.</td></tr>';
    }
  }

  // --- Leaderboard Generation ---
  async function generateLeaderboard() {
    const leaderboardPodium = document.getElementById('leaderboard-podium');
    const leaderboardList = document.getElementById('leaderboard-list');
    if (!leaderboardPodium || !leaderboardList) return;

    const currentUserID = userSettings.userID;
    const currentUserDisplayName = userSettings.name;

    // Inject Toggle if missing
    if (!document.getElementById('leaderboard-toggle-container')) {
      const toggleHTML = `
        <div id="leaderboard-toggle-container" style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
            <div style="background: var(--glass-2); padding: 4px; border-radius: 8px; display: flex; gap: 4px;">
                <button id="lb-toggle-global" class="btn-sm active" style="padding: 4px 12px; border-radius: 6px; border: none; background: var(--accent1); color: white; cursor: pointer; font-size: 0.8rem;">Global</button>
                <button id="lb-toggle-friends" class="btn-sm" style="padding: 4px 12px; border-radius: 6px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 0.8rem;">Friends</button>
            </div>
        </div>
        `;
      leaderboardPodium.insertAdjacentHTML('beforebegin', toggleHTML);

      // Add Event Listeners
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
    }

    const currentFilter = window.leaderboardFilter || 'global';
    const myID = userSettings.userID || 'guest';

    // Check for Friend Requests (only if on friends tab or just always? Let's do always above leaderboard)
    if (document.getElementById('friend-requests-container')) {
      document.getElementById('friend-requests-container').remove();
    }

    try {
      const reqRes = await fetch(`/api/friends/requests?current_user_id=${myID}`); // API requires user_id param likely if strictly enforced, though cookie auth is better. Route says param default guest.
      // Wait, route depends on get_db and current_user_id. Frontend doesn't send auth header usually here?
      // backend: def get_friend_requests(current_user_id: str = "guest" ...
      // We need to pass current_user_id query param as we do elsewhere.

      if (reqRes.ok) {
        const requests = await reqRes.json();
        if (requests.length > 0) {
          const reqContainer = document.createElement('div');
          reqContainer.id = 'friend-requests-container';
          reqContainer.style.marginBottom = '20px';
          reqContainer.style.background = 'var(--bg2)';
          reqContainer.style.padding = '15px';
          reqContainer.style.borderRadius = '12px';
          reqContainer.style.border = '1px solid var(--accent1)';

          reqContainer.innerHTML = `<h3 style="margin-top:0; font-size:1rem; color:var(--accent1);">Pending Friend Requests</h3>`;

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
                        <button class="btn-xs accept-freq-btn" data-id="${req.id}" style="background:var(--success);border:none;color:white;padding:4px 10px;border-radius:4px;cursor:pointer;">Accept</button>
                    `;
            ul.appendChild(li);
          });

          reqContainer.appendChild(ul);

          // Add event listeners
          ul.querySelectorAll('.accept-freq-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
              const freqId = e.target.getAttribute('data-id');
              e.target.textContent = '...';
              try {
                const accRes = await fetch(`/api/friends/accept/${freqId}?current_user_id=${myID}`, { method: 'POST' });
                if (accRes.ok) {
                  e.target.parentElement.remove();
                  if (ul.children.length === 0) reqContainer.remove();
                  // Refresh leaderboard if we are on friends tab
                  if (currentFilter === 'friends') generateLeaderboard();
                  createNotification('Friend request accepted!', 'success');
                } else {
                  const errText = await accRes.text();
                  console.error("Accept failed:", accRes.status, errText);
                  alert(`Failed to accept: ${errText}`);
                  e.target.textContent = 'Accept';
                }
              } catch (err) {
                console.error("Accept fetch error:", err);
                alert("Network error accepting request.");
                e.target.textContent = 'Accept';
              }
            });
          });

          leaderboardPodium.insertAdjacentElement('beforebegin', reqContainer);
        }
      }
    } catch (e) { console.error("Error fetching friend requests", e); }

    // Fetch from API
    let leaderboardData = [];
    try {
      const endpoint = currentFilter === 'friends'
        ? `/api/friends?current_user_id=${myID}`
        : '/api/battle/leaderboard';

      const res = await fetch(endpoint);

      if (currentFilter === 'friends') {
        const friends = await res.json();
        // Transform friend list to leaderboard format
        // Add self to friend list for comparison? Usually yes.
        // For now, simple friends list.
        leaderboardData = friends.map(f => ({
          id: f.username,
          name: f.username,
          score: f.elo_rating
        }));
        // Sort by score
        leaderboardData.sort((a, b) => b.score - a.score);
      } else {
        const data = await res.json();
        leaderboardData = data.leaderboard.map(u => ({
          id: u.username,
          name: u.username,
          score: u.rating
        }));
      }

    } catch (e) {
      console.error("Leaderboard fetch failed", e);
      return;
    }

    // Assign Rank
    leaderboardData.forEach((user, index) => user.rank = index + 1);
    const currentUserRank = leaderboardData.find(u => u.id === currentUserID)?.rank;

    // Clear Lists NOW
    leaderboardPodium.innerHTML = '';
    leaderboardList.innerHTML = '';

    const topThree = leaderboardData.slice(0, 3);
    const rest = leaderboardData.slice(3);

    const podiumClasses = ['silver', 'gold', 'bronze'];
    const podiumOrder = [1, 0, 2];
    const medalIcons = {
      gold: `<svg class="podium-icon" width="40" height="40" viewBox="0 0 24 24" fill="var(--gold)" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.5 8.5H3L8.5 12.5L6.5 19L12 15L17.5 19L15.5 12.5L21 8.5H14.5L12 2Z"/></svg>`,
      silver: `<svg class="podium-icon" width="32" height="32" viewBox="0 0 24 24" fill="var(--silver)" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.5 8.5H3L8.5 12.5L6.5 19L12 15L17.5 19L15.5 12.5L21 8.5H14.5L12 2Z"/></svg>`,
      bronze: `<svg class="podium-icon" width="32" height="32" viewBox="0 0 24 24" fill="var(--bronze)" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.5 8.5H3L8.5 12.5L6.5 19L12 15L17.5 19L15.5 12.5L21 8.5H14.5L12 2Z"/></svg>`
    };

    topThree.forEach((user, index) => {
      const podiumClass = podiumClasses[podiumOrder.findIndex(o => o === index)];
      const isCurrentUser = user.id === currentUserID;
      const item = document.createElement('div');
      item.className = `podium-item ${podiumClass} ${isCurrentUser ? 'user-rank' : ''}`;
      item.innerHTML = `
                ${isCurrentUser ? '<span class="user-badge">You</span>' : ''}
                ${medalIcons[podiumClass]}
                <div class="podium-name" onclick="window.openUserProfile('${user.name}')" style="cursor: pointer; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.3);">${user.name}</div>
                <div class="podium-score">${user.score.toLocaleString()} RP</div>
            `;
      leaderboardPodium.appendChild(item);
    });

    rest.forEach(user => {
      const item = document.createElement('li');
      const isCurrentUser = user.id === currentUserID;
      item.className = `leaderboard-item ${isCurrentUser ? 'user-rank' : ''}`;
      if (isCurrentUser) item.id = 'user-rank-list-item';

      item.innerHTML = `
                <div class="rank">${user.rank}</div>
                <div class="avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div class="name-wrap">
                    <div class="name" onclick="window.openUserProfile('${user.name}')" style="cursor: pointer;">${user.name}</div>
                    ${isCurrentUser ? '<span class="user-badge">You</span>' : ''}
                </div>
                <div class="score">${user.score.toLocaleString()} RP</div>
            `;
      leaderboardList.appendChild(item);
    });

    if (currentUserRank > 3) {
      setTimeout(() => {
        document.getElementById('user-rank-list-item')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }

    if (leaderboardFirstView) {
      const podiumItems = leaderboardPodium.querySelectorAll('.podium-item');
      const listItems = leaderboardList.querySelectorAll('.leaderboard-item');
      [...podiumItems, ...listItems].forEach(item => item.classList.add('anim-hidden'));

      const gold = leaderboardPodium.querySelector('.gold');
      if (gold) { gold.style.animationDelay = '100ms'; gold.classList.add('animate-podium-gold'); }

      const silver = leaderboardPodium.querySelector('.silver');
      if (silver) { silver.style.animationDelay = '250ms'; silver.classList.add('animate-podium-silver'); }

      const bronze = leaderboardPodium.querySelector('.bronze');
      if (bronze) { bronze.style.animationDelay = '250ms'; bronze.classList.add('animate-podium-bronze'); }

      listItems.forEach((item, index) => {
        item.style.animationDelay = `${400 + index * 40}ms`;
        item.classList.add('animate-list-item');
      });

      leaderboardFirstView = false;
    }
  }

  // --- Public Profile Modal Logic ---
  function createPublicProfileModal() {
    if (document.getElementById('public-profile-modal')) return;

    const modalHTML = `
        <div id="public-profile-modal" class="modal-overlay">
          <div class="modal-content profile-modal" style="max-width: 440px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); background: linear-gradient(165deg, #1a1a2e 0%, #16213e 100%);">
            <button id="close-public-profile-btn" class="close-modal-btn" style="position:absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; display:flex; align-items:center; justify-content:center; cursor: pointer; border: none; color: rgba(255,255,255,0.7); transition: all 0.2s;">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 1L1 13M1 1l12 12" /></svg>
            </button>
            <div class="profile-header centered" style="text-align: center; padding: 40px 30px 20px;">
              <div class="profile-avatar-wrapper" style="position: relative; width: 100px; height: 100px; margin: 0 auto 1.5rem; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);">
                <div class="profile-avatar large" id="public-profile-avatar" style="width: 100%; height: 100%; font-size: 3rem; background: #0f0c29; display: flex; align-items: center; justify-content: center; border-radius: 50%;">U</div>
              </div>
              <h2 id="public-profile-username" style="margin: 0; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px; color: #ffffff !important;">Username</h2>
              <p class="profile-userid" id="public-profile-joined" style="color: rgba(255,255,255,0.6) !important; font-size: 0.9rem; margin-top: 5px;">Joined: ...</p>
    
              <div class="profile-stats-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">
                <div class="stat-item" style="background: rgba(255,255,255,0.03); padding: 1.2rem; border-radius: 16px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                  <div class="stat-value" id="public-profile-elo" style="font-size: 1.8rem; font-weight: 800; color: #00d2ff; text-shadow: 0 0 20px rgba(0,210,255,0.3);">1200</div>
                  <div class="stat-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-top: 5px;">Elo Rating</div>
                </div>
                <div class="stat-item" style="background: rgba(255,255,255,0.03); padding: 1.2rem; border-radius: 16px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                  <div class="stat-value" id="public-profile-views" style="font-size: 1.8rem; font-weight: 800; color: #ffffff;">0</div>
                  <div class="stat-label" style="font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-top: 5px;">Views</div>
                </div>
              </div>
    
              <div class="profile-actions" style="margin-top: 0;">
                <button id="add-friend-btn" class="btn primary-btn" style="width: 100%; border-radius: 12px; padding: 12px; font-weight: 600; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(5px); color: #ffffff !important;">Add Friend</button>
                <div id="friend-status-msg" style="margin-top: 10px; color: rgba(255,255,255,0.7) !important; display: none; font-size: 0.9rem;"></div>
              </div>
            </div>
    
            <div style="text-align: center; padding-bottom: 30px;">
              <a id="public-profile-link" href="#" target="_blank" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.85rem; transition: color 0.2s;">View Public Page &rarr;</a>
            </div>
          </div>
        </div>
        `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('close-public-profile-btn').addEventListener('click', () => {
      document.getElementById('public-profile-modal').classList.remove('active');
    });

    document.getElementById('public-profile-modal').addEventListener('click', (e) => {
      if (e.target.id === 'public-profile-modal') {
        document.getElementById('public-profile-modal').classList.remove('active');
      }
    });
  }

  window.openUserProfile = async function (username) {
    createPublicProfileModal();
    const modal = document.getElementById('public-profile-modal');
    const avatarEl = document.getElementById('public-profile-avatar');
    const usernameEl = document.getElementById('public-profile-username');
    const joinedEl = document.getElementById('public-profile-joined');
    const eloEl = document.getElementById('public-profile-elo');
    const viewsEl = document.getElementById('public-profile-views');
    const addFriendBtn = document.getElementById('add-friend-btn');
    const statusMsg = document.getElementById('friend-status-msg');
    const linkEl = document.getElementById('public-profile-link');

    // Reset UI
    addFriendBtn.style.display = 'inline-block';
    addFriendBtn.disabled = false;
    addFriendBtn.textContent = 'Add Friend';
    addFriendBtn.onclick = null; // Clear previous handler
    statusMsg.style.display = 'none';

    // Show Modal Loading
    modal.classList.add('active');
    usernameEl.textContent = 'Loading...';

    const myID = window.userSettings ? (window.userSettings.userID || 'guest') : 'guest';

    try {
      const res = await fetch(`/api/profile/${username}?current_user_id=${myID}`);
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();

      usernameEl.textContent = data.username;
      avatarEl.textContent = data.username.charAt(0).toUpperCase();
      joinedEl.textContent = `Joined: ${new Date(data.created_at).toLocaleDateString()}`;
      eloEl.textContent = data.elo_rating;
      viewsEl.textContent = data.stats.profile_views;
      linkEl.href = `/profile_public.html?u=${data.username}`;

      // Friend Logic
      if (data.username === userSettings.name) {
        addFriendBtn.style.display = 'none'; // Can't add self
      } else if (data.is_friend) {
        addFriendBtn.disabled = false;
        addFriendBtn.textContent = 'Challenge ⚔️';

        // Override CSS !important rules to enable interaction
        addFriendBtn.style.setProperty('pointer-events', 'auto', 'important');
        addFriendBtn.style.setProperty('cursor', 'pointer', 'important');

        // Use green style
        addFriendBtn.style.setProperty('background', 'rgba(34, 197, 94, 0.2)', 'important');
        addFriendBtn.style.setProperty('color', '#4ade80', 'important');
        addFriendBtn.style.setProperty('border', '1px solid #22c55e', 'important');
        addFriendBtn.style.setProperty('opacity', '1', 'important');

        addFriendBtn.onclick = () => {
          if (typeof window.sendChallenge === 'function') {
            window.sendChallenge(data.username);
          } else {
            showToast("Please open the 'Battle' tab first to connect to the lobby!");
          }
        };
      } else {
        // Setup Add Friend Handler
        addFriendBtn.onclick = async () => {
          try {
            addFriendBtn.disabled = true;
            addFriendBtn.textContent = 'Sending...';
            const req = await fetch(`/api/friends/request/${data.username}?current_user_id=${myID}`, { method: 'POST' });

            if (req.ok) {
              addFriendBtn.textContent = 'Request Sent';
              statusMsg.textContent = 'Friend request sent!';
              statusMsg.style.display = 'block';
              statusMsg.style.color = 'var(--accent-success)';
            } else {
              const err = await req.json();
              addFriendBtn.textContent = 'Add Friend';
              addFriendBtn.disabled = false;
              statusMsg.textContent = err.detail || 'Failed to send request';
              statusMsg.style.display = 'block';
              statusMsg.style.color = 'var(--accent-danger)';
            }
          } catch (e) {
            console.error(e);
            addFriendBtn.disabled = false;
            addFriendBtn.textContent = 'Error';
          }
        };
      }

    } catch (e) {
      console.error(e);
      usernameEl.textContent = 'Error';
    }
  };

  // --- Practice View Logic ---
  let practiceViewInitialized = false;
  const problemsData = window.FULL_PROBLEM_SET || [];

  // --- Persistence Logic ---
  let solvedProblemsMap = {};

  async function fetchSolvedStatus() {
    if (!window.userSettings || !window.userSettings.userID) return;
    try {
      const response = await fetch(`/api/submissions/status/${window.userSettings.userID}`);
      if (response.ok) {
        solvedProblemsMap = await response.json();
        // If practice view is active, we might want to re-render, but for now initPracticeView calls this.
      }
    } catch (e) {
      console.error('Failed to fetch solved status:', e);
    }
  }


  // Restore latest code
  window.fetchAndRestoreLatestCode = async function (problemId) {
    if (!userSettings.userID || !window.editorInstance) return;
    try {
      const response = await fetch(`/ api / submissions / history / ${userSettings.userID}/${encodeURIComponent(problemId)}`);
      if (response.ok) {
        const history = await response.json();
        if (history.length > 0) {
          const latest = history[0];
          console.log('[Restore] Restoring latest submission:', latest.id);
          // Use setValue to update editor content
          window.editorInstance.setValue(latest.code);
        }
      }
    } catch (e) {
      console.error('Failed to restore code:', e);
    }
  };

  function initPracticeView() {
    if (practiceViewInitialized) return;
    const topicFiltersContainer = document.getElementById('topic-filters');
    const problemsTableBody = document.getElementById('problems-table-body');
    const searchInput = document.getElementById('problem-search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn'); // Get Reference

    if (!topicFiltersContainer || !problemsTableBody || !searchInput) return;

    // Fetch status initially
    fetchSolvedStatus().then(() => renderProblems());

    let currentTopic = 'All Problems';
    let searchTerm = '';

    // Search Logic with Debounce and Clear Button
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;

      // Toggle Clear Button Visibility
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchTerm.length > 0 ? 'flex' : 'none';
      }

      renderProblems();
    });

    // Clear Button Click Handler
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchTerm = '';
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        renderProblems();
      });
    }
    let currentFilters = {
      status: [],
      difficulty: [],
      topics: []
    };

    function renderProblems() {
      const filteredProblems = problemsData.filter(p => {
        // Text search
        if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        // Topic filter (from topic buttons)
        if (currentTopic !== 'All Problems' && p.topic !== currentTopic) {
          return false;
        }

        // Status filter
        if (currentFilters.status.length > 0) {
          const isSolved = solvedProblemsMap[p.title]?.status === 'accepted';
          const statusMatch = currentFilters.status.some(s =>
            (s === 'solved' && isSolved) || (s === 'unsolved' && !isSolved)
          );
          if (!statusMatch) return false;
        }

        // Difficulty filter
        if (currentFilters.difficulty.length > 0) {
          if (!currentFilters.difficulty.includes(p.difficulty)) {
            return false;
          }
        }

        // Topics filter (from dropdown)
        if (currentFilters.topics.length > 0) {
          if (!currentFilters.topics.includes(p.topic)) {
            return false;
          }
        }

        return true;
      });
      problemsTableBody.innerHTML = filteredProblems.map((p, index) => {
        const isSolved = solvedProblemsMap[p.title] && solvedProblemsMap[p.title].status === 'accepted';
        return `<tr onclick="window.openCodeEditor('${p.title}')" style="cursor: pointer;">
                <td style="text-align: center; padding-left: 0; padding-right: 10px;">
                  ${isSolved ? `<label class="custom-checkbox" onclick="event.stopPropagation()" style="cursor: default;">
                    <input type="checkbox" class="problem-solved-checkbox" data-problem="${p.title}" checked disabled>
                    <span class="checkmark"></span>
                  </label>` : ''}
                </td>
                <td style="text-align: center; padding-right: 10px; color: var(--text-secondary); white-space: nowrap;">${index + 1}</td>
                <td style="padding-left: 0; white-space: nowrap;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${p.title}
                    </div>
                </td>
                <td><span class="difficulty-tag ${p.difficulty.toLowerCase()}">${p.difficulty}</span></td>
                <td>${p.acceptance}</td>
              </tr>`;
      }).join('');
    }

    function populateTopicFilters() {
      const topics = ['All Problems', ...new Set(problemsData.map(p => p.topic))];
      topicFiltersContainer.innerHTML = topics.map(topic => `<button class="topic-filter-btn ${topic === 'All Problems' ? 'active' : ''}" data-topic="${topic}">${topic}</button>`).join('');
      topicFiltersContainer.querySelectorAll('.topic-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentTopic = btn.dataset.topic;
          topicFiltersContainer.querySelector('.active').classList.remove('active');
          btn.classList.add('active');
          renderProblems();
        });
      });
    }

    // Scroll button functionality
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');

    if (scrollLeftBtn) {
      scrollLeftBtn.addEventListener('click', () => {
        topicFiltersContainer.scrollBy({ left: -200, behavior: 'smooth' });
      });
    }

    if (scrollRightBtn) {
      scrollRightBtn.addEventListener('click', () => {
        topicFiltersContainer.scrollBy({ left: 200, behavior: 'smooth' });
      });
    }

    // Filter dropdown functionality
    const filterBtn = document.getElementById('filter-btn');
    const filterDropdown = document.getElementById('filter-dropdown');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const filterCategories = document.getElementById('filter-categories');
    const filterHeader = filterDropdown?.querySelector('.filter-header');

    if (filterBtn && filterDropdown) {
      // Show/hide submenu functions (defined first)
      function showSubmenu(submenuName) {
        // Hide main menu elements
        if (filterHeader) filterHeader.style.display = 'none';
        filterCategories.style.display = 'none';

        // Show submenu
        const submenu = document.getElementById(`${submenuName}-submenu`);
        if (submenu) {
          submenu.classList.add('show');
        }
      }

      function showMainMenu() {
        // Show main menu elements
        if (filterHeader) filterHeader.style.display = 'flex';
        filterCategories.style.display = 'flex';

        // Hide all submenus
        const submenus = filterDropdown.querySelectorAll('.filter-submenu');
        submenus.forEach(submenu => {
          submenu.classList.remove('show');
        });
      }

      // Toggle filter dropdown
      filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('show');
        filterBtn.classList.toggle('active');

        // Reset to main menu when opening
        if (filterDropdown.classList.contains('show')) {
          showMainMenu();
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
          filterDropdown.classList.remove('show');
          filterBtn.classList.remove('active');
          showMainMenu(); // Reset to main menu
        }
      });

      // Category button handlers
      const statusBtn = document.getElementById('status-filter-btn');
      const difficultyBtn = document.getElementById('difficulty-filter-btn');
      const topicsBtn = document.getElementById('topics-filter-btn');

      if (statusBtn) {
        statusBtn.addEventListener('click', () => showSubmenu('status'));
      }
      if (difficultyBtn) {
        difficultyBtn.addEventListener('click', () => showSubmenu('difficulty'));
      }
      if (topicsBtn) {
        topicsBtn.addEventListener('click', () => showSubmenu('topics'));
      }

      // Back button handlers
      const backBtns = filterDropdown.querySelectorAll('.back-btn');
      backBtns.forEach(btn => {
        btn.addEventListener('click', () => showMainMenu());
      });
    }

    // Populate filter topics
    function populateFilterTopics() {
      const topics = [...new Set(problemsData.map(p => p.topic))];
      const topicsList = document.getElementById('filter-topics-list');

      if (topicsList) {
        topicsList.innerHTML = topics.map(topic => `
              <label class="filter-option">
                <input type="checkbox" class="filter-topic-checkbox" value="${topic}">
                <span>${topic}</span>
              </label>
            `).join('');

        // Add event listeners to topic checkboxes
        topicsList.querySelectorAll('input').forEach(checkbox => {
          checkbox.addEventListener('change', handleFilterChange);
        });
      }
    }

    // Handle filter changes
    function handleFilterChange(e) {
      const { value, checked } = e.target;

      if (e.target.classList.contains('filter-status')) {
        if (checked) {
          currentFilters.status.push(value);
        } else {
          currentFilters.status = currentFilters.status.filter(s => s !== value);
        }
      } else if (e.target.classList.contains('filter-difficulty')) {
        if (checked) {
          currentFilters.difficulty.push(value);
        } else {
          currentFilters.difficulty = currentFilters.difficulty.filter(d => d !== value);
        }
      } else if (e.target.classList.contains('filter-topic-checkbox')) {
        if (checked) {
          currentFilters.topics.push(value);
        } else {
          currentFilters.topics = currentFilters.topics.filter(t => t !== value);
        }
      }

      renderProblems();
    }

    // Clear all filters
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        currentFilters = {
          status: [],
          difficulty: [],
          topics: []
        };

        // Uncheck all filter checkboxes
        filterDropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.checked = false;
        });

        renderProblems();
      });
    }

    // Add event listeners to status and difficulty filters
    filterDropdown.querySelectorAll('.filter-status, .filter-difficulty').forEach(checkbox => {
      checkbox.addEventListener('change', handleFilterChange);
    });

    searchInput.addEventListener('input', (e) => { searchTerm = e.target.value; renderProblems(); });
    populateTopicFilters();
    populateFilterTopics();
    renderProblems();
    practiceViewInitialized = true;
  }

  // --- Rewards View Logic ---
  function generateRewards() {
    const rewardsGrid = document.getElementById('rewards-grid');
    if (!rewardsGrid) return;
    const rewardsData = [
      { icon: '📅', title: 'Week Warrior', description: 'Maintain a 7-day coding streak.' }, { icon: '🔥', title: 'Grind Master', description: 'Maintain a 30-day coding streak.' },
      { icon: '🏆', title: 'Contest King', description: 'Win a weekly coding contest.' }, { icon: '🧠', title: 'AlgoQueen', description: 'Solve 10 hard algorithm problems.' },
      { icon: '🚀', title: 'Speed Racer', description: 'Solve a problem in under 5 minutes.' }, { icon: '💡', title: 'Optimization Expert', description: 'Submit a solution with optimal complexity.' },
      { icon: '💻', title: 'DP Dynamo', description: 'Solve 5 Dynamic Programming problems.' }, { icon: '🔗', title: 'Graph Guru', description: 'Solve 5 Graph theory problems.' },
    ];
    rewardsGrid.innerHTML = rewardsData.map(badge => `<div class="badge-card"><div class="badge-icon" style="font-size: 32px;">${badge.icon}</div><div class="badge-title">${badge.title}</div><div class="badge-description">${badge.description}</div></div>`).join('');
  }

  // --- Settings View Logic ---
  let settingsViewInitialized = false;
  function initSettingsView() {
    const form = document.getElementById('settings-form');
    const userIDInput = document.getElementById('setting-userid');
    const nameInput = document.getElementById('setting-name');
    const genderInput = document.getElementById('setting-gender');
    const locationInput = document.getElementById('setting-location');
    const githubInput = document.getElementById('setting-github');
    const linkedinInput = document.getElementById('setting-linkedin');
    if (!form) return;

    userIDInput.value = userSettings.userID;
    nameInput.value = userSettings.name || '';
    genderInput.value = userSettings.gender || '';
    locationInput.value = userSettings.location || '';
    githubInput.value = userSettings.github || '';
    linkedinInput.value = userSettings.linkedin || '';

    if (settingsViewInitialized) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      userSettings.name = nameInput.value.trim() || userSettings.userID;
      userSettings.gender = genderInput.value;
      userSettings.location = locationInput.value.trim();
      userSettings.github = githubInput.value.trim();
      userSettings.linkedin = linkedinInput.value.trim();
      saveUserSettings();
      updateHeaderUI();
      showToast();
    });
    settingsViewInitialized = true;
  }

  function showToast(message = "Changes saved successfully!") {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // --- Contests View Logic ---
  // --- Contests View Logic ---
  function initContestsView() {
    const inviteBtn = document.getElementById('invite-friend-btn');
    const emailInput = document.getElementById('invite-email-input');
    const onlineList = document.getElementById('online-users-list');

    if (inviteBtn) {
      inviteBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (!email) {
          showToast("Please enter an email address.");
          return;
        }

        // Generate unique match ID
        const matchId = 'match_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        // Generate Guest Link - use battle_join.html for onboarding, pass match_id
        const inviterName = userSettings.name || userSettings.userID;
        const link = `${window.location.origin}/battle_join.html?match_id=${matchId}&inviter=${encodeURIComponent(inviterName)}`;

        // Copy to Clipboard
        navigator.clipboard.writeText(link).then(() => {
          showToast(`Invite Link copied! Redirecting to battle...`);
          emailInput.value = '';

          // Redirect inviter to battle screen as host
          setTimeout(() => {
            window.location.href = `/battle.html?match_id=${matchId}&is_host=true`;
          }, 1000);
        }).catch(err => {
          console.error('Failed to copy text: ', err);
          showToast(`Invite sent to ${email}!`);
          emailInput.value = '';

          // Still redirect even if clipboard fails
          setTimeout(() => {
            window.location.href = `/battle.html?match_id=${matchId}&is_host=true`;
          }, 1000);
        });
      });
    }

    // Lobby WebSocket
    let lobbyWs = null;
    function connectLobby() {
      const userId = userSettings.name || userSettings.userID;
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // Use port 8001 specifically as backend is on 8001, but relative path might fail if serving from 5500 via live server
      // We'll use absolute URL to backend for safety here or relative if same origin
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
          // window.location.href = `/battle.html?match_id=${data.match_id}`;
          showMatchReadyModal(data.match_id);
        }
      };

      lobbyWs.onclose = () => {
        setTimeout(connectLobby, 5000); // Reconnect
      };
    }

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
        // Retry logic if needed, or ask user to try again
      }
    };

    // Match Ready Modal
    function showMatchReadyModal(matchId) {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.style.display = 'flex'; // Force show

      overlay.innerHTML = `
                <div class="modal-container" style="text-align: center; padding: 40px; border: 1px solid var(--accent1); box-shadow: 0 0 20px rgba(78, 168, 255, 0.2);">
                    <div style="font-size: 3rem; margin-bottom: 20px;">⚔️</div>
                    <h2 style="margin-bottom: 10px; color: var(--text-primary);">Match Ready!</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 30px;">Your opponent is ready. Enter the arena?</p>
                    
                    <button id="manual-join-btn" class="solve-btn" style="width: 100%; font-size: 1.2rem; padding: 15px;">
                        ENTER BATTLE
                    </button>
                    <div style="margin-top: 15px; font-size: 0.9rem; color: var(--text-secondary); cursor: pointer; text-decoration: underline;" onclick="this.closest('.modal-overlay').remove()">Cancel</div>
                </div>
            `;

      document.body.appendChild(overlay);

      document.getElementById('manual-join-btn').onclick = () => {
        window.location.href = `/battle.html?match_id=${matchId}`;
      };
    }

    // Modal Logic
    const challengeModal = document.getElementById('challenge-modal');
    let currentChallengerId = null;
    function showChallengeModal(challengerId) {
      if (challengeModal) {
        currentChallengerId = challengerId;
        document.getElementById('challenger-name').textContent = challengerId;
        challengeModal.classList.add('active');
      }
    }

    if (document.getElementById('accept-challenge-btn')) {
      document.getElementById('accept-challenge-btn').addEventListener('click', () => {
        if (lobbyWs && currentChallengerId) {
          lobbyWs.send(JSON.stringify({
            type: 'ACCEPT_CHALLENGE',
            challenger_id: currentChallengerId
          }));
          challengeModal.classList.remove('active');
        }
      });
      document.getElementById('decline-challenge-btn').addEventListener('click', () => {
        challengeModal.classList.remove('active');
      });
    }

    connectLobby();

    // Active Users Logic
    async function fetchActiveUsers() {
      // ... (Fetch logic needs to call sendChallenge on click)
      // We need to overwrite the innerHTML logic to use onclick="window.sendChallengeGlobal(...)"
    }

    window.sendChallengeGlobal = window.sendChallenge; // Expose for HTML string

    async function fetchActiveUsersInternal() { // Renamed to avoid scoping conflict if any
      if (!onlineList) return;
      try {
        const res = await fetch('/api/battle/active_users');
        const data = await res.json();
        const users = data.users || [];
        const currentUserId = userSettings.name || userSettings.userID;

        onlineList.innerHTML = users.length === 0
          ? '<div style="text-align:center; color:var(--text-secondary); padding:20px;">No users online. Be the first!</div>'
          : users.filter(u => u.user_id !== currentUserId).map(u => `
                        <div class="online-user-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                          <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; border-radius: 5; background: linear-gradient(135deg, var(--accent1), var(--accent2)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;">
                              ${u.user_id.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style="color: var(--text-primary); font-weight: 600;">${u.user_id}</div>
                              <div style="color: var(--text-secondary); font-size: 0.8rem;">Status: <span style="color:${u.status === 'battling' ? '#ef4444' : '#22c55e'}">${u.status}</span> • Rating: ${u.rating}</div>
                            </div>
                </div>
                          ${u.status === 'battling' ?
              `<button onclick="window.location.href='/battle.html'" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: not-allowed; opacity: 0.7;">Battling</button>` :
              `<button onclick="window.sendChallengeGlobal('${u.user_id}')" style="padding: 8px 16px; background: linear-gradient(135deg, var(--accent1), var(--accent2)); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Challenge</button>`
            }
                        </div>
                    `).join('');

        // Update counts (Simplified)
        const count = users.length;
        const bottomMsg = onlineList.nextElementSibling.querySelector('span');
        if (bottomMsg) bottomMsg.textContent = `${count} users online`;

      } catch (e) {
        console.error("Failed to fetch active users", e);
      }
    }

    fetchActiveUsersInternal();
    setInterval(fetchActiveUsersInternal, 5000);

  }

  function runDashboardAnimations() {
    document.querySelectorAll('.stats-grid .card, .main-column .card, .side-column .card').forEach((el, index) => {
      el.classList.add('anim-hidden', 'animate-in');
      el.style.animationDelay = `${100 + index * 100}ms`;
    });
  }

  // --- INITIALIZATION ---
  function initializeDashboard() {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(storedTheme);

    loadUserSettings();
    updateHeaderUI();

    if (waveCanvas) resizeCanvas();
    animationLoop();
    runDashboardAnimations();
    initContestsView();
    generateLeaderboard();
  }

  initializeDashboard();
});
