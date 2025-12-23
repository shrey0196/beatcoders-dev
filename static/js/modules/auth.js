
// auth.js - User Authentication & Settings Management

// Global User Settings Object
export const userSettings = {
    userID: null,
    name: null, // Display Name
    gender: null,
    location: null,
    github: null,
    linkedin: null
};

// Make it globally available for legacy code compatibility
window.userSettings = userSettings;

export function loadUserSettings() {
    const storedID = localStorage.getItem('beatCodersUserID');
    const storedName = localStorage.getItem('beatCodersRealName'); // "Real Name" field for display
    const storedGender = localStorage.getItem('beatCodersGender');
    const storedLocation = localStorage.getItem('beatCodersLocation');
    const storedGithub = localStorage.getItem('beatCodersGithub');
    const storedLinkedin = localStorage.getItem('beatCodersLinkedin');

    if (storedID) {
        userSettings.userID = storedID;
        userSettings.name = storedName || storedID; // Default to ID if no name
        userSettings.gender = storedGender;
        userSettings.location = storedLocation;
        userSettings.github = storedGithub;
        userSettings.linkedin = storedLinkedin;
    } else {
        // Generate a random Guest ID if none exists
        const guestID = 'guest_' + Math.random().toString(36).substr(2, 9);
        userSettings.userID = guestID;
        userSettings.name = "Guest User";
        localStorage.setItem('beatCodersUserID', guestID);
    }
}

export function saveUserSettings() {
    if (userSettings.userID) localStorage.setItem('beatCodersUserID', userSettings.userID);
    if (userSettings.name) localStorage.setItem('beatCodersRealName', userSettings.name);
    if (userSettings.gender) localStorage.setItem('beatCodersGender', userSettings.gender);
    if (userSettings.location) localStorage.setItem('beatCodersLocation', userSettings.location);
    if (userSettings.github) localStorage.setItem('beatCodersGithub', userSettings.github);
    if (userSettings.linkedin) localStorage.setItem('beatCodersLinkedin', userSettings.linkedin);
}

export function updateHeaderUI() {
    const welcomeMsg = document.getElementById('welcome-msg');
    const userAvatar = document.querySelector('.user-profile .avatar'); // Refined selector
    const userNameDisplay = document.querySelector('.user-profile .username');

    if (welcomeMsg) {
        welcomeMsg.textContent = `Welcome back, ${userSettings.name || 'Coder'}!`;
    }
    if (userAvatar) {
        userAvatar.textContent = (userSettings.name || 'G').charAt(0).toUpperCase();
    }
    if (userNameDisplay) {
        userNameDisplay.textContent = userSettings.name || 'Guest';
    }
}
