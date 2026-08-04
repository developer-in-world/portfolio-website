const root = document.documentElement;
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#main-nav');
const themeToggle = document.querySelector('.theme-toggle');
const progressBar = document.querySelector('.progress-track span');
const toast = document.querySelector('.toast');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function updateThemeButton() {
  const dark = root.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
  themeMeta?.setAttribute('content', dark ? '#101628' : '#f6f1df');
}

function closeMenu({ restoreFocus = false } = {}) {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  if (restoreFocus) menuButton.focus();
}

updateThemeButton();

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', root.dataset.theme);
  updateThemeButton();
});

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  if (!localStorage.getItem('theme')) {
    root.dataset.theme = event.matches ? 'dark' : 'light';
    updateThemeButton();
  }
});

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu({ restoreFocus: true });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 800) closeMenu();
});

document.querySelector('#year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

let ticking = false;
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  const progress = scrollable > 0 ? Math.min(100, Math.max(0, (scrollY / scrollable) * 100)) : 0;
  progressBar.style.width = `${progress}%`;
  ticking = false;
}

addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateProgress);
    ticking = true;
  }
}, { passive: true });
updateProgress();

let toastTimer;
document.querySelectorAll('.skill-grid > div, .badge-grid > div, .badge-grid > a').forEach((item) => {
  item.addEventListener('pointerup', () => {
    if (reducedMotion.matches) return;
    clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1300);
  });
});
