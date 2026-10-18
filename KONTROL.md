# KONTROL — Lear (18 Ekim 2026)

Üretim sürümü (`npm run build` → `npm run preview`) üzerinde, gerçek Chrome 155 ile (puppeteer) ölçüldü. Her satır bir otomatik denetim: ✓ geçti, ✗ kaldı. Ekran görüntüleri `kontrol/` altında.

**Otomatik denetim: 75/75 ✓**

## Davranış denetimleri

| | Denetim | Ölçüm / not |
|---|---|---|
| ✓ | Hero day→night follows scroll and rewinds | [0,0.17,0.56,1,1,1,0.56,0.17,0] |
| ✓ | Mouse wheel is not blocked or slowed | scrolled 600px for 600px wheel, defaultPrevented=[false,false] |
| ✓ | Header is transparent over the hero | rgba(14, 42, 32, 0) |
| ✓ | Header turns solid as the hero ends | {"w":1440,"bg":"rgb(14, 42, 32)","op":"1","vis":"visible"} |
| ✓ | Header shrinks to a 132px dark piece | {"w":132,"bg":"rgb(14, 42, 32)","op":"1","vis":"visible"} |
| ✓ | Small header opens to the full header on hover | {"w":1440,"bg":"rgb(14, 42, 32)","op":"1","vis":"visible"} |
| ✓ | Small header disappears once the footer is on screen | {"w":132,"bg":"rgb(14, 42, 32)","op":"0","vis":"hidden"} |
| ✓ | Small header comes back when scrolling up | {"w":132,"bg":"rgb(14, 42, 32)","op":"1","vis":"visible"} |
| ✓ | Footer logo scrolls to the top | scrollY=0 |
| ✓ | Button hover: line closes 9px→4px smoothly, moss fill, no jump | top: -9.0 -6.5 -5.3 -4.5 -4.2 -4.1 -4.0 -4.0 -4.0 -4.0 -4.0 -4.0 · bg rgb(122, 159, 69) |
| ✓ | House row: line drawing covers the photo on hover (single layer), "View home" tag appears | closed=inset(0px 100% 0px 0px) open=inset(0px) tag=1 |
| ✓ | House row: closes smoothly back along the same path (no cut) | mid=inset(0px 45.8331% 0px 0px) end=inset(0px 100% 0px 0px) |
| ✓ | One team: slogan and all four parts fit on a single screen | {"q":[{"top":257,"bottom":395},{"top":257,"bottom":363},{"top":542,"bottom":708},{"top":542,"bottom":676}],"h2":120,"vh":900} |
| ✓ | Show home photo: zoom-out finishes exactly at the end of the page | end=matrix(1, 0, 0, 1, 0, 0) before=matrix(1.0216, 0, 0, 1.0216, 0, 0) |
| ✓ | Three homes at 1024px: "One landscape." stays in place above the drawings | {"w2bottom":257,"frameTop":315,"w2right":983,"vw":1024,"h2w":942} |
| ✓ | Kildare window: opens from the first pixel, is fully framed when pinned | inset(14% 40% 10% calc(40% + 40px)) \| inset(calc(0% + 104px) calc(0% + 56px) calc(0% + 56px) calc(0% + 96px)) |
| ✓ | Kildare rings: double line first, outer line fades, one circle stays | [{"ring":0.500898,"ring2op":1},{"ring":0,"ring2op":0.6},{"ring":0,"ring2op":0}] |
| ✓ | Site plan: hovering a plot lifts the mass, shows the selection ring and updates the card | {"c5":{"n":"5","t":"The Court","s":"Available","p":"€735,000","href":"/homes/the-court/?plot=5","img":"the-court"},"c12":{"n":"12","t":"The Slope","s… |
| ✓ | Site plan: card links to the house with ?plot=N | /homes/the-slope/?plot=12 |
| ✓ | Site plan: keyboard focus selects the plot too | {"n":"9","t":"The Line","s":"Available","p":"€665,000","href":"/homes/the-line/?plot=9","img":"the-line"} |
| ✓ | Site plan: clicking a plot opens the house page with ?plot=N | http://localhost:4330/homes/the-slope/?plot=13 |
| ✓ | Site plan: masses are tinted from plots.json (sold brick, reserved stone, available moss edge, show home label) | {"sold":"#CDA697","avail":"#F4F2ED","res":"#E6E1D6","showpin":"Show home"} |
| ✓ | Site plan: homes settle in one after another while scrolling in | [1,1,0.81] |
| ✓ | Plot cards sort by price (cheapest first) | 9,8,10,5 |
| ✓ | Plot cards sort by home | 1,2,3 |
| ✓ | Site plan on a phone: tapping a plot opens its card below the plan (no navigation on first tap) | {"n":"12","t":"The Slope","s":"Available","p":"€845,000","href":"/homes/the-slope/?plot=12","img":"the-slope"} |
| ✓ | Homes at 390px: no horizontal overflow |  |
| ✓ | House page opens with ?plot=N picked | 9 |
| ✓ | Floor plan: hovering a room in the list darkens it in the plan and shows name and size | {"fill":"rgb(201, 211, 188)","lbl":"1","other":"0"} |
| ✓ | Floor plan: hovering a room in the plan also marks its list row | {"lbl":"1","list":"rl is-on"} |
| ✓ | Floor plan: keyboard focus highlights the room |  |
| ✓ | Materials: hovering a row lights its layer in the section, others fade, callout shows | {"heat":1,"floor":0.2,"glazing":0.2,"co":1,"active":"heat"} |
| ✓ | Materials: keyboard focus lights the layer |  |
| ✓ | Architecture: "Nature" drawing is fully drawn and on screen | {"visiblePct":87,"off":0,"op":1,"others":[0,0,0],"h3":"rgb(14, 42, 32)","top":172,"bottom":835,"vh":900} |
| ✓ | Architecture: "Architecture" drawing is fully drawn and on screen | {"visiblePct":87,"off":0,"op":1,"others":[0,0,0],"h3":"rgb(14, 42, 32)","top":156,"bottom":819,"vh":900} |
| ✓ | Architecture: "Construction" drawing is fully drawn and on screen | {"visiblePct":87,"off":0,"op":1,"others":[0,0,0],"h3":"rgb(14, 42, 32)","top":156,"bottom":819,"vh":900} |
| ✓ | Architecture: "After the keys" drawing is fully drawn and on screen | {"visiblePct":87,"off":0,"op":1,"others":[0,0,0],"h3":"rgb(14, 42, 32)","top":156,"bottom":819,"vh":900} |
| ✓ | Architecture: Nature is open by default | {"d1":1,"p":1} |
| ✓ | Architecture: keyboard focus opens a row and draws its picture |  |
| ✓ | Architecture: visible breathing room between the photo and "How we work" | 160px |
| ✓ | Architecture: top photo is about 5/8 of the screen height | 63% |
| ✓ | Show home: "Open in Google Maps" opens the directions link in a new tab | {"href":"https://www.google.com/maps/dir/?api=1&destination=Kildare%20town%2C%20Co.%20Kildare","target":"_blank"} |
| ✓ | Show home: map route draws itself when it comes into view | 1 -> 0 |
| ✓ | Booking: continue without a time shows a clear message | Choose a time to continue. |
| ✓ | Booking: day, time and home update the "Your visit" summary | {"day":"Sunday 25 Oct","time":"11:30","home":"The Slope"} |
| ✓ | Booking: step 2 (details) opens |  |
| ✓ | Booking: empty details show errors with aria-invalid | {"name":"Enter your full name.","phone":"Enter an Irish mobile number, like 085 123 4567.","email":"Enter an email address, like name@example.com.","… |
| ✓ | Booking: bad phone and email formats are rejected | {"phone":"Enter an Irish mobile number, like 085 123 4567.","email":"Enter an email address, like name@example.com."} |
| ✓ | Booking: code step says "code sent" with a masked number, never shows a code, resend waits 30 s | {"step":"3","hint":"08X XXX 4567","text":"We've sent a 6-digit code to 08X XXX 4567.6-digit codeResend code in 30s BackConfirm visit","resend":true} |
| ✓ | Booking: an empty code is refused |  |
| ✓ | Booking: any 6-digit code confirms the visit | {"step":"4","title":"See you on Sunday 25 Oct.","when":"11:30 · Show home, Plot 1, Lear, Kildare town"} |
| ✓ | Booking: "Add to calendar" builds a valid .ics | UID:1792361549218@lear.example \| DTSTAMP:20261018T221229Z \| DTSTART:20261025T113000 \| DTEND:20261025T120000 \| SUMMARY:Visit the Lear show home |
| ✓ | Booking: "Change the time" returns to step 1 |  |
| ✓ | Booking: callback branch asks only for name and number, then confirms |  |
| ✓ | Booking: ?type=the-line preselects the home |  |
| ✓ | Phase 2 form: empty submit explains what is missing |  |
| ✓ | Phase 2 form: success message "You're on the list." |  |
| ✓ | Contact: ?topic=phase2 selects "Phase 2 interest" |  |
| ✓ | Contact: success reads "Thanks. We reply within one working day." |  |
| ✓ | No horizontal overflow at 375px on any page |  |
| ✓ | No horizontal overflow at 390px on any page |  |
| ✓ | Touch targets are at least 44px high on a phone |  |
| ✓ | Mobile menu: opens full screen with the five links, phone and email | {"exp":"true","vis":true,"links":["Homes","Architecture","Show home","Buying","Contact"],"tel":true,"mail":true,"font":"Gloock, Georgia, serif"} |
| ✓ | Mobile menu: Escape closes it |  |
| ✓ | Mobile header: hides on scroll down, returns on scroll up | hidden=true shown=true |
| ✓ | Mobile header: hidden once the footer is visible |  |
| ✓ | Mobile header: thin bottle strip with a 44px menu button | {"h":60,"menu":[64,44]} |
| ✓ | Reduced motion: scenes are not pinned and animations are off | {"heroPos":"relative","thPos":"relative","kilPos":"relative","otPos":"relative","anim":"none","night":"1","transition":"0s","hrowLw":"inset(0px 100% … |
| ✓ | Reduced motion: sections stack without overlapping | 0 overlaps |
| ✓ | Phone: tapping a room in the list highlights it in the plan with name and size | {"row":true,"room":"1","other":"0"} |
| ✓ | Phone: tapping a material row highlights its layer in the section above the list | {"active":"heat","heat":1,"floor":0.2,"secTop":64,"rowTop":353.296875} |
| ✓ | Phone: photo, line drawing and cutaway stack with their own text (not pinned) | {"vis":[244,244,244],"pinned":"relative"} |
| ✓ | Phone: floor plan sits in a sideways scroll box (min 560px) | {"ov":"auto","svgW":560,"boxW":390} |
| ✓ | Phone: hero is 1.5 screens, the other scenes are not pinned, One team is a plain list | {"heroH":1.5,"hero":"sticky","th":"relative","kil":"relative","ot":"relative","quadCols":"block"} |
| ✓ | Phone: Kildare stop labels are 12px or larger on screen | rendered sizes 13px |

## Lighthouse (mobil, `npm run preview`, simüle yavaş 4G)

| Sayfa | Performans | Erişilebilirlik | En iyi uygulamalar | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 98 | 100 | 100 | 100 | 2.3 s | 0 | 0 |
| `/homes/` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 |
| `/homes/the-court/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 0 |
| `/homes/the-line/` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 |
| `/homes/the-slope/` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 |
| `/show-home/` | 99 | 100 | 100 | 100 | 2.1 s | 0 | 0 |
| `/architecture/` | 100 | 100 | 100 | 100 | 1.7 s | 0 | 0 |
| `/buying/` | 100 | 100 | 100 | 100 | 1.7 s | 0 | 0 |
| `/phase-2/` | 99 | 100 | 100 | 100 | 1.8 s | 0 | 0 |
| `/contact/` | 100 | 100 | 100 | 100 | 1.7 s | 0 | 0 |
| `/privacy/` | 100 | 100 | 100 | 100 | 1.7 s | 0 | 0 |

axe-core (WCAG 2 A/AA + best practice): 1440 ve 390 genişlikte bütün sayfalar temiz; tek istisna, `Buying`'de ekrana girerken `rise` animasyonunun ara karesinde yakalanan geçici düşük opaklık (kalıcı değil).

## Firefox yedeği

Bu makinede gerçek Firefox yok. Yedek modül (`src/scripts/scroll-poly.ts`) Chrome'da `?sdpoly=1` ile zorlanıp yerel CSS animasyonlarıyla piksel karşılaştırıldı (aynı kaydırma noktalarında 12 kare, 5 sayfa + ana sayfa 19 kare): ortalama gri farkı 0–0,3/255, en kötü kare 1,0/255 (yerleşke planı SVG'si, ölçüm yuvarlaması). Yedek açıkken `html.sd-poly` sahneleri yeniden sabitler; modül yoksa her şey son halinde ve okunur kalır.

## Ekran görüntüleri (`kontrol/`)

- `kontrol/1440/`, `kontrol/1024/`, `kontrol/390/`: 12 sayfanın tamamı, görünüm boyunda, yukarıdan aşağı (`ev-sayfası-01.jpg`…).
- `kontrol/scenes/`: sabitlenen sahneler 0 / %25 / %50 / %75 / %100 noktalarında: hero, Three homes, Kildare, One team (1440 ve 1024), ev sayfası fotoğraf→çizgi→kesit, Architecture sloganı (1440 ve 1024), hero (390).

Hepsi tek tek açılıp referansla (ölçü, boşluk, font, renk, sıra) karşılaştırıldı; bulunan farklar (aşağıda) düzeltildi:

- Kildare haritası telefonda çok küçüktü → CSS ile kırpıp büyütüldü, etiketler 13 px.
- One team tablet genişliğinde başlık sütunu esniyordu → `flex: none`.
- Telefon üst şeridi 375 px'te 8 px taşıyordu (Architecture başlığı) → başlık küçüldü.
- Dokunma hedefleri 44 px altındaydı (iletişim, footer bağlantıları) → büyütüldü.
- Dokunmada parsel ilk dokunuşta açılıyordu → ilk dokunuş seçer, kart düğmesi açar.
- Yayında CSS küçültücü `animation-timeline` kuralını bozuyordu → CSS küçültme kapatıldı (SAPMALAR.md).

## Yapılmayanlar / açık

- Gerçek Firefox, Safari ve gerçek telefon denenmedi.
- Fiyat ve mesafeler kurgu; yayın öncesi Daft/MyHome ve Kildare mesafeleri bir kez kontrol edilmeli (belgede de not var).
