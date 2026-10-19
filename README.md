# Jinghao Wang — Academic Website

Personal academic website for [Jinghao Wang](https://jinghao-coding.github.io/), focused on cloud systems, GPU scheduling, and resource-efficient AI infrastructure.

## Content structure

- `index.html` — site content and metadata
- `css/style.css` — visual system and responsive layout
- `js/main.js` — footer year; navigation works without JavaScript
- `figs/` — portrait and social preview image
- `_sites/` — lightweight packaging adapter for private OpenAI Sites deployment

GitHub Pages serves the static files from the repository root. The `_sites` adapter copies that same source into the Cloudflare Worker-compatible structure expected by Sites, so the two deployments do not maintain separate page content.

## Local preview

Open `index.html` directly or serve the repository root with any static web server.

## Validate the Sites package

```bash
cd _sites
npm test
```

The command builds `dist/client/` from the root static site, creates the Worker entry point at `dist/server/index.js`, and runs structural checks for key content and links.
