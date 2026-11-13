# Flour & Fire — Cinematic Bakery Website Prototype

A **working HTML/CSS/JavaScript** prototype of a cinematic bakery storefront. The camera travels through four continuous, scroll-linked visual acts, with live clickable hotspots on ingredients, process details, and individual products.

## Try it

1. Open `index.html` in Chrome, Safari, Firefox or Edge (a local browser tab works; no installation needed).
2. Scroll or swipe **down**. The scene stays pinned while photography, lighting, flour dust, headings and camera position are coordinated with scroll progress.
3. Click or tap any animated `+` hotspot; product information opens in a side panel.
4. Add products to the mock basket, change quantities, and copy a text summary. Basket quantities persist across refreshes in this browser.
5. Use the chapter scrubber along the bottom to jump to a specific chapter.

## Included

- `index.html` — semantic site sections and dialogs
- `styles.css` — polished art direction, mobile responsive styles, scrolling UI, and visual effects
- `script.js` — scroll timeline, zoom/cross-fade choreography, particle dust, hotspots, cart, persistence

## Important notes

- **This is a functional visual prototype, not a finished bakery e-commerce platform.** Prices, brand and products are illustrative. No payments, genuine checkout or real order submission.
- Visual background and product photos are **bundled local images**, so the full experience works offline. They are generated concept visuals. For production-level continuity, replace the four stills with matched scene/video renders or real brand photography.
- The four bundled images are crossfaded and zoomed using browser rendering. To achieve seamless cinematic *object transformation* or physically continuous camera motion on a final site, replace the photographic backgrounds with matched render sequences or a single scroll-scrubbed video/image sequence; keep the HTML product hotspots as separate live layers.
- A full commercial launch would require a product database, inventory, payment provider, GDPR/cookie review, and accessibility/performance testing.

## How to customise

- Brand and page text: `index.html`
- Scene photos: `assets/scene-*.webp` and their `.scene-photo` inline `background-image` paths in `index.html`
- Scene timings: thresholds in `script.js`, in `render()` and each hotspot's `data-from` / `data-to`
- Product names, prices, descriptions and images: `products` object in `script.js`
- Hotspot locations: `--x` and `--y` on `.hotspot` buttons in `index.html` (mobile overrides in CSS)
- Colour palette: `:root` in `styles.css`

## Reference and image licence

All images in `assets/` are generated illustration-style concept photography, intended for prototype demonstration. They are not photographs of a real bakery.

## Deploy to GitHub Pages

This package is GitHub Pages ready: `index.html` belongs at the root of the repository, next to `styles.css`, `script.js`, and the `assets/` folder. The `.nojekyll` file is included to serve files as static assets without Jekyll processing.

1. Create a new public GitHub repository (or use an existing repository).
2. **Extract the ZIP first.** Upload the extracted contents directly to the repository's root. Do **not** upload the ZIP as a single file and do **not** keep everything inside an extra parent folder.
3. Commit the files to the default branch (`main`, if you choose that branch name).
4. Open repository **Settings → Pages → Build and deployment → Source: Deploy from a branch**. Select your default branch and `/(root)` folder, then save.
5. Your site will be published at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/` (or the repository's Pages URL shown in Settings → Pages).

For a user/organization site repository exactly named `YOUR-USERNAME.github.io`, the site is served at `https://YOUR-USERNAME.github.io/` instead.

**Technical limits:** This is a static demo and needs no build step or server. The basket is stored only in the visitor's browser, not as an actual account or order. Do not promise customers an actual checkout or purchase.
