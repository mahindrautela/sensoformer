# Foundation Models for Particle Accelerators

Static project page for **Foundation Models for Particle Accelerators** by Mahindra Singh Rautela and Alexander Scheinker (NeurIPS 2026).

This repository contains the project website and the final NeurIPS 2026 manuscript PDF. The website does not link the manuscript or its OpenReview record until their public records are available. The repository does not currently publish the SensOFormer model implementation, pretrained weights, or the multi-facility datasets.

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

The site deploys to GitHub Pages on every push to `main` using the workflow in `.github/workflows/pages.yml`.

Expected URL: `https://mahindrautela.github.io/sensoformer/`

All paths are relative so the page also works from a local server or another project-site path.

## Camera-ready figure sources

The website uses the original PNG assets referenced by `neurips_camera_ready.tex`. The three main-text figures and the 50 panels composing Appendix Figures 4–13 are preserved under `static/images/paper-source/`; the missing-data explorer displays those source panels directly without rasterizing them from the PDF.
