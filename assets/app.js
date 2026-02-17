const body = document.body;

function getFocusable(container) {
  return [...container.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.disabled && el.offsetParent !== null);
}

function setupLangMenus() {
  document.querySelectorAll('.lang-wrap').forEach((wrap) => {
    const trigger = wrap.querySelector('.lang-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.lang-wrap.open').forEach(el => el !== wrap && el.classList.remove('open'));
      wrap.classList.toggle('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.lang-wrap.open').forEach(el => el.classList.remove('open'));
  });
}

function setupFAQ() {
  const items = [...document.querySelectorAll('.faq-item')];
  items.forEach((item) => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      items.forEach(i => i !== item && i.classList.remove('open'));
      item.classList.toggle('open');
    });
  });
}

function setupDrawer() {
  const drawer = document.querySelector('#mobileDrawer');
  const openBtn = document.querySelector('#burgerBtn');
  const closeBtn = drawer?.querySelector('.drawer-close');
  const backdrop = document.querySelector('#drawerBackdrop');
  if (!drawer || !openBtn || !closeBtn || !backdrop) return;

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    body.classList.remove('no-scroll');
    openBtn.focus();
  };
  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('show');
    body.classList.add('no-scroll');
    const first = getFocusable(drawer)[0];
    first?.focus();
  };

  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
    if (e.key === 'Tab' && drawer.classList.contains('open')) {
      const f = getFocusable(drawer);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

const modalWrap = document.querySelector('#privacyModal');
function closeModal() {
  if (!modalWrap) return;
  modalWrap.classList.remove('show');
  body.classList.remove('no-scroll');
}

function setupModal() {
  if (!modalWrap) return;
  const opens = document.querySelectorAll('[data-open-privacy]');
  const closeX = modalWrap.querySelector('.modal-close-x');
  const closeB = modalWrap.querySelector('.modal-close-btm');
  const bg = modalWrap.querySelector('.modal-bg');
  const dialog = modalWrap.querySelector('.modal');
  let lastFocus = null;

  const openModal = () => {
    lastFocus = document.activeElement;
    modalWrap.classList.add('show');
    body.classList.add('no-scroll');
    getFocusable(dialog)[0]?.focus();
  };

  opens.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  [closeX, closeB, bg].forEach(el => el?.addEventListener('click', () => {
    closeModal();
    lastFocus?.focus();
  }));

  document.addEventListener('keydown', (e) => {
    if (!modalWrap.classList.contains('show')) return;
    if (e.key === 'Tab') {
      const f = getFocusable(dialog);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function setupReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

setupLangMenus();
setupFAQ();
setupDrawer();
setupModal();
setupReveal();
