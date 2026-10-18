# SAPMALAR — PROMPT.md ve reference/ ekranlarından farklı yapılanlar

Her satır: ne farklı, neden.

## Kurulum ve yapı

- **`sharp` paketi eklendi** (belgedeki paket listesinde yok). Astro'nun `<Picture>` bileşeni AVIF/WebP üretmek için bunu ister.
- **`site: 'https://lear.example'`** yer tutucu (belgede böyle). Alan adı belli olunca `astro.config.mjs`, `public/robots.txt` içindeki sitemap adresi ve `og:image` adresleri kendiliğinden düzelir (ilk ikisi elle).
- **CSS küçültme kapalı** (`vite.build.cssMinify: false`). Küçültücü `animation-timeline` değerini `animation` kısayoluna katıyor (`animation: linear both fadeIn --hero`); tarayıcı `--hero`'yu ikinci bir animasyon adı sayıp bütün kuralı atıyor ve kaydırmaya bağlı sahneler hiç oynamıyordu. Bedel: sayfa başına yaklaşık 50 KB okunur CSS (gzip'te küçük). Firefox yedeği de bu okunur CSS'i ayrıştırıyor.
- **Görseller:** `<Picture>` genişlikleri 480/800/1200/1600/2000 istendi; kaynaklar en çok 1672 px olduğu için en büyük çıktı 1672 px. AVIF + WebP, yedek WebP; şeffaf çizim dosyaları şeffaflığını koruyor.
- **Sahne yükseklikleri** referanstaki sabit `1700px` gibi değerler yerine `calc(100svh + N)`, sabit sahne `100svh`. N, referanstaki (sahne − 880) farkıyla aynı, yani 880 px yüksek ekranda birebir referans; daha kısa ekranda kaydırma bütçesi aynı kalıyor, yerleşim ekran yüksekliğine göre sıkışıyor (`min()`/`clamp()`).
- **Sahne içi ölçüler** yüksekliğe duyarlı yapıldı: Three homes çizimleri `min(340px, 37svh)`, üst boşluk `clamp(84px, 12.5svh, 110px)`; One team üst/alt boşluk `clamp()`; ev sayfası görsel kutusu `min(640px, 74svh)`. Gerekçe: 768 px yüksek ekranda başlık ile çizimlerin üst üste binmemesi.
- **Büyük başlıkların boyutu** referanstaki piksel değerinin 1440 px genişlikteki oranı olarak `clamp(min, vw, referans px)` yazıldı; 1440 px'te referansla aynı, dar ekranda orantılı küçülüyor.
- `html { scroll-behavior: smooth }` eklendi (footer logosu "en üste kayar" için); hareket azaltmada kapalı.

## Veri

- **Yerleşke planındaki ev kütleleri `plots.json`'dan renklendiriliyor** (`src/lib/siteplan.ts`). Panoda satıldı/rezerve/müsait tonları SVG'ye gömülüydü; durum değişince plan eskimesin diye yapı sırasında yeniden boyanıyor (kütle yüzleri, çatı kenarı, numara etiketi, `aria-label`). Başka bir parsel "Show home" yapılırsa etiket de değişir.
- Parsel kartlarının bağlantısı `/homes/<tip>/?plot=N`; ev sayfaları listesindeki kartlar `Show home` ve `Book a visit` sayfalarına gidiyor (referanstaki gibi).
- **`?plot=N` ev sayfasında:** referansta karşılığı çizilmemişti; ilgili parsel kartı çift çizgili "seçili" halde açılıyor (belgedeki "seçili durum" çift çizgisi).

## Tasarım

