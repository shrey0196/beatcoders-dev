/**
 * QUICK FIX FOR VISUAL DEBUGGER
 * The "Generate Flowchart" button isn't showing because the code editor modal
 * doesn't exist when VisualDebugger.init() is called.
 * 
 * SOLUTION: Call createDebuggerUI() when opening a problem
 */

// Add this code to the part of main.js where you open the code editor modal
// Look for the function that opens the problem (probably called openCodeEditor or similar)

// BEFORE opening the modal, add this line:
if (window.visualDebugger) {
    window.visualDebugger.createDebuggerUI();
}

// ALTERNATIVE: Add a MutationObserver to detect when modal is added
// Add this code at the end of main.js initialization:

const observer = new MutationObserver(() => {
    const modal = document.getElementById('code-editor-modal');
    if (modal && window.visualDebugger) {
        window.visualDebugger.createDebuggerUI();
        // Disconnect after creating UI once
        observer.disconnect();
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('[VisualDebugger] Waiting for code editor modal...');
