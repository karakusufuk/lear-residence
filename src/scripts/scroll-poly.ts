/**
 * Fallback for browsers without CSS scroll-driven animations (animation-timeline).
 * It reads the site's own stylesheet, finds every rule that uses a scroll()/view()/named timeline
 * and replays the same @keyframes with the Web Animations API, pinned to the scroll position.
 * Wheel and touch events are never touched; the page scrolls natively.
 */

interface Offset { unit: '%' | 'px'; v: number }
interface RangePart { name?: string; off: Offset }
interface Layer { name?: string; timeline?: string; range?: [RangePart, RangePart] }
type Frame = { offset: number; props: Record<string, string> };

const RANGE_NAMES = new Set(['entry', 'exit', 'cover', 'contain', 'entry-crossing', 'exit-crossing']);
const KEYWORDS = new Set(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'both', 'forwards', 'backwards', 'none', 'infinite', 'alternate', 'alternate-reverse', 'reverse', 'paused', 'running', 'normal']);

function splitTop(s: string, sep = ','): string[] {
  const out: string[] = [];
  let depth = 0; let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === sep && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function matchBrace(css: string, open: number): number {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return i;
  }
  return css.length - 1;
}

function parseDecls(body: string): Record<string, string> {
  const o: Record<string, string> = {};
  splitTop(body, ';').forEach((d) => {
    const i = d.indexOf(':');
    if (i > 0) o[d.slice(0, i).trim()] = d.slice(i + 1).replace(/!important/, '').trim();
  });
  return o;
}

function parseOffset(t: string): Offset {
  const m = /^(-?[\d.]+)(%|px)?$/.exec(t);
  return m ? { unit: (m[2] as '%' | 'px') || 'px', v: parseFloat(m[1]) } : { unit: '%', v: 0 };
}

function parseRange(s: string): [RangePart, RangePart] {
  const items: { name?: string; off?: Offset }[] = [];
  for (const t of s.split(/\s+/).filter(Boolean)) {
    if (RANGE_NAMES.has(t)) items.push({ name: t });
    else {
      const last = items[items.length - 1];
      if (last && !last.off) last.off = parseOffset(t);
      else items.push({ off: parseOffset(t) });
    }
  }
  if (items.length === 1) {
    const a = items[0];
    return [{ name: a.name, off: a.off ?? { unit: '%', v: 0 } }, { name: a.name, off: { unit: '%', v: 100 } }];
  }
  const [a, b] = items;
  return [
    { name: a.name, off: a.off ?? { unit: '%', v: 0 } },
    { name: b.name ?? a.name, off: b.off ?? { unit: '%', v: 100 } },
  ];
}

