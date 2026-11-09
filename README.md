# rawstor benchmarks

[docs](docs/)

## Checks

- `npm test` — snapshot calculations and operation filters.
- `npm run test:python` — import, report generation, timestamps and data processing.
- `npm run test:browser` — real dashboard interactions in headless Edge/Chromium.
- `npm run typecheck` and `npm run build` — TypeScript validation and dashboard build.

Browser checks require Node.js 22+, Edge at its default Windows path (or
`BROWSER_PATH` pointing to Chromium), and network access to download D3.
They serve deterministic fixtures locally and do not modify the published site.
Python and JavaScript unit tests also run in CI.
