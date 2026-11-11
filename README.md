# rawstor benchmarks

[docs](docs/)

## Dashboard sampling

For each UTC day, branch, configuration, and metric (read/write IOPS or latency),
the dashboard keeps the latest run that reported that metric. The Compare
snapshot takes the median of the most recent `N` available daily points in each
series.

## Checks

Use Node.js 22 or later. CI runs Node.js 24.

- `npm test` — snapshot calculations and operation filters.
- `npm run test:python` — import, report generation, timestamps and data processing.
- `npm run test:browser` — real dashboard interactions in headless Edge/Chromium.
- `npm run typecheck` and `npm run build` — TypeScript validation and dashboard build.

Browser checks require Edge at its default Windows path or `BROWSER_PATH` pointing
to Edge or Chromium. They serve the production bundle and deterministic fixtures
from a local server and can run offline after `npm ci`.
Python and JavaScript unit tests also run in CI.
