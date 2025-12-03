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
  const cognitiveObserver = new window.CognitiveObserver();
  const cognitiveReplay = new window.CognitiveReplay('cognitive-chart');

  // Phase 3: Adaptive IDE (make globally accessible)
  window.adaptiveIDE = new window.AdaptiveIDE();
  window.visualDebugger = new window.VisualDebugger();

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

  // --- SMOOTH SCROLL & LOGO ---
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


  // Problem Data and Function Templates

  // Visual Hints (Mermaid Flowcharts) for each problem


  const problemsData = [
    {
      title: "Two Sum",
      difficulty: "Easy",
      topic: "Arrays & Hashing",
      acceptance: "49.2%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
          <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [2,7,11,15], target = 9</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[0,1]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Explanation</span>
            <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">Because nums[0] + nums[1] == 9, we return [0, 1].</div>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [3,2,4], target = 6</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[1,2]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [3,3], target = 6</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[0,1]</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>2 <= nums.length <= 10<sup>4</sup></code></li>
          <li class="constraint-item"><code>-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup></code></li>
          <li class="constraint-item"><code>-10<sup>9</sup> <= target <= 10<sup>9</sup></code></li>
          <li class="constraint-item"><strong>Only one valid answer exists.</strong></li>
        </ul>
      `,
      testCases: [{ "input": { "nums": [2, 7, 11, 15], "target": 9 }, "output": [0, 1] }, { "input": { "nums": [3, 2, 4], "target": 6 }, "output": [1, 2] }, { "input": { "nums": [3, 3], "target": 6 }, "output": [0, 1] }]
    },
    {
      title: "Valid Anagram",
      difficulty: "Easy",
      topic: "Arrays & Hashing",
      acceptance: "62.4%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> <em>if</em> <code>t</code> <em>is an anagram of</em> <code>s</code><em>, and</em> <code>false</code> <em>otherwise</em>.</p>
          <p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">s = "anagram", t = "nagaram"</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">true</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">s = "rat", t = "car"</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">false</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>1 <= s.length, t.length <= 5 * 10<sup>4</sup></code></li>
          <li class="constraint-item"><code>s</code> and <code>t</code> consist of lowercase English letters.</li>
        </ul>
      `,
      testCases: [{ "input": { "s": "anagram", "t": "nagaram" }, "output": true }, { "input": { "s": "rat", "t": "car" }, "output": false }, { "input": { "s": "a", "t": "a" }, "output": true }]
    },
    {
      title: "Contains Duplicate",
      difficulty: "Easy",
      topic: "Arrays & Hashing",
      acceptance: "60.1%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,2,3,1]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">true</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,2,3,4]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">false</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,1,1,3,3,4,3,2,4,2]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">true</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>1 <= nums.length <= 10<sup>5</sup></code></li>
          <li class="constraint-item"><code>-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup></code></li>
        </ul>
      `,
      testCases: [{ "input": { "nums": [1, 2, 3, 1] }, "output": true }, { "input": { "nums": [1, 2, 3, 4] }, "output": false }, { "input": { "nums": [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, "output": true }]
    },
    {
      title: "Group Anagrams",
      difficulty: "Medium",
      topic: "Arrays & Hashing",
      acceptance: "66.2%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given an array of strings <code>strs</code>, group <strong>the anagrams</strong> together. You can return the answer in <strong>any order</strong>.</p>
          <p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">strs = ["eat","tea","tan","ate","nat","bat"]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[["bat"],["nat","tan"],["ate","eat","tea"]]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">strs = [""]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[[""]]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">strs = ["a"]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[["a"]]</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>1 <= strs.length <= 10<sup>4</sup></code></li>
          <li class="constraint-item"><code>0 <= strs[i].length <= 100</code></li>
          <li class="constraint-item"><code>strs[i]</code> consists of lowercase English letters.</li>
        </ul>
      `,
      testCases: [{ "input": { "strs": ["eat", "tea", "tan", "ate", "nat", "bat"] }, "output": [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] }, { "input": { "strs": [""] }, "output": [[""]] }, { "input": { "strs": ["a"] }, "output": [["a"]] }]
    },
    {
      title: "Top K Frequent Elements",
      difficulty: "Medium",
      topic: "Arrays & Hashing",
      acceptance: "64.1%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>k</code> <em>most frequent elements</em>. You may return the answer in <strong>any order</strong>.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,1,1,2,2,3], k = 2</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[1,2]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1], k = 1</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[1]</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>1 <= nums.length <= 10<sup>5</sup></code></li>
          <li class="constraint-item"><code>-10<sup>4</sup> <= nums[i] <= 10<sup>4</sup></code></li>
          <li class="constraint-item"><code>k</code> is in the range <code>[1, the number of unique elements in the array]</code>.</li>
          <li class="constraint-item">It is <strong>guaranteed</strong> that the answer is <strong>unique</strong>.</li>
        </ul>
      `,
      testCases: [{ "input": { "nums": [1, 1, 1, 2, 2, 3], "k": 2 }, "output": [1, 2] }, { "input": { "nums": [1], "k": 1 }, "output": [1] }, { "input": { "nums": [1, 2], "k": 2 }, "output": [1, 2] }]
    },
    {
      title: "Product of Array Except Self",
      difficulty: "Medium",
      topic: "Arrays & Hashing",
      acceptance: "63.8%",
      htmlDescription: `
        <div class="problem-statement">
          <p>Given an integer array <code>nums</code>, return <em>an array</em> <code>answer</code> <em>such that</em> <code>answer[i]</code> <em>is equal to the product of all the elements of</em> <code>nums</code> <em>except</em> <code>nums[i]</code>.</p>
          <p>The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</p>
          <p>You must write an algorithm that runs in <code>O(n)</code> time and without using the division operation.</p>
        </div>

        <div class="section-title">Examples</div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [1,2,3,4]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[24,12,8,6]</code>
          </div>
        </div>

        <div class="example-card">
          <div class="io-group">
            <span class="io-label">Input</span>
            <code class="io-value">nums = [-1,1,0,-3,3]</code>
          </div>
          <div class="io-group">
            <span class="io-label">Output</span>
            <code class="io-value">[0,0,9,0,0]</code>
          </div>
        </div>

        <div class="section-title">Constraints</div>
        <ul class="constraint-list">
          <li class="constraint-item"><code>2 <= nums.length <= 10<sup>5</sup></code></li>
          <li class="constraint-item"><code>-30 <= nums[i] <= 30</code></li>
          <li class="constraint-item">The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</li>
        </ul>
      `,
      testCases: [{ "input": { "nums": [1, 2, 3, 4] }, "output": [24, 12, 8, 6] }, { "input": { "nums": [-1, 1, 0, -3, 3] }, "output": [0, 0, 9, 0, 0] }, { "input": { "nums": [2, 3, 4, 5] }, "output": [60, 40, 30, 24] }]
    }
  ];

  const functionTemplates = {
    "Two Sum": "def twoSum(nums, target):\n    # Write your code here\n    pass",
    "Valid Anagram": "def isAnagram(s, t):\n    # Write your code here\n    pass",
    "Contains Duplicate": "def containsDuplicate(nums):\n    # Write your code here\n    pass",
    "Group Anagrams": "def groupAnagrams(strs):\n    # Write your code here\n    pass",
    "Top K Frequent Elements": "def topKFrequent(nums, k):\n    # Write your code here\n    pass",
    "Product of Array Except Self": "def productExceptSelf(nums):\n    # Write your code here\n    pass"
  };

  const problemsDataMap = problemsData.reduce((acc, curr) => {
    acc[curr.title] = curr;
    return acc;
  }, {});

  function initPracticeView() {
    const tableBody = document.getElementById('problems-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    problemsData.forEach(problem => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${problem.title}</td>
        <td><span class="difficulty-tag ${problem.difficulty.toLowerCase()}">${problem.difficulty}</span></td>
        <td>${problem.acceptance}</td>
      `;
      row.style.cursor = 'pointer';
      tableBody.appendChild(row);
    });
  }


  function resetEditorState() {
    console.log('[Reset] Resetting editor state...');

    // Reset Test Case Tabs
    const tabs = document.querySelectorAll('.test-case-tab');
    console.log(`[Reset] Found ${tabs.length} tabs`);

    tabs.forEach((tab, index) => {
      // Nuke all classes and re-add base class
      tab.className = 'test-case-tab';

      // Nuke inline styles
      tab.removeAttribute('style');

      // Reset content
      tab.innerHTML = '';
      tab.textContent = `Case ${index + 1}`;

      // Set first as active
      if (index === 0) tab.classList.add('active');
    });

    // Reset Submit Button
    const submitBtn = document.getElementById('submit-solution-btn');
    if (submitBtn) {
      // Force hide with important style if possible, or just standard
      submitBtn.style.cssText = 'display: none !important; opacity: 0 !important; transition: all 0.3s ease;';
    }

    // Reset Results Panel
    const resultsPanel = document.getElementById('test-results-panel');
    if (resultsPanel) resultsPanel.innerHTML = '';

    console.log('[Reset] Complete');
  }

  function openCodeEditor(problemTitle) {
    resetEditorState();
    currentProblemTitle = problemTitle;

    console.log('openCodeEditor called with:', problemTitle);
    const problem = problemsDataMap[problemTitle] || {
      description: "Problem description not available.",
      difficulty: "Unknown",
      topic: "General",
      acceptance: "-"
    };


    // Render Initial Test Case Content
    const testCaseContent = document.querySelector('.test-case-content');
    if (testCaseContent && problem.testCases && problem.testCases.length > 0) {
      const firstCase = problem.testCases[0];
      testCaseContent.innerHTML = `
        <div style="margin-bottom: 10px;">
          <span style="color: var(--text-secondary);">Input:</span>
          <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(firstCase.input)}</code>
        </div>
        <div>
          <span style="color: var(--text-secondary);">Expected Output:</span>
          <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(firstCase.output)}</code>
        </div>
      `;
    } else if (testCaseContent) {
      testCaseContent.innerHTML = '<div style="color: var(--text-secondary); padding: 20px; text-align: center;">No test cases available</div>';
    }


    // Update Editor UI
    document.getElementById('editor-problem-title').textContent = problemTitle;

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
    const template = functionTemplates[problemTitle] || "# Write your code here\n";

    if (window.require) {
      require(['vs/editor/editor.main'], function () {
        if (!editorInstance) {
          editorInstance = monaco.editor.create(document.getElementById('monaco-editor-container'), {
            value: template,
            language: 'python',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 20 }
          });
          window.editorInstance = editorInstance;

          // Phase 3: Create Visual Debugger UI
          if (window.visualDebugger) {
            // We need to adapt Visual Debugger to new layout if needed, 
            // but for now let's ensure it knows about the editor
            // window.visualDebugger.createDebuggerUI(); // This might need adjustment for new layout
          }

          document.dispatchEvent(new CustomEvent('monaco-loaded', { detail: { editor: editorInstance } }));
        } else {
          editorInstance.setValue(template);
          editorInstance.layout(); // Force layout update
        }

        // Attach Cognitive Observer
        if (cognitiveObserver) {
          const taskId = problemTitle.toLowerCase().replace(/\s+/g, '-');
          console.log(`[Main] Attaching observer to task: ${taskId}`);
          cognitiveObserver.attach(editorInstance, taskId);
        }
      });
    }

    // Reset Feedback
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.style.display = 'none';
  }

  function closeCodeEditor() {
    const fullScreenEditor = document.getElementById('full-screen-editor');
    if (fullScreenEditor) {
      fullScreenEditor.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  // Expose to window
  window.openCodeEditor = openCodeEditor;
  window.closeCodeEditor = closeCodeEditor;

  // Event Listeners for New Editor
  const closeEditorBtn = document.getElementById('close-editor-btn');
  if (closeEditorBtn) closeEditorBtn.addEventListener('click', closeCodeEditor);

  // Language Selector Logic
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.addEventListener('change', (e) => {
      const lang = e.target.value;
      if (editorInstance) {
        monaco.editor.setModelLanguage(editorInstance.getModel(), lang);
      }
    });
  }

  // Test Case Tabs Logic
  const testCaseTabs = document.querySelectorAll('.test-case-tab');
  const testCaseContent = document.querySelector('.test-case-content');

  if (testCaseTabs.length > 0 && testCaseContent) {
    testCaseTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        testCaseTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        // Update content based on index (Mock data for now)
        const mockCases = [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
          { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
          { input: "nums = [3,3], target = 6", output: "[0,1]" }
        ];

        const currentCase = mockCases[index] || mockCases[0];

        testCaseContent.innerHTML = `
                <div style="margin-bottom: 10px;">
                  <span style="color: var(--text-secondary);">Input:</span>
                  <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${currentCase.input}</code>
                </div>
                <div>
                  <span style="color: var(--text-secondary);">Expected Output:</span>
                  <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${currentCase.output}</code>
                </div>
              `;
      });
    });
  }

  // Run Button Logic
  let currentProblemTitle = null;

  const runCodeBtn = document.getElementById('run-code-btn');
  if (runCodeBtn) {
    runCodeBtn.addEventListener('click', async () => {
      if (!editorInstance || !currentProblemTitle) {
        alert('Editor not initialized');
        return;
      }

      const code = editorInstance.getValue();
      const problem = problemsDataMap[currentProblemTitle];

      if (!problem || !problem.testCases) {
        alert('No test cases available for this problem');
        return;
      }

      // Show loading state
      runCodeBtn.disabled = true;
      runCodeBtn.innerHTML = '<span style="margin-right: 5px;">⏳</span> Running...';

      try {
        const response = await fetch('http://localhost:8001/api/run-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            language: 'python',
            testCases: problem.testCases,
            problemId: currentProblemTitle
          })
        });

        const data = await response.json();

        // Update test case tabs with results
        const testCaseTabs = document.querySelectorAll('.test-case-tab');
        const testCaseContent = document.querySelector('.test-case-content');

        if (data.success && data.results) {
          data.results.forEach((result, index) => {
            const tab = testCaseTabs[index];
            if (tab) {
              // Remove previous status classes
              tab.classList.remove('test-passed', 'test-failed');

              // Add status class
              if (result.passed) {
                tab.classList.add('test-passed');
                tab.innerHTML = `Case ${index + 1} <span style="color: #22c55e; margin-left: 5px;">✓</span>`;
              } else {
                tab.classList.add('test-failed');
                tab.innerHTML = `Case ${index + 1} <span style="color: #ef4444; margin-left: 5px;">✗</span>`;
              }
            }
          });

          // Show first test case result
          if (data.results.length > 0) {
            displayTestResult(data.results[0], testCaseContent);
          }

          // Show/hide Submit button based on all tests passing
          const submitBtn = document.getElementById('submit-solution-btn');
          if (submitBtn) {
            if (data.allPassed) {
              submitBtn.style.display = 'inline-flex';
              submitBtn.style.opacity = '1';
              submitBtn.style.animation = 'fadeIn 0.3s ease-in';
            } else {
              submitBtn.style.display = 'none';
            }
          }
        }

      } catch (error) {
        console.error('Error running code:', error);
        alert('Failed to run code. Make sure the backend server is running.');
      } finally {
        // Reset button state
        runCodeBtn.disabled = false;
        runCodeBtn.innerHTML = `
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 5px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Run
        `;
      }
    });
  }

  // Submit Button Logic
  const submitBtn = document.getElementById('submit-solution-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      if (!editorInstance || !currentProblemTitle) {
        alert('Editor not initialized');
        return;
      }

      const code = editorInstance.getValue();
      const problem = problemsDataMap[currentProblemTitle];

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span style="margin-right: 5px;">⏳</span> Submitting...';

      try {
        const response = await fetch('http://localhost:8001/api/submit-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            language: 'python',
            problemId: currentProblemTitle,
            testCases: problem.testCases || []
          })
        });

        const data = await response.json();

        if (data.success) {
          // Show success screen if all tests passed, otherwise show regular results
          if (data.allPassed) {
            showSuccessScreen(data, code);
          } else {
            showFailureScreen(data, code);
          }
        }

      } catch (error) {
        console.error('Error submitting code:', error);
        alert('Failed to submit code. Make sure the backend server is running.');
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit';
      }
    });
  }

  // Helper function to display test result
  function displayTestResult(result, container) {
    if (!container) return;

    const statusColor = result.passed ? '#22c55e' : '#ef4444';
    const statusIcon = result.passed ? '✓' : '✗';

    container.innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="color: ${statusColor}; font-size: 1.2rem;">${statusIcon}</span>
          <span style="color: var(--text-primary); font-weight: 600;">${result.passed ? 'Passed' : 'Failed'}</span>
        </div>
        
        <div style="margin-bottom: 10px;">
          <span style="color: var(--text-secondary); font-size: 0.85rem;">Input:</span>
          <code style="display: block; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; margin-top: 5px; color: var(--text-primary);">${JSON.stringify(result.input, null, 2)}</code>
        </div>
        
        <div style="margin-bottom: 10px;">
          <span style="color: var(--text-secondary); font-size: 0.85rem;">Expected Output:</span>
          <code style="display: block; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; margin-top: 5px; color: var(--text-primary);">${JSON.stringify(result.expected, null, 2)}</code>
        </div>
        
        <div style="margin-bottom: 10px;">
          <span style="color: var(--text-secondary); font-size: 0.85rem;">Your Output:</span>
          <code style="display: block; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; margin-top: 5px; color: ${result.passed ? 'var(--text-primary)' : '#ef4444'};">${result.error || JSON.stringify(result.actual, null, 2)}</code>
        </div>
      </div>
    `;
  }


  // Helper function to analyze code quality and assign points with real insights
  function analyzeSolution(code, runtime, cognitiveData) {
    // Analyze code structure
    const codeLines = code.trim().split('\\n').length;

    const hasComments = code.includes('#') || code.includes('//');
    const hasNestedLoops = /for.*for/s.test(code) || /while.*while/s.test(code);
    const hasHashMap = code.includes('{}') || code.includes('dict') || code.includes('seen') || code.includes('hash');
    const hasOptimalStructure = hasHashMap && !hasNestedLoops;

    // Parse runtime (assuming format like "42ms")
    const runtimeMs = parseInt(runtime.replace('ms', ''));

    // Determine quality tier and insights
    let tier = 'Improvable';
    let points = 50;
    let color = '#f59e0b'; // Orange
    let timeComplexity = 'O(n²)';
    let spaceComplexity = 'O(1)';
    let insights = [];

    if (hasNestedLoops) {
      // Brute force approach
      tier = 'Improvable';
      points = 50;
      color = '#f59e0b';
      timeComplexity = 'O(n²)';
      spaceComplexity = 'O(1)';
      insights = [
        { icon: '⚠️', title: 'Nested Loops Detected', desc: 'Using O(n²) time complexity with nested iterations', positive: false },
        { icon: '✓', title: 'Minimal Space Usage', desc: 'No additional data structures used (O(1) space)', positive: true },
        { icon: '💡', title: 'Optimization Possible', desc: 'Consider using a hash map to achieve O(n) time complexity', positive: false }
      ];
    } else if (hasOptimalStructure && runtimeMs < 50) {
      // Optimal solution
      tier = 'Optimal';
      points = 100;
      color = '#22c55e';
      timeComplexity = 'O(n)';
      spaceComplexity = 'O(n)';
      insights = [
        { icon: '✓', title: 'Optimal Time Complexity', desc: 'Using O(n) time with hash map optimization', positive: true },
        { icon: '✓', title: 'Efficient Single Pass', desc: 'Solution completes in one iteration through the array', positive: true },
        { icon: '✓', title: 'Smart Space Trade-off', desc: 'Uses O(n) space for significant time improvement', positive: true }
      ];
    } else {
      // Good solution
      tier = 'Good';
      points = 70;
      color = '#f59e0b';
      timeComplexity = hasHashMap ? 'O(n)' : 'O(n log n)';
      spaceComplexity = hasHashMap ? 'O(n)' : 'O(1)';
      insights = [
        { icon: '✓', title: 'Decent Performance', desc: 'Achieves ' + timeComplexity + ' time complexity', positive: true },
        { icon: '✓', title: 'Correct Implementation', desc: 'Solution passes all test cases successfully', positive: true },
        { icon: '💡', title: 'Minor Improvements Possible', desc: 'Small optimizations could improve runtime', positive: false }
      ];
    }

    return { tier, points, color, timeComplexity, spaceComplexity, insights };
  }

  // Visual Hints (Mermaid Flowcharts) for each problem
  const problemHints = {
    'Two Sum': `graph TD
      A[Start with array and target] --> B{Use Hash Map?}
      B -->|Yes| C[Create empty hash map]
      C --> D[Iterate through array]
      D --> E{complement = target - current}
      E --> F{Is complement in map?}
      F -->|Yes| G[Return indices]
      F -->|No| H[Store current in map]
      H --> D
      G --> I[End - O n time]
      
      style C fill:#22c55e
      style F fill:#4ea8ff
      style I fill:#22c55e`,

    'Valid Anagram': `graph TD
      A[Start with two strings] --> B{Same length?}
      B -->|No| C[Return false]
      B -->|Yes| D[Count character frequencies]
      D --> E[Use hash map or array]
      E --> F[Compare frequencies]
      F --> G{All match?}
      G -->|Yes| H[Return true]
      G -->|No| I[Return false]
      
      style D fill:#22c55e
      style E fill:#4ea8ff
      style H fill:#22c55e`,

    'Contains Duplicate': `graph TD
      A[Start with array] --> B{Use Set?}
      B -->|Yes| C[Create empty set]
      C --> D[Iterate through array]
      D --> E{Element in set?}
      E -->|Yes| F[Return true - duplicate found]
      E -->|No| G[Add to set]
      G --> D
      F --> H[End - O n time]
      
      style C fill:#22c55e
      style E fill:#4ea8ff
      style H fill:#22c55e`
  };

  // Show visual hint using Mermaid flowchart
  function showVisualHint() {
    const problemTitle = currentProblemTitle || 'Two Sum';
    const hintDiagram = problemHints[problemTitle];

    if (!hintDiagram) {
      alert('No hint available for this problem yet!');
      return;
    }

    // Create hint modal
    const hintModal = document.createElement('div');
    hintModal.id = 'hint-modal';
    hintModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 11000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    `;

    hintModal.innerHTML = `
      <div style="
        background: #0a0a0a;
        border: 1px solid rgba(168, 85, 247, 0.3);
        border-radius: 16px;
        padding: 40px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <h2 style="color: #e5e7eb; font-size: 1.8rem; display: flex; align-items: center; gap: 10px;">
            <span>💡</span> Algorithm Hint: ${problemTitle}
          </h2>
          <button onclick="document.getElementById('hint-modal').remove()" style="
            background: none;
            border: none;
            color: #9ca3af;
            font-size: 2rem;
            cursor: pointer;
            line-height: 1;
          ">×</button>
        </div>
        
        <div style="
          background: #1a1a1a;
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        ">
          <div class="mermaid">
${hintDiagram}
          </div>
        </div>
        
        <div style="
          margin-top: 20px;
          padding: 15px;
          background: rgba(168, 85, 247, 0.1);
          border-left: 3px solid #a855f7;
          border-radius: 8px;
          color: #e5e7eb;
        ">
          <strong>💡 Tip:</strong> This flowchart shows the optimal approach. Try implementing it step by step!
        </div>
      </div>
    `;

    document.body.appendChild(hintModal);

    // Re-initialize Mermaid for the new diagram
    setTimeout(() => {
      if (window.mermaid) {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      }
    }, 100);
  }

  // Helper function to show success screen with cognitive analysis

  function showFailureScreen(data, code) {
    // Track attempts
    const problemId = currentProblemTitle || 'unknown';
    const attemptsKey = `attempts_${problemId}`;
    let attempts = parseInt(localStorage.getItem(attemptsKey) || '0') + 1;
    localStorage.setItem(attemptsKey, attempts);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'success-overlay'; // Reusing ID for styling, or we can add a class
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      justify-content: flex-end;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    // Analyze code for insights even on failure
    const analysis = analyzeSolution(code, data.runtime || '0ms', null);

    // Calculate stats
    const totalTests = data.totalCount;
    const passedTests = data.passedCount;
    const failedTests = totalTests - passedTests;

    // Content
    overlay.innerHTML = `
      <div style="
        width: 50%;
        height: 100%;
        background: #0a0a0a;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        padding: 40px;
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      ">
        <!-- Header -->
        <div style="margin-bottom: 30px;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
            <div style="
              width: 50px; 
              height: 50px; 
              border-radius: 12px; 
              background: rgba(239, 68, 68, 0.2); 
              display: flex; 
              align-items: center; 
              justify-content: center;
              font-size: 24px;
              color: #ef4444;
            ">✗</div>
            <div>
              <h1 style="margin: 0; font-size: 2rem; color: #ef4444;">Submission Failed</h1>
              <p style="margin: 5px 0 0 0; color: #9ca3af;">Keep going, you're learning!</p>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
          <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 5px;">Test Cases Passed</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: #e5e7eb;">${passedTests} <span style="font-size: 1rem; color: #9ca3af;">/ ${totalTests}</span></div>
            <div style="font-size: 0.8rem; color: #ef4444; margin-top: 5px;">${failedTests} Failed</div>
          </div>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 5px;">Total Attempts</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: #e5e7eb;">${attempts}</div>
            <div style="font-size: 0.8rem; color: #4ea8ff; margin-top: 5px;">Don't give up!</div>
          </div>
        </div>

        <!-- Cognitive Insights (Even on Failure) -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #e5e7eb; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
            <span>🧠</span> Cognitive Analysis
          </h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${analysis.insights.map(insight => `
              <div style="
                background: #1a1a1a; 
                padding: 15px; 
                border-radius: 8px; 
                border-left: 3px solid ${insight.positive ? '#22c55e' : '#f59e0b'};
                display: flex;
                align-items: flex-start;
                gap: 12px;
              ">
                <span style="font-size: 1.2rem;">${insight.icon}</span>
                <div>
                  <div style="color: #e5e7eb; font-weight: 600; margin-bottom: 2px;">${insight.title}</div>
                  <div style="color: #9ca3af; font-size: 0.9rem;">${insight.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Failed Test Cases Detail -->
        <div style="margin-bottom: 30px; flex: 1;">
          <h3 style="color: #e5e7eb; margin-bottom: 15px;">Failed Test Cases</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${data.results.filter(r => !r.passed).slice(0, 3).map((r, i) => `
              <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 15px;">
                <div style="color: #ef4444; font-weight: 600; margin-bottom: 5px;">Case ${r.caseNumber} ${r.hidden ? '(Hidden)' : ''}</div>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; font-size: 0.9rem;">
                  <span style="color: #9ca3af;">Input:</span>
                  <code style="color: #e5e7eb; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(r.input)}</code>
                  <span style="color: #9ca3af;">Expected:</span>
                  <code style="color: #e5e7eb; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">${JSON.stringify(r.expected)}</code>
                  <span style="color: #9ca3af;">Actual:</span>
                  <code style="color: #ef4444; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">${r.error || JSON.stringify(r.actual)}</code>
                </div>
              </div>
            `).join('')}
            ${data.results.filter(r => !r.passed).length > 3 ? `<div style="text-align: center; color: #9ca3af; font-style: italic;">+ ${data.results.filter(r => !r.passed).length - 3} more failed cases</div>` : ''}
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 15px; margin-top: auto;">
          <button onclick="document.getElementById('success-overlay').remove()" style="
            flex: 1;
            padding: 15px;
            background: #2a2a2a;
            color: #e5e7eb;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">Try Again</button>
          <button onclick="showVisualHint()" style="
            flex: 1;
            padding: 15px;
            background: rgba(168, 85, 247, 0.1);
            color: #a855f7;
            border: 1px solid rgba(168, 85, 247, 0.2);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">💡 View Hint</button>
          <button onclick="showDetailedCognitiveAnalysis(window.lastSubmissionData, window.lastSubmissionCode)" style="
            flex: 1;
            padding: 15px;
            background: rgba(78, 168, 255, 0.1);
            color: #4ea8ff;
            border: 1px solid rgba(78, 168, 255, 0.2);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">View Analysis</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Store data for detailed analysis
    window.lastSubmissionData = data;
    window.lastSubmissionCode = code;

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      overlay.children[0].style.transform = 'translateX(0)';
    });
  }



  function showVisualHint() {
    const problemTitle = currentProblemTitle || 'Two Sum';
    const hintDiagram = problemHints[problemTitle];

    if (!hintDiagram) {
      alert('No hint available for this problem yet!');
      return;
    }

    // Create hint modal
    const hintModal = document.createElement('div');
    hintModal.id = 'hint-modal';
    hintModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 11000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    `;

    hintModal.innerHTML = `
      <div style="
        background: #0a0a0a;
        border: 1px solid rgba(168, 85, 247, 0.3);
        border-radius: 16px;
        padding: 40px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <h2 style="color: #e5e7eb; font-size: 1.8rem; display: flex; align-items: center; gap: 10px;">
            <span>💡</span> Algorithm Hint
          </h2>
          <button onclick="document.getElementById('hint-modal').remove()" style="
            background: none;
            border: none;
            color: #9ca3af;
            font-size: 2rem;
            cursor: pointer;
            line-height: 1;
          ">×</button>
        </div>
        
        <div style="
          background: #1a1a1a;
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        ">
          <div class="mermaid">
${hintDiagram}
          </div>
        </div>
        
        <div style="
          margin-top: 20px;
          padding: 15px;
          background: rgba(168, 85, 247, 0.1);
          border-left: 3px solid #a855f7;
          border-radius: 8px;
          color: #e5e7eb;
        ">
          <strong>💡 Tip:</strong> This flowchart shows the optimal approach. Try implementing it step by step!
        </div>
      </div>
    `;

    document.body.appendChild(hintModal);

    // Re-initialize Mermaid for the new diagram
    if (window.mermaid) {
      mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }
  }


  function showSuccessScreen(data, code) {
    const analysis = analyzeSolution(code, data.runtime, null);

    // Create half-screen overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 50vw;
      height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      z-index: 3500;
      overflow-y: auto;
      box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
      animation: slideInRight 0.4s ease-out;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 40px;
      color: #e5e7eb;
    `;

    content.innerHTML = `
      <style>
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes celebrate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .success-badge {
          animation: celebrate 0.6s ease-in-out;
        }
      </style>
      
      <!-- Close Button -->
      <button id="close-success-screen" style="
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #e5e7eb;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
        ×
      </button>
      
      <!-- Success Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="font-size: 4rem; margin-bottom: 15px;">🎉</div>
        <h1 style="color: #22c55e; font-size: 2.5rem; margin-bottom: 10px;">All Tests Passed!</h1>
        <p style="color: #9ca3af; font-size: 1.1rem;">Your solution has been accepted</p>
      </div>
      
      <!-- Points Badge -->
      <div class="success-badge" style="
        background: linear-gradient(135deg, ${analysis.color}22 0%, ${analysis.color}11 100%);
        border: 2px solid ${analysis.color};
        border-radius: 16px;
        padding: 30px;
        text-align: center;
        margin-bottom: 30px;
      ">
        <div style="font-size: 0.9rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">
          Solution Quality
        </div>
        <div style="font-size: 3rem; color: ${analysis.color}; font-weight: 700; margin-bottom: 10px;">
          ${analysis.tier}
        </div>
        <div style="font-size: 2.5rem; color: ${analysis.color}; font-weight: 600;">
          +${analysis.points} pts
        </div>
      </div>
      
      <!-- Performance Metrics -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.2rem;">📊 Performance Metrics</h3>
        <div style="display: grid; gap: 15px;">
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; border-left: 3px solid #4ea8ff;">
            <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 5px;">Runtime</div>
            <div style="color: #e5e7eb; font-size: 1.3rem; font-weight: 600;">${data.runtime}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; border-left: 3px solid #a855f7;">
            <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 5px;">Memory</div>
            <div style="color: #e5e7eb; font-size: 1.3rem; font-weight: 600;">${data.memory}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; border-left: 3px solid #22c55e;">
            <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 5px;">Test Cases</div>
            <div style="color: #e5e7eb; font-size: 1.3rem; font-weight: 600;">${data.passedCount}/${data.totalCount} Passed</div>
          </div>
        </div>
      </div>
      
      <!-- Cognitive Insights -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.2rem;">🧠 Cognitive Insights</h3>
        <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
          ${analysis.insights.map(insight => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="color: ${insight.positive ? '#22c55e' : '#f59e0b'};">${insight.icon}</span>
                <span style="color: #e5e7eb; font-weight: 500;">${insight.title}</span>
              </div>
              <div style="color: #9ca3af; font-size: 0.9rem; padding-left: 30px;">
                ${insight.desc}
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Complexity Analysis -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; text-align: center;">
            <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 5px;">Time Complexity</div>
            <div style="color: ${analysis.color}; font-size: 1.3rem; font-weight: 600;">${analysis.timeComplexity}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; text-align: center;">
            <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 5px;">Space Complexity</div>
            <div style="color: ${analysis.color}; font-size: 1.3rem; font-weight: 600;">${analysis.spaceComplexity}</div>
          </div>
        </div>
      </div>
      
      <!-- Points Breakdown -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.2rem;">💎 Points Breakdown</h3>
        <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #9ca3af;">Base Points (All Tests Passed)</span>
            <span style="color: #e5e7eb; font-weight: 600;">+50</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #9ca3af;">Code Quality Bonus</span>
            <span style="color: ${analysis.color}; font-weight: 600;">+${analysis.points - 50}</span>
          </div>
          <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #e5e7eb; font-weight: 600; font-size: 1.1rem;">Total Points Earned</span>
            <span style="color: ${analysis.color}; font-weight: 700; font-size: 1.3rem;">+${analysis.points}</span>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div style="display: grid; gap: 12px;">
        <button id="view-detailed-analysis" style="
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #4ea8ff, #a855f7);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          View Detailed Analysis
        </button>
        <button id="next-problem-btn" style="
          width: 100%;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          color: #e5e7eb;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
          Next Problem →
        </button>
      </div>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Event listeners
    const closeBtn = overlay.querySelector('#close-success-screen');
    closeBtn.addEventListener('click', () => {
      overlay.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => overlay.remove(), 300);
    });

    const detailedBtn = overlay.querySelector('#view-detailed-analysis');
    detailedBtn.addEventListener('click', () => {
      // Close success screen first
      overlay.remove();
      // Show detailed analysis with cognitive features
      showDetailedCognitiveAnalysis(data, code);
    });

    const nextBtn = overlay.querySelector('#next-problem-btn');
    nextBtn.addEventListener('click', () => {
      overlay.remove();
      closeCodeEditor();
    });

    // Add slide out animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }


  // Helper function to show detailed cognitive analysis with Phase 2 features
  async function showDetailedCognitiveAnalysis(data, code) {
    // Create full-screen modal
    const modal = document.createElement('div');
    modal.id = 'detailed-analysis-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 4000;
      overflow-y: auto;
      padding: 40px;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      max-width: 1200px;
      margin: 0 auto;
      background: #0a0a0a;
      border-radius: 16px;
      padding: 40px;
      color: #e5e7eb;
    `;

    // Try to fetch cognitive data
    let cognitiveData = null;
    try {
      if (currentProblemTitle && cognitiveObserver && cognitiveObserver.taskId) {
        const taskId = cognitiveObserver.taskId;
        const response = await fetch(`http://localhost:8001/api/cognitive/analysis/${taskId}`);
        if (response.ok) {
          cognitiveData = await response.json();
        }
      }
    } catch (err) {
      console.log('Could not fetch cognitive data:', err);
    }

    content.innerHTML = `
      <!-- Close Button -->
      <button id="close-detailed-analysis" style="
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #e5e7eb;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      ">×</button>

      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #e5e7eb; font-size: 2rem; margin-bottom: 10px;">📊 Detailed Cognitive Analysis</h1>
        <p style="color: #9ca3af;">Comprehensive breakdown of your coding session</p>
      </div>

      <!-- Test Results Section -->
      <div style="margin-bottom: 40px;">
        <h2 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.5rem;">✅ Test Results</h2>
        ${data.results.map((result, i) => `
          <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 10px; margin-bottom: 12px; border-left: 3px solid ${result.passed ? '#22c55e' : '#ef4444'};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="color: #e5e7eb; font-weight: 600;">Test Case ${i + 1}</span>
                ${result.hidden ? '<span style="color: #9ca3af; margin-left: 10px; font-size: 0.85rem;">(Hidden)</span>' : ''}
              </div>
              <span style="color: ${result.passed ? '#22c55e' : '#ef4444'}; font-weight: 600;">${result.passed ? '✓ Passed' : '✗ Failed'}</span>
            </div>
            ${!result.passed && !result.hidden ? `
              <div style="margin-top: 10px; padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 6px;">
                <div style="color: #ef4444; font-size: 0.9rem; margin-bottom: 5px;">Error:</div>
                <code style="color: #ef4444; font-size: 0.85rem;">${result.error || 'Output mismatch'}</code>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Cognitive Insights Section -->
      ${cognitiveData ? `
        <div style="margin-bottom: 40px;">
          <h2 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.5rem;">🧠 Cognitive Insights</h2>
          
          <!-- Session Metrics -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px; text-align: center;">
              <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 8px;">Coder Type</div>
              <div style="color: #4ea8ff; font-size: 1.5rem; font-weight: 600;">${cognitiveData.analysis?.fingerprint?.type || 'Balanced'}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px; text-align: center;">
              <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 8px;">Typing Speed</div>
              <div style="color: #e5e7eb; font-size: 1.5rem; font-weight: 600;">${Math.round(cognitiveData.analysis?.metrics?.wpm || 0)} WPM</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px; text-align: center;">
              <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 8px;">Focus Score</div>
              <div style="color: ${(cognitiveData.analysis?.states?.focus || 0) > 0.7 ? '#22c55e' : '#f59e0b'}; font-size: 1.5rem; font-weight: 600;">${Math.round((cognitiveData.analysis?.states?.focus || 0) * 100)}%</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px; text-align: center;">
              <div style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 8px;">Session Time</div>
              <div style="color: #e5e7eb; font-size: 1.5rem; font-weight: 600;">${Math.round((cognitiveData.analysis?.metrics?.total_time_sec || 0) / 60)}m</div>
            </div>
          </div>

          <!-- Cognitive Flow Chart -->
          <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #e5e7eb; margin-bottom: 15px; font-size: 1.2rem;">Typing Speed Over Time</h3>
            <canvas id="cognitive-flow-chart" style="max-height: 300px;"></canvas>
          </div>

          <!-- State Timeline -->
          <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px;">
            <h3 style="color: #e5e7eb; margin-bottom: 15px; font-size: 1.2rem;">Coding State Timeline</h3>
            <div id="detailed-state-timeline" style="height: 60px; background: #1a1a1a; border-radius: 8px; position: relative; overflow: hidden; margin-bottom: 15px;"></div>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; font-size: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 5px;">
                <div style="width: 16px; height: 16px; background: #22c55e; border-radius: 4px;"></div>
                <span style="color: #9ca3af;">Flow State</span>
              </div>
              <div style="display: flex; align-items: center; gap: 5px;">
                <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 4px;"></div>
                <span style="color: #9ca3af;">Normal Coding</span>
              </div>
              <div style="display: flex; align-items: center; gap: 5px;">
                <div style="width: 16px; height: 16px; background: #f59e0b; border-radius: 4px;"></div>
                <span style="color: #9ca3af;">Thinking</span>
              </div>
              <div style="display: flex; align-items: center; gap: 5px;">
                <div style="width: 16px; height: 16px; background: #ef4444; border-radius: 4px;"></div>
                <span style="color: #9ca3af;">Frustration</span>
              </div>
            </div>
          </div>
        </div>
      ` : `
        <div style="margin-bottom: 40px;">
          <h2 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.5rem;">🧠 Cognitive Insights</h2>
          <div style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 10px; text-align: center;">
            <p style="color: #9ca3af;">Cognitive data not available for this session.</p>
            <p style="color: #9ca3af; font-size: 0.9rem; margin-top: 10px;">Start coding to see real-time cognitive analysis!</p>
          </div>
        </div>
      `}

      <!-- Performance Metrics -->
      <div style="margin-bottom: 40px;">
        <h2 style="color: #e5e7eb; margin-bottom: 20px; font-size: 1.5rem;">⚡ Performance Metrics</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 10px;">
            <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 10px;">Runtime</div>
            <div style="color: #e5e7eb; font-size: 2rem; font-weight: 700;">${data.runtime}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 10px;">
            <div style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 10px;">Memory Usage</div>
            <div style="color: #e5e7eb; font-size: 2rem; font-weight: 700;">${data.memory}</div>
          </div>
        </div>
      </div>

      <!-- Close Button -->
      <button id="close-detailed-btn" style="
        width: 100%;
        padding: 15px;
        background: #4ea8ff;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
      ">Close</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Render cognitive chart if data available
    if (cognitiveData && cognitiveData.signals) {
      setTimeout(() => {
        renderCognitiveFlowChart(cognitiveData.signals);
        renderDetailedStateTimeline(cognitiveData.signals);
      }, 100);
    }

    // Event listeners
    const closeBtn = content.querySelector('#close-detailed-analysis');
    const closeBtnBottom = content.querySelector('#close-detailed-btn');

    const closeModal = () => modal.remove();
    closeBtn.addEventListener('click', closeModal);
    closeBtnBottom.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Helper to render cognitive flow chart
  function renderCognitiveFlowChart(signals) {
    const canvas = document.getElementById('cognitive-flow-chart');
    if (!canvas || !window.Chart) return;

    const ctx = canvas.getContext('2d');
    const buckets = {};
    const windowSize = 5000;
    const startTime = signals[0]?.ts || 0;

    signals.forEach(s => {
      if (s.type !== 'KEY_PRESS') return;
      const bucketIndex = Math.floor((s.ts - startTime) / windowSize);
      buckets[bucketIndex] = (buckets[bucketIndex] || 0) + 1;
    });

    const labels = Object.keys(buckets).map(i => `${i * 5}s`);
    const dataPoints = Object.values(buckets).map(count => (count / 5) * 60);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Typing Speed (WPM)',
          data: dataPoints,
          borderColor: '#4ea8ff',
          backgroundColor: 'rgba(78, 168, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Helper to render detailed state timeline
  function renderDetailedStateTimeline(signals) {
    const timeline = document.getElementById('detailed-state-timeline');
    if (!timeline) return;

    timeline.innerHTML = '';
    const windowSize = 5000;
    const startTime = signals[0]?.ts || 0;
    const endTime = signals[signals.length - 1]?.ts || 0;
    const duration = endTime - startTime;

    if (duration === 0) return;

    const windows = [];
    for (let t = 0; t < duration; t += windowSize) {
      const windowSignals = signals.filter(s =>
        s.ts >= startTime + t && s.ts < startTime + t + windowSize
      );

      const keyPresses = windowSignals.filter(s => s.type === 'KEY_PRESS').length;
      const wpm = (keyPresses / 5) * 60;

      let state = 'normal';
      if (wpm > 80) state = 'flow';
      else if (wpm < 20 && keyPresses > 0) state = 'thinking';
      else if (keyPresses === 0) state = 'frustration';

      windows.push({ state, width: (windowSize / duration) * 100 });
    }

    const colors = {
      flow: '#22c55e',
      normal: '#3b82f6',
      thinking: '#f59e0b',
      frustration: '#ef4444'
    };

    let leftPos = 0;
    windows.forEach(w => {
      const segment = document.createElement('div');
      segment.style.cssText = `
        position: absolute;
        left: ${leftPos}%;
        height: 100%;
        background: ${colors[w.state]};
        width: ${w.width}%;
      `;
      timeline.appendChild(segment);
      leftPos += w.width;
    });
  }

  // Helper function to show submission results
  function showSubmissionResults(data) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: #0a0a0a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 30px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      color: var(--text-primary);
    `;

    const statusColor = data.allPassed ? '#22c55e' : '#ef4444';
    const statusText = data.allPassed ? 'Accepted' : 'Wrong Answer';

    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: ${statusColor}; margin-bottom: 10px;">${statusText}</h2>
        <p style="color: var(--text-secondary);">${data.passedCount} / ${data.totalCount} test cases passed</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
        <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
          <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Runtime</div>
          <div style="color: var(--text-primary); font-size: 1.1rem; font-weight: 600;">${data.runtime}</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
          <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Memory</div>
          <div style="color: var(--text-primary); font-size: 1.1rem; font-weight: 600;">${data.memory}</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: var(--text-primary); margin-bottom: 15px; font-size: 1rem;">Test Results</h3>
        ${data.results.map((result, i) => `
          <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid ${result.passed ? '#22c55e' : '#ef4444'};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: var(--text-secondary);">Test Case ${i + 1}${result.hidden ? ' (Hidden)' : ''}</span>
              <span style="color: ${result.passed ? '#22c55e' : '#ef4444'};">${result.passed ? '✓ Passed' : '✗ Failed'}</span>
            </div>
            ${!result.passed && !result.hidden ? `<div style="color: #ef4444; font-size: 0.85rem; margin-top: 8px;">${result.error || 'Output mismatch'}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <button id="close-results-btn" style="
        width: 100%;
        padding: 12px;
        background: var(--accent1);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
      ">Close</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add event listener to close button
    const closeBtn = content.querySelector('#close-results-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.remove();
      });
    }

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Event Listeners
  if (closeCodeEditorBtn) closeCodeEditorBtn.addEventListener('click', closeCodeEditor);

  if (codeEditorModal) codeEditorModal.addEventListener('click', (e) => {
    if (e.target === codeEditorModal) closeCodeEditor();
  });

  // Initialize Practice Problems Click Handlers - Using Delegation
  console.log("Attaching global click listener...");
  document.addEventListener('click', (e) => {
    console.log('Global click detected on:', e.target.tagName, e.target.className);
    const tableBody = document.getElementById('problems-table-body');

    if (tableBody) {
      const isInside = tableBody.contains(e.target);
      console.log('Is inside table body?', isInside);

      if (isInside) {
        const row = e.target.closest('tr');
        if (row) {
          const title = row.cells[0].textContent;
          console.log('Row clicked, title:', title);
          openCodeEditor(title);
        }
      }
    }
  });
  console.log("Global click listener attached.");

  // Also handle "Solve Problem" button in Dashboard view
  const solveProblemBtn = document.getElementById('solve-problem-btn');
  if (solveProblemBtn) {
    solveProblemBtn.addEventListener('click', () => {
      const title = document.querySelector('.problem-title').textContent;
      openCodeEditor(title);
    });
  }

  console.log("Calling initPracticeView...");
  initPracticeView();
  console.log("initPracticeView finished.");
}

// Phase 3: Initialize Adaptive IDE modules
setTimeout(() => {
  if (typeof window.AdaptiveIDE !== 'undefined' && window.adaptiveIDE) {
    window.adaptiveIDE.init();
    console.log('[Phase3] AdaptiveIDE initialized');
  }

  if (typeof window.VisualDebugger !== 'undefined' && window.visualDebugger) {
    window.visualDebugger.init();
    console.log('[Phase3] VisualDebugger initialized');
  }
}, 1000);

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
