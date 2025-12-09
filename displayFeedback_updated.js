function displayFeedback(analysis) {
    const tierColors = {
        optimal: { bg: 'rgba(34, 197, 94, 0.1)', border: 'var(--green)', text: 'var(--green)' },
        good: { bg: 'rgba(245, 158, 11, 0.1)', border: 'var(--yellow)', text: 'var(--yellow)' },
        improvable: { bg: 'rgba(239, 68, 68, 0.1)', border: 'var(--red)', text: 'var(--red)' },
        uncertain: { bg: 'rgba(78, 168, 255, 0.1)', border: 'var(--accent1)', text: 'var(--accent1)' }
    };

    const colors = tierColors[analysis.feedback_tier] || tierColors.uncertain;

    const feedbackContent = document.getElementById('feedback-content');
    feedbackContent.innerHTML = `
      <div style="background: ${colors.bg}; border: 1px solid ${colors.border}; border-radius: 12px; padding: 25px;">
        <h2 style="color: ${colors.text}; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
          ${analysis.feedback_icon} ${analysis.feedback_title}
        </h2>
        <p style="color: var(--text-primary); font-size: 16px; margin-bottom: 20px; line-height: 1.5; white-space: pre-line;">
          ${analysis.feedback_message}
        </p>
        
        ${analysis.test_results && analysis.test_results.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--text-primary); margin-bottom: 10px; font-size: 1.1rem;">
              📝 Test Cases (${analysis.tests_passed}/${analysis.tests_total} passed)
            </h3>
            ${analysis.test_results.map((test, idx) => `
              <div style="background: var(--hover-bg); padding: 12px; border-radius: 6px; margin: 8px 0; border-left: 3px solid ${test.passed ? 'var(--green)' : 'var(--red)'};">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <span style="font-size: 16px;">${test.passed ? '✅' : '❌'}</span>
                  <strong style="color: var(--text-primary);">${test.description}</strong>
                </div>
                <div style="color: var(--text-secondary); font-size: 14px; margin-left: 24px;">
                  <div><strong>Input:</strong> ${JSON.stringify(test.input)}</div>
                  <div><strong>Expected:</strong> ${JSON.stringify(test.expected)}</div>
                  ${!test.passed ? `
                    <div><strong>Your output:</strong> ${test.actual !== null ? JSON.stringify(test.actual) : 'None'}</div>
                    ${test.error ? `<div style="color: var(--red); margin-top: 4px;"><strong>Error:</strong> ${test.error}</div>` : ''}
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div style="background: var(--hover-bg); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="margin: 8px 0; color: var(--text-secondary);">
            <strong style="color: var(--text-primary);">Time Complexity:</strong> ${analysis.time_complexity}
          </div>
          <div style="margin: 8px 0; color: var(--text-secondary);">
            <strong style="color: var(--text-primary);">Space Complexity:</strong> ${analysis.space_complexity}
          </div>
          <div style="margin: 8px 0; color: var(--text-secondary);">
            <strong style="color: var(--text-primary);">Patterns Detected:</strong> ${analysis.patterns_detected.join(', ') || 'None'}
          </div>
        </div>
        
        ${analysis.hints && analysis.hints.length > 0 ? `
          <div style="margin-top: 20px;">
            <h3 style="color: var(--text-primary); margin-bottom: 10px; font-size: 1.1rem;">💡 Hints:</h3>
            ${analysis.hints.map(hint => `
              <div style="background: var(--hover-bg); padding: 12px; border-radius: 6px; margin: 8px 0; color: var(--text-secondary);">
                ${hint}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${analysis.show_celebration ? `
          <div style="margin-top: 20px; text-align: center;">
            <h3 style="color: ${colors.text};">🎉 Congratulations! 🎉</h3>
            <p style="color: var(--text-secondary);">You've achieved an optimal solution!</p>
          </div>
        ` : ''}
      </div>
    `;

    feedbackSection.style.display = 'block';
    feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
