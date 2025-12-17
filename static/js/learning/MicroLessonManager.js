/**
 * MicroLessonManager
 * Delivers bite-sized mindset and strategy lessons based on user context.
 * Premium Feature.
 */
class MicroLessonManager {
    constructor() {
        this.errorStreak = 0;
        this.lastLessonTime = 0;
        this.cooldown = 120000; // 2 minutes between lessons
        this.frustrationThreshold = 0.6;
    }

    init() {
        console.log('[MicroLessons] Initializing...');
        this.setupEventListeners();
        this.createToastContainer();
    }

    setupEventListeners() {
        // Listen for submission results
        document.addEventListener('submit_result', (e) => {
            if (e.detail && e.detail.success === false) {
                this.errorStreak++;
                this.checkErrorTrigger();
            } else {
                this.errorStreak = 0; // Reset on success
            }
        });

        // Listen for cognitive updates (frustration)
        document.addEventListener('cognitive-update', (e) => {
            const analysis = e.detail;
            if (analysis && analysis.states && analysis.states.frustration > this.frustrationThreshold) {
                this.triggerLesson('frustration', analysis.states.frustration);
            }
        });
    }

    async triggerLesson(triggerType, contextScore = 0) {
        const now = Date.now();
        if (now - this.lastLessonTime < this.cooldown) {
            console.log('[MicroLessons] Cooldown active, skipping...');
            return;
        }

        const user = JSON.parse(localStorage.getItem('beatCodersUser') || '{}');
        console.log('[MicroLessons] User premium status:', user.is_premium);

        // 1. FREE USER: Show Upsell
        if (!user.is_premium) {
            if (this.shouldShowUpsell()) {
                this.showUpsellToast(triggerType);
                this.lastLessonTime = now;
            }
            return;
        }

        // 2. PREMIUM USER: Fetch Lesson
        console.log('[MicroLessons] Fetching lesson for premium user...');
        try {
            const response = await fetch('/api/learning/lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.user_id,
                    trigger: triggerType,
                    context_score: contextScore
                })
            });

            console.log('[MicroLessons] API Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('[MicroLessons] API Response data:', data);
                if (data.lesson) {
                    this.showLessonToast(data.lesson);
                    this.lastLessonTime = now;
                } else {
                    console.warn('[MicroLessons] No lesson in response');
                }
            } else {
                console.error('[MicroLessons] API returned error:', response.status);
            }
        } catch (error) {
            console.error('[MicroLessons] Failed to fetch lesson:', error);
        }
    }

    checkErrorTrigger() {
        if (this.errorStreak >= 3) {
            this.triggerLesson('error_streak');
            this.errorStreak = 0; // Reset to avoid spamming every error after 3
        }
    }

    shouldShowUpsell() {
        // ALWAYS show for verification (User Request)
        return true;
    }

    createToastContainer() {
        if (document.getElementById('lesson-toast-container')) return;
        const container = document.createElement('div');
        container.id = 'lesson-toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);

        // Inject styles
        const style = document.createElement('style');
        style.textContent = `
            .lesson-toast {
                background: rgba(16, 24, 40, 0.95);
                border: 1px solid rgba(78, 168, 255, 0.3);
                border-radius: 12px;
                padding: 16px;
                width: 350px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                backdrop-filter: blur(10px);
                animation: slideUpFade 0.5s ease-out forwards;
                pointer-events: auto;
                position: relative;
                overflow: hidden;
            }
            .lesson-toast::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(to bottom, #4ea8ff, #8b5cf6);
            }
            .lesson-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                font-weight: 600;
                font-size: 0.9rem;
                color: #4ea8ff;
            }
            .lesson-content {
                color: #e2e8f0;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            .lesson-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                font-size: 1.2rem;
            }
            .lesson-close:hover { color: #fff; }
            
            .upsell-toast {
                border-color: #ef4444;
            }
            .upsell-toast::before {
                background: linear-gradient(to bottom, #ef4444, #f59e0b);
            }
            .upsell-btn {
                margin-top: 10px;
                padding: 6px 12px;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 0.8rem;
                cursor: pointer;
                width: 100%;
            }

            @keyframes slideUpFade {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes toastExit {
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }

    showLessonToast(lesson) {
        const container = document.getElementById('lesson-toast-container');
        const toast = document.createElement('div');
        toast.className = 'lesson-toast';

        toast.innerHTML = `
            <button class="lesson-close" onclick="this.parentElement.remove()">×</button>
            <div class="lesson-header">
                <span>💡 AI Coach</span>
                <span style="opacity:0.6">• ${lesson.type.toUpperCase()}</span>
            </div>
            <div class="lesson-content">
                <strong>${lesson.title}</strong><br>
                ${lesson.content}
            </div>
        `;

        container.appendChild(toast);

        // Auto-remove after 10s
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'toastExit 0.5s ease-out forwards';
                setTimeout(() => toast.remove(), 500);
            }
        }, 12000);
    }

    showUpsellToast(trigger) {
        const container = document.getElementById('lesson-toast-container');
        const toast = document.createElement('div');
        toast.className = 'lesson-toast upsell-toast';

        const triggerText = trigger === 'frustration' ? "Frustrated?" : "Stuck?";

        toast.innerHTML = `
            <button class="lesson-close" onclick="this.parentElement.remove()">×</button>
            <div class="lesson-header" style="color: #ef4444;">
                <span>🔒 Premium Insight</span>
            </div>
            <div class="lesson-content">
                <strong>${triggerText}</strong><br>
                Our AI Coach has a strategy for this exact moment.<br>
                Upgrade to unlock real-time mindset coaching.
            </div>
            <button class="upsell-btn" onclick="alert('Redirecting to Pricing...')">Unlock AI Coach</button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'toastExit 0.5s ease-out forwards';
                setTimeout(() => toast.remove(), 500);
            }
        }, 8000);
    }
}

// Global Export
window.MicroLessonManager = MicroLessonManager;
