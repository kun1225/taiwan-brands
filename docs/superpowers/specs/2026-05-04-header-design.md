## Header design

Goal: add a lightweight site header at `src/layouts/header.tsx` for the homepage.

Structure:
- Left: geometric mountain logo based on the provided image plus the text `Taiwan Brands`
- Right: primary CTA labeled `探索台灣品牌`

Behavior:
- The CTA links to the existing `#brands` section on the homepage
- The component stays presentational and does not add client-side state

Implementation notes:
- Reuse the provided logo asset from `public/logo.jpeg` and align `favicon.ico` with it
- Reuse the existing button styling language from the project UI layer
- Keep layout responsive with a stacked mobile layout and a single-row desktop layout
