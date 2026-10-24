interface PlotData { n: number; type: string; typeName: string; status: string; statusText: string; dot: string; beds: number; area: number; ber: string; priceText: string; href: string }

const data: PlotData[] = JSON.parse(document.getElementById('plan-data')!.textContent!);
const byN = new Map(data.map((p) => [p.n, p]));
const grid = document.querySelector<HTMLElement>('[data-plan]');
const card = document.querySelector<HTMLElement>('[data-card]');
const touch = matchMedia('(hover: none)');

function select(n: number) {
  const p = byN.get(n);
  if (!p || !card || !grid) return;
  grid.querySelectorAll('.pl').forEach((g) => g.classList.toggle('is-sel', g.classList.contains(`pl${n}`)));
  const set = (k: string, v: string) => card.querySelectorAll<HTMLElement>(`[data-f="${k}"]`).forEach((el) => (el.textContent = v));
  set('n', String(p.n)); set('typeName', p.typeName); set('statusText', p.statusText);
  set('beds', String(p.beds)); set('area', String(p.area)); set('ber', p.ber); set('priceText', p.priceText);
  card.querySelectorAll<HTMLElement>('[data-f="dot"]').forEach((el) => (el.style.background = p.dot));
  card.querySelectorAll<HTMLAnchorElement>('[data-f="href"]').forEach((el) => (el.href = p.href));
  card.querySelectorAll<HTMLElement>('[data-type]').forEach((el) => (el.hidden = el.dataset.type !== p.type));
}

const small = matchMedia('(max-width: 1199px)');
if (grid) {
  select(5);
  grid.querySelectorAll<SVGAElement>('a[data-plot]').forEach((a) => {
    const n = +a.dataset.plot!;
    a.addEventListener('mouseenter', () => { if (!touch.matches) select(n); });
    a.addEventListener('focus', () => { if (!touch.matches) select(n); });
    a.addEventListener('click', (e) => {
      // touch: the first tap selects the plot and opens its card, the card's button opens the house
      if (touch.matches && !a.parentElement!.classList.contains('is-sel')) {
        e.preventDefault(); select(n);
        // phones and tablets: the card sits under the plan, bring it up if it is below the fold
        if (small.matches && card) {
          const r = card.getBoundingClientRect();
          if (r.top > innerHeight - 160) scrollBy({ top: r.top - innerHeight + Math.min(r.height, innerHeight - 120) + 24, behavior: 'smooth' });
        }
      }
    });
  });
  // phones: the plan is wider than the screen and scrolls sideways; open it centred on the Phase 1 plots
  const scroller = grid.querySelector<HTMLElement>('.plan-scroll');
  if (scroller && matchMedia('(max-width: 767px)').matches && scroller.scrollWidth > scroller.clientWidth) {
    const rs = [...scroller.querySelectorAll('.pl')].map((g) => g.getBoundingClientRect());
    if (rs.length) {
      const mid = (Math.min(...rs.map((r) => r.left)) + Math.max(...rs.map((r) => r.right))) / 2;
      const box = scroller.getBoundingClientRect();
      scroller.scrollLeft += mid - (box.left + box.width / 2);
    }
  }
}

// Sort cards: Plot / Home / Price
const cards = document.querySelector<HTMLElement>('[data-cards]');
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-sort]');
buttons.forEach((b) =>
  b.addEventListener('click', () => {
    if (!cards) return;
    const key = b.dataset.sort;
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const items = [...cards.children] as HTMLElement[];
    const n = (el: HTMLElement) => +el.dataset.n!;
    const price = (el: HTMLElement) => (el.dataset.price ? +el.dataset.price : 9e9);
    items.sort((a, c) =>
      key === 'price' ? price(a) - price(c) || n(a) - n(c)
      : key === 'home' ? a.dataset.type!.localeCompare(c.dataset.type!) || n(a) - n(c)
      : n(a) - n(c));
    items.forEach((el) => cards.appendChild(el));
  }),
);
