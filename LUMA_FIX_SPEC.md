# LUMA Fix Spec

## Fixes Required

### 1. Navbar (refer to attached navbar image)
- Full-width white bar, **no border-radius** (radius 0).
- Left: `MEN   WOMEN   JOURNEY` in uppercase, spaced out.
- Center: bold uppercase `LUMA` logo.
- Right: `ACCOUNT   SEARCH   CART (0)` in uppercase.
- Remove the current floating pill style.
- Keep hamburger menu on mobile that opens the mobile overlay.

### 2. Global radius
- Set `--radius: 0` everywhere.
- Remove border-radius from announcement bar, header, buttons, inputs, cards, images, modals, drawers.

### 3. Font
- Switch from Inter to **DM Sans** (`https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap`).
- Use DM Sans for headings, body, nav, buttons.

### 4. Section 2 — Category tiles (refer to attached section 2 image)
Replace the current category tabs/grid with a full-width tile grid like the reference:
- 5 tiles in a row on desktop, full-bleed edge-to-edge.
- Each tile is a large lifestyle image with text overlay.
- Labels: `TOPS`, `SHOP NOW`, `BOTTOMS`, `SHOP NOW`, `JACKETS`.
- On mobile: stack vertically or 2-column.
- Labels are uppercase, white, positioned bottom-left or centered depending on tile.
- No gaps between tiles (or very small 1–2px gaps).
- Keep using Unsplash images.

### 5. Fix broken Section 3 and below
Current issues to fix:
- Featured products split section layout is collapsing / product cards not rendering properly.
- Journey blocks layout broken (images too tall / grid misaligned).
- Newsletter and footer spacing off after radius changes.
- Ensure all sections stack correctly on mobile and expand properly on desktop.
- Remove any leftover CSS from old LUMA theme that conflicts with new monochrome theme.

## Files
- `/Users/user/Documents/e-commerce/03-luma-lifestyle/index.html`
- `/Users/user/Documents/e-commerce/03-luma-lifestyle/styles.css`
- `/Users/user/Documents/e-commerce/03-luma-lifestyle/script.js`

## Deliverable
A clean, working, responsive LUMA page with the new navbar, 0 radius, DM Sans font, fixed category tiles section, and all sections below rendering correctly.
