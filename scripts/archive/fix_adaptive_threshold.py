import os

# Update AdaptiveIDE.js to add cooldown and stricter threshold
js_path = 'static/js/cognitive/AdaptiveIDE.js'

try:
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the constructor and add lastAutoTriggerTime
    old_constructor = """    constructor() {
        this.isActive = false;
        this.focusModeEnabled = false;
        this.currentState = null;
        this.thresholds = {
            frustration: 0.7,
            fatigue: 0.6,
            lowFocus: 0.4
        };"""

    new_constructor = """    constructor() {
        this.isActive = false;
        this.focusModeEnabled = false;
        this.currentState = null;
        this.thresholds = {
            frustration: 0.7,
            fatigue: 0.6,
            lowFocus: 0.4
        };
        this.lastAutoTriggerTime = 0;
        this.autoTriggerCooldown = 60000; // 1 minute cooldown"""

    if old_constructor in content:
        content = content.replace(old_constructor, new_constructor)
        print("Added cooldown timer to constructor")

    # Update adaptToState to add cooldown check
    old_adapt = """        // Auto-activate Focus Mode if struggling (High Frustration or Anger)
        // Assuming 'anger' might be a new metric or mapped from frustration
        const frustrationLevel = states.frustration || 0;
        const angerLevel = states.anger || 0; // If available
        
        if (!this.focusModeEnabled) {
            if (frustrationLevel > this.thresholds.frustration || angerLevel > 0.7) {
                console.log('[AdaptiveIDE] Auto-activating Focus Mode (high frustration detected)');
                this.toggleFocusMode();
            }
        }"""

    new_adapt = """        // Auto-activate Focus Mode if struggling (High Frustration or Anger)
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
        }"""

    if old_adapt in content:
        content = content.replace(old_adapt, new_adapt)
        print("Updated adaptToState with cooldown and stricter logic")
    else:
        print("Could not find adaptToState section")

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated AdaptiveIDE.js")

except Exception as e:
    print(f"Error: {e}")
