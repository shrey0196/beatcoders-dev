/**
 * Cognitive Analysis Integration for Dashboard
 * Adds cognitive analysis display to the code submission feedback
 */

(function () {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Find the feedback section and add cognitive analysis container
        const feedbackSection = document.getElementById('feedback-section');
        if (!feedbackSection) {
            console.warn('[Cognitive] Feedback section not found');
            return;
        }

        // Create cognitive analysis section
        const cognitiveSection = document.createElement('div');
        cognitiveSection.id = 'cognitive-analysis-section';
        cognitiveSection.style.cssText = 'margin-top: 30px; border-top: 1px solid var(--border-color); padding-top: 20px; display: none;';
        cognitiveSection.innerHTML = `
            <h3 style="color: var(--text-primary); margin-bottom: 15px;">🧠 Cognitive Analysis</h3>
            <div id="cognitive-summary" style="margin-bottom: 20px; color: var(--text-secondary);">Loading analysis...</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div class="cog-stat">
                    <div class="cog-label">Coder Type</div>
                    <div class="cog-value" id="cog-type">-</div>
                </div>
                <div class="cog-stat">
                    <div class="cog-label">WPM</div>
                    <div class="cog-value" id="cog-wpm">0</div>
                </div>
                <div class="cog-stat">
                    <div class="cog-label">Focus</div>
                    <div class="cog-value" id="cog-focus">0%</div>
                </div>
                <div class="cog-stat">
                    <div class="cog-label">Frustration</div>
                    <div class="cog-value" id="cog-frustration">0%</div>
                </div>
            </div>
        `;

        feedbackSection.appendChild(cognitiveSection);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .cog-stat {
                background: var(--glass);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .cog-label {
                font-size: 0.85rem;
                color: var(--text-secondary);
                margin-bottom: 8px;
            }
            .cog-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--accent1);
            }
            .cog-value.good { color: var(--green); }
            .cog-value.warn { color: var(--red); }
        `;
        document.head.appendChild(style);

        console.log('[Cognitive] Analysis section added to dashboard');
    }

    // Expose function to load analysis
    window.loadCognitiveAnalysis = async function (taskId) {
        const section = document.getElementById('cognitive-analysis-section');
        if (!section) return;

        section.style.display = 'block';

        try {
            const response = await fetch(`http://localhost:8001/api/cognitive/analysis/${taskId}`);
            if (!response.ok) throw new Error('No analysis available');

            const data = await response.json();
            const { metrics, states, fingerprint } = data.analysis;

            // Update UI
            document.getElementById('cog-type').textContent = fingerprint.type;
            document.getElementById('cog-wpm').textContent = metrics.wpm;

            const focusEl = document.getElementById('cog-focus');
            focusEl.textContent = Math.round(states.focus * 100) + '%';
            focusEl.className = 'cog-value ' + (states.focus > 0.7 ? 'good' : 'warn');

            const frustEl = document.getElementById('cog-frustration');
            frustEl.textContent = Math.round(states.frustration * 100) + '%';
            frustEl.className = 'cog-value ' + (states.frustration < 0.3 ? 'good' : 'warn');

            document.getElementById('cognitive-summary').textContent =
                `Analysis complete: ${data.signal_count} signals processed`;

        } catch (error) {
            document.getElementById('cognitive-summary').textContent =
                '⚠️ No cognitive data available for this session';
        }
    };
})();
