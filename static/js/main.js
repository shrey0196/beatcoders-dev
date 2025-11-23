document.addEventListener('DOMContentLoaded', () => {

  // --- CONFIG ---
  const CONFIG = {
    THEMES: { DARK: 'dark', LIGHT: 'light' },
    modal: { animationDuration: 160 },
    drawer: { animationDuration: 300 },
    startCodingDelay: 150
  };

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

  const showCreateAccountBtn = document.getElementById('show-create-account-btn');
  const showSignInBtn = document.getElementById('show-sign-in-btn');
  const showForgotPasswordBtn = document.getElementById('show-forgot-password-btn');
  const backToChoiceFromCreateBtn = document.getElementById('back-to-choice-from-create-btn');
  const backToChoiceFromSignInBtn = document.getElementById('back-to-choice-from-signin-btn');
  const backToSignInFromForgotBtn = document.getElementById('back-to-signin-from-forgot-btn');
  const backToSignInFromSentBtn = document.getElementById('back-to-signin-from-sent-btn');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  const createAccountForm = document.getElementById('create-account-form');
  const signInForm = document.getElementById('sign-in-form');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
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
    successView, forgotPasswordView, resetSentView
  ];

  const showModalView = (viewToShow) => {
    ALL_MODAL_VIEWS.forEach(view => { if (view) view.classList.add('hidden'); });
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
      [createAccountForm, signInForm, forgotPasswordForm].forEach(f => f?.reset());
      [emailError, passwordError, confirmPasswordError].forEach(el => { if (el) el.textContent = ''; });
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
    createAccountForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();
      const isConfirmPasswordValid = validateConfirmPassword();

      if (!isPasswordValid && passwordError) passwordError.textContent = 'Password does not meet all requirements.';
      else if (passwordError) passwordError.textContent = '';

      if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
        const userID = `Coder${Math.floor(1000 + Math.random() * 9000)}`;
        const emailName = emailInput.value.split('@')[0];
        const realName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

        localStorage.setItem('beatCodersUserID', userID);
        localStorage.setItem('beatCodersRealName', realName);
        localStorage.setItem('beatCodersEmail', emailInput.value);
        localStorage.removeItem('beatCodersUserSettings');

        const newUsernameEl = document.getElementById('new-username');
        if (newUsernameEl) newUsernameEl.textContent = userID;

        showModalView(successView);
      }
    });
  }

  if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let userID = 'Coder';
      if (signInEmailInput && signInEmailInput.value) {
        const emailValue = signInEmailInput.value;
        const emailName = emailValue.split('@')[0];
        userID = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        localStorage.setItem('beatCodersEmail', emailValue);
      }
      localStorage.setItem('beatCodersUserID', userID);
      window.location.href = 'dashboard.html';
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showModalView(resetSentView);
    });
  }

  // --- SMOOTH SCROLL & LOGO ---
  document.querySelectorAll('[data-scroll-to]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const section = document.getElementById(this.getAttribute('data-scroll-to'));
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      if (drawerContainer && !drawerContainer.classList.contains('hidden')) setTimeout(closeDrawer, CONFIG.drawer.animationDuration);
    });
  });

  const logo = document.getElementById('logo');
  if (logo) {
    logo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    logo.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.scrollTo({ top: 0, behavior: 'smooth' }); });
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

  // Problem Data (Mock Data for now, ideally fetch from backend)
  const problemsDataMap = {
    "Two Sum": {
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      difficulty: "Easy",
      topic: "Arrays & Hashing",
      acceptance: "48.5%"
    },
    "Valid Anagram": {
      description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      difficulty: "Easy",
      topic: "Arrays & Hashing",
      acceptance: "62.1%"
    },
    "Contains Duplicate": {
      description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
      difficulty: "Easy",
      topic: "Arrays & Hashing",
      acceptance: "60.3%"
    },
    "Group Anagrams": {
      description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
      difficulty: "Medium",
      topic: "Arrays & Hashing",
      acceptance: "66.2%"
    },
    "Top K Frequent Elements": {
      description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
      difficulty: "Medium",
      topic: "Arrays & Hashing",
      acceptance: "64.5%"
    },
    "Product of Array Except Self": {
      description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
      difficulty: "Medium",
      topic: "Arrays & Hashing",
      acceptance: "63.8%"
    }
  };

  function openCodeEditor(problemTitle) {
    const problem = problemsDataMap[problemTitle] || {
      description: "Problem description not available.",
      difficulty: "Unknown",
      topic: "General",
      acceptance: "-"
    };

    document.getElementById('modal-problem-title').textContent = problemTitle;
    document.getElementById('modal-problem-description').textContent = problem.description;

    const diffTag = document.getElementById('modal-problem-difficulty');
    diffTag.textContent = problem.difficulty;
    diffTag.className = `difficulty-tag ${problem.difficulty.toLowerCase()}`;

    document.getElementById('modal-problem-topic').textContent = problem.topic;

    // Reset editor
    codeEditor.value = '';
    feedbackSection.style.display = 'none';
    codeEditorModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeCodeEditor() {
    codeEditorModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeCodeEditorBtn) closeCodeEditorBtn.addEventListener('click', closeCodeEditor);
  if (codeEditorModal) codeEditorModal.addEventListener('click', (e) => {
    if (e.target === codeEditorModal) closeCodeEditor();
  });

  // Initialize Practice Problems Click Handlers
  const problemsTableBody = document.getElementById('problems-table-body');
  if (problemsTableBody) {
    problemsTableBody.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (row) {
        const title = row.cells[0].textContent;
        openCodeEditor(title);
      }
    });
  }

  // Also handle "Solve Problem" button in Dashboard view
  const solveProblemBtn = document.getElementById('solve-problem-btn');
  if (solveProblemBtn) {
    solveProblemBtn.addEventListener('click', () => {
      const title = document.querySelector('.problem-title').textContent;
      openCodeEditor(title);
    });
  }

  // Submit Code Logic
  if (submitCodeBtn) {
    submitCodeBtn.addEventListener('click', async () => {
      const code = codeEditor.value;
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

      } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing code. Make sure the backend server is running on port 8001.');
      } finally {
        submitCodeBtn.disabled = false;
        submitCodeBtn.textContent = 'Submit Solution';
      }
    });
  }

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
        <p style="color: var(--text-primary); font-size: 16px; margin-bottom: 20px; line-height: 1.5;">
          ${analysis.feedback_message}
        </p>
        
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

});
