/**
 * Phase 3 Initialization Script
 * Add this code to main.js after Monaco editor is created
 */

// Initialize Phase 3 modules when editor modal opens
function initPhase3Modules() {
    console.log('[Phase3] Initializing Adaptive IDE modules...');

    // Initialize AdaptiveIDE
    if (window.AdaptiveIDE && adaptiveIDE) {
        adaptiveIDE.init();
    }

    // Initialize VisualDebugger
    if (window.VisualDebugger && visualDebugger) {
        visualDebugger.init().then(() => {
            visualDebugger.show();
        });
    }

    // Make editorInstance globally accessible for VisualDebugger
    window.editorInstance = editorInstance;

    console.log('[Phase3] Modules initialized');
}

// Call this function after Monaco editor is created
// Example: After the editor is created in the code editor modal logic
// Add this line after: editorInstance = monaco.editor.create(...)
// initPhase3Modules();

// Connect cognitive analysis to AdaptiveIDE
// Add this in the submit code logic after getting analysis results:
/*
if (analysis && adaptiveIDE) {
  adaptiveIDE.adaptToState(analysis);
}
*/
