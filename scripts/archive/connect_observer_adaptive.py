import os

# Update CognitiveObserver.js to analyze signals locally and trigger AdaptiveIDE
js_path = 'static/js/cognitive/CognitiveObserver.js'

try:
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add a method to analyze signals locally and trigger AdaptiveIDE
    analysis_method = """
    /**
     * Analyze recent signals and trigger AdaptiveIDE
     * @private
     */
    _analyzeAndAdapt() {
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
    }
"""

    # Insert before the flush method
    insert_marker = "    /**\n     * Send buffered signals to the backend\n     */"
    
    if insert_marker in content:
        content = content.replace(insert_marker, analysis_method + "\n\n" + insert_marker)
        print("Added _analyzeAndAdapt method")
    else:
        print("Could not find insertion point")

    # Update recordEvent to trigger analysis periodically
    old_record = """        if (this.signals.length >= this.batchSize) {
            this.flush();
        }"""
    
    new_record = """        if (this.signals.length >= this.batchSize) {
            this.flush();
        }
        
        // Analyze every 10 events for adaptive UI
        if (this.signals.length % 10 === 0) {
            this._analyzeAndAdapt();
        }"""
    
    if old_record in content:
        content = content.replace(old_record, new_record)
        print("Updated recordEvent to trigger analysis")
    else:
        print("Could not update recordEvent")

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated CognitiveObserver.js")

except Exception as e:
    print(f"Error: {e}")
