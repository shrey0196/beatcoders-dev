// Phase 3 Module Initialization
// Add this code to main.js after the module declarations

// Initialize Phase 3 modules when the page loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('[Phase3] Initializing modules...');

    // Wait a bit for all modules to load
    setTimeout(() => {
        if (typeof window.AdaptiveIDE !== 'undefined' && adaptiveIDE) {
            adaptiveIDE.init();
            console.log('[Phase3] AdaptiveIDE initialized');
        } else {
            console.error('[Phase3] AdaptiveIDE not found');
        }

        if (typeof window.VisualDebugger !== 'undefined' && visualDebugger) {
            visualDebugger.init().then(() => {
                console.log('[Phase3] VisualDebugger initialized');
            });
        } else {
            console.error('[Phase3] VisualDebugger not found');
        }
    }, 500);
});

// INSTRUCTIONS:
// Add this entire code block to main.js at the END of the file (before the closing brace of initApp)
// Or add it right after line ~986 (at the very end of main.js)
