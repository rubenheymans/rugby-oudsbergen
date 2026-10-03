# Rugbyclub Oudsbergen: redesign proposal

Static redesign of [rugbyoudsbergen.be](https://www.rugbyoudsbergen.be/). Content scraped from the live site (Oct 2026); hero and section images are AI-generated (Gemini), club photos and sponsor logos come from the current site.

```bash
npm install
npm run build   # -> dist/
npm run serve   # http://localhost:4321
```

- `src/content.mjs`: all club data (age groups, fees, calendar, trainers, board, sponsors). Edit here, rebuild.
- `src/pages.mjs`: page templates. `src/layout.mjs`: header, footer, shell.
- `assets/gen/`: generated images. `tools/`: image generation scripts (need `GEMINI_API_KEY`).
- Deploys to GitHub Pages on push to `main` (`.github/workflows/pages.yml`). `BASE_PATH` is set to the repo name there.

Every page carries `noindex` and a banner pointing to the official site, so the preview never competes with it.
