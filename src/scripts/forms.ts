// Demo forms: visible labels, format checks, a friendly result. Nothing is sent anywhere.
document.querySelectorAll<HTMLFormElement>('form[data-demo]').forEach((form) => {
  const ok = form.querySelector<HTMLElement>('[data-success]');
  const fields = form.querySelector<HTMLElement>('[data-fields]');
  const msg = (el: HTMLInputElement, text: string) => {
    el.setAttribute('aria-invalid', text ? 'true' : 'false');
    const err = el.closest('.fld')?.querySelector<HTMLElement>('.err');
    if (err) err.textContent = text;
  };
  form.addEventListener('input', (e) => msg(e.target as HTMLInputElement, ''));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let first: HTMLInputElement | null = null;
    form.querySelectorAll<HTMLInputElement>('[required]').forEach((el) => {
      let text = '';
      const v = el.value.trim();
      if (!v) text = el.type === 'email' ? 'Enter your email address.' : 'This is needed so we can reply.';
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) text = 'Enter an email address, like name@example.com.';
      msg(el, text);
      if (text && !first) first = el;
    });
    if (first) { (first as HTMLInputElement).focus(); return; }
    fields?.setAttribute('hidden', '');
    form.querySelectorAll<HTMLElement>('[data-hide-on-success]').forEach((el) => el.setAttribute('hidden', ''));
    if (ok) { ok.hidden = false; ok.setAttribute('tabindex', '-1'); ok.focus({ preventScroll: true }); }
  });
});

// ?topic=phase2 preselects the subject on the contact form
const topic = new URLSearchParams(location.search).get('topic');
const sel = document.querySelector<HTMLSelectElement>('select[name="about"]');
if (topic && sel && [...sel.options].some((o) => o.value === topic)) sel.value = topic;
