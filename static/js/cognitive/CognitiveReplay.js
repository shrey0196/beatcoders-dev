/**
 * CognitiveReplay.js
 * Visualizes the "Cognitive Fingerprint" of a coding session.
 * Uses Chart.js to render typing speed, pauses, and frustration markers.
 */
class CognitiveReplay {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.chart = null;
    }

    async loadAndRender(taskId) {
        try {
            // 1. Fetch Analysis Data
            const response = await fetch(`/api/cognitive/analysis/${taskId}`);
            if (!response.ok) throw new Error('Failed to load analysis');

            const data = await response.json();
            const analysis = data.analysis;

            // 2. Fetch Raw Signals for Timeline
            const signalResponse = await fetch(`/api/cognitive/session/${taskId}`);
            const signalData = await signalResponse.json();

            this.renderChart(signalData.signals);
            this.renderSummary(analysis);

            // Populate insights panel
            this.populateSessionSummary(analysis);
            this.renderCoderTypeBadge(analysis.fingerprint);
            this.renderStateTimeline(signalData.signals);
            this.renderRecommendations(analysis);

            // Show insights panel
            const insightsPanel = document.getElementById('cognitive-insights-panel');
            if (insightsPanel) insightsPanel.style.display = 'block';

        } catch (err) {
            console.error('CognitiveReplay Error:', err);
            document.getElementById('cognitive-summary').innerHTML = `<div class="error">Could not load cognitive data: ${err.message}</div>`;
        }
    }

    renderSummary(analysis) {
        const container = document.getElementById('cognitive-summary');
        if (!container) return;

        const { wpm, total_time_sec } = analysis.metrics;
        const { fatigue, frustration, focus } = analysis.states;
        const type = analysis.fingerprint.type;

        container.innerHTML = `
            <div class="cog-stat-grid">
                <div class="cog-card">
                    <div class="cog-label">Coder Archetype</div>
                    <div class="cog-value highlight">${type}</div>
                </div>
                <div class="cog-card">
                    <div class="cog-label">Flow State (WPM)</div>
                    <div class="cog-value">${wpm}</div>
                </div>
                <div class="cog-card">
                    <div class="cog-label">Focus Score</div>
                    <div class="cog-value ${(focus > 0.7) ? 'good' : 'warn'}">${Math.round(focus * 100)}%</div>
                </div>
                <div class="cog-card">
                    <div class="cog-label">Frustration</div>
                    <div class="cog-value ${(frustration < 0.3) ? 'good' : 'bad'}">${Math.round(frustration * 100)}%</div>
                </div>
            </div>
        `;
    }

    populateSessionSummary(analysis) {
        const { wpm, total_time_sec, keystrokes } = analysis.metrics;
        const { focus } = analysis.states;

        // Update session metrics
        const durationEl = document.getElementById('session-duration');
        const wpmEl = document.getElementById('session-wpm');
        const focusEl = document.getElementById('session-focus');
        const keystrokesEl = document.getElementById('session-keystrokes');

        if (durationEl) durationEl.textContent = `${Math.round(total_time_sec / 60)}m`;
        if (wpmEl) wpmEl.textContent = Math.round(wpm);
        if (focusEl) focusEl.textContent = `${Math.round(focus * 100)}%`;
        if (keystrokesEl) keystrokesEl.textContent = keystrokes || '--';
    }

    renderCoderTypeBadge(fingerprint) {
        const badge = document.getElementById('coder-type-badge');
        if (!badge || !fingerprint) return;

        const iconEl = document.getElementById('coder-badge-icon');
        const textEl = document.getElementById('coder-type-text');
        const descEl = document.getElementById('coder-type-description');

        const archetypes = {
            'Speedster': { icon: '⚡', desc: 'Fast typist with high flow state' },
            'Thinker': { icon: '🧠', desc: 'Deliberate coder with careful planning' },
            'Balanced': { icon: '⚖️', desc: 'Well-rounded coding approach' },
            'Struggler': { icon: '💪', desc: 'Persistent through challenges' }
        };

        const type = fingerprint.type || 'Balanced';
        const archetype = archetypes[type] || archetypes['Balanced'];

        if (iconEl) iconEl.textContent = archetype.icon;
        if (textEl) textEl.textContent = type;
        if (descEl) descEl.textContent = archetype.desc;

        badge.style.display = 'block';
    }

    renderStateTimeline(signals) {
        const timeline = document.getElementById('state-timeline');
        const container = document.getElementById('state-timeline-container');
        if (!timeline || !container) return;

        // Create colored segments based on typing patterns
        timeline.innerHTML = '';
        const windowSize = 5000; // 5 second windows
        const startTime = signals[0]?.ts || 0;
        const endTime = signals[signals.length - 1]?.ts || 0;
        const duration = endTime - startTime;

        if (duration === 0) return;

        // Bucket signals into windows and determine state
        const windows = [];
        for (let t = 0; t < duration; t += windowSize) {
            const windowSignals = signals.filter(s =>
                s.ts >= startTime + t && s.ts < startTime + t + windowSize
            );

            const keyPresses = windowSignals.filter(s => s.type === 'KEY_PRESS').length;
            const wpm = (keyPresses / 5) * 60; // Approximate WPM

            let state = 'normal';
            if (wpm > 80) state = 'flow';
            else if (wpm < 20 && keyPresses > 0) state = 'thinking';
            else if (keyPresses === 0) state = 'frustration';

            windows.push({ state, width: (windowSize / duration) * 100 });
        }

        // Render segments
        const colors = {
            flow: '#22c55e',
            normal: '#3b82f6',
            thinking: '#f59e0b',
            frustration: '#ef4444'
        };

        windows.forEach(w => {
            const segment = document.createElement('div');
            segment.style.cssText = `
                position: absolute;
                height: 100%;
                background: ${colors[w.state]};
                width: ${w.width}%;
                display: inline-block;
            `;
            timeline.appendChild(segment);
        });

        container.style.display = 'block';
    }

    renderRecommendations(analysis) {
        const section = document.getElementById('recommendations-section');
        const list = document.getElementById('recommendations-list');
        if (!section || !list) return;

        const { wpm } = analysis.metrics;
        const { focus, frustration } = analysis.states;

        const recommendations = [];

        if (focus < 0.5) {
            recommendations.push({
                icon: '🎯',
                text: 'Try breaking down the problem into smaller steps to improve focus.'
            });
        }

        if (frustration > 0.6) {
            recommendations.push({
                icon: '😌',
                text: 'Take a short break when feeling stuck. Fresh perspective helps!'
            });
        }

        if (wpm < 30) {
            recommendations.push({
                icon: '💡',
                text: 'Consider planning your approach before coding to reduce hesitation.'
            });
        } else if (wpm > 100) {
            recommendations.push({
                icon: '⚡',
                text: 'Great typing speed! Make sure to balance speed with code quality.'
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                icon: '✨',
                text: 'Excellent session! Your coding flow looks healthy.'
            });
        }

        list.innerHTML = recommendations.map(r => `
            <div style="display: flex; gap: 10px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
                <div style="font-size: 1.5rem;">${r.icon}</div>
                <div style="color: var(--text-primary); flex: 1;">${r.text}</div>
            </div>
        `).join('');

        section.style.display = 'block';
    }

    renderChart(signals) {
        const ctx = document.getElementById(this.canvasId).getContext('2d');

        // Filter for keystrokes to show WPM over time
        // We'll bucket them into 5-second windows
        const buckets = {};
        const windowSize = 5000; // 5 seconds
        const startTime = signals[0].ts;

        signals.forEach(s => {
            if (s.type !== 'KEY_PRESS') return;
            const bucketIndex = Math.floor((s.ts - startTime) / windowSize);
            buckets[bucketIndex] = (buckets[bucketIndex] || 0) + 1;
        });

        const labels = Object.keys(buckets).map(i => `${i * 5}s`);
        const dataPoints = Object.values(buckets).map(count => (count / 5) * 60); // Convert chars/5s to WPM approx

        if (this.chart) this.chart.destroy();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Typing Speed (WPM)',
                    data: dataPoints,
                    borderColor: '#4ea8ff',
                    backgroundColor: 'rgba(78, 168, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Cognitive Flow Timeline', color: '#9aa7c7' }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

window.CognitiveReplay = CognitiveReplay;
