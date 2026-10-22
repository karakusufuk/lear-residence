# Konsept modalı

Bileşen: `src/components/ConceptModal.astro` (Base.astro'da bir kez), mantık: `src/scripts/concept.ts` (`openConcept(kind, onClose, origin)`), link: `CASE_STUDY_URL` in `src/config/site.ts`.
Girişte hiçbir şerit/uyarı yok; modal yalnız eylemde açılır. Hiçbir veri gönderilmez. Kapatma: Close, Esc, arka plan (zamanlayıcı yok).

## Tetikleyiciler
- Show home ziyareti son onayı (kod adımı): `src/scripts/booking.ts` `next()` step 3 -> `openConcept('visit', finishVisit)`
- Geri arama son onayı: `booking.ts` `next()` step 2 callback modu -> `openConcept('callback', finishCallback)`
- İletişim formu "Send": `src/scripts/forms.ts` submit (contact.astro:21) -> 'enquiry'
- Phase 2 listesi "Join the list": `forms.ts` (phase-2.astro:32, `data-concept="register"`) -> 'register'
- tel: linkleri (Header.astro:29,49; Footer.astro:15; contact.astro:15; show-home noscript): `concept.ts` delegasyon
- mailto: linkleri (Header.astro:50; Footer.astro:15; contact.astro:16; privacy.astro:15)
- Adres/harita: show-home.astro "Open in Google Maps" (`data-concept="address"`)

## Gövde metinleri ("In a live build, ...")
- visit: this would book your show home visit and send a confirmation.
- callback: this would pass your number to the sales team, who would call you back.
- enquiry: this would land your message in the sales team inbox, with a reply within one working day.
- register: this would add you to the Phase 2 list, ahead of general sale.
- phone: this would ring the sales suite.
- email: this would open a message to the sales team.
- address: this would open directions to the show home.

## Telefon
`+353 45 555 0182` / `045 555 0182` (gerçek Kildare alan kodu, gerçek olabilir) -> `+353 1 234 5182` / `01 234 5182` / `tel:+35312345182` (`src/config/site.ts`).

## Diğer
- robots.txt: `User-agent: *` + `Disallow: /`. noindex meta Base.astro'da duruyor. Footer: "Portfolio demo, not a real business." + "Designed by Ufuk Karakuş"; eski şerit ve "Concept site" ibaresi kaldırıldı.
- Belirsiz: adres metni (kare düz yazı, link değil) ve harita SVG'si tıklanabilir değil, bu yüzden tetikleyici değil. `.ics` indirme (bitiş ekranı) modal sonrası olduğu için ayrıca tetiklenmedi. `sales@learhomes.ie` alan adının gerçek olup olmadığı doğrulanmadı (learhomes.ie), gerekirse değiştirilmeli. Dev sunucusunda paylaşılan tarayıcı sekmesi başka ajan tarafından değiştirildiği için testler ayrı sekmede yapıldı; desktop ~1280 görsel ekran görüntüsü alınmadı (DOM testi yapıldı), mobil (390) görsel doğrulandı.