function layersFrom(decls: Record<string, string>, prev: Layer[]): Layer[] {
  let layers = prev.map((l) => ({ ...l }));
  const shorthand = decls['animation'];
  if (shorthand !== undefined) {
    layers = splitTop(shorthand).map((one) => {
      const l: Layer = {};
      for (const t of one.split(/\s+/)) {
        if (/^(scroll|view)\(/.test(t) || t.startsWith('--')) l.timeline = t;
        else if (KEYWORDS.has(t) || /^[\d.]+m?s$/.test(t) || /^[\d.]+$/.test(t) || t.includes('(')) continue;
        else l.name = t;
      }
      return l;
    });
  }
  if (decls['animation-name']) splitTop(decls['animation-name']).forEach((n, i) => { layers[i] = { ...(layers[i] ?? {}), name: n === 'none' ? undefined : n }; });
  if (decls['animation-timeline']) splitTop(decls['animation-timeline']).forEach((t, i) => { layers[i] = { ...(layers[i] ?? {}), timeline: t === 'auto' ? undefined : t }; });
  if (decls['animation-range']) {
    const parts = splitTop(decls['animation-range']);
    layers.forEach((l, i) => { l.range = parseRange(parts[i % parts.length]); });
  }
  return layers;
}

function camel(p: string): string {
  if (p.startsWith('--')) return p;
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function init() {
  const root = document.documentElement;
  const raw = [...document.querySelectorAll('style')].map((s) => s.textContent ?? '').join('\n').replace(/\/\*[\s\S]*?\*\//g, '');

  // 1. keyframes
  const keyframes = new Map<string, Frame[]>();
  let rest = '';
  let pos = 0;
  const kfRe = /@keyframes\s+([\w-]+)\s*\{/g;
  let m: RegExpExecArray | null;
  const cut: [number, number][] = [];
  while ((m = kfRe.exec(raw))) {
    const open = m.index + m[0].length - 1;
    const close = matchBrace(raw, open);
    const body = raw.slice(open + 1, close);
    const frames: Frame[] = [];
    const fRe = /([^{}]+)\{([^{}]*)\}/g;
    let f: RegExpExecArray | null;
    while ((f = fRe.exec(body))) {
      const props = parseDecls(f[2]);
      for (const sel of f[1].split(',').map((x) => x.trim())) {
        const offset = sel === 'from' ? 0 : sel === 'to' ? 1 : parseFloat(sel) / 100;
        frames.push({ offset, props });
      }
    }
    frames.sort((a, b) => a.offset - b.offset);
    keyframes.set(m[1], frames);
    cut.push([m.index, close + 1]);
    kfRe.lastIndex = close + 1;
  }
  cut.forEach(([a, b]) => { rest += raw.slice(pos, a); pos = b; });
  rest += raw.slice(pos);

  // 2. drop @media / @supports / @font-face / @property blocks (the fallback only runs on tablet and desktop with motion allowed)
  let flat = '';
  pos = 0;
  const atRe = /@(media|supports|font-face|property|layer|container)[^{;]*\{/g;
  while ((m = atRe.exec(rest))) {
    const open = m.index + m[0].length - 1;
    const close = matchBrace(rest, open);
    flat += rest.slice(pos, m.index);
    pos = close + 1;
    atRe.lastIndex = close + 1;
  }
  flat += rest.slice(pos);

  // 3. rules
  const rules: { sel: string; decls: Record<string, string> }[] = [];
  const timelines = new Map<string, string>();
  const rRe = /([^{}]+)\{([^{}]*)\}/g;
  let r: RegExpExecArray | null;
  while ((r = rRe.exec(flat))) {
    const sel = r[1].trim();
    if (!sel || sel.startsWith('@')) continue;
    const decls = parseDecls(r[2]);
    if (decls['view-timeline-name']) timelines.set(decls['view-timeline-name'], sel);
    if ('animation' in decls || 'animation-name' in decls || 'animation-timeline' in decls || 'animation-range' in decls) rules.push({ sel, decls });
  }

  // 4. per element layers (document order wins, like the cascade for these rules)
  const perEl = new Map<Element, Layer[]>();
  for (const { sel, decls } of rules) {
    let els: Element[] = [];
    try { els = [...document.querySelectorAll(sel)]; } catch { continue; }
    for (const el of els) perEl.set(el, layersFrom(decls, perEl.get(el) ?? []));
  }
  // inline animation-range overrides (site plan plots)
  perEl.forEach((layers, el) => {
    const inline = /animation-range:\s*([^;"]+)/.exec(el.getAttribute('style') ?? '');
    if (inline) { const parts = splitTop(inline[1]); layers.forEach((l, i) => { l.range = parseRange(parts[i % parts.length]); }); }
  });

  // 5. build the animations
  interface Entry { anim: Animation; el: Element; layer: Layer }
  const entries: Entry[] = [];
  root.classList.add('sd-poly');
  perEl.forEach((layers, el) => {
    layers.forEach((layer) => {
      if (!layer.name || !layer.timeline) return;
      const frames = keyframes.get(layer.name);
      if (!frames) return;
      const kf = frames.map((fr) => {
        const o: Record<string, string | number> = { offset: fr.offset };
        for (const [k, v] of Object.entries(fr.props)) if (!k.startsWith('-webkit-')) o[camel(k)] = v;
        return o;
      });
      try {
        const anim = (el as HTMLElement).animate(kf as Keyframe[], { duration: 1000, fill: 'both', easing: 'linear' });
        anim.pause();
        anim.currentTime = 1000;
        entries.push({ anim, el, layer });
      } catch { /* a value this browser cannot animate: leave that element in its final state */ }
    });
  });

  // 6. geometry
  interface Box { top: number; height: number }
  const makeGetter = () => {
    const boxes = new Map<Element, Box>();
    const sy = scrollY;
    return (el: Element): Box => {
      let b = boxes.get(el);
      if (b) return b;
      if (el instanceof HTMLElement) {
        let top = 0; let n: HTMLElement | null = el;
        while (n) { top += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
        b = { top, height: el.offsetHeight };
      } else {
        const rc = el.getBoundingClientRect();
        b = { top: rc.top + sy, height: rc.height };
      }
      boxes.set(el, b);
      return b;
    };
  };
  let get = makeGetter();

  const rangeBounds = (box: Box, vh: number) => {
    const coverStart = box.top - vh; const coverEnd = box.top + box.height;
    const a = box.top + box.height - vh; const b = box.top;
    const containStart = Math.min(a, b); const containEnd = Math.max(a, b);
    return {
      cover: [coverStart, coverEnd], contain: [containStart, containEnd],
      entry: [coverStart, containStart], exit: [containEnd, coverEnd],
      'entry-crossing': [coverStart, coverStart + box.height], 'exit-crossing': [coverEnd - box.height, coverEnd],
    } as Record<string, [number, number]>;
  };
  const at = (rg: [number, number], p: RangePart) => rg[0] + (p.off.unit === '%' ? ((rg[1] - rg[0]) * p.off.v) / 100 : p.off.v);
  const cover: [RangePart, RangePart] = [{ name: 'cover', off: { unit: '%', v: 0 } }, { name: 'cover', off: { unit: '%', v: 100 } }];

  const update = () => {
    const vh = innerHeight;
    const sy = scrollY;
    const maxScroll = Math.max(1, root.scrollHeight - vh);
    for (const { anim, el, layer } of entries) {
      let start: number; let end: number;
      const tl = layer.timeline!;
      if (tl.startsWith('scroll')) {
        const rg = layer.range;
        start = rg ? rg[0].off.v : 0;
        end = rg ? rg[1].off.v : maxScroll;
      } else {
        const subject = tl.startsWith('--') ? document.querySelector(timelines.get(tl) ?? '') : el;
        if (!subject) continue;
        const bounds = rangeBounds(get(subject), vh);
        const rg = layer.range ?? cover;
        start = at(bounds[rg[0].name ?? 'cover'], rg[0]);
        end = at(bounds[rg[1].name ?? 'cover'], rg[1]);
      }
      const p = end > start ? Math.min(1, Math.max(0, (sy - start) / (end - start))) : sy >= end ? 1 : 0;
      anim.currentTime = p * 1000;
    }
  };

  let queued = false;
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); } };
  const remeasure = () => { get = makeGetter(); update(); };
  // measure once with every animation in its end state, so transforms do not bend the geometry
  get = makeGetter();
  update();
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', remeasure);
  addEventListener('load', remeasure);
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(document.body);
  (window as unknown as { __sdpoly: unknown }).__sdpoly = { count: entries.length, update };
}
