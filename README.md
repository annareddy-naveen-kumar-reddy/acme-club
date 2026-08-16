# ACME Club Website

A modern, premium, and fully responsive website for **ACME Club**, built with clean semantic HTML5, modern CSS3 (Custom Properties & Glassmorphism), and vanilla JavaScript.

---

## 📁 Project Structure

```
ACME Club/
├── index.html              # Main website structure with all 11 sections & interactive modals
├── README.md               # Quick editing & customization guide
├── css/
│   ├── variables.css       # Design tokens (colors, gradients, typography scale, radii)
│   ├── styles.css          # Core layouts, glassmorphism cards, micro-interactions
│   └── responsive.css      # Desktop, tablet, and mobile responsiveness
├── js/
│   ├── main.js             # Sticky navbar, scroll spy, active links, modals, counters
│   ├── canvas-tech.js      # Interactive innovation particle network canvas for Hero
│   └── gallery-modal.js    # Accessible gallery Lightbox with keyboard & swipe navigation
└── assets/
    ├── logo.svg            # ACME Club vector logo placeholder
    └── images/             # Vector placeholder cards for events, team, and gallery
```

---

## 🚀 How to Customize & Add Real Content

### 1. Replacing the Logo
- Place your official logo in `assets/logo.svg` or `assets/logo.png`.
- Search for `assets/logo.svg` in `index.html` (Navbar, Hero, and Footer) and update the file path if needed.

### 2. Editing Text & Information
- All placeholders in `index.html` are marked with `[Square Brackets]` and clear `<!-- EDIT: ... -->` comments.
- **Hero & About**: Update the mission statement and 4 pillar highlights.
- **Events**: Modify titles, dates, descriptions, or duplicate the `<article class="event-card">` block to add more events.
- **Team**: Update names, roles, bios, and social links in the `<article class="team-card">` blocks.
- **Highlights / Counters**: Change the `data-target="500"` attribute on the `.stat-number` elements to adjust the numbers.
- **Contact Details**: Update the email, phone, campus room number, and social media URLs.

### 3. Adding Real Photos
- **Gallery**: Replace the placeholder SVGs in `assets/images/gallery-*.svg` with real club event photos (`.jpg`, `.png`, `.webp`) and update the `src` and `data-full-src` in `index.html`.
- **Team Avatars**: Replace `avatar-1.svg` to `avatar-5.svg` with member profile pictures.
- **Events**: Replace `event-1.svg` to `event-3.svg` with event flyers or photos.

### 4. Customizing Theme Colors
- Open `css/variables.css` to adjust accent colors (Cyan `#00D2FE`, Blue `#3B82F6`, Indigo `#6366F1`, etc.).

---

## ✨ Features Included
- **Sticky Glass Navbar** with reading scroll progress indicator.
- **Interactive Tech Canvas** background that dynamically reacts to mouse and touch.
- **Scroll-Triggered Animated Statistics Counters**.
- **Interactive Event Details Modal** (`<dialog>`).
- **Interactive Membership "Join Us" Application Modal**.
- **Full-Featured Accessible Lightbox Modal** for the gallery with `ESC` and keyboard arrow navigation.
- **Validated Contact Form** with toast notifications.
- **Zero Horizontal Overflow** & 100% mobile-friendly responsive layout.
