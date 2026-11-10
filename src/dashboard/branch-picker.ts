interface BranchPickerOptions {
  id: string;
  branches: string[];
  lastUpdated?: ReadonlyMap<string, string>;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onSelect: (branch: string) => void;
  signal?: AbortSignal;
}

/** Searchable single selection; Compare supplies only unselected branches. */
export function createBranchPicker(opts: BranchPickerOptions): HTMLElement {
  const { id, branches, signal } = opts;
  const root = document.createElement('div');
  root.className = 'branch-picker';
  const input = document.createElement('input');
  input.id = id;
  input.type = 'text';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.placeholder = opts.placeholder ?? 'Search branches…';
  input.value = opts.value ?? '';
  input.disabled = !!opts.disabled;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', `${id}-options`);
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'branch-picker-toggle';
  toggle.textContent = '🔎';
  toggle.setAttribute('aria-label', 'Show branches');
  toggle.setAttribute('aria-controls', `${id}-options`);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.disabled = input.disabled;
  const popup = document.createElement('div');
  popup.className = 'branch-picker-popup';
  popup.hidden = true;
  const list = document.createElement('div');
  list.id = `${id}-options`;
  list.className = 'branch-picker-options';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Branches');
  const status = document.createElement('div');
  status.className = 'branch-picker-status';
  status.setAttribute('role', 'status');
  popup.append(list, status);
  root.append(input, toggle, popup);

  let query = '';
  let selected = opts.value ?? '';
  let matches: string[] = [];
  let active = 0;
  const close = () => {
    popup.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    input.value = selected;
    query = '';
  };
  const highlight = () => {
    const options = Array.from(list.children) as HTMLElement[];
    options.forEach((option, i) => option.setAttribute('aria-selected', String(i === active)));
    const current = options[active];
    if (current) {
      input.setAttribute('aria-activedescendant', current.id);
      current.scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  };
  const choose = (branch: string) => {
    selected = opts.value === undefined ? '' : branch;
    close();
    opts.onSelect(branch);
    // Compare replaces its controls after adding a branch; keep adding by keyboard.
    (document.getElementById(id) as HTMLInputElement | null)?.focus();
  };
  const open = () => {
    if (input.disabled) return;
    popup.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    const needle = query.trim().toLocaleLowerCase();
    const filtered = branches.filter(b => b.toLocaleLowerCase().includes(needle));
    const rank = (branch: string) => {
      const name = branch.toLocaleLowerCase();
      if (!needle) return 0;
      if (name === needle) return 0;
      return name.startsWith(needle) ? 1 : 2;
    };
    filtered.sort((a, b) => {
      const relevance = rank(a) - rank(b);
      if (relevance) return relevance;
      const first = opts.lastUpdated?.get(a) ?? '';
      const second = opts.lastUpdated?.get(b) ?? '';
      return second.localeCompare(first) || a.localeCompare(b);
    });
    matches = filtered.slice(0, 50);
    active = 0;
    list.replaceChildren();
    matches.forEach((branch, i) => {
      const option = document.createElement('div');
      option.id = `${id}-option-${i}`;
      option.className = 'branch-picker-option';
      option.setAttribute('role', 'option');
      const name = document.createElement('span');
      name.className = 'branch-option-name';
      name.textContent = branch;
      const timestamp = opts.lastUpdated?.get(branch);
      const date = document.createElement(timestamp ? 'time' : 'span');
      date.className = 'branch-option-date';
      date.textContent = timestamp ? timestamp.slice(0, 10) : 'No date';
      if (date instanceof HTMLTimeElement && timestamp) date.dateTime = timestamp;
      date.title = timestamp ? `Last benchmark: ${timestamp} (UTC)` : 'No dated benchmarks';
      option.title = `${branch} — ${date.title}`;
      option.setAttribute('aria-label', `${branch}, ${date.title}`);
      option.append(name, date);
      option.addEventListener('pointerdown', e => e.preventDefault(), { signal });
      option.addEventListener('click', () => choose(branch), { signal });
      list.appendChild(option);
    });
    status.textContent = filtered.length === 0 ? 'No branches found'
      : filtered.length > matches.length ? `${matches.length} of ${filtered.length} branches — type to narrow`
      : `${filtered.length} ${filtered.length === 1 ? 'branch' : 'branches'}`;
    highlight();
  };
  input.addEventListener('focus', () => { query = ''; input.select(); open(); }, { signal });
  input.addEventListener('click', () => { if (popup.hidden) open(); }, { signal });
  input.addEventListener('input', () => { query = input.value; open(); }, { signal });
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (popup.hidden) open();
      else if (matches.length) active = (active + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
      highlight();
    } else if (e.key === 'Enter' && !popup.hidden) {
      e.preventDefault();
      if (matches[active]) choose(matches[active]);
    }
  }, { signal });
  // Keep focus in the input when the dropdown button is pressed.
  toggle.addEventListener('pointerdown', e => e.preventDefault(), { signal });
  toggle.addEventListener('click', () => {
    if (!popup.hidden) close();
    else { input.focus(); query = ''; open(); }
  }, { signal });
  root.addEventListener('focusout', e => {
    if (!root.contains(e.relatedTarget as Node | null)) close();
  }, { signal });
  return root;
}
