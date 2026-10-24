// Concept-site modal: opens on a user action (final confirm, phone, email, address). Sends nothing anywhere.
type Kind = 'visit' | 'callback' | 'enquiry' | 'register' | 'phone' | 'email' | 'address';

const BODY: Record<Kind, string> = {
  visit: 'this would book your show home visit and send a confirmation.',
  callback: 'this would pass your number to the sales team, who would call you back.',
  enquiry: 'this would land your message in the sales team inbox, with a reply within one working day.',
  register: 'this would add you to the Phase 2 list, ahead of general sale.',
  phone: 'this would ring the sales suite.',
  email: 'this would open a message to the sales team.',
  address: 'this would open directions to the show home.',
};

const root = document.querySelector<HTMLElement>('[data-concept-modal]');
const FOCUSABLE = 'a[href], button:not([disabled])';
let lastFocus: HTMLElement | null = null;
let afterClose: (() => void) | null = null;
let closeTimer = 0;

export function openConcept(kind: Kind, onClose?: () => void, origin?: HTMLElement | null) {
  if (!root) { onClose?.(); return; }
  clearTimeout(closeTimer);
  lastFocus = origin ?? (document.activeElement as HTMLElement | null);
  afterClose = onClose ?? null;
  const body = root.querySelector<HTMLElement>('[data-concept-body]');
  if (body) body.textContent = `In a live build, ${BODY[kind]}`;
  root.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  void root.offsetWidth;
  root.classList.add('is-open');
  root.querySelector<HTMLElement>('[data-concept-close]')?.focus({ preventScroll: true });
}

function close() {
  if (!root || root.hidden) return;
  root.classList.remove('is-open');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finish = () => {
    root.hidden = true;
    // the mobile/tablet menu can sit underneath (phone and email links in it): keep the page locked while it is open
    document.documentElement.style.overflow = document.querySelector('[data-menu]:not([hidden])') ? 'hidden' : '';
    const cb = afterClose; afterClose = null;
    if (cb) cb(); else lastFocus?.focus({ preventScroll: true });
    // after a flow step the original trigger may be hidden; focus only if still visible
  };
  if (reduced) finish(); else closeTimer = window.setTimeout(finish, 320);
}

if (root) {
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === root || t.closest('[data-concept-close]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      const els = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (!root.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // one delegated listener for phone, email and address
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || (e.target as Element).closest('[data-concept-modal]')) return;
    const a = (e.target as Element).closest<HTMLAnchorElement>('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    let kind: Kind | null = null;
    if (href.startsWith('tel:')) kind = 'phone';
    else if (href.startsWith('mailto:')) kind = 'email';
    else if (a.dataset.concept === 'address') kind = 'address';
    if (!kind) return;
    e.preventDefault();
    openConcept(kind, undefined, a);
  });
}
