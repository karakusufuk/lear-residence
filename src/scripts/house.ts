// Floor plan rooms and material rows light up their counterpart (hover, keyboard focus, tap).
function link(root: HTMLElement | null, attr: string, onSet: (key: string | null) => void) {
  if (!root) return;
  let pinned: string | null = null;
  const els = root.querySelectorAll<HTMLElement>(`[${attr}]`);
  els.forEach((el) => {
    const key = el.getAttribute(attr)!;
    el.addEventListener('mouseenter', () => { if (!pinned) onSet(key); });
    el.addEventListener('mouseleave', () => { if (!pinned) onSet(null); });
    el.addEventListener('focus', () => onSet(key));
    el.addEventListener('blur', () => { if (!pinned) onSet(null); });
    el.addEventListener('click', () => {
      if (!matchMedia('(hover: none)').matches) return;
      pinned = pinned === key ? null : key;
      onSet(pinned);
    });
  });
}

const rooms = document.querySelector<HTMLElement>('[data-rooms]');
link(rooms, 'data-r', (key) => rooms!.querySelectorAll<HTMLElement>('[data-r]').forEach((el) => el.classList.toggle('is-on', el.dataset.r === key)));

const mats = document.querySelector<HTMLElement>('[data-mats]');
link(mats, 'data-layer', (key) => {
  if (key) mats!.dataset.active = key; else delete mats!.dataset.active;
  mats!.querySelectorAll<HTMLElement>('[data-layer]').forEach((el) => el.classList.toggle('is-on', el.dataset.layer === key));
});

// ?plot=N opens the page with that plot picked in the plot list
const n = new URLSearchParams(location.search).get('plot');
if (n) document.querySelector(`[data-plots] [data-n="${CSS.escape(n)}"]`)?.classList.add('is-picked');
