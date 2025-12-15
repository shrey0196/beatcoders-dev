console.log("MAIN JS LOADED - VERSION 2");

function initApp() {
  console.log("INIT APP STARTED");

  // --- CONFIG ---
  const CONFIG = {
    THEMES: { DARK: 'dark', LIGHT: 'light' },
    modal: { animationDuration: 160 },
    drawer: { animationDuration: 300 },
    startCodingDelay: 150
  };

  // --- MONACO EDITOR & COGNITIVE MODULES ---
  let editorInstance = null;
  const cognitiveObserver = window.CognitiveObserver ? new window.CognitiveObserver() : null;
  const cognitiveReplay = window.CognitiveReplay ? new window.CognitiveReplay('cognitive-chart') : null;

  // Use global problem set from problems_db.js
  const problems = window.FULL_PROBLEM_SET || [];

  const problemsDataMap = problems.reduce((acc, curr) => {
    acc[curr.title] = curr;
    return acc;
  }, {});

  function displayFeedback(analysis) {
    const tierColors = {
      optimal: { bg: 'rgba(34, 197, 94, 0.1)', border: 'var(--green)', text: 'var(--green)' },
      good: { bg: 'rgba(245, 158, 11, 0.1)', border: 'var(--yellow)', text: 'var(--yellow)' },
      improvable: { bg: 'rgba(239, 68, 68, 0.1)', border: 'var(--red)', text: 'var(--red)' },
      uncertain: { bg: 'rgba(78, 168, 255, 0.1)', border: 'var(--accent1)', text: 'var(--accent1)' }
    };

    const colors = tierColors[analysis.feedback_tier] || tierColors.uncertain;

    const feedbackContent = document.getElementById('feedback-content');
    if (!feedbackContent) return;

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

    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.style.display = 'block';
  }

  function resetEditorState() {
    console.log('[Reset] Resetting editor state...');

    // Reset Test Case Tabs
    const tabs = document.querySelectorAll('.test-case-tab');
    console.log(`[Reset] Found ${tabs.length} tabs`);

    tabs.forEach((tab, index) => {
      tab.className = 'test-case-tab';
      tab.removeAttribute('style');
      tab.innerHTML = '';
      tab.textContent = `Case ${index + 1} `;
      if (index === 0) tab.classList.add('active');
    });

    // Reset Submit Button
    const submitBtn = document.getElementById('submit-solution-btn');
    if (submitBtn) {
      submitBtn.style.cssText = 'display: none !important; opacity: 0 !important; transition: all 0.3s ease;';
    }

    // Reset Results Panel
    const resultsPanel = document.getElementById('test-results-panel');
    if (resultsPanel) resultsPanel.innerHTML = '';

    console.log('[Reset] Complete');
  }

  function initPracticeView() {
    const tableBody = document.getElementById('problems-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    problems.forEach((problem, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="text-align: center; color: var(--text-secondary);">${index + 1}</td>
        <td style="text-align: center;">
          <label class="custom-checkbox" style="cursor: default;">
            <input type="checkbox" class="problem-solved-checkbox" data-problem="${problem.title}" disabled>
            <span class="checkmark"></span>
          </label>
        </td>
        <td>${problem.title}</td>
        <td><span class="difficulty-tag ${problem.difficulty.toLowerCase()}">${problem.difficulty}</span></td>
        <td>${problem.acceptance}</td>
      `;
      row.style.cursor = 'pointer';

      row.addEventListener('click', (e) => {
        // Don't open editor if clicking on checkbox
        if (e.target.closest('.custom-checkbox')) return;

        console.log('Problem row clicked:', problem.title);
        if (window.openCodeEditor) {
          window.openCodeEditor(problem.title);
        } else {
          console.error('window.openCodeEditor is not defined');
        }
      });

      tableBody.appendChild(row);
    });
  }

  window.openCodeEditor = function openCodeEditor(problemTitle) {
    resetEditorState();
    currentProblemTitle = problemTitle;
    window.currentProblemTitle = problemTitle; // Fix for hints module

    console.log('openCodeEditor called with:', problemTitle);
    const problem = problemsDataMap[problemTitle] || {
      description: "Problem description not available.",
      difficulty: "Unknown",
      topic: "General",
      acceptance: "-"
    };

    // --- PERSISTENCE INTEGRATION ---
    // A. Clear and Load History
    // A. Clear and Load History
    const historySection = document.getElementById('submissions-history-section');
    if (historySection) historySection.style.display = 'none'; // Reset visibility

    // Re-bind safely every time
    const historyBtn = document.getElementById('view-submissions-btn');
    if (historyBtn) {
      // Remove old listeners by cloning (simple trick) or just re-assign onclick
      historyBtn.onclick = (e) => {
        e.stopPropagation(); // Just in case
        console.log('History button clicked');
        if (historySection) {
          const isHidden = historySection.style.display === 'none';
          historySection.style.display = isHidden ? 'block' : 'none';
          if (isHidden) {
            // Scroll into view if opening
            historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.fetchSubmissionHistory) window.fetchSubmissionHistory(problemTitle);
          }
        } else {
          console.error('History section not found');
        }
      };
    }

    // B. Auto-load history (optional, or just fetch status)
    // We don't auto-show history, but we can pre-fetch if we wanted.

    // Render Initial Test Case Content
    const testCaseContent = document.querySelector('.test-case-content');
    const testCaseTabs = document.querySelectorAll('.test-case-tab');

    const renderTestCase = (index) => {
      if (!testCaseContent) return;
      if (problem.testCases && problem.testCases[index]) {
        const tCase = problem.testCases[index];
        testCaseContent.innerHTML = `
            <div style="margin-bottom: 10px;">
                <span style="color: var(--text-secondary);">Input:</span>
                <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(tCase.input)}</code>
            </div>
            <div>
              <span style="color: var(--text-secondary);">Expected Output:</span>
              <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(tCase.output)}</code>
            </div>
          `;
      } else {
        testCaseContent.innerHTML = '<div style="color: var(--text-secondary); padding: 20px; text-align: center;">No test cases available</div>';
      }
    };

    // Initial Render
    renderTestCase(0);

    // Setup Tabs with Dynamic Listeners
    testCaseTabs.forEach((oldTab, index) => {
      const newTab = oldTab.cloneNode(true);
      if (oldTab.parentNode) oldTab.parentNode.replaceChild(newTab, oldTab);

      newTab.textContent = `Case ${index + 1} `;
      newTab.classList.remove('active', 'test-passed', 'test-failed');
      if (index === 0) newTab.classList.add('active');

      newTab.addEventListener('click', () => {
        document.querySelectorAll('.test-case-tab').forEach(t => t.classList.remove('active'));
        newTab.classList.add('active');
        renderTestCase(index);
      });
    });


    // Update Editor UI
    const titleEl = document.getElementById('editor-problem-title');
    if (titleEl) titleEl.textContent = problemTitle;

    const diffTag = document.getElementById('editor-difficulty');
    if (diffTag) {
      diffTag.textContent = problem.difficulty;
      diffTag.className = `difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`;
    }

    const topicTag = document.getElementById('editor-topic');
    if (topicTag) topicTag.textContent = problem.topic;

    const descContainer = document.getElementById('editor-problem-description');
    if (descContainer) {
      // Fallback to description if htmlDescription is missing (though we updated data)
      const descContent = problem.htmlDescription || problem.description || "<p>Description not available.</p>";
      descContainer.innerHTML = descContent;
    }

    // Show Full Screen Editor
    const fullScreenEditor = document.getElementById('full-screen-editor');
    if (fullScreenEditor) {
      fullScreenEditor.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }


    // Initialize AdaptiveIDE
    if (!window.adaptiveIDE) {
      window.adaptiveIDE = new AdaptiveIDE();
    }
    window.adaptiveIDE.init();

    // Initialize Monaco Editor
    const template = problem.template || "# Write your code here\n";

    if (window.require) {
      require(['vs/editor/editor.main'], function () {
        const container = document.getElementById('monaco-editor-container');
        if (container) {
          // CLEANUP: Dispose existing instance to prevent duplicates or memory leaks
          if (editorInstance) {
            editorInstance.dispose();
            editorInstance = null;
          }
          if (window.editorInstance) {
            // Double check global one too
            if (typeof window.editorInstance.dispose === 'function') window.editorInstance.dispose();
            window.editorInstance = null;
          }
          container.innerHTML = ''; // Force clear DOM

          editorInstance = monaco.editor.create(container, {
            value: template,
            language: 'python',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 20 },
            scrollBeyondLastLine: false
          });

          window.editorInstance = editorInstance;

          // FORCE FOCUS and layout
          setTimeout(() => {
            editorInstance.layout();
            editorInstance.focus();

            // Auto-restore last solution if available
            if (window.fetchAndRestoreLatestCode) {
              window.fetchAndRestoreLatestCode(problemTitle);
            }
          }, 100);

          document.dispatchEvent(new CustomEvent('monaco-loaded', { detail: { editor: editorInstance } }));

          // Attach Cognitive Observer
          if (cognitiveObserver) {
            const taskId = problemTitle.toLowerCase().replace(/\s+/g, '-');
            console.log(`[Main] Attaching observer to task: ${taskId} `);
            cognitiveObserver.attach(editorInstance, taskId);
          }
        }
      });
    }

    // Reset Feedback
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.style.display = 'none';
  }


  console.log("INIT APP STARTED");

  // Phase 3: Adaptive IDE (make globally accessible)
  if (window.AdaptiveIDE) {
    window.adaptiveIDE = new window.AdaptiveIDE();
  }
  if (window.VisualDebugger) {
    window.visualDebugger = new window.VisualDebugger();
  }

  // Configure Monaco Loader
  if (window.require) {
    require.config({
      paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
    });
  }

  // --- THEME TOGGLE ---
  const themeToggle = document.getElementById('theme-toggle');

  const applyTheme = (theme) => {
    if (theme === CONFIG.THEMES.DARK) {
      document.documentElement.classList.add(CONFIG.THEMES.DARK);
    } else {
      document.documentElement.classList.remove(CONFIG.THEMES.DARK);
    }
    localStorage.setItem('theme', theme);
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.classList.contains(CONFIG.THEMES.DARK)
        ? CONFIG.THEMES.DARK
        : CONFIG.THEMES.LIGHT;
      const newTheme = currentTheme === CONFIG.THEMES.LIGHT
        ? CONFIG.THEMES.DARK
        : CONFIG.THEMES.LIGHT;
      applyTheme(newTheme);

    });
  }

  // --- MODAL & DRAWER ELEMENTS ---
  const modalContainer = document.getElementById('modal-container');
  const modal = document.getElementById('modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  let lastFocusedElement;

  const authChoiceView = document.getElementById('auth-choice-view');
  const createAccountView = document.getElementById('create-account-view');
  const signInView = document.getElementById('sign-in-view');
  const successView = document.getElementById('success-view');
  const forgotPasswordView = document.getElementById('forgot-password-view');
  const resetSentView = document.getElementById('reset-sent-view');
  const verifyEmailView = document.getElementById('verify-email-view');
  const resetPasswordView = document.getElementById('reset-password-view');

  const showCreateAccountBtn = document.getElementById('show-create-account-btn');
  const showSignInBtn = document.getElementById('show-sign-in-btn');
  const showForgotPasswordBtn = document.getElementById('show-forgot-password-btn');
  const backToChoiceFromCreateBtn = document.getElementById('back-to-choice-from-create-btn');
  const backToChoiceFromSignInBtn = document.getElementById('back-to-choice-from-signin-btn');
  const backToSignInFromForgotBtn = document.getElementById('back-to-signin-from-forgot-btn');
  const backToSignInFromSentBtn = document.getElementById('back-to-signin-from-sent-btn');
  const backToSignInFromVerifyBtn = document.getElementById('back-to-signin-from-verify-btn');
  const backToSignInFromResetBtn = document.getElementById('back-to-signin-from-reset-btn');
  const resendCodeBtn = document.getElementById('resend-code-btn');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  const createAccountForm = document.getElementById('create-account-form');
  const signInForm = document.getElementById('sign-in-form');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const verifyEmailForm = document.getElementById('verify-email-form');
  const resetPasswordForm = document.getElementById('reset-password-form');
  const emailInput = document.getElementById('email');
  const signInEmailInput = document.getElementById('signin-email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirm-password-error');

  const reqLength = document.getElementById('req-length');
  const reqNumber = document.getElementById('req-number');

  const drawerContainer = document.getElementById('drawer-container');
  const drawerNav = document.getElementById('drawer-nav');
  const openDrawerBtn = document.getElementById('openDrawerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerStartCodingBtn = document.getElementById('drawer-start-coding-btn');

  // --- MODAL VIEW MANAGEMENT ---
  const ALL_MODAL_VIEWS = [
    authChoiceView, createAccountView, signInView,
    successView, forgotPasswordView, resetSentView,
    verifyEmailView, resetPasswordView
  ];

  const showModalView = (viewToShow) => {
    ALL_MODAL_VIEWS.forEach(view => {
      if (view) view.classList.add('hidden');
    });
    if (viewToShow) viewToShow.classList.remove('hidden');
  };

  const openModal = () => {
    if (!modalContainer || !modal) return;
    lastFocusedElement = document.activeElement;

    modalContainer.classList.remove('hidden');
    modal.classList.remove('animate-fade-out');
    modalContainer.classList.remove('animate-fade-out');
    modalContainer.classList.add('animate-fade-in');
    modal.classList.add('animate-fade-in');
    document.body.classList.add('modal-is-open');

    const focusableElements = modal.querySelectorAll('a[href], button:not([disabled])');
    if (focusableElements.length > 0) focusableElements[0].focus();
  };

  const closeModal = () => {
    if (!modalContainer || !modal) return;

    modalContainer.classList.add('animate-fade-out');
    modal.classList.add('animate-fade-out');

    setTimeout(() => {
      modalContainer.classList.add('hidden');
      modalContainer.classList.remove('animate-fade-in');
      modal.classList.remove('animate-fade-in');
      document.body.classList.remove('modal-is-open');

      // reset modal view & forms
      showModalView(authChoiceView);
      [createAccountForm, signInForm, forgotPasswordForm, verifyEmailForm, resetPasswordForm].forEach(f => f?.reset());
      [emailError, passwordError, confirmPasswordError].forEach(el => {
        if (el) el.textContent = '';
      });
      [reqLength, reqNumber].forEach(el => {
        if (el) {
          el.classList.remove('text-green-500', 'dark:text-green-400');
          el.classList.add('text-slate-500', 'dark:text-slate-400');
        }

      });

      if (lastFocusedElement) lastFocusedElement.focus();
    }, CONFIG.modal.animationDuration);
  };

  // --- MODAL & DRAWER EVENTS ---
  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', () => {


    window.location.href = 'dashboard.html';

  });

  if (showCreateAccountBtn) showCreateAccountBtn.addEventListener('click', () => showModalView(createAccountView));
  if (showSignInBtn) showSignInBtn.addEventListener('click', () => showModalView(signInView));
  if (showForgotPasswordBtn) showForgotPasswordBtn.addEventListener('click', () => showModalView(forgotPasswordView));
  if (backToChoiceFromCreateBtn) backToChoiceFromCreateBtn.addEventListener('click', () => showModalView(authChoiceView));
  if (backToChoiceFromSignInBtn) backToChoiceFromSignInBtn.addEventListener('click', () => showModalView(authChoiceView));
  if (backToSignInFromForgotBtn) backToSignInFromForgotBtn.addEventListener('click', () => showModalView(signInView));
  if (backToSignInFromSentBtn) backToSignInFromSentBtn.addEventListener('click', () => showModalView(signInView));
  if (backToSignInFromVerifyBtn) backToSignInFromVerifyBtn.addEventListener('click', () => showModalView(signInView));
  if (backToSignInFromResetBtn) backToSignInFromResetBtn.addEventListener('click', () => showModalView(signInView));

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', () => {
    drawerContainer.classList.remove('hidden');
    drawerNav.classList.add('animate-slide-in-right');
    drawerNav.classList.remove('translate-x-full', 'animate-slide-out-right');
    drawerOverlay.classList.remove('animate-fade-out');
    drawerOverlay.classList.add('animate-fade-in');
    document.body.classList.add('drawer-is-open');

  });

  const closeDrawer = () => {
    if (!drawerContainer || !drawerNav || !drawerOverlay) return;
    drawerNav.classList.add('animate-slide-out-right');
    drawerOverlay.classList.add('animate-fade-out');

    setTimeout(() => {
      drawerContainer.classList.add('hidden');
      drawerNav.classList.remove('animate-slide-in-right');
      drawerNav.classList.add('translate-x-full');
      drawerOverlay.classList.remove('animate-fade-in');
      document.body.classList.remove('drawer-is-open');
    }, CONFIG.drawer.animationDuration);
  };

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  if (drawerStartCodingBtn) {
    drawerStartCodingBtn.addEventListener('click', () => {
      closeDrawer();
      setTimeout(openModal, CONFIG.startCodingDelay);

    });
  }

  // --- FORM VALIDATION ---
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email is required.';
      return false;
    } else if (!emailRegex.test(emailInput.value)) {
      emailError.textContent = 'Please enter a valid email address.';
      return false;
    } else {
      emailError.textContent = '';
      return true;
    }
  };

  const validatePassword = () => {
    const value = passwordInput.value;
    let isValid = true;

    const setReqState = (el, met) => {
      if (!el) return;
      if (met) {
        el.classList.add('text-green-500', 'dark:text-green-400');
        el.classList.remove('text-slate-500', 'dark:text-slate-400');
      } else {
        el.classList.remove('text-green-500', 'dark:text-green-400');
        el.classList.add('text-slate-500', 'dark:text-slate-400');
        isValid = false;
      }
    };

    setReqState(reqLength, value.length >= 7 && value.length <= 18);
    setReqState(reqNumber, /\d/.test(value));

    if (isValid && passwordError) passwordError.textContent = '';
    return isValid;
  };

  const validateConfirmPassword = () => {
    if (!confirmPasswordInput || !passwordInput) return true;
    if (confirmPasswordInput.value !== passwordInput.value) {
      if (confirmPasswordError) confirmPasswordError.textContent = 'Passwords do not match.';
      return false;
    } else {
      if (confirmPasswordError) confirmPasswordError.textContent = '';
      return true;
    }
  };

  if (emailInput) emailInput.addEventListener('input', validateEmail);
  if (passwordInput) passwordInput.addEventListener('input', () => {
    validatePassword();
    if (confirmPasswordInput && confirmPasswordInput.value) validateConfirmPassword();

  });
  if (confirmPasswordInput) confirmPasswordInput.addEventListener('input', validateConfirmPassword);

  if (createAccountForm) {
    createAccountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();
      const isConfirmPasswordValid = validateConfirmPassword();

      if (!isPasswordValid && passwordError) passwordError.textContent = 'Password does not meet all requirements.';
      else if (passwordError) passwordError.textContent = '';

      if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
        const submitBtn = createAccountForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        try {
          const response = await fetch('http://localhost:8001/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailInput.value,
              password: passwordInput.value
            })

          });

          if (response.ok) {
            const data = await response.json();
            const userID = data.user_id;

            localStorage.setItem('beatCodersUserID', userID);
            localStorage.setItem('beatCodersEmail', data.email);
            localStorage.setItem('beatCodersUsername', data.username);
            localStorage.removeItem('beatCodersUserSettings');

            const newUsernameEl = document.getElementById('new-username');
            if (newUsernameEl) newUsernameEl.textContent = userID;

            // Store email for verification
            localStorage.setItem('pendingVerificationEmail', data.email);
            showModalView(verifyEmailView);
          } else {
            const errorData = await response.json();
            if (emailError) emailError.textContent = errorData.detail || 'Registration failed.';
          }
        } catch (error) {
          console.error('Registration error:', error);
          if (emailError) emailError.textContent = 'Network error. Please try again.';
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }

    });
  }

  if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = signInForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing In...';

      // Clear previous errors (if any element exists for general errors, otherwise use alert or console for now)
      // Ideally add a general error element to the form in HTML, but for now we can use alert or just log

      try {
        const response = await fetch('http://localhost:8001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: signInEmailInput.value,
            password: document.getElementById('signin-password').value
          })

        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('beatCodersUserID', data.user_id);
          localStorage.setItem('beatCodersEmail', data.email);
          localStorage.setItem('beatCodersUsername', data.username);
          window.location.href = 'dashboard.html';
        } else {
          const errorData = await response.json();
          if (response.status === 404) {
            alert('Account not found');
          } else {
            const errorData = await response.json();
            if (response.status === 403) {
              alert('Email not verified. Please verify your email.');
              localStorage.setItem('pendingVerificationEmail', signInEmailInput.value);
              showModalView(verifyEmailView);
            } else if (response.status === 404) {
              alert('Account not found');
            } else {
              alert(errorData.detail || 'Login failed');
            }
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Network error. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }

    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const response = await fetch('http://localhost:8001/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })

        });

        if (response.ok) {
          console.log('Forgot password response OK');
          localStorage.setItem('pendingResetEmail', email);

          if (!resetPasswordView) {
            console.error('CRITICAL: resetPasswordView element not found!');
            alert('Error: Could not load reset password view. Please reload the page.');
            return;
          }

          console.log('Showing resetPasswordView');
          showModalView(resetPasswordView);
          alert('Reset code sent to your email.');
        } else {
          const data = await response.json();
          alert(data.detail || 'Failed to send reset email.');
        }
      } catch (error) {
        console.error('Forgot password error:', error);
        alert('Network error.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }

    });
  }

  if (verifyEmailForm) {
    verifyEmailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('verification-code').value;
      const email = localStorage.getItem('pendingVerificationEmail');

      if (!email) {
        alert('No email found to verify. Please sign in again.');
        showModalView(signInView);
        return;
      }

      const submitBtn = verifyEmailForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';

      try {
        const response = await fetch('http://localhost:8001/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, code: code })

        });

        if (response.ok) {
          alert('Email verified successfully! Please sign in.');
          showModalView(signInView);
        } else {
          const data = await response.json();
          alert(data.detail || 'Verification failed.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        alert('Network error.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }

    });
  }

  if (resendCodeBtn) {
    resendCodeBtn.addEventListener('click', async () => {
      const email = localStorage.getItem('pendingVerificationEmail');
      if (!email) return;

      resendCodeBtn.disabled = true;
      resendCodeBtn.textContent = 'Sending...';

      try {
        const response = await fetch('http://localhost:8001/api/auth/resend-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })

        });

        if (response.ok) {
          alert('Verification code resent!');
        } else {
          const data = await response.json();
          alert(data.detail || 'Failed to resend code.');
        }
      } catch (error) {
        console.error('Resend error:', error);
        alert('Network error.');
      } finally {
        resendCodeBtn.disabled = false;
        resendCodeBtn.textContent = 'Resend Code';
      }

    });
  }

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('reset-code').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmNewPassword = document.getElementById('confirm-new-password').value;
      const email = localStorage.getItem('pendingResetEmail');

      if (newPassword !== confirmNewPassword) {
        alert('Passwords do not match.');
        return;
      }

      if (!email) {
        alert('Session expired. Please try forgot password again.');
        showModalView(forgotPasswordView);
        return;
      }

      const submitBtn = resetPasswordForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Resetting...';

      try {
        const response = await fetch('http://localhost:8001/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            code: code,
            new_password: newPassword
          })

        });

        if (response.ok) {
          alert('Password reset successfully! Please sign in with your new password.');
          showModalView(signInView);
        } else {
          const data = await response.json();
          alert(data.detail || 'Password reset failed.');
        }
      } catch (error) {
        console.error('Reset password error:', error);
        alert('Network error.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }

    });
  }
  document.querySelectorAll('[data-scroll-to]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const section = document.getElementById(this.getAttribute('data-scroll-to'));
      if (section) section.scrollIntoView({
        behavior: 'smooth'
      });
      if (drawerContainer && !drawerContainer.classList.contains('hidden')) setTimeout(closeDrawer, CONFIG.drawer.animationDuration);

    });

  });

  const logo = document.getElementById('logo');
  if (logo) {
    logo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    logo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') window.scrollTo({
        top: 0, behavior: 'smooth'
      });
    });
  }

  // --- ACCESSIBILITY (KEYBOARD CONTROLS) ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalContainer && !modalContainer.classList.contains('hidden')) closeModal();
      if (drawerContainer && !drawerContainer.classList.contains('hidden')) closeDrawer();
    }

    if (e.key === 'Tab' && modalContainer && !modalContainer.classList.contains('hidden')) {
      if (!modal) return;
      const focusableElements = Array.from(modal.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(el => window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden');

      if (focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }
      } else {
        if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }
      }
    }

  });

  // --- INVITE FRIEND LOGIC ---
  const inviteFriendBtn = document.getElementById('invite-friend-btn');
  const inviteEmailInput = document.getElementById('invite-email-input');

  if (inviteFriendBtn && inviteEmailInput) {
    inviteFriendBtn.addEventListener('click', () => {
      const email = inviteEmailInput.value.trim();
      if (email) {
        // Simulate sending invite
        alert(`Battle invite sent to ${email}! 🎮\n\nThey'll receive an email with a link to join your battle.`);
        inviteEmailInput.value = '';
      } else {
        alert('Please enter a valid email address.');
      }

    });
  }

  // --- ONLINE USERS CHALLENGE LOGIC ---
  const challengeBtns = document.querySelectorAll('.challenge-btn');

  challengeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const username = btn.getAttribute('data-user');
      if (confirm(`Challenge ${username} to a 1v1 Rap Battle? 🎤⚔️\n\nYou'll both compete to solve coding problems. Each test case passed deals damage to your opponent!`)) {
        alert(`Battle request sent to ${username}! ⚡\n\nWaiting for them to accept... (Coming soon!)`);
      }

    });

  });

  // --- CODE EDITOR MODAL LOGIC ---
  const codeEditorModal = document.getElementById('code-editor-modal');
  const closeCodeEditorBtn = document.getElementById('close-modal-btn');
  const submitCodeBtn = document.getElementById('submit-code-btn');
  const codeEditor = document.getElementById('code-editor');
  const feedbackSection = document.getElementById('feedback-section');




  // Submit Code Logic
  if (submitCodeBtn) {
    submitCodeBtn.addEventListener('click', async () => {
      let code = '';
      if (editorInstance) {
        code = editorInstance.getValue();
        // Flush cognitive signals on submit
        console.log('[Main] Flushing signals before submit...');
        await cognitiveObserver.flush();
        console.log('[Main] Signals flushed.');
      } else {
        code = codeEditor.value;
      }
      const language = 'python'; // Default to Python
      const problemTitle = document.getElementById('modal-problem-title').textContent;
      const problemId = problemTitle.toLowerCase().replace(/\s+/g, '-');

      if (!code.trim()) {
        alert('Please write some code before submitting!');
        return;
      }

      // Show loading state
      submitCodeBtn.disabled = true;
      submitCodeBtn.textContent = 'Analyzing...';

      try {
        // 1. Submit to Backend
        const response = await fetch('http://localhost:8001/api/submissions/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            problem_id: problemId,
            code: code,
            language: language,
            user_tier: 'free'
          })
        });

        if (!response.ok) throw new Error('Submission failed');

        const result = await response.json();

        // 2. Get Analysis Results
        const analysisResponse = await fetch(`http://localhost:8001/api/submissions/analysis/${result.submission_id}`);

        if (!analysisResponse.ok) throw new Error('Analysis failed');

        const analysis = await analysisResponse.json();

        // 3. Display Feedback
        displayFeedback(analysis);

        // 4. Load Cognitive Analysis
        const cognitiveSection = document.getElementById('cognitive-analysis-section');
        if (cognitiveSection) {
          cognitiveSection.style.display = 'block';
          // Use the task ID we generated for the observer
          const taskId = cognitiveObserver.taskId;
          // Wait a moment for the flush to complete
          setTimeout(() => {
            if (cognitiveReplay) cognitiveReplay.loadAndRender(taskId);
          }, 1000);
        }

      } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing code. Make sure the backend server is running on port 8001.');
      } finally {
        submitCodeBtn.disabled = false;
        submitCodeBtn.textContent = 'Submit Solution';
      }
    });
  }

  // [Cleaned up duplicate run logic]

  // --- HELPER: Display Test Result in the panel ---
  window.renderVerticalResults = function (result, container) {
    if (!container) return;

    // Use CSS classes from style.css for layout (.test-case-content)
    // We just need to ensure the inner structure matches what the CSS expects (direct children divs)

    let html = `
        <div>
            <div style="color: var(--text-secondary); font-size: 13px; font-weight: 500;">Input</div>
            <code style="display:block; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace; font-size: 13px; overflow-x: auto;">${JSON.stringify(result.input)}</code>
        </div>
        <div>
            <div style="color: var(--text-secondary); font-size: 13px; font-weight: 500;">Expected Output</div>
            <code style="display:block; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace; font-size: 13px; overflow-x: auto;">${JSON.stringify(result.expected)}</code>
        </div>
      `;

    // Vertical layout for Actual Output
    const color = result.passed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    const borderColor = result.passed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    const textColor = result.passed ? '#86efac' : '#fca5a5';
    // Single line for logic check, fallback to error message
    const outputContent = result.error || JSON.stringify(result.actual);

    html += `
        <div>
            <div style="color: var(--text-secondary); font-size: 13px; font-weight: 500;">Your Output</div>
            <code style="display:block; background: ${color}; border: 1px solid ${borderColor}; padding: 12px; border-radius: 8px; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${textColor}; overflow-x: auto;">${outputContent}</code>
        </div>
      `;

    container.innerHTML = html;
  };

  // --- HELPER: Setup Tab Clicks ---
  function setupTestTabInteractions() {
    const tabs = document.querySelectorAll('.test-case-tab');
    tabs.forEach((tab, index) => {
      // Remove old listeners to avoid duplicates (naive approach: cloning)
      const newTab = tab.cloneNode(true);
      tab.parentNode.replaceChild(newTab, tab);

      newTab.addEventListener('click', () => {
        // Update active state - Relative to container
        const container = newTab.closest('.test-case-tabs');
        if (container) {
          container.querySelectorAll('.test-case-tab').forEach(t => t.classList.remove('active'));
        }
        newTab.classList.add('active');

        // Determine index relative to siblings to match with result array
        const siblings = Array.from(newTab.parentNode.children);
        const relativeIndex = siblings.indexOf(newTab);

        // Find relevant content container (modal or fullscreen)
        const wrapper = newTab.closest('#test-case-panel') || newTab.closest('.test-case-panel') || newTab.parentNode.parentNode;
        const content = wrapper ? wrapper.querySelector('.test-case-content') : null;

        if (window.currentTestResults && window.currentTestResults[relativeIndex] && content) {
          window.renderVerticalResults(window.currentTestResults[relativeIndex], content);
        }
      });
    });
  }

  // Rewrite Run Logic to use these helpers
  // --- FIX: Close Editor (Back Button) ---
  const closeEditorBtn = document.getElementById('close-editor-btn');
  if (closeEditorBtn) {
    // Cloning to remove old listeners if any
    const newCloseBtn = closeEditorBtn.cloneNode(true);
    closeEditorBtn.parentNode.replaceChild(newCloseBtn, closeEditorBtn);

    newCloseBtn.addEventListener('click', () => {
      const editorOverlay = document.getElementById('full-screen-editor');
      if (editorOverlay) {
        editorOverlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
      }
    });
  }

  const runBtnRef = document.getElementById('run-code-btn');
  if (runBtnRef) {
    // Re-attaching to clean up any potential closure mess
    const newRunBtn = runBtnRef.cloneNode(true);
    runBtnRef.parentNode.replaceChild(newRunBtn, runBtnRef);

    newRunBtn.addEventListener('click', async () => {
      console.log('[Run] Clicked!'); let code = '';
      if (editorInstance) code = editorInstance.getValue();
      else if (window.editorInstance) code = window.editorInstance.getValue();
      else code = codeEditor ? codeEditor.value : '';

      const titleEl = document.getElementById('editor-problem-title') || document.getElementById('modal-problem-title');
      const problemTitle = titleEl ? titleEl.innerText.trim() : '';
      const problemId = problemTitle.toLowerCase().replace(/\s+/g, '-');
      console.log('[Run] Problem:', problemId, 'from Title:', problemTitle);

      const currentProblem = window.FULL_PROBLEM_SET ? window.FULL_PROBLEM_SET.find(p => p.title === problemTitle) : null;
      console.log('[Run] Found Problem in DB:', currentProblem);
      const testCases = currentProblem ? currentProblem.testCases : [];

      if (!code.trim()) { alert('Write some code!'); return; }

      const originalText = newRunBtn.textContent;
      newRunBtn.disabled = true;
      newRunBtn.innerHTML = '<span class="animate-spin">↻</span> Running...';

      try {
        const feedbackSection = document.getElementById('feedback-section');
        // Hide feedback section to focus on tests
        if (feedbackSection) feedbackSection.style.display = 'none';

        console.log('[Run] Sending request...');
        const res = await fetch('http://localhost:8001/api/run-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language: 'python', problemId, testCases })
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || 'Run failed');
        }

        const data = await res.json();
        window.currentTestResults = data.results;

        // Update tabs
        setupTestTabInteractions(); // Re-bind clicks
        const tabs = document.querySelectorAll('.test-case-tab');
        let allPassed = true;

        data.results.forEach((r, i) => {
          // This loop is imperfect because it updates tabs globally by index. 
          // Ideally we should update tabs in groups, but for now this visual feedback is acceptable
          // as long as the functionality to click them works (which we fixed above).
          if (tabs[i]) {
            if (!r.passed) allPassed = false;
            // Only update inner HTML if it's not already updated to avoid layout thrashing, or just update.
            // We need to keep the structure clean.
            // Naive update matches original logic
            // tabs[i].innerHTML logic is okay, but we should potentially target specific containers if we want perfection.
            // For now, let's keep it simple as the user cares about the CONTENT result layout.
            // Actually, we should iterate all tabs and restart "Case N" text if needed
          }
        });

        // Better Tab Update Loop:
        document.querySelectorAll('.test-case-tabs').forEach(tabContainer => {
          const containerTabs = tabContainer.querySelectorAll('.test-case-tab');
          data.results.forEach((r, idx) => {
            if (containerTabs[idx]) {
              containerTabs[idx].innerHTML = `Case ${idx + 1} <span style="color:${r.passed ? '#4ade80' : '#f87171'}; margin-left:4px;">${r.passed ? '✓' : '✗'}</span>`;
              if (idx === 0) containerTabs[idx].classList.add('active');
              else containerTabs[idx].classList.remove('active');
            }
          });
        });

        // Show first result in ALL content containers
        const allContentContainers = document.querySelectorAll('.test-case-content');
        if (allContentContainers.length > 0 && data.results.length > 0) {
          allContentContainers.forEach(container => {
            window.renderVerticalResults(data.results[0], container);
          });
        }

        // Toggle Submit Button
        const submitBtn = document.getElementById('submit-solution-btn');
        if (submitBtn) {
          if (allPassed) {
            console.log('[Run] All passed, showing submit');
            submitBtn.style.display = 'flex';
            submitBtn.style.opacity = '1';
            // Animate it nicely
            submitBtn.animate([
              { transform: 'scale(0.9)', opacity: 0 },
              { transform: 'scale(1)', opacity: 1 }
            ], { duration: 300 });
          } else {
            console.log('[Run] Not all passed, hiding submit');
            submitBtn.style.display = 'none';
          }
        }




      } catch (e) {
        console.error(e);
        alert(e.message);
      } finally {
        newRunBtn.disabled = false;
        newRunBtn.innerHTML = `
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 5px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg> Run`;
      }
    });
  }

  // --- FIX: Submit Solution Logic (Hidden Tests + Next Question) ---
  const submitSolutionBtn = document.getElementById('submit-solution-btn');
  if (submitSolutionBtn) {
    // Clone to remove old listeners
    const newSubmitBtn = submitSolutionBtn.cloneNode(true);
    submitSolutionBtn.parentNode.replaceChild(newSubmitBtn, submitSolutionBtn);

    newSubmitBtn.addEventListener('click', async () => {
      let code = '';
      if (editorInstance) code = editorInstance.getValue();
      else if (window.editorInstance) code = window.editorInstance.getValue();
      else code = document.getElementById('monaco-editor-container').innerText; // Fallback

      const titleEl = document.getElementById('editor-problem-title');
      const problemTitle = titleEl ? titleEl.innerText.trim() : '';
      const problemId = problemTitle.toLowerCase().replace(/\s+/g, '-');

      if (!code.trim()) { alert('Write some code!'); return; }

      const originalText = newSubmitBtn.textContent;
      newSubmitBtn.disabled = true;
      newSubmitBtn.textContent = 'Submitting...';

      try {
        const feedbackSection = document.getElementById('feedback-section');
        const feedbackContent = document.getElementById('feedback-content');
        if (feedbackSection) feedbackSection.style.display = 'block';
        if (feedbackContent) feedbackContent.innerHTML = '<div style="color:var(--text-secondary);">Running hidden tests...</div>';

        // 1. Submit to Backend
        const response = await fetch('http://localhost:8001/api/submissions/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problem_id: problemId,
            code: code,
            language: 'python',
            user_tier: 'free'
          })
        });

        if (!response.ok) throw new Error('Submission failed');
        const result = await response.json();

        // 2. Get Analysis Results
        const analysisResponse = await fetch(`http://localhost:8001/api/submissions/analysis/${result.submission_id}`);
        if (!analysisResponse.ok) throw new Error('Analysis failed');
        const analysis = await analysisResponse.json();

        // 3. Display Feedback
        displayFeedback(analysis);

        // 4. Check for Success -> Show "Next Question"
        if (analysis.is_optimal || analysis.feedback_tier === 'optimal' || analysis.feedback_tier === 'good' || (analysis.tests_passed === analysis.tests_total && analysis.tests_total > 0)) {
          console.log('[Submit] Success! Showing Next Question button.');

          if (feedbackContent) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'submit-btn';
            nextBtn.style.marginTop = '20px';
            nextBtn.style.width = '100%';
            nextBtn.style.background = 'var(--accent1)'; // Blue/Purple accent
            nextBtn.style.color = '#fff';
            nextBtn.style.fontWeight = '600';
            nextBtn.type = 'button'; // Prevent implicit form submission
            nextBtn.innerHTML = 'Next Problem →';

            nextBtn.onclick = (e) => { // Accept event object
              if (e) e.preventDefault(); // Stop any default action (form submit etc.)

              // Redirect/Close Editor
              const editorOverlay = document.getElementById('full-screen-editor');
              if (editorOverlay) {
                editorOverlay.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scrolling
              }

              // Redirect to Practice View with slight delay to ensure UI updates
              setTimeout(() => {
                console.log('[NextProblem] Executing DIRECT view switch to practice-view');

                // 1. Try Global Function (Cleanest)
                if (window.showMainView) {
                  try { window.showMainView('practice-view'); } catch (e) { console.error(e); }
                }

                // 2. Force DOM State (Backup/Nuclear Option)
                const practiceView = document.getElementById('practice-view');
                if (practiceView) {
                  // Hide all potential views
                  document.querySelectorAll('main > div[id$="-view"]').forEach(v => v.classList.add('hidden'));
                  // Show Practice
                  practiceView.classList.remove('hidden');
                }

                // 3. Update Nav State
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                const navLink = document.getElementById('nav-practice-link');
                if (navLink) navLink.classList.add('active');

                // 4. Re-populate data just in case
                initPracticeView();

                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            };

            feedbackContent.appendChild(nextBtn);
            // Scroll to bottom to show button
            feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }

      } catch (error) {
        console.error('Submit Error:', error);
        alert('Submission failed: ' + error.message);
      } finally {
        newSubmitBtn.disabled = false;
        newSubmitBtn.textContent = originalText;
      }
    });
  }

  initPracticeView();
  console.log('[Main] initApp body execution complete');
}

// Run initialization when DOM is ready
console.log('[Main] Registering DOMContentLoaded listener');
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
