import plotsData from '../data/plots.json';
import homesData from '../data/homes.json';

export type Status = 'available' | 'reserved' | 'sold' | 'show';
export interface Plot { n: number; type: string; status: Status; price: number | null }
export interface HomeType {
  slug: string; name: string; order: number; short: string; home: string;
  beds: number; baths: number; area: number; ber: string; from: number;
  images: Record<string, string>;
  stages: { kind: string; title: string; text: string }[];
  plan: { title: string; text: string; rooms3d: { name: string; x0: number; y0: number; x1: number; y1: number; level: number; outdoor: boolean }[] };
  alt: Record<string, string>;
  specLayers: { label: string; text: string; layer: string; callout: string; calloutSub: string }[];
  ceilingHeight: string;
}

export const plots = plotsData.phase1 as Plot[];
export const homes = (homesData.types as HomeType[]).slice().sort((a, b) => a.order - b.order);
export const shared = homesData.shared;
export const siteImages = homesData.siteImages as Record<string, string>;
export const statusText = plotsData.statusText as Record<Status, string>;
export const phase2 = plotsData.phase2;

export const statusDot: Record<Status, string> = {
  available: '#7A9F45',
  reserved: '#9C9482',
  sold: '#A9705C',
  show: '#EFEBE2',
};

export const countOf = (s: Status, type?: string) =>
  plots.filter((p) => p.status === s && (!type || p.type === type)).length;
export const remaining = countOf('available');
export const typeBySlug = (slug: string) => homes.find((h) => h.slug === slug)!;
export const plotsOf = (slug: string) => plots.filter((p) => p.type === slug);
export const euro = (v: number) => '€' + v.toLocaleString('en-IE');
export const priceText = (p: Plot) =>
  p.status === 'sold' ? 'Sold' : p.status === 'show' ? 'Not for sale' : euro(p.price!);
export const photoOf = (slug: string) => typeBySlug(slug).images.photo;
export const countsSentence = () =>
  `${countOf('available')} available, ${countOf('reserved')} reserved, ${countOf('sold')} sold, ${countOf('show')} show home`;
