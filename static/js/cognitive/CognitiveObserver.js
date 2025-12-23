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
        this.attachTime = Date.now();

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
        // 1. Keystroke Dynamics & Edit Operations
        this.editor.onDidChangeModelContent((e) => {
            if (this.isRestoring) return; // IGNORE RESTORE EVENTS

            const now = Date.now();
            // Ignore events in the first 1 second of attachment (likely initialization)
            if (now - this.attachTime < 2000) return;

            const latency = now - this.lastKeystrokeTime;
            this.lastKeystrokeTime = now;

            e.changes.forEach(change => {
                let type = 'KEY_PRESS';

                // Heuristic for Edit Ops
                if (change.text === '') {
                    type = 'DELETE'; // Backspace or Delete
                } else if (change.text.length > 5) { // Threshold for paste
                    type = 'PASTE';
                } else if (change.text === ' ' || change.text === '\t') {
                    type = 'WHITESPACE';
                }

                this.recordEvent(type, {
                    latency: latency,
                    length: change.text.length,
                    rangeLength: change.rangeLength, // How much was replaced/deleted
                    line: change.range.startLineNumber,
                    column: change.range.startColumn
                });
            });
        });

        // 2. Cursor & Selection (Hesitation/Navigation + Linearity)
        this.editor.onDidChangeCursorPosition((e) => {
            const position = e.position;
            // Calculate linearity: Is user moving DOWN (fresh code) or UP (editing old code)?
            // We only care if line changed
            let navigationType = 'SAME_LINE';
            if (this.lastLineNumber) {
                if (position.lineNumber > this.lastLineNumber) navigationType = 'PROGRESSION';
                else if (position.lineNumber < this.lastLineNumber) navigationType = 'REGRESSION';
            }

            this.recordEvent('CURSOR_MOVE', {
                line: position.lineNumber,
                column: position.column,
                navType: navigationType
            });

            this.lastLineNumber = position.lineNumber;
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

        // Analyze every 10 events OR immediately on significant events (PASTE)
        if (type === 'PASTE' || this.signals.length % 10 === 0) {
            this._analyzeAndAdapt(type === 'PASTE');
        }
    }


    /**
     * Analyze recent signals and trigger AdaptiveIDE
     * @private
     * @param {Boolean} force - Ignore signal count threshold
     */
    /**
     * Set restoring state to ignore events
     */
    setRestoring(val) {
        this.isRestoring = val;
    }

    /**
     * Analysis Logic
     */
    _analyzeAndAdapt(force = false) {
        if (!force && this.signals.length < 10) return;

        const recentSignals = this.signals.slice(-50);
        // ... (counts same) ...
        const deletions = recentSignals.filter(s => s.type === 'DELETE').length;
        const pastes = recentSignals.filter(s => s.type === 'PASTE').length;
        const keyPresses = recentSignals.filter(s => s.type === 'KEY_PRESS');

        // ... (linearity same) ...
        const moves = recentSignals.filter(s => s.type === 'CURSOR_MOVE');
        const progressions = moves.filter(s => s.data.navType === 'PROGRESSION').length;
        const regressions = moves.filter(s => s.data.navType === 'REGRESSION').length;
        const linearity = moves.length > 0 ? progressions / (progressions + regressions + 0.1) : 0.5;

        // 3. Typing Variance - Relaxed Thresholds
        const latencies = keyPresses.map(s => s.data.latency).filter(l => l < 5000);
        let latencyVariance = 0;
        if (latencies.length > 1) {
            const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
            latencyVariance = latencies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / latencies.length;
        }

        // 4. Classification
        let coderType = 'Balanced';

        // REMOVED: Paste / Source Detected logic as per user request

        if (linearity > 0.9 && latencyVariance < 50000 && keyPresses.length > 10 && moves.length > 5) { // Relaxed var constraint for transcriber
            coderType = 'Transcriber';
            // ... interrogation logic ...
            if (!this.hasTriggeredTranscriptionInterrogation && typeof window.triggerMentorInterrogation === 'function') {
                this.hasTriggeredTranscriptionInterrogation = true;
                window.triggerMentorInterrogation('TRANSCRIPTION');
            }
        }
        else if (regressions > progressions && deletions > 5) coderType = 'Refactorer';

        // Create Analysis Object
        const isFocused = latencyVariance < 50000 && keyPresses.length > 5; // Variance < 50k (~220ms deviation)
        const frustrationScore = (deletions / (recentSignals.length || 1)) > 0.2 ? 0.9 : 0.1;

        const analysis = {
            states: {
                frustration: frustrationScore,
                anger: frustrationScore, // Map Frustration to Anger to trigger Focus Mode
                focus: isFocused ? 0.9 : 0.3,
                fatigue: 0.3,
            },
            metrics: {
                deletions: deletions,
                typingSpeed: keyPresses.length, // Rough localized WPM proxy
                linearity: linearity,
                variance: latencyVariance
            },
            fingerprint: {
                type: coderType
            }
        };

        console.log('[CognitiveObserver] Analysis:', analysis.fingerprint.type, `Lin: ${linearity.toFixed(2)} Var: ${Math.round(latencyVariance)}`);

        // Trigger AdaptiveIDE
        if (window.adaptiveIDE) window.adaptiveIDE.adaptToState(analysis);
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
