
// dashboard_main.js - Entry Point
import { loadUserSettings, updateHeaderUI, userSettings } from './modules/auth.js';
import { applyTheme, initCanvas, runDashboardAnimations, initNavigation, generateRewards } from './modules/ui.js';
import { initPracticeView } from './modules/practice.js';
import { initContestsView } from './modules/battle.js';
import { openUserProfile, generateLeaderboard } from './modules/profile.js';
import { initSettingsView } from './modules/settings.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth & Settings
    loadUserSettings();
    const storedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(storedTheme);
    updateHeaderUI();

    // Theme Toggle Listener
    const beatToggle = document.getElementById('beat-toggle');
    if (beatToggle) {
        beatToggle.checked = (storedTheme === 'dark'); // Set initial state
        beatToggle.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    // 2. UI & Animations
    initCanvas();
    runDashboardAnimations();
    initNavigation();
    generateRewards();

    // 3. Feature Views
    initPracticeView(); // Pre-load practice data
    initContestsView(); // Setup battle listeners
    initSettingsView(); // Setup settings form

    // 4. Leaderboard
    generateLeaderboard();

    console.log("Dashboard Modules Loaded via dashboard_main.js");
});
