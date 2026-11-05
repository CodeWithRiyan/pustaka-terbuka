# Changelog

All notable changes to this project are listed here. Versions follow the
roadmap's releases (R1 = 0.2.0, R2 = 0.3.0, … R5 = 1.0.0).

## 0.2.0 — R1 Clean-up and publish

- Indonesian and English: every interface text lives in `src/i18n`, picked
  from the browser and remembered; a language picker in the header.
- Quality gates in CI on every pull request: typecheck, lint, formatting,
  unit tests with coverage thresholds (95/85/95/95), a bundle size budget,
  Playwright end-to-end tests with axe at desktop and 360 px, and a gitleaks
  secret scan. Pages is deployed only from a green `main`.
- Skip link to the content, translated labels for the theme toggle, the
  dialog close button and the pagination.
- Pagination rebuilt as buttons with translated labels.
- Removed dead code and dependencies: unused UI components, the unused alert
  dialog (which loaded animations from a third-party host), and 26 packages.
- MIT licence.

## 0.1.0 — Initial commit

- Open Library catalog (subjects, search, book detail) as a static export on
  GitHub Pages, replacing the earlier private-library prototype.
