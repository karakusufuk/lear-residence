import { openConcept } from './concept';
// Show home visit booking: demo flow, nothing leaves the browser.
const root = document.querySelector<HTMLFormElement>('[data-book]');

if (root) {
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const $$ = <T extends HTMLElement>(s: string) => [...root.querySelectorAll<T>(s)];
  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const HOME_NAMES: Record<string, string> = { 'the-court': 'The Court', 'the-line': 'The Line', 'the-slope': 'The Slope', '': 'Not sure yet' };
  const THU = ['17:00', '17:30', '18:00', '18:30', '19:00'];
  const WEEKEND = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];

  const now = new Date();
  const slotsOfDay = (d: Date) => (d.getDay() === 4 ? THU : WEEKEND);
  const timeOver = (d: Date, t: string) => {
    if (d.toDateString() !== now.toDateString()) return false;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
  };
  // the next two weeks of opening days; today only while it still has a time left
  const days = Array.from({ length: 14 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i))
    .filter((d) => [4, 6, 0].includes(d.getDay()) && slotsOfDay(d).some((t) => !timeOver(d, t)));
  const st = { step: 1, mode: 'visit' as 'visit' | 'callback', day: 0, time: '', home: '', resendAt: 0, timer: 0 };

  const dayLong = (d: Date) => `${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`;
  const slotsOf = slotsOfDay;
  const isTaken = (d: Date, t: string, i: number) => {
    const h = (d.getDate() * 7 + d.getMonth() * 3 + i * 5) % 11;
    return h === 0 || h === 4 || (slotsOf(d).length > 5 && h === 8);
  };
  const isPast = timeOver;

  const val = (n: string) => (root.elements.namedItem(n) as HTMLInputElement).value.trim();
  const input = (n: string) => root.elements.namedItem(n) as HTMLInputElement;
  const phoneDigits = (p: string) => p.replace(/[\s\-().]/g, '');
  const phoneOk = (p: string) => /^(?:\+?353|0)8[3-9]\d{7}$/.test(phoneDigits(p));
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  const phoneHint = (p: string) => `08X XXX ${phoneDigits(p).slice(-4)}`;

  function setErr(name: string, msg: string) {
    const el = input(name);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    root!.querySelector<HTMLElement>(`#e-${name}`)!.textContent = msg;
  }
  root.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name) setErr(t.name, '');
  });

  function renderDays() {
    const box = $('[data-days]');
    box.innerHTML = '';
    days.forEach((d, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.setAttribute('aria-pressed', String(i === st.day));
      b.innerHTML = `<span class="dw">${DOW[d.getDay()]}</span><span class="dd">${d.getDate()} ${MON[d.getMonth()]}</span>`;
      b.addEventListener('click', () => { st.day = i; st.time = ''; renderDays(); renderTimes(); summary(); });
      box.appendChild(b);
    });
  }
  function renderTimes() {
    const box = $('[data-times]');
    box.innerHTML = '';
    const d = days[st.day];
    slotsOf(d).forEach((t, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip num'; b.textContent = t;
      const off = isTaken(d, t, i) || isPast(d, t);
      b.disabled = off;
      if (off) b.setAttribute('aria-label', `${t}, not available`);
      b.setAttribute('aria-pressed', String(st.time === t));
      b.addEventListener('click', () => { st.time = t; renderTimes(); summary(); showErr(1, ''); });
      box.appendChild(b);
    });
  }
  function summary() {
    $('[data-sum="day"]').textContent = dayLong(days[st.day]);
    $('[data-sum="time"]').textContent = st.time || 'Choose a time';
    $('[data-sum="home"]').textContent = HOME_NAMES[st.home];
  }
  function showErr(step: number, msg: string) {
    const el = root!.querySelector<HTMLElement>(`[data-err="${step}"]`);
    if (!el) return;
    el.textContent = msg; el.hidden = !msg;
  }

  function go(step: number, focus = true) {
    st.step = step;
    $$('[data-step]').forEach((p) => (p.hidden = p.dataset.step !== String(step)));
    if (focus) {
      const panel = root!.querySelector<HTMLElement>(`[data-step="${step}"]`)!;
      const target = panel.querySelector<HTMLElement>('input:not([hidden]), h3[tabindex]') ?? panel.querySelector<HTMLElement>('button');
      target?.focus({ preventScroll: true });
      // phones and tablets: the steps differ a lot in height, so the new step can start above the screen; bring it up
      if (matchMedia('(max-width: 1199px)').matches) {
        const top = root!.querySelector<HTMLElement>('.book-card')!.getBoundingClientRect().top;
        if (top < 64 || top > innerHeight * 0.5) scrollBy({ top: top - 76 });
      }
    }
    if (step === 3) startResend();
  }

  function startResend() {
    st.resendAt = Date.now() + 30_000;
    const btn = $<HTMLButtonElement>('[data-resend]');
    clearInterval(st.timer);
    const tick = () => {
      const left = Math.ceil((st.resendAt - Date.now()) / 1000);
      btn.disabled = left > 0;
      btn.textContent = left > 0 ? `Resend code in ${left}s` : 'Resend code';
      if (left <= 0) clearInterval(st.timer);
    };
    tick();
    st.timer = window.setInterval(tick, 500);
  }

  function checkDetails(): boolean {
    let ok = true;
    if (val('name').length < 2) { setErr('name', 'Enter your full name.'); ok = false; } else setErr('name', '');
    if (!phoneOk(val('phone'))) { setErr('phone', 'Enter an Irish mobile number, like 085 123 4567.'); ok = false; } else setErr('phone', '');
    if (st.mode === 'visit') {
      if (!emailOk(val('email'))) { setErr('email', 'Enter an email address, like name@example.com.'); ok = false; } else setErr('email', '');
    }
    if (!ok) root!.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return ok;
  }

  function finishVisit() {
    const d = days[st.day];
    $('[data-done-title]').textContent = `See you on ${dayLong(d)}.`;
    $('[data-done-when]').textContent = `${st.time} · Show home, Plot 1, Lear, Kildare town`;
    $('[data-done-note]').textContent = `A text reminder comes the day before to ${phoneHint(val('phone'))}. Park on the green; the door is the one in the limestone wall.`;
    $('[data-ics]').hidden = false;
    $<HTMLButtonElement>('[data-restart]').textContent = 'Change the time';
    go(4);
  }
  function finishCallback() {
    const first = val('name').split(/\s+/)[0];
    $('[data-done-title]').textContent = `Thanks, ${first}.`;
    $('[data-done-when]').textContent = 'Someone from the sales team will call you within two working days.';
    $('[data-done-note]').textContent = `We will call ${phoneHint(val('phone'))}.`;
    $('[data-ics]').hidden = true;
    $<HTMLButtonElement>('[data-restart]').textContent = 'Back to booking';
    $('[data-callback]').hidden = true;
    $('[data-callback-done]').hidden = false;
    go(4);
  }

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const home = t.closest<HTMLElement>('[data-home]');
    if (home) {
      st.home = home.dataset.home ?? '';
      $$('[data-home]').forEach((b) => b.setAttribute('aria-pressed', String(b === home)));
      summary();
      return;
    }
    if (t.closest('[data-callback-btn]')) {
      st.mode = 'callback';
      $('[data-details-lead]').hidden = false;
      $('[data-email-field]').hidden = true;
      $('[data-next-label]').textContent = 'Ask us to call you';
      go(2);
      return;
    }
    if (t.closest('[data-back]')) {
      if (st.step === 2 && st.mode === 'callback') { st.mode = 'visit'; resetModeUi(); go(1); }
      else go(st.step - 1);
      return;
    }
    if (t.closest('[data-restart]')) {
      st.mode = 'visit'; resetModeUi();
      $('[data-callback]').hidden = false; $('[data-callback-done]').hidden = true;
      st.time = ''; renderTimes(); summary(); go(1);
      return;
    }
    if (t.closest('[data-resend]')) {
      if (Date.now() >= st.resendAt) { startResend(); $('[data-resend-note]').textContent = 'Code sent again.'; }
      return;
    }
    if (t.closest('[data-ics]')) { downloadIcs(); return; }
    if (t.closest('[data-next]')) next();
  });
  root.addEventListener('submit', (e) => { e.preventDefault(); next(); });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') { e.preventDefault(); next(); }
  });

  function resetModeUi() {
    $('[data-details-lead]').hidden = true;
    $('[data-email-field]').hidden = false;
    $('[data-next-label]').textContent = 'Send me a code';
  }

  function next() {
    if (st.step === 1) {
      if (!st.time) { showErr(1, 'Choose a time to continue.'); return; }
      showErr(1, ''); go(2);
    } else if (st.step === 2) {
      if (!checkDetails()) return;
      if (st.mode === 'callback') { openConcept('callback', finishCallback, document.activeElement as HTMLElement | null); return; }
      $('[data-phone-hint]').textContent = phoneHint(val('phone'));
      $('[data-resend-note]').textContent = '';
      go(3);
    } else if (st.step === 3) {
      if (!/^\d{6}$/.test(val('code'))) { setErr('code', 'Enter the 6-digit code.'); input('code').focus(); return; }
      openConcept('visit', finishVisit, document.activeElement as HTMLElement | null);
    }
  }

  function downloadIcs() {
    const d = days[st.day];
    const [h, m] = st.time.split(':').map(Number);
    const p = (n: number) => String(n).padStart(2, '0');
    const f = (mins: number) => `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(Math.floor(mins / 60))}${p(mins % 60)}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Lear//Show home//EN', 'BEGIN:VEVENT',
      `UID:${Date.now()}@lear.example`, `DTSTAMP:${stamp}`,
      `DTSTART:${f(h * 60 + m)}`, `DTEND:${f(h * 60 + m + 30)}`,
      'SUMMARY:Visit the Lear show home',
      `DESCRIPTION:${HOME_NAMES[st.home] === 'Not sure yet' ? 'Show home visit' : 'Show home visit, interested in ' + HOME_NAMES[st.home]}`,
      'LOCATION:Plot 1\\, Lear\\, Kildare town\\, Co. Kildare R51', 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'lear-show-home-visit.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ?type=the-line preselects the home
  const type = new URLSearchParams(location.search).get('type');
  if (type && type in HOME_NAMES) {
    st.home = type;
    $$('[data-home]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.home === type)));
  }
  // open on the first day that still has a free time
  const firstOpen = days.findIndex((d) => slotsOf(d).some((t, i) => !isTaken(d, t, i) && !isPast(d, t)));
  if (firstOpen > 0) st.day = firstOpen;
  renderDays(); renderTimes(); summary();
}
