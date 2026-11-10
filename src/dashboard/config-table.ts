import { describeConfig } from './config-label';

export function renderConfigTable(
  configs: string[],
  isSelected: (config: string) => boolean,
  onToggle: (config: string) => void,
  colorFor?: (config: string) => string,
): HTMLElement {
  const scroll = document.createElement('div');
  scroll.className = 'legend-table-wrap';
  const table = document.createElement('table');
  table.className = 'legend-table';
  table.setAttribute('aria-label', 'Configuration visibility');
  const headings = table.createTHead().insertRow();
  for (const label of ['Storage', 'Block', 'QD', 'Jobs', 'Mode']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    headings.appendChild(th);
  }
  const body = table.createTBody();

  for (const group of configs) {
    const color = colorFor?.(group);
    const item = document.createElement('button');
    item.className = 'legend-item';
    item.dataset.group = group;
    item.type = 'button';
    item.setAttribute('role', 'checkbox');
    item.classList.toggle('hidden', !isSelected(group));
    item.setAttribute('aria-checked', String(isSelected(group)));
    const dot = document.createElement('span');
    dot.className = 'legend-dot';
    if (color) dot.style.background = color;
    const label = document.createElement('span');
    label.className = 'legend-label';
    const config = describeConfig(group);
    label.textContent = config.title;
    item.setAttribute('aria-label', config.compact);
    const row = body.insertRow();
    const name = document.createElement('th');
    name.scope = 'row';
    name.appendChild(item);
    row.appendChild(name);
    const [block, depth, jobs, ...modes] = config.tags;
    if (block && !modes.includes('No liburing')) modes.unshift('With liburing');
    for (const value of [block, depth?.replace('QD ', ''), jobs, modes.join(' · ')]) {
      row.insertCell().textContent = value || '—';
    }
    item.title = group;
    if (color) item.appendChild(dot);
    item.appendChild(label);
    item.addEventListener('click', () => {
      onToggle(group);
      if (!item.isConnected) {
        document.querySelector<HTMLElement>(`.legend-item[data-group="${CSS.escape(group)}"]`)?.focus();
      }
    });
    item.addEventListener('keydown', (e: KeyboardEvent) => {
      // Space/Enter handled natively by <button>; only handle arrows.
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        row.nextElementSibling?.querySelector<HTMLElement>('.legend-item')?.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        row.previousElementSibling?.querySelector<HTMLElement>('.legend-item')?.focus();
      }
    });
  }

  scroll.appendChild(table);
  return scroll;
}
