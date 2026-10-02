# WM Sofa Maker — Premium Demo Website

Designer & custom sofas · Moradabad, Uttar Pradesh, India.

## Run locally

No build step. Open `index.html` directly, or serve the folder:

```powershell
# Windows PowerShell
python -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
/
├── index.html          # Complete single-page experience (hero → contact)
├── about.html          # Studio story + Moradabad
├── collections.html    # All 8 collection categories
├── custom-sofas.html   # Interactive configurator (fabric / colour / config / comfort)
├── craftsmanship.html  # 4-stage craft story with sticky visual
├── gallery.html        # Masonry gallery + lightbox
├── contact.html        # Enquiry form + contact placeholders
├── css/styles.css      # Design system (ivory / charcoal / champagne)
├── js/main.js          # Vanilla JS + GSAP progressive enhancement
├── assets/logo/wm-logo.png  # ORIGINAL client logo (unmodified)
├── robots.txt / sitemap.xml
```

## Logo

The original `wm logo.png` was preserved untouched at `assets/logo/wm-logo.png`.
It is presented in a dark cinematic crop (navbar / footer) so the gold-on-dark
emblem stays legible — the file itself was never redesigned or recoloured.

## Before handover to the owner

Replace these clearly-marked editable placeholders:

- `[CLIENT PHONE]` → real phone, plus `tel:+91XXXXXXXXXX` links
- `[CLIENT WHATSAPP]` → real number, plus `https://wa.me/91XXXXXXXXXX` links
- `[CLIENT EMAIL]` → real email
- Exact showroom address + map embed (currently a labelled placeholder)
- `https://www.wmsofamaker.in/` canonical / sitemap URLs
- Social links (`#` placeholders in footer)

## Notes

- No fake awards, statistics, reviews or rankings anywhere on the site.
- Product names (The Monarch, Nova, Arden, Luna, Orion, Vela) are fictional demo catalogue entries.
- Imagery: Unsplash CDN with lazy-loading; hero image is eager + high priority.
- Respects `prefers-reduced-motion`; keyboard-accessible menu, lightbox and form.
