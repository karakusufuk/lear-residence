# Lear

Kildare'de kurgu bir design-build firmasının satış sitesi (portfolyo demosu). Astro, vanilla TypeScript, tamamen statik çıktı.

```bash
npm install
npm run dev       # geliştirme, http://localhost:4321
npm run build     # dist/
npm run preview   # üretim sürümünü dene
```

- Parsel durumu ve fiyatlar: `src/data/plots.json` (sayaçlar, yerleşke planı, kartlar buradan hesaplanır).
- Ev metinleri, ölçüler, kat planı odaları, malzeme satırları: `src/data/homes.json`.
- Telefon, e-posta, adres, saatler: `src/config/site.ts`.
- Tasarım değişkenleri: `src/styles/tokens.css`.
- Üretim talimatı ve onaylı tasarım panosu: `../lear-paket/`.
- Paketten farklı yapılanlar: `SAPMALAR.md`. Denetim sonuçları ve ekran görüntüleri: `KONTROL.md`, `kontrol/`.
