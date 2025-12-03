/**
 * CognitiveObserver.js
 * The "Silent Observer" that captures behavioral signals from the user's coding session.
 * Designed to be non-blocking and privacy-conscious.
 */
class CognitiveObserver {
    constructor() {
        this.signals = [];
        this.batchSize = 50; // Flush after 50 events
        this.flushInterval = 30000; // Or every 30 seconds
        this.isRecording = false;
        this.editor = null;
        this.lastKeystrokeTime = 0;
        this.timer = null;
        this.taskId = null; // To link to specific battle/practice session
    }

    /**
     * Attach to a Monaco Editor instance
     * @param {Object} editorInstance - The Monaco editor instance
     * @param {String} taskId - Optional ID for the current task/session
     */
    attach(editorInstance, taskId = 'session_' + Date.now()) {
        this.editor = editorInstance;
        this.taskId = taskId;
        this.isRecording = true;
        this.lastKeystrokeTime = Date.now();

        console.log(`[CognitiveObserver] Attached to editor. Task ID: ${this.taskId}`);

        this._bindListeners();
        this._startPeriodicFlush();
    }

    /**
     * Bind all necessary event listeners to the editor
     * @private
     */
    _bindListeners() {
        if (!this.editor) return;

        // 1. Keystroke Dynamics & Edit Operations
        this.editor.onDidChangeModelContent((e) => {
            const now = Date.now();
            const latency = now - this.lastKeystrokeTime;
            this.lastKeystrokeTime = now;

            e.changes.forEach(change => {
                let type = 'KEY_PRESS';

                // Heuristic for Edit Ops
                if (change.text === '') {
                    type = 'DELETE'; // Backspace or Delete
                } else if (change.text.length > 1) {
                    type = 'PASTE'; // Likely a paste if multiple chars inserted at once
                } else if (change.text === ' ' || change.text === '\t') {
                    type = 'WHITESPACE';
                }

                this.recordEvent(type, {
                    latency: latency,
                    length: change.text.length,
                    rangeLength: change.rangeLength, // How much was replaced/deleted
                    line: change.range.startLineNumber
                });
            });
        });

        // 2. Cursor & Selection (Hesitation/Navigation)
        this.editor.onDidChangeCursorPosition((e) => {
            // We don't want to log every cursor move, only significant ones or pauses?
            // For now, let's just track it as a generic activity signal to calculate "Focus"
            // Maybe only log if it's a jump (line change)
        });

        // 3. Scroll Behavior (Reading vs Searching)
        // Monaco doesn't have a simple onScroll, usually handled via onDidScrollChange
        this.editor.onDidScrollChange((e) => {
            if (e.scrollTopChanged) {
                this.recordEvent('SCROLL', {
                    scrollTop: e.scrollTop,
                    delta: e.scrollTop - (this.lastScrollTop || 0)
                });
                this.lastScrollTop = e.scrollTop;
            }
        });

        // 4. Focus/Blur (Tab Switching)
        this.editor.onDidBlurEditorText(() => {
            this.recordEvent('FOCUS_LOST', {});
        });

        this.editor.onDidFocusEditorText(() => {
            this.recordEvent('FOCUS_GAINED', {});
        });
    }

    /**
     * Buffer a signal event
     * @param {String} type - Event type (KEY_PRESS, SCROLL, etc.)
     * @param {Object} payload - Additional data
     */
    recordEvent(type, payload) {
        if (!this.isRecording) return;

        const event = {
            type: type,
            ts: Date.now(),
            data: payload
        };

        console.log(`[CognitiveObserver] Recording event: ${type}`);
        this.signals.push(event);

        if (this.signals.length >= this.batchSize) {
            this.flush();
        }
        
        // Analyze every 10 events for adaptive UI
        if (this.signals.length % 10 === 0) {
            this._analyzeAndAdapt();
        }
    }


    /**
     * Analyze recent signals and trigger AdaptiveIDE
     * @private
     */
    _analyzeAndAdapt() {
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
    }


    /**
     * Send buffered signals to the backend
     */
    async flush() {
        if (this.signals.length === 0) return;

        const batch = [...this.signals];
        this.signals = []; // Clear buffer immediately

        console.log(`[CognitiveObserver] Flushing ${batch.length} signals...`);

        try {
            const response = await fetch('/api/cognitive/signals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task_id: this.taskId,
                    signals: batch
                })
            });

            if (!response.ok) {
                console.warn('[CognitiveObserver] Failed to flush signals', response.status);
                // Optional: Re-queue failed signals if critical, but for now drop to avoid memory leaks
            }
        } catch (err) {
            console.error('[CognitiveObserver] Error flushing signals:', err);
        }
    }

    /**
     * Start the periodic flush timer
     * @private
     */
    _startPeriodicFlush() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.flush();
        }, this.flushInterval);
    }

    /**
     * Stop recording and do a final flush
     */
    stop() {
        this.isRecording = false;
        if (this.timer) clearInterval(this.timer);
        this.flush();
    }
}

// Export globally
window.CognitiveObserver = CognitiveObserver;
