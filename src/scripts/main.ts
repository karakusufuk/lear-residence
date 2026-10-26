import './concept';
import { nextOpen } from '../lib/nextopen';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const supported = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
const forced = new URLSearchParams(location.search).has('sdpoly');

// Fallback for browsers without CSS scroll-driven animations (desktop only, only with motion allowed).
// Below 1200px the scroll scenes are laid out statically, so phones and tablets never need it.
if ((!supported || forced) && !reduced && matchMedia('(min-width: 1200px)').matches) {
  import('./scroll-poly').then((m) => m.init());
}


// Hero day to night: one scroll gesture plays the whole change and holds on the night frame, whatever the force
// of the gesture (wheel inertia, key repeat and a continuing swipe are absorbed). The page moves on with the next gesture.
const heroScene = document.querySelector<HTMLElement>('.scene.hero');
if (heroScene && !reduced) {
  const travel = () => heroScene.offsetHeight - innerHeight; // the pinned scroll length of the hero
  const lock = () => document.body.style.overflow === 'hidden';
  const active = () => travel() > 8 && scrollY < travel() - 2 && !lock();
  let running = false, locked = false, lastWheel = 0, touched = false, y0 = 0;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const go = () => {
    if (running) return;
    const from = scrollY, to = travel(), ms = 900 + 1300 * Math.min(1, (to - from) / Math.max(1, to));
    running = true; locked = true;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      scrollTo({ top: from + (to - from) * ease(t), behavior: 'instant' });
      if (t < 1) requestAnimationFrame(frame); else running = false;
    };
    requestAnimationFrame(frame);
  };
  addEventListener('wheel', (e) => {
    const now = performance.now(), fresh = now - lastWheel > 140;
    lastWheel = now;
    if (e.ctrlKey || e.deltaY === 0 || Math.abs(e.deltaY) < Math.abs(e.deltaX) || lock()) return;
    if (running || (locked && !fresh)) { e.preventDefault(); return; }
    locked = false;
    if (fresh && e.deltaY > 0 && active()) { e.preventDefault(); go(); }
  }, { passive: false });
  addEventListener('touchstart', (e) => { y0 = e.touches[0].clientY; touched = false; locked = false; }, { passive: true });
  addEventListener('touchmove', (e) => {
    if (lock()) return;
    if (running || touched) { if (e.cancelable) e.preventDefault(); return; }
    if (y0 - e.touches[0].clientY > 10 && active()) { touched = true; if (e.cancelable) e.preventDefault(); go(); }
  }, { passive: false });
  addEventListener('touchend', () => { touched = false; }, { passive: true });
  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || lock()) return;
    const t = e.target as HTMLElement;
    if (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(t.tagName) || t.isContentEditable) return;
    if (!(e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'End' || (e.key === ' ' && !e.shiftKey))) return;
    if (running || (locked && e.repeat)) { e.preventDefault(); return; }
    locked = false;
    if (active()) { e.preventDefault(); go(); }
  });
}

// Live "Next open" lines
const stamp = () => {
  const text = nextOpen();
  document.querySelectorAll<HTMLElement>('[data-next-open]').forEach((el) => (el.textContent = text));
};
stamp();
setInterval(stamp, 60_000);

// Mobile and tablet menu and header (hides on scroll down, returns on scroll up, hidden at the footer).
// The header only shows below 1200px, so none of this reaches the desktop view.
const mhd = document.querySelector<HTMLElement>('[data-mhd]');
const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
if (mhd && btn && menu) {
  const label = btn.querySelector<HTMLElement>('[data-menu-label]');
  const setOpen = (open: boolean, restoreFocus = true) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close' : 'Menu';
    mhd.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      mhd.classList.remove('is-hidden');
      menu.querySelector<HTMLElement>('a[href]')?.focus({ preventScroll: true });
    } else if (restoreFocus) btn.focus({ preventScroll: true });
  };
  btn.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    // a tap on the dimmed backdrop closes the menu
    if (t === menu) { setOpen(false); return; }
    // phone and email open the concept note on top of the menu; every other link closes it
    const a = t.closest<HTMLAnchorElement>('a');
    if (a && !/^(tel:|mailto:)/.test(a.getAttribute('href') || '')) setOpen(false, false);
  });
  addEventListener('keydown', (e) => {
    if (menu.hidden || e.defaultPrevented) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'Tab') {
      // keep keyboard focus inside the header bar and the open menu
      const els = [...mhd.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter((el) => el.getClientRects().length > 0);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (!mhd.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // turning a tablet or widening the window past the breakpoint never leaves the page locked
  const small = matchMedia('(max-width: 1199px)');
  small.addEventListener('change', () => { if (!small.matches && !menu.hidden) setOpen(false, false); });
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
