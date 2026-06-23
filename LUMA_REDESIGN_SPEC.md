# LUMA Redesign Spec — Head Golf Adaptation

## Goal
Redesign `/Users/user/Documents/e-commerce/03-luma-lifestyle/` to visually and interactively match https://headgolf.com/?ref=land-book.com. Keep the LUMA brand name and lifestyle positioning, but adapt the layout, typography, colors, and interactions to the Head Golf aesthetic.

Use **Unsplash placeholder images** for all assets while the visual direction is being prepared.

## Design System

### Colors
- `--color-white`: `#fff`
- `--color-grey`: `#f6f6f8`
- `--color-medium-grey`: `#e6e6e6`
- `--color-dark-grey`: `#9d9d9d`
- `--color-black`: `#000`
- `--color-error`: `#ed0000`
- `--color-overlay`: `rgba(0, 0, 0, 0.2)`

Page background: white. Section/card backgrounds: `#f6f6f8`. Primary text: black. Muted text: `#9d9d9d`.

### Typography
- Use **Inter** from Google Fonts (`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap`).
- Headings/CTAs/nav: `Inter`, weight 400–500, uppercase, `letter-spacing: 0.02em`, `line-height: 1.1`.
- Body text: `Inter`, weight 300, `line-height: 1.5`.
- Type scale:
  - H1: 1.6rem mobile / 2.6rem desktop, uppercase
  - H2: 1.4rem / 2rem, uppercase
  - Body: 0.95rem / 1rem
  - CTA: 0.85rem / 0.9rem, uppercase

### Spacing & Shapes
- `border-radius: 5px` on nearly everything: buttons, inputs, cards, images, announcement bar, header.
- Mobile gutter: 15px; desktop gutter: 40px.
- Section vertical padding: 20px mobile / 60–80px desktop.
- Container max-width: ~1400px, centered.

## Sections (in order)

### 1. Announcement Bar
- Rounded wrapper (`border-radius: 5px`) inside a grey bar.
- Two rotating messages with fade/slide transition.
- Close (×) button.
- Mobile: single line; desktop: two columns (promo left, perk right).

### 2. Header
- Floating pill-style header: white background, `border-radius: 5px`, positioned absolute over hero.
- Left: hamburger "Menu" on mobile; desktop nav: `Men`, `Women`, `Journey`.
- Center: LUMA logo (text logo, uppercase, letter-spaced).
- Right: Search icon, Account, Cart icon with count badge.
- Sticky behavior: hide on scroll down, reappear on scroll up.
- Mobile menu: full-screen overlay, accordion submenus.

### 3. Hero Slider
- Full-bleed Swiper/carousel (use vanilla JS, no external library if possible; a simple fade/slide carousel is fine).
- 3 slides. Each slide: full-bleed image, text overlay bottom-left.
- Text: small uppercase eyebrow, large uppercase heading, light subcopy, underlined "Explore Now" CTA.
- Pagination dots bottom-right.
- Aspect ratio: ~16:9 desktop, taller mobile.

### 4. Editorial Statement
- Centered text block on white background.
- Small uppercase eyebrow, large serif-like heading, body copy.

### 5. Category Grid with Tabs
- Tabs: `Women` / `Men`.
- 2-column grid mobile, 4-column desktop.
- Cards: tall portrait image (`aspect-ratio: 3/4`) with caption below.
- Use Unsplash lifestyle/fashion images.

### 6. Featured Products Split
- 50/50 split layout (mobile stacked).
- Left: grey panel with collection title, description, and a horizontal product scroll/swiper.
- Right: large lifestyle image.
- Products: 4 cards with dual-image hover crossfade (use two Unsplash URLs per product).

### 7. Journey / Editorial Blocks
- Grey wrapper, `5px` radius.
- CSS grid: 2 columns desktop, 1 column mobile.
- 3 blocks: badge + title + excerpt + "Read More" link + image.

### 8. Newsletter
- Simple centered section: heading, email input inline with subscribe button.
- Input and button have `border-radius: 5px`.

### 9. Footer
- Grey background.
- 4-column menu grid desktop, stacked mobile.
- Newsletter + social links + legal row.

## Interactions Required

1. **Announcement bar rotation**: rotate messages every 4 seconds with fade/slide. Close button hides bar.
2. **Header scroll behavior**: hide on scroll down, show on scroll up. Add `header--sticky` class when scrolled.
3. **Hero carousel**: autoplay every 5 seconds with fade transition and dot pagination. Pause on hover/touch.
4. **Category tabs**: clicking tab filters/switches visible category cards.
5. **Product card hover**: crossfade between two images on desktop (`opacity` transition).
6. **Scroll fade-in**: elements with `.fade-in` class animate from `opacity: 0; translateY(40px)` to visible when scrolled into view.
7. **Cart drawer**: right-aligned panel, opens from cart icon, closes on backdrop/Escape, locks body scroll, shows items and subtotal.
8. **Mobile menu**: full-screen overlay with accordion submenus.
9. **Smooth hover underlines** on links/CTAs.

## Component Class Names (use these consistently)

- `.announcement-bar`
- `.site-header`, `.header-inner`, `.logo`, `.main-nav`, `.nav-link`, `.header-actions`, `.cart-toggle`, `.cart-badge`
- `.mobile-menu`, `.mobile-menu__overlay`, `.mobile-menu__panel`, `.accordion`
- `.hero`, `.hero__slide`, `.hero__media`, `.hero__content`, `.hero__kicker`, `.hero__title`, `.hero__sub`, `.hero__cta`, `.hero__pagination`
- `.section`, `.container`, `.section-title`, `.eyebrow`
- `.category-tabs`, `.category-tab`, `.category-grid`, `.category-card`
- `.featured-split`, `.featured-split__content`, `.featured-split__image`, `.product-scroll`, `.product-card`, `.product-card__images`, `.product-card__img`, `.product-card__meta`
- `.journey-blocks`, `.journey-block`
- `.newsletter`, `.newsletter__form`, `.newsletter__input`
- `.footer`, `.footer__grid`, `.footer__menu`, `.socials`
- `.cart-drawer`, `.cart-drawer__overlay`, `.cart-drawer__panel`, `.cart-list`, `.cart-item`, `.cart-total`
- `.fade-in`

## Assets
Use Unsplash URLs for all images. Reuse images where appropriate. Each product should have two image URLs for hover crossfade.

## Files to Modify
- `/Users/user/Documents/e-commerce/03-luma-lifestyle/index.html`
- `/Users/user/Documents/e-commerce/03-luma-lifestyle/styles.css`
- `/Users/user/Documents/e-commerce/03-luma-lifestyle/script.js`

## Deliverable
A fully working, responsive landing page that loads without errors and captures the Head Golf premium monochrome sportswear aesthetic.
