import './concept';
import { nextOpen } from '../lib/nextopen';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const supported = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
const forced = new URLSearchParams(location.search).has('sdpoly');

// Fallback for browsers without CSS scroll-driven animations (only on tablet/desktop, only with motion allowed).
if ((!supported || forced) && !reduced && matchMedia('(min-width: 768px)').matches) {
  import('./scroll-poly').then((m) => m.init());
}

// Live "Next open" lines
const stamp = () => {
  const text = nextOpen();
  document.querySelectorAll<HTMLElement>('[data-next-open]').forEach((el) => (el.textContent = text));
};
stamp();
setInterval(stamp, 60_000);

// Mobile menu and header (hides on scroll down, returns on scroll up, hidden at the footer)
const mhd = document.querySelector<HTMLElement>('[data-mhd]');
const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
if (mhd && btn && menu) {
  const setOpen = (open: boolean) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) mhd.classList.remove('is-hidden');
  };
  btn.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); }
  });
  let last = scrollY;
  let atFoot = false;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (!menu.hidden) { last = y; return; }
    if (y > last + 6 && y > 120) mhd.classList.add('is-hidden');
    else if (y < last - 6 || y < 120) mhd.classList.remove('is-hidden');
    if (atFoot) mhd.classList.add('is-hidden');
    last = y;
  }, { passive: true });
  const foot = document.querySelector('.foot');
  if (foot) {
    new IntersectionObserver(([en]) => {
      atFoot = en.isIntersecting;
      mhd.classList.toggle('is-hidden', atFoot);
    }).observe(foot);
  }
}

// Touch screens: hover effects play once when the element reaches the middle of the screen
if (matchMedia('(hover: none)').matches) {
  const els = document.querySelectorAll<HTMLElement>('[data-io-center]');
  if (els.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-center'); io.unobserve(en.target); } });
    }, { rootMargin: '-42% 0px -42% 0px' });
    els.forEach((el) => io.observe(el));
  }
}
