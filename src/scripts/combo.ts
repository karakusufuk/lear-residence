// Phones: every form select gets the site's own combobox (the native one opens the phone's system picker).
// The native select stays in the form and holds the value; on wider screens it is the one shown (global.css).
const ARROW = '<svg class="combo-arr" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
let uid = 0;

document.querySelectorAll<HTMLSelectElement>('.fld select').forEach((sel) => {
  const label = sel.closest('label');
  const name = (label?.firstChild?.textContent ?? '').trim();
  const id = `combo-${++uid}`;
  const box = document.createElement('div');
  box.className = 'combo';
  box.innerHTML = `<button type="button" class="combo-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}"><span class="sr-only">${name}, </span><span class="combo-val"></span>${ARROW}</button><ul class="combo-list" id="${id}" role="listbox" aria-label="${name}" hidden></ul>`;
  sel.after(box);
  const btn = box.querySelector<HTMLButtonElement>('.combo-btn')!;
  const val = box.querySelector<HTMLElement>('.combo-val')!;
  const list = box.querySelector<HTMLUListElement>('.combo-list')!;
  const opts = [...sel.options].map((o, i) => {
    const li = document.createElement('li');
    li.role = 'option'; li.tabIndex = -1; li.textContent = o.text; li.dataset.i = String(i);
    list.appendChild(li);
    return li;
  });

  const sync = () => {
    val.textContent = sel.options[sel.selectedIndex]?.text ?? '';
    opts.forEach((li, i) => li.setAttribute('aria-selected', String(i === sel.selectedIndex)));
  };
  const setOpen = (open: boolean, focusOpt = false) => {
    list.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    box.classList.toggle('is-open', open);
    if (open && focusOpt) opts[Math.max(0, sel.selectedIndex)]?.focus({ preventScroll: true });
  };
  const choose = (i: number) => {
    if (i !== sel.selectedIndex) { sel.selectedIndex = i; sel.dispatchEvent(new Event('change', { bubbles: true })); }
    sync();
    setOpen(false);
  };

  // preventDefault: the combobox sits inside the field's <label>, whose click would otherwise go on to the select
  btn.addEventListener('click', (e) => { e.preventDefault(); setOpen(list.hidden, e.detail === 0); });
  list.addEventListener('click', (e) => {
    e.preventDefault();
    const li = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (li) { choose(+li.dataset.i!); if (e.detail === 0) btn.focus({ preventScroll: true }); }
  });
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true, true); }
  });
  list.addEventListener('keydown', (e) => {
    const at = opts.indexOf(document.activeElement as HTMLLIElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      opts[Math.min(opts.length - 1, Math.max(0, at + (e.key === 'ArrowDown' ? 1 : -1)))].focus({ preventScroll: true });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); if (at >= 0) choose(at); btn.focus({ preventScroll: true });
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault();
      setOpen(false); btn.focus({ preventScroll: true });
    }
  });
  document.addEventListener('pointerdown', (e) => { if (!list.hidden && !box.contains(e.target as Node)) setOpen(false); });
  sel.addEventListener('change', sync);
  sync();
});
