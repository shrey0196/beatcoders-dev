document.addEventListener('DOMContentLoaded', () => {

  // --- THEME TOGGLE ---
  const themeToggle = document.getElementById('theme-toggle');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }

  // --- MODAL ---
  const modalContainer = document.getElementById('modal-container');
  const modal = document.getElementById('modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  let lastFocusedElement;

  // Modal Views
  const authChoiceView = document.getElementById('auth-choice-view');
  const createAccountView = document.getElementById('create-account-view');
  const signInView = document.getElementById('sign-in-view');
  const successView = document.getElementById('success-view');
  const forgotPasswordView = document.getElementById('forgot-password-view');
  const resetSentView = document.getElementById('reset-sent-view');

  // Modal Buttons
  const showCreateAccountBtn = document.getElementById('show-create-account-btn');
  const showSignInBtn = document.getElementById('show-sign-in-btn');
  const showForgotPasswordBtn = document.getElementById('show-forgot-password-btn');
  const backToChoiceFromCreateBtn = document.getElementById('back-to-choice-from-create-btn');
  const backToChoiceFromSignInBtn = document.getElementById('back-to-choice-from-signin-btn');
  const backToSignInFromForgotBtn = document.getElementById('back-to-signin-from-forgot-btn');
  const backToSignInFromSentBtn = document.getElementById('back-to-signin-from-sent-btn');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  // Form Elements
  const createAccountForm = document.getElementById('create-account-form');
  const signInForm = document.getElementById('sign-in-form');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const emailInput = document.getElementById('email');
  const signInEmailInput = document.getElementById('signin-email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  // Error Message Elements
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirm-password-error');

  // Password Requirements Checklist
  const reqLength = document.getElementById('req-length');
  const reqNumber = document.getElementById('req-number');

  // --- MODAL VIEW MANAGEMENT ---
  const ALL_MODAL_VIEWS = [
    authChoiceView, createAccountView, signInView,
    successView, forgotPasswordView, resetSentView
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
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
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

      // Fully reset modal to initial state
      showModalView(authChoiceView);

      // Reset forms
      if (createAccountForm) createAccountForm.reset();
      if (signInForm) signInForm.reset();
      if (forgotPasswordForm) forgotPasswordForm.reset();

      // Clear all error messages
      if (emailError) emailError.textContent = '';
      if (passwordError) passwordError.textContent = '';
      if (confirmPasswordError) confirmPasswordError.textContent = '';

      // Reset password checklist style
      [reqLength, reqNumber].forEach(el => {
        if(el) {
          el.classList.remove('text-green-500', 'dark:text-green-400');
          el.classList.add('text-slate-500', 'dark:text-slate-400');
        }
      });

      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }, 160);
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
  });

  // --- MODAL NAVIGATION ---
  if (showCreateAccountBtn) showCreateAccountBtn.addEventListener('click', () => showModalView(createAccountView));
  if (showSignInBtn) showSignInBtn.addEventListener('click', () => showModalView(signInView));
  if (showForgotPasswordBtn) showForgotPasswordBtn.addEventListener('click', () => showModalView(forgotPasswordView));
  if (backToChoiceFromCreateBtn) backToChoiceFromCreateBtn.addEventListener('click', () => showModalView(authChoiceView));
  if (backToChoiceFromSignInBtn) backToChoiceFromSignInBtn.addEventListener('click', () => showModalView(authChoiceView));
  if (backToSignInFromForgotBtn) backToSignInFromForgotBtn.addEventListener('click', () => showModalView(signInView));
  if (backToSignInFromSentBtn) backToSignInFromSentBtn.addEventListener('click', () => showModalView(signInView));

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
        if(!el) return;
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

    if (isValid && passwordError) {
      passwordError.textContent = ''; // Clear summary error if all reqs are met
    }

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

  // Add real-time validation listeners
  if(emailInput) emailInput.addEventListener('input', validateEmail);
  if(passwordInput) passwordInput.addEventListener('input', () => {
    validatePassword();
    if (confirmPasswordInput && confirmPasswordInput.value) {
        validateConfirmPassword();
    }
  });
  if(confirmPasswordInput) confirmPasswordInput.addEventListener('input', validateConfirmPassword);

  // Form submission handlers
  if (createAccountForm) {
    createAccountForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();
      const isConfirmPasswordValid = validateConfirmPassword();

      if (!isPasswordValid && passwordError) {
        passwordError.textContent = 'Password does not meet all requirements.';
      } else if (passwordError) {
        passwordError.textContent = '';
      }

      if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
        const userID = `Coder${Math.floor(1000 + Math.random() * 9000)}`;
        const emailName = emailInput.value.split('@')[0];
        const realName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

        localStorage.setItem('beatCodersUserID', userID);
        localStorage.setItem('beatCodersRealName', realName); // Store initial real name
        localStorage.setItem('beatCodersEmail', emailInput.value);
        localStorage.removeItem('beatCodersUserSettings'); // Clear old settings on new account

        const newUsernameEl = document.getElementById('new-username');
        if(newUsernameEl) newUsernameEl.textContent = userID;

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
        // We don't set RealName here, it will be loaded from settings on the dashboard.
        window.location.href = 'dashboard.html';
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showModalView(resetSentView);
    });
  }

  // --- MOBILE DRAWER ---
  const drawerContainer = document.getElementById('drawer-container');
  const drawerNav = document.getElementById('drawer-nav');
  const openDrawerBtn = document.getElementById('openDrawerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerOverlay = document.getElementById('drawer-overlay');

  const openDrawer = () => {
    if (!drawerContainer || !drawerNav || !drawerOverlay) return;
    drawerContainer.classList.remove('hidden');
    drawerNav.classList.add('animate-slide-in-right');
    drawerNav.classList.remove('translate-x-full', 'animate-slide-out-right');
    drawerOverlay.classList.remove('animate-fade-out');
    drawerOverlay.classList.add('animate-fade-in');
    document.body.classList.add('drawer-is-open');
  };

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
    }, 300);
  };

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  const drawerStartCodingBtn = document.getElementById('drawer-start-coding-btn');
  if (drawerStartCodingBtn) {
    drawerStartCodingBtn.addEventListener('click', () => {
      closeDrawer();
      setTimeout(openModal, 150);
    });
  }

  // --- SMOOTH SCROLL ---
  document.querySelectorAll('[data-scroll-to]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-scroll-to');
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }

      if(drawerContainer && !drawerContainer.classList.contains('hidden')){
        setTimeout(closeDrawer, 300);
      }
    });
  });

  const logo = document.getElementById('logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    logo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
             window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
  }

  // --- ACCESSIBILITY (KEYBOARD CONTROLS) ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalContainer && !modalContainer.classList.contains('hidden')) {
        closeModal();
      }
      if (drawerContainer && !drawerContainer.classList.contains('hidden')) {
        closeDrawer();
      }
    }

    if (e.key === 'Tab' && modalContainer && !modalContainer.classList.contains('hidden')) {
      if (!modal) return;
      const focusableElements = Array.from(modal.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });

});