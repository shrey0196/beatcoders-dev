
// settings.js - User Settings Form Logic
import { userSettings, saveUserSettings, updateHeaderUI } from './auth.js';
import { showToast } from './ui.js';

let settingsViewInitialized = false;

export function initSettingsView() {
    const form = document.getElementById('settings-form');
    const userIDInput = document.getElementById('setting-userid');
    const nameInput = document.getElementById('setting-name');
    const genderInput = document.getElementById('setting-gender');
    const locationInput = document.getElementById('setting-location');
    const githubInput = document.getElementById('setting-github');
    const linkedinInput = document.getElementById('setting-linkedin');

    if (!form) return;

    // Populate current values
    if (userIDInput) userIDInput.value = userSettings.userID || '';
    if (nameInput) nameInput.value = userSettings.name || '';
    if (genderInput) genderInput.value = userSettings.gender || '';
    if (locationInput) locationInput.value = userSettings.location || '';
    if (githubInput) githubInput.value = userSettings.github || '';
    if (linkedinInput) linkedinInput.value = userSettings.linkedin || '';

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
        showToast("Settings saved successfully!");
    });

    settingsViewInitialized = true;
}
