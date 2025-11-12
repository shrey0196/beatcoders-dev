(() => {
  const body = document.body;

  // --- THEME TOGGLE LOGIC ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  themeToggle.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
  });


  // --- SMOOTH SCROLL LOGIC ---
  const scrollToSection = (sectionId, callback) => {
    if (!sectionId) return;
    if (sectionId === 'heroSection') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    if (callback) {
      // A short delay allows the scroll to start before the drawer closes, feeling smoother.
      setTimeout(callback, 300);
    }
  };

  document.getElementById('contestsBtnDesktop').addEventListener('click', () => scrollToSection('contestsSection'));
  document.getElementById('leaderboardBtnDesktop').addEventListener('click', () => scrollToSection('leaderboardSection'));
  document.getElementById('logo').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  // --- MODAL LOGIC ---
  const authModal = document.getElementById('authModal');
  const authBox = document.getElementById('authBox');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  const openAuthModal = () => {
    if (!authModal || !authBox) return;
    authModal.classList.remove('hidden');
    body.classList.add('modal-is-open');
    authBox.classList.remove('animate-fade-out');
    authBox.classList.add('animate-fade-in');
  };

  const closeAuthModal = () => {
    if (!authModal || !authBox) return;
    authBox.classList.remove('animate-fade-in');
    authBox.classList.add('animate-fade-out');

    setTimeout(() => {
      authModal.classList.add('hidden');
      body.classList.remove('modal-is-open');
    }, 160);
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openAuthModal));
  closeModalBtn.addEventListener('click', closeAuthModal);
  modalBackdrop.addEventListener('click', closeAuthModal);


  // --- DRAWER LOGIC ---
  const openDrawerBtn = document.getElementById('openDrawerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const navDrawer = document.getElementById('navDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const contestsBtnMobile = document.getElementById('contestsBtnMobile');
  const leaderboardBtnMobile = document.getElementById('leaderboardBtnMobile');

  const openDrawer = () => {
    if (!navDrawer || !drawerBackdrop) return;
    drawerBackdrop.classList.remove('hidden');
    navDrawer.classList.remove('hidden');
    body.classList.add('drawer-is-open');

    drawerBackdrop.classList.remove('animate-fade-out');
    drawerBackdrop.classList.add('animate-fade-in');
    navDrawer.classList.remove('animate-slide-out-right');
    navDrawer.classList.add('animate-slide-in-right');
  };

  const closeDrawer = () => {
    if (!navDrawer || !drawerBackdrop) return;
    drawerBackdrop.classList.remove('animate-fade-in');
    drawerBackdrop.classList.add('animate-fade-out');
    navDrawer.classList.remove('animate-slide-in-right');
    navDrawer.classList.add('animate-slide-out-right');

    setTimeout(() => {
      drawerBackdrop.classList.add('hidden');
      navDrawer.classList.add('hidden');
      body.classList.remove('drawer-is-open');
    }, 300); // Match animation duration
  };

  openDrawerBtn.addEventListener('click', openDrawer);
  closeDrawerBtn.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  contestsBtnMobile.addEventListener('click', () => scrollToSection('contestsSection', closeDrawer));
  leaderboardBtnMobile.addEventListener('click', () => scrollToSection('leaderboardSection', closeDrawer));


  // --- GLOBAL KEYDOWN LISTENER ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (body.classList.contains('modal-is-open')) {
        closeAuthModal();
      }
      if (body.classList.contains('drawer-is-open')) {
        closeDrawer();
      }
    }
  });
})();