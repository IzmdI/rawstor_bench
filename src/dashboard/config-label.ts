export interface ConfigDescription {
  title: string;
  tags: string[];
  compact: string;
}

/** Display labels only: raw config IDs continue to drive filters, URLs and links. */
export function describeConfig(config: string): ConfigDescription {
  const match = /^perftest-(-?without-liburing-)?(file|ost)(-legacy)?-([1-9]\d*)([kKmMgG]?)-([1-9]\d*)-([1-9]\d*)$/.exec(config);
  if (!match) return { title: config, tags: [], compact: config };
  const [, withoutLiburing, backend, legacy, block, suffix, depth, jobs] = match;
  const unit: Record<string, string> = { '': 'B', k: 'KiB', m: 'MiB', g: 'GiB' };
  const tags = [`${block} ${unit[suffix.toLowerCase()]}`, `QD ${depth}`, `${jobs} ${jobs === '1' ? 'job' : 'jobs'}`];
  if (withoutLiburing) tags.push('No liburing');
  if (legacy) tags.push('Legacy');
  const title = backend === 'ost' ? 'Object storage' : 'File';
  return { title, tags, compact: [backend === 'ost' ? 'OST' : 'File', ...tags].join(' · ') };
}

export function formatConfigLabel(config: string): string {
  return describeConfig(config).compact;
}

export function renderConfigHeading(heading: HTMLElement, config: string): void {
  const { title, tags } = describeConfig(config);
  heading.title = config;
  const name = document.createElement('span');
  name.className = 'config-title-text';
  name.textContent = title;
  heading.replaceChildren(name);
  if (!tags.length) return;
  const badges = document.createElement('span');
  badges.className = 'config-tags';
  for (const text of tags) {
    const badge = document.createElement('span');
    badge.className = 'config-tag';
    badge.textContent = text;
    badges.appendChild(badge);
  }
  heading.appendChild(badges);
}
