import raw from '../svg/site-plan.html?raw';
import { plots, homes, statusText, type Status } from './plots';

// The isometric masses were drawn once; their tones follow the plot status in data/plots.json.
const tones: Record<Status, { l: string; r: string; top: string; roofStyle: string; pin: string }> = {
  available: { l: '#E3DFD6', r: '#D5D0C5', top: '#F4F2ED', roofStyle: 'stroke:#7A9F45;stroke-width:1.6', pin: '#7A9F45' },
  reserved: { l: '#D6CFC1', r: '#C8C0B0', top: '#E6E1D6', roofStyle: '', pin: '#9C9482' },
  sold: { l: '#B98F7F', r: '#A67D6D', top: '#CDA697', roofStyle: '', pin: '#8E6252' },
  show: { l: '#E3DFD6', r: '#D5D0C5', top: '#F4F2ED', roofStyle: 'stroke:#0E2A20;stroke-width:1.6', pin: '#0E2A20' },
};

function recolor(group: string, n: number): string {
  const p = plots.find((x) => x.n === n);
  if (!p) return group;
  const t = tones[p.status];
  const type = homes.find((h) => h.slug === p.type)!;
  let g = group
    .replace(/fill="#(?:E3DFD6|D6CFC1|B98F7F)"/g, `fill="${t.l}"`)
    .replace(/fill="#(?:D5D0C5|C8C0B0|A67D6D)"/g, `fill="${t.r}"`)
    .replace(/fill="#(?:F4F2ED|E6E1D6|CDA697)"/g, `fill="${t.top}"`)
    .replace(/ style="stroke:#[0-9A-Fa-f]{6};stroke-width:1\.6"/g, '')
    .replace(/(class="roof")/g, t.roofStyle ? `$1 style="${t.roofStyle}"` : '$1')
    .replace(/aria-label="[^"]*"/, `aria-label="Plot ${n}, ${type.name}, ${statusText[p.status].toLowerCase()}"`);
  g = g.replace(/<g class="pin">[\s\S]*?<\/g>/, (pin) => {
    const y = /<rect x="[\d.]+" y="([\d.]+)"/.exec(pin)![1];
    const cx = +/<text x="([\d.]+)"/.exec(pin)![1];
    const ty = /<text x="[\d.]+" y="([\d.]+)"/.exec(pin)![1];
    const label = p.status === 'show' ? 'Show home' : String(n);
    const w = p.status === 'show' ? 74 : 26;
    return `<g class="pin"><rect x="${(cx - w / 2).toFixed(1)}" y="${y}" width="${w}" height="20" rx="6" fill="${t.pin}"/><text x="${cx}" y="${ty}" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="12" font-weight="700" fill="#F9F7F3">${label}</text></g>`;
  });
  return g;
}

export const sitePlanSvg = raw.replace(/<g class="pl pl(\d+)"[\s\S]*?<\/a><\/g>/g, (g, n) => recolor(g, +n));
