/**
 * Cognitive Analysis Module
 * Displays detailed cognitive analysis with charts and metrics
 */

const CognitiveAnalysis = (function () {
    'use strict';

    /**
     * Render cognitive flow chart showing typing speed over time
     * @param {Array} signals - Cognitive signals data
     */
    function renderCognitiveFlowChart(signals) {
        const canvas = document.getElementById('cognitive-flow-chart');
        if (!canvas || !window.Chart) return;

        const ctx = canvas.getContext('2d');
        const buckets = {};
        const windowSize = 5000;
        const startTime = signals[0]?.ts || 0;

        signals.forEach(s => {
            if (s.type !== 'KEY_PRESS') return;
            const bucketIndex = Math.floor((s.ts - startTime) / windowSize);
            buckets[bucketIndex] = (buckets[bucketIndex] || 0) + 1;
        });

        const labels = Object.keys(buckets).map(i => `${i * 5}s`);
        const dataPoints = Object.values(buckets).map(count => (count / 5) * 60);

        new Chart(ctx, {
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
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    /**
     * Render detailed state timeline showing coding states over time
     * @param {Array} signals - Cognitive signals data
     */
    function renderDetailedStateTimeline(signals) {
        const timeline = document.getElementById('detailed-state-timeline');
        if (!timeline) return;

        timeline.innerHTML = '';
        const windowSize = 5000;
        const startTime = signals[0]?.ts || 0;
        const endTime = signals[signals.length - 1]?.ts || 0;
        const duration = endTime - startTime;

        if (duration === 0) return;

        const windows = [];
        for (let t = 0; t < duration; t += windowSize) {
            const windowSignals = signals.filter(s =>
                s.ts >= startTime + t && s.ts < startTime + t + windowSize
            );

            const keyPresses = windowSignals.filter(s => s.type === 'KEY_PRESS').length;
            const wpm = (keyPresses / 5) * 60;

            let state = 'normal';
            if (wpm > 80) state = 'flow';
            else if (wpm < 20 && keyPresses > 0) state = 'thinking';
            else if (keyPresses === 0) state = 'frustration';

            windows.push({ state, width: (windowSize / duration) * 100 });
        }

        const colors = {
            flow: '#22c55e',
            normal: '#3b82f6',
            thinking: '#f59e0b',
            frustration: '#ef4444'
        };

        let leftPos = 0;
        windows.forEach(w => {
            const segment = document.createElement('div');
            segment.style.cssText = `
                position: absolute;
                left: ${leftPos}%;
                height: 100%;
                background: ${colors[w.state]};
                width: ${w.width}%;
            `;
            timeline.appendChild(segment);
            leftPos += w.width;
        });
    }

    /**
     * Show detailed cognitive analysis modal
     * @param {Object} data - Test results data
     * @param {string} code - User's submitted code
     */
    async function show(data, code) {
        // Create full-screen modal
        const modal = document.createElement('div');
        modal.id = 'detailed-analysis-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            z-index: 4000;
            overflow-y: auto;
            padding: 40px;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            background: #0a0a0a;
            border-radius: 16px;
            padding: 40px;
            color: #e5e7eb;
        `;

        // Try to fetch cognitive data
        let cognitiveData = null;
        try {
            if (window.currentProblemTitle && window.cognitiveObserver && window.cognitiveObserver.taskId) {
                const taskId = window.cognitiveObserver.taskId;
                const response = await fetch(`http://localhost:8001/api/cognitive/analysis/${taskId}`);
                if (response.ok) {
                    cognitiveData = await response.json();
                }
            }
        } catch (err) {
            console.log('Could not fetch cognitive data:', err);
        }

        content.innerHTML = `
            <!-- Close Button -->
            <button id="close-detailed-analysis" style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #e5e7eb;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #e5e7eb; font-size: 2rem; margin-bottom: 10px;">📊 Detailed Cognitive Analysis</h1>
                <p style="color: #9ca3af;">Comprehensive breakdown of your coding session</p>
            </div>

            <!-- Test Results Section -->
            <div style="margin-bottom: 40px;">
                <h2 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.5rem;">✅ Test Results</h2>
                ${data.results.map((result, i) => `
                    <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 10px; margin-bottom: 12px; border-left: 3px solid ${result.passed ? '#22c55e' : '#ef4444'};">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="color: #e5e7eb; font-weight: 600;">Test Case ${i + 1}</span>
                                ${result.hidden ? '<span style="color: #9ca3af; margin-left: 10px; font-size: 0.85rem;">(Hidden)</span>' : ''}
                            </div>
                            <span style="color: ${result.passed ? '#22c55e' : '#ef4444'}; font-weight: 600;">${result.passed ? '✓ Passed' : '✗ Failed'}</span>
                        </div>
                        ${!result.passed && !result.hidden ? `
                            <div style="margin-top: 10px; padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 6px;">
                                <div style="color: #ef4444; font-size: 0.9rem; margin-bottom: 5px;">Error:</div>
                                <code style="color: #ef4444; font-size: 0.85rem;">${result.error || 'Output mismatch'}</code>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>

            <!-- Cognitive Insights Section -->
            ${cognitiveData ? `
                <div style="margin-bottom: 40px;">
                    <h2 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.5rem;">🧠 Cognitive Insights</h2>
                    
                    <!-- Session Metrics -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                        <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px; text-align: center;">
                            <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 8px;">Coder Type</div>
                            <div style="color: #4ea8ff; font-size: 1.5rem; font-weight: 600;">${cognitiveData.analysis?.fingerprint?.type || 'Balanced'}</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px; text-align: center;">
                            <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 8px;">Typing Speed</div>
                            <div style="color: #e5e7eb; font-size: 1.5rem; font-weight: 600;">${Math.round(cognitiveData.analysis?.metrics?.wpm || 0)} WPM</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px; text-align: center;">
                            <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 8px;">Focus Score</div>
                            <div style="color: ${(cognitiveData.analysis?.states?.focus || 0) > 0.7 ? '#22c55e' : '#f59e0b'}; font-size: 1.5rem; font-weight: 600;">${Math.round((cognitiveData.analysis?.states?.focus || 0) * 100)}%</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px; text-align: center;">
                            <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 8px;">Session Time</div>
                            <div style="color: #e5e7eb; font-size: 1.5rem; font-weight: 600;">${Math.round((cognitiveData.analysis?.metrics?.total_time_sec || 0) / 60)}m</div>
                        </div>
                    </div>

                    <!-- Cognitive Flow Chart -->
                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h3 style="color: #e5e7eb; margin-bottom: 15px; font-size: 1.2rem;">Typing Speed Over Time</h3>
                        <canvas id="cognitive-flow-chart" style="max-height: 300px;"></canvas>
                    </div>

                    <!-- State Timeline -->
                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px;">
                        <h3 style="color: #e5e7eb; margin-bottom: 15px; font-size: 1.2rem;">Coding State Timeline</h3>
                        <div id="detailed-state-timeline" style="height: 60px; background: #1a1a1a; border-radius: 8px; position: relative; overflow: hidden; margin-bottom: 15px;"></div>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; font-size: 0.85rem;">
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <div style="width: 16px; height: 16px; background: #22c55e; border-radius: 4px;"></div>
                                <span style="color: #9ca3af;">Flow State</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 4px;"></div>
                                <span style="color: #9ca3af;">Normal Coding</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <div style="width: 16px; height: 16px; background: #f59e0b; border-radius: 4px;"></div>
                                <span style="color: #9ca3af;">Thinking</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <div style="width: 16px; height: 16px; background: #ef4444; border-radius: 4px;"></div>
                                <span style="color: #9ca3af;">Frustration</span>
                            </div>
                        </div>
                    </div>
                </div>
            ` : `
                <div style="margin-bottom: 40px;">
                    <h2 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.5rem;">🧠 Cognitive Insights</h2>
                    <div style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 10px; text-align: center;">
                        <p style="color: #9ca3af;">Cognitive data not available for this session.</p>
                        <p style="color: #9ca3af; font-size: 0.9rem; margin-top: 10px;">Start coding to see real-time cognitive analysis!</p>
                    </div>
                </div>
            `}

            <!-- Performance Metrics -->
            <div style="margin-bottom: 40px;">
                <h2 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.5rem;">⚡ Performance Metrics</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 10px;">
                        <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 10px;">Runtime</div>
                        <div style="color: #e5e7eb; font-size: 2rem; font-weight: 700;">${data.runtime}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 10px;">
                        <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 10px;">Memory Usage</div>
                        <div style="color: #e5e7eb; font-size: 2rem; font-weight: 700;">${data.memory}</div>
                    </div>
                </div>
            </div>

            <!-- Close Button -->
            <button id="close-detailed-btn" style="
                width: 100%;
                padding: 15px;
                background: #4ea8ff;
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
            ">Close</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Render cognitive chart if data available
        if (cognitiveData && cognitiveData.signals) {
            setTimeout(() => {
                renderCognitiveFlowChart(cognitiveData.signals);
                renderDetailedStateTimeline(cognitiveData.signals);
            }, 100);
        }

        // Event listeners
        const closeBtn = content.querySelector('#close-detailed-analysis');
        const closeBtnBottom = content.querySelector('#close-detailed-btn');

        const closeModal = () => modal.remove();
        closeBtn.addEventListener('click', closeModal);
        closeBtnBottom.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Public API
    return {
        show: show
    };
})();

// Make globally accessible
window.showDetailedCognitiveAnalysis = function (data, code) {
    CognitiveAnalysis.show(data, code);
};
