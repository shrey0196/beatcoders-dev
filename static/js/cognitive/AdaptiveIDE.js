/**
 * AdaptiveIDE - Intelligent UI adaptation based on cognitive state
 * Monitors user's cognitive metrics and adapts the IDE interface in real-time
 */

class AdaptiveIDE {
    constructor() {
        this.isActive = false;
        this.focusModeEnabled = false;
        this.currentState = null;
        this.thresholds = {
            frustration: 0.7,
            fatigue: 0.6,
            lowFocus: 0.4
        };
        this.lastAutoTriggerTime = 0;
        this.autoTriggerCooldown = 60000; // 1 minute cooldown
        this.encouragementMessages = [
            "💪 You've got this! Take a deep breath.",
            "🧠 Complex problems take time. You're making progress!",
            "☕ Consider taking a short break to refresh your mind.",
            "🎯 Break the problem into smaller steps.",
            "✨ Every expert was once a beginner. Keep going!"
        ];
        this.lastEncouragementTime = 0;
        this.encouragementCooldown = 60000; // 1 minute
    }

    /**
     * Initialize the adaptive IDE system
     */
    init() {
        console.log('[AdaptiveIDE] Initializing...');
        if (!this.checkPremium()) {
            console.log('[AdaptiveIDE] Premium not active. Adaptive features disabled.');
            return;
        }
        this.isActive = true;
        this.createFocusModeButton();
        this.createEncouragementContainer();
        console.log('[AdaptiveIDE] Ready');
    }

    checkPremium() {
        const user = JSON.parse(localStorage.getItem('beatCodersUser') || '{}');
        return true; // user.is_premium === true; // TEMPORARY: Force enable for testing
    }

    /**
     * Create Focus Mode toggle button in the editor navbar
     */
    createFocusModeButton() {
        // Try to find the editor navbar or modal header
        let container = document.getElementById('editor-navbar');
        let insertBeforeNode = null;

        // Fallback: Target the Code Editor Modal Header
        if (!container) {
            const modal = document.getElementById('code-editor-modal');
            if (modal) {
                container = modal.querySelector('.modal-header');
                // Insert before the close button
                insertBeforeNode = container ? container.querySelector('.modal-close-btn') : null;
            }
        }

        if (!container) {
            console.log('[AdaptiveIDE] Could not find editor container to attach Focus Button');
            return;
        }

        // Check if button already exists
        if (document.getElementById('focus-mode-toggle')) return;

        const focusBtn = document.createElement('button');
        focusBtn.id = 'focus-mode-toggle';
        focusBtn.className = 'focus-mode-btn';
        focusBtn.innerHTML = '🎯 Focus Mode';
        focusBtn.style.cssText = `
            padding: 6px 14px;
            background: rgba(168, 85, 247, 0.2);
            color: #a855f7;
            border: 1px solid rgba(168, 85, 247, 0.4);
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-left: auto;
            margin-right: 10px; /* Add spacing from close button */
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.9rem;
        `;

        focusBtn.addEventListener('click', () => this.toggleFocusMode());

        // Insert into the button container (right side of navbar)
        const buttonContainer = document.querySelector('#editor-navbar > div:last-child');
        if (buttonContainer) {
            buttonContainer.insertBefore(focusBtn, buttonContainer.firstChild);
        } else if (insertBeforeNode) {
            container.insertBefore(focusBtn, insertBeforeNode);
        } else {
            container.appendChild(focusBtn);
        }
    }

