// ============================================================
// GUIDE.JS — Starter Guide page logic (White Theme Redesign)
// ============================================================

// ---- INSTALL TABS ----
const installTabs = document.querySelectorAll('.install-tab');
const installContents = document.querySelectorAll('.install-content');

installTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    installTabs.forEach(t => t.classList.remove('active'));
    installContents.forEach(c => c.classList.add('hidden'));
    tab.classList.add('active');
    const target = document.getElementById('tab-' + tab.dataset.tab);
    if (target) target.classList.remove('hidden');
  });
});

// ---- SIDEBAR ACTIVE STATE ON SCROLL ----
const guideSections = document.querySelectorAll('.guide-section');
const guideNavLinks = document.querySelectorAll('.guide-nav-link');

if (guideSections.length && guideNavLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        guideNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-70px 0px -60% 0px' });

  guideSections.forEach(section => sectionObserver.observe(section));
}

// ---- QUICK JUMP CARD SMOOTH SCROLL ----
document.querySelectorAll('.guide-quick-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const href = card.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ---- NEXT STEPS CARD NAVIGATION ----
document.querySelectorAll('.next-step-card').forEach(card => {
  card.addEventListener('click', () => {
    const href = card.getAttribute('href');
    if (href) window.location.href = href;
  });
});

// ---- KEYBOARD SHORTCUT: Ctrl+G to go to playground ----
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
    window.location.href = 'playground.html';
  }
});
