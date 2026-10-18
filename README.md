# Foundation Models for Particle Accelerators

Static project page for **Foundation Models for Particle Accelerators** by Mahindra Singh Rautela and Alexander Scheinker (NeurIPS 2026).

This repository contains the project website and an earlier ICML 2026 workshop-version PDF. It does not currently publish the SensOFormer model implementation, pretrained weights, or the multi-facility datasets.

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

The site deploys to GitHub Pages on every push to `main` using the workflow in `.github/workflows/pages.yml`.

Expected URL: `https://mahindrautela.github.io/sensoformer/`

All paths are relative so the page also works from a local server or another project-site path.

## Regenerating the imputation animation

The missing-data result animation is built directly from Appendix Figures 4–12 in the paper:

```bash
osascript -l JavaScript scripts/build-imputation-gif.js
```

The generator uses macOS PDFKit and ImageIO and writes both the animated GIF and its reduced-motion poster to `static/images/`.