    /**
     * Create container for encouragement messages
     */
    createEncouragementContainer() {
        if (document.getElementById('encouragement-container')) return;

        const container = document.createElement('div');
        container.id = 'encouragement-container';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            max-width: 300px;
            padding: 15px 20px;
            background: linear-gradient(135deg, var(--accent1), var(--accent2));
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            animation: slideInRight 0.5s ease;
            font-size: 14px;
            line-height: 1.5;
        `;
        document.body.appendChild(container);

        // Add animation styles if not present
        if (!document.getElementById('adaptive-animations')) {
            const style = document.createElement('style');
            style.id = 'adaptive-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
                
                /* Focus Mode Styles */
                body.focus-mode-active #problem-pane {
                    display: none !important;
                }
                body.focus-mode-active #coding-pane {
                    width: 100% !important;
                }
                body.focus-mode-active #editor-navbar > div:first-child {
                    opacity: 0.3;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Toggle Focus Mode manually
     */
    toggleFocusMode() {
        this.focusModeEnabled = !this.focusModeEnabled;
        const btn = document.getElementById('focus-mode-toggle');

        if (this.focusModeEnabled) {
            this.activateFocusMode();
            if (btn) {
                btn.innerHTML = '❌ Exit Focus';
                btn.style.background = 'rgba(239, 68, 68, 0.2)';
                btn.style.color = '#ef4444';
                btn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }
        } else {
            this.deactivateFocusMode();
            if (btn) {
                btn.innerHTML = '🎯 Focus Mode';
                btn.style.background = 'rgba(168, 85, 247, 0.2)';
                btn.style.color = '#a855f7';
                btn.style.borderColor = 'rgba(168, 85, 247, 0.4)';
            }
        }
    }

    /**
     * Activate Focus Mode - hide distractions
     */
    activateFocusMode() {
        console.log('[AdaptiveIDE] Activating Focus Mode');
        document.body.classList.add('focus-mode-active');

        // Force layout update for Monaco editor
        if (window.editorInstance) {
            setTimeout(() => window.editorInstance.layout(), 100);
        }

        this.showNotification('🎯 Focus Mode Activated', 'Distractions minimized. You got this!');
    }

    /**
     * Deactivate Focus Mode
     */
    deactivateFocusMode() {
        console.log('[AdaptiveIDE] Deactivating Focus Mode');
        document.body.classList.remove('focus-mode-active');

        // Force layout update for Monaco editor
        if (window.editorInstance) {
            setTimeout(() => window.editorInstance.layout(), 100);
        }

        this.showNotification('✨ Focus Mode Deactivated', 'Welcome back!');
    }

    /**
     * Analyze cognitive state and trigger adaptations
     * @param {Object} analysis - Cognitive analysis data
     */
    adaptToState(analysis) {
        if (!this.isActive || !analysis) return;

        const { states } = analysis;
        this.currentState = states;

        // Auto-activate Focus Mode if struggling (High Frustration or Anger)
        const frustrationLevel = states.frustration || 0;
        const angerLevel = states.anger || 0;

        // Check cooldown to prevent rapid re-triggering
        const now = Date.now();
        const timeSinceLastTrigger = now - this.lastAutoTriggerTime;

        if (!this.focusModeEnabled && timeSinceLastTrigger > this.autoTriggerCooldown) {
            // STRICT: Require BOTH high frustration AND high anger
            if (frustrationLevel > this.thresholds.frustration && angerLevel > 0.7) {
                console.log('[AdaptiveIDE] Auto-activating Focus Mode (high frustration + anger detected)');
                console.log(`[AdaptiveIDE] Frustration: ${frustrationLevel.toFixed(2)}, Anger: ${angerLevel.toFixed(2)}`);
                this.toggleFocusMode();
                this.lastAutoTriggerTime = now;
            } else {
                console.log(`[AdaptiveIDE] Not triggering - Frustration: ${frustrationLevel.toFixed(2)}, Anger: ${angerLevel.toFixed(2)}`);
            }
        } else if (!this.focusModeEnabled) {
            console.log(`[AdaptiveIDE] Cooldown active - ${Math.round((this.autoTriggerCooldown - timeSinceLastTrigger) / 1000)}s remaining`);
        }

        // Show encouragement if frustrated but not enough to trigger focus mode yet
        if (frustrationLevel > 0.5 && frustrationLevel <= this.thresholds.frustration) {
            this.showEncouragement();
        }

        // Celebrate flow state
        if (states.focus > 0.8 && frustrationLevel < 0.3) {
            // Optional: subtle indicator
        }
    }

    /**
     * Show random encouragement message
     */
    showEncouragement() {
        const now = Date.now();
        if (now - this.lastEncouragementTime < this.encouragementCooldown) {
            return; // Don't spam messages
        }

        const message = this.encouragementMessages[
            Math.floor(Math.random() * this.encouragementMessages.length)
        ];

        const container = document.getElementById('encouragement-container');
        if (container) {
            container.textContent = message;
            container.style.display = 'block';

            setTimeout(() => {
                container.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => {
                    container.style.display = 'none';
                    container.style.animation = 'slideInRight 0.5s ease';
                }, 500);
            }, 5000);
        }

        this.lastEncouragementTime = now;
    }

    /**
     * Show a notification
     */
    showNotification(title, message) {
        // We can reuse the encouragement container for notifications or create a toast
        const container = document.getElementById('encouragement-container');
        if (container) {
            container.innerHTML = `<strong>${title}</strong><br>${message}`;
            container.style.display = 'block';

            setTimeout(() => {
                container.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => {
                    container.style.display = 'none';
                    container.style.animation = 'slideInRight 0.5s ease';
                }, 500);
            }, 3000);
        }
    }
}

// Export for use in other modules
window.AdaptiveIDE = AdaptiveIDE;
