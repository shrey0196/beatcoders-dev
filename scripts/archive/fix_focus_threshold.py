import os

# Update CognitiveObserver.js to require more deletions before triggering
js_path = 'static/js/cognitive/CognitiveObserver.js'

try:
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find and replace the _analyzeAndAdapt method with stricter thresholds
    old_analysis = """    _analyzeAndAdapt() {
        if (!window.adaptiveIDE || this.signals.length < 10) return;

        const recentSignals = this.signals.slice(-20); // Last 20 events
        
        // Count event types
        const deletions = recentSignals.filter(s => s.type === 'DELETE').length;
        const keyPresses = recentSignals.filter(s => s.type === 'KEY_PRESS').length;
        const pastes = recentSignals.filter(s => s.type === 'PASTE').length;
        
        // Calculate frustration based on deletion rate
        const deletionRate = deletions / recentSignals.length;
        const frustration = Math.min(deletionRate * 2, 1.0); // Scale up, cap at 1.0
        
        // Calculate focus based on consistent typing
        const avgLatency = recentSignals
            .filter(s => s.data && s.data.latency)
            .reduce((sum, s) => sum + s.data.latency, 0) / recentSignals.length;
        
        const focus = avgLatency < 200 ? 0.8 : 0.4; // Fast typing = focused
        
        // Create analysis object
        const analysis = {
            states: {
                frustration: frustration,
                focus: focus,
                fatigue: 0.3,
                anger: deletionRate > 0.5 ? 0.8 : 0.2
            },
            metrics: {
                deletions: deletions,
                typingSpeed: keyPresses,
                avgLatency: avgLatency
            }
        };
        
        console.log('[CognitiveObserver] Analysis:', analysis);
        
        // Trigger AdaptiveIDE
        window.adaptiveIDE.adaptToState(analysis);
    }"""

    new_analysis = """    _analyzeAndAdapt() {
        if (!window.adaptiveIDE || this.signals.length < 10) return;

        const recentSignals = this.signals.slice(-30); // Last 30 events for better context
        
        // Count event types
        const deletions = recentSignals.filter(s => s.type === 'DELETE').length;
        const keyPresses = recentSignals.filter(s => s.type === 'KEY_PRESS').length;
        
        // REQUIRE at least 5 deletions in recent history
        if (deletions < 5) {
            console.log('[CognitiveObserver] Not enough deletions yet:', deletions);
            return;
        }
        
        // Calculate frustration based on deletion rate
        const deletionRate = deletions / recentSignals.length;
        
        // Only trigger if deletion rate is high (>30% of recent actions are deletions)
        const frustration = deletionRate > 0.3 ? Math.min(deletionRate * 1.5, 1.0) : 0.2;
        
        // Calculate focus based on consistent typing
        const avgLatency = recentSignals
            .filter(s => s.data && s.data.latency)
            .reduce((sum, s) => sum + s.data.latency, 0) / recentSignals.length;
        
        const focus = avgLatency < 200 ? 0.8 : 0.4;
        
        // Create analysis object
        const analysis = {
            states: {
                frustration: frustration,
                focus: focus,
                fatigue: 0.3,
                anger: deletions >= 8 ? 0.8 : 0.2 // High anger only if 8+ deletions
            },
            metrics: {
                deletions: deletions,
                typingSpeed: keyPresses,
                avgLatency: avgLatency
            }
        };
        
        console.log('[CognitiveObserver] Analysis:', analysis, `(${deletions} deletions)`);
        
        // Trigger AdaptiveIDE
        window.adaptiveIDE.adaptToState(analysis);
    }"""

    if old_analysis in content:
        content = content.replace(old_analysis, new_analysis)
        print("Updated _analyzeAndAdapt with stricter thresholds (requires 5+ deletions)")
    else:
        print("Could not find _analyzeAndAdapt method to update")

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated CognitiveObserver.js")

except Exception as e:
    print(f"Error: {e}")
