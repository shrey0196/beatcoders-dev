(() => {
  // --- THEME TOGGLE LOGIC ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  themeToggle.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
  });

  // --- SMOOTH SCROLL LOGIC ---
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  document.getElementById('contestsBtnDesktop').addEventListener('click', () => scrollToSection('contestsSection'));
  document.getElementById('leaderboardBtnDesktop').addEventListener('click', () => scrollToSection('efficiencySection'));
  document.getElementById('contestsBtnMobile').addEventListener('click', () => {
    scrollToSection('contestsSection');
    closeMobileMenu();
  });
  document.getElementById('leaderboardBtnMobile').addEventListener('click', () => {
    scrollToSection('efficiencySection');
    closeMobileMenu();
  });
  document.getElementById('logo').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // --- MOBILE MENU LOGIC ---
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpenIcon = document.getElementById('menu-open-icon');
  const menuCloseIcon = document.getElementById('menu-close-icon');

  const openMobileMenu = () => {
    mobileMenu.classList.remove('hidden');
    menuOpenIcon.classList.add('hidden');
    menuCloseIcon.classList.remove('hidden');
    menuToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.add('hidden');
    menuOpenIcon.classList.remove('hidden');
    menuCloseIcon.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('hidden')) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  });


  // --- MODAL LOGIC ---
  const authModal = document.getElementById('authModal');
  const authBox = document.getElementById('authBox');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  const openAuthModal = () => {
    if (!authModal || !authBox) return;
    authModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    authBox.classList.remove('animate-fade-out');
    authBox.classList.add('animate-fade-in');
  };

  const closeAuthModal = () => {
    if (!authModal || !authBox) return;
    authBox.classList.remove('animate-fade-in');
    authBox.classList.add('animate-fade-out');

    setTimeout(() => {
      authModal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 160);
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openAuthModal));
  closeModalBtn.addEventListener('click', closeAuthModal);
  modalBackdrop.addEventListener('click', closeAuthModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
      closeAuthModal();
    }
  });
})();
