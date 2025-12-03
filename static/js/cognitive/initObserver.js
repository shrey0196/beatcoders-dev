/**
 * initObserver.js
 * Bootstraps the CognitiveObserver and handles the privacy toggle UI.
 */
document.addEventListener('DOMContentLoaded', () => {
    const observer = new window.CognitiveObserver();
    window.cognitiveObserverInstance = observer; // Expose for debugging

    // 1. Check for Privacy Toggle
    const toggle = document.getElementById('cognitive-toggle');
    const isEnabled = localStorage.getItem('cognitive_enabled') === 'true';

    if (toggle) {
        toggle.checked = isEnabled;
        toggle.addEventListener('change', (e) => {
            const checked = e.target.checked;
            localStorage.setItem('cognitive_enabled', checked);

            if (checked) {
                // If we are already in an editor session, start recording
                if (window.monacoEditorInstance) {
                    observer.attach(window.monacoEditorInstance, 'session_' + Date.now());
                }
            } else {
                observer.stop();
            }
        });
    }

    // 2. Hook into Monaco Editor Creation
    // We listen for a custom event 'monaco-loaded' which main.js should dispatch
    document.addEventListener('monaco-loaded', (e) => {
        if (localStorage.getItem('cognitive_enabled') === 'true') {
            const editor = e.detail.editor;
            window.monacoEditorInstance = editor; // Keep reference
            observer.attach(editor, 'session_' + Date.now());
        }
    });
});