- **Architecture, pasif satır başlığı rengi `#CFC9BC` yerine `#8E877A`.** Referanstaki renk zeminde 1,5:1 veriyor (belge "kontrast 4,5:1" diyor); büyük metin eşiği olan 3:1'e çıkarıldı. Açık satır `--bottle`.
- **Satılan parsel kartı:** tüm kartı %55–60 soldurmak metni 3:1'in altına indiriyordu; yalnızca fotoğraf %50 soldu, başlık `--ink-2`.
- **Kildare penceresi:** referanstaki aralık `entry 0% contain 6%` idi (pencere sabitlendikten ~160 px sonra tamamlanıyor). Belgedeki cümle ("sabitlendiğinde tam hale ulaşır") için `entry 0% contain 0%` yapıldı.
- **Seçim açılır menüsü (`<select>`):** referanstaki gibi düz; özel ok çizilmedi (ikon yok kuralı), tarayıcının kendi oku kullanılıyor.
- **Başlık "Phase 2."** referanstaki gibi 66 px üst boşlukla başlıyor.
- **Tablet header:** referansta yalnız masaüstü var. 1199 px altında telefon numarası, 999 px altında "Phase 1 · N homes remaining" gizleniyor; menü aralıkları daralıyor.
- **One team tablet (<1200 px):** her bölmede başlık cümlenin üstünde (yan yana sığmıyor).
- **Ev sayfası telefon:** üstteki dış cephe fotoğrafı telefonda gizli; hemen altındaki foto→çizgi→kesit akışının ilk görseli aynı fotoğraf (iki kez üst üste görünüyordu).
- **Kildare telefon:** harita CSS ile kırpılıp büyütüldü (`68vw` yükseklikli kutuda `225vw` SVG), durak etiketleri 13 px'e çıkarıldı; halkalar ekrana girerken kaydırmaya bağlı çiziliyor ("bir kez" yerine geri sarılıyor).
- **Telefon menü düğmesi** simge yerine "Menu / Close" yazısı (ikon yok).
- **Telefonda Three homes** çizimler ekrana girince çiziliyor ve ardından fotoğrafa dönüşüyor; ufuk çizgisi telefonda yok (sütunlar alt alta).

## Davranış

- **Randevu akışı** (Fennel Dental'dan kod kopyalanmadı, aynı adımlar yeniden yazıldı): günler önümüzdeki 14 gündeki Per/Cmt/Paz; bugün yalnızca hâlâ boş saati varsa listede. Dolu saatler tarihe göre sabit sahte düzen. SMS kodunda ekranda kod gösterilmiyor, numara `08X XXX 4567` biçiminde maskeli, "Resend" 30 sn bekliyor, 6 haneli her kod kabul. Onayda başlık `See you on Sunday 25 Oct.`.
- **"Can't find a time that works?"** dalı ayrı bir form açmıyor (sayfada tek form kuralı): aynı akışın ad + cep adımına gidiyor, e-posta istenmiyor, sonunda "Thanks, <ad>." gösteriyor.
- **Dokunmatik yerleşke planı:** ilk dokunuş parseli seçip kartı açıyor, kart düğmesi evi açıyor (masaüstünde tıklayınca doğrudan ev sayfası).
- **Kat planı odaları** klavyeyle odaklanabilir (`tabindex`, `aria-label` "Oda, ölçü"); malzeme ve oda listesi satırları da. Referansta yalnızca fare vardı.
- **Firefox yedeği** referans CSS'i yeniden yazmak yerine sitenin kendi CSS'ini okuyup aynı `@keyframes` ve aynı aralıkları Web Animations API ile çalıştırıyor (`src/scripts/scroll-poly.ts`). Yalnız ≥768 px ve hareket azaltma kapalıyken devreye girer.

## Bilinen sınırlar

- Buying sayfasında `rise` animasyonunun ara karesi, otomatik erişilebilirlik tarayıcısında geçici düşük kontrast olarak görünebiliyor; kalıcı değil.
- Gerçek Firefox/Safari bu makinede denenemedi; Firefox yedeği Chrome'da zorlanarak doğrulandı (KONTROL.md).
- Fiyat ve mesafe rakamları kurgu; yayın öncesi Daft/MyHome ve Kildare mesafeleri bir kez kontrol edilmeli.
