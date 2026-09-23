# Deploying Broken Front

This project is a static website. No build step is required.

## GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - Source: **GitHub Actions** (preferred, uses `.github/workflows/pages.yml`), or
   - Source: **Deploy from a branch**, branch `main`, folder `/` (root).
4. Wait for the first deployment, then open `https://<user>.github.io/BrokenFront/`.

If the site is served from a project path (`/BrokenFront/`), keep asset URLs relative (they already are).

## Local testing

Use any static server from the repository root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

Do not open `index.html` as a `file://` URL if the browser blocks ES modules or the Three.js CDN import map.
