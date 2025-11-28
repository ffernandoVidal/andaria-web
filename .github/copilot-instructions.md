# Paseo Andaria - AI Agent Instructions

## Project Overview
Multi-page vanilla JavaScript website for "Paseo Andaria" shopping center in Guatemala. Pure HTML/CSS/JS implementation with no build tools or frameworks - optimized for direct browser execution.

## Architecture & Key Files

### Page Structure (Consistent Pattern)
All pages follow identical navigation structure with active state management:
- **Header**: Fixed navbar with logo + hamburger menu (mobile)
- **Breadcrumbs**: Accessible navigation trail on all internal pages
- **Quick Nav**: Section jump buttons on content-heavy pages
- **Back-to-top**: Auto-appearing scroll button after 300px

**Core Pages**: `index.html` (hero carousel), `tiendas.html` (stores), `eventos.html` (events), `cine.html` (cinema), `nosotros.html` (about), `contactanos.html` (contact)

### Centralized Systems
- **`styles.css`**: Single 2455-line stylesheet with CSS custom properties system
- **`script.js`**: Core UX features - menu, carousel, scroll effects, form validation
- **`cine-script.js`**: Separate cinema-specific functionality (movie data, date selector)

## Design System (CSS Custom Properties)

### Must use these variables - defined in `:root`:
```css
/* Colors from logo */
--primary-orange: #FF6B35   /* CTAs, hover states */
--primary-green: #4CAF50    /* Nature/sustainability elements */
--primary-blue: #1976D2     /* Professional elements */
--accent-light-blue: #03DAC6
--accent-yellow: #FFC107
--dark-blue: #0D47A1        /* Backgrounds, main text */

/* Spacing system - use consistently */
--spacing-xs: 0.5rem
--spacing-sm: 1rem  
--spacing-md: 1.5rem
--spacing-lg: 2rem
--spacing-xl: 3rem

/* Border radius */
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 15px
--radius-xl: 20px

/* Image sizing standards */
--img-logo-sm: 60px
--img-logo-md: 80px
--img-card-height: 200px
--img-gallery-height: 300px
```

**Critical**: Always use these variables instead of hard-coded values.

## Project-Specific Patterns

### Logo Implementation (Reused Across All Pages)
```html
<div class="logo">
    <div class="logo-icon">
        <div class="logo-shapes">
            <div class="shape shape-orange"></div>
            <div class="shape shape-green"></div>
            <div class="shape shape-blue"></div>
        </div>
    </div>
    <div class="logo-text">
        <span class="logo-paseo">Paseo</span>
        <span class="logo-andaria">Andaria</span>
    </div>
</div>
```

### Mobile Menu Pattern
Toggle uses `.active` class on both `#mobile-menu` and `#nav-menu`:
- Prevents body scroll when menu open (`body.style.overflow = 'hidden'`)
- Closes on: link click, Escape key, outside click
- ARIA attributes: `aria-expanded`, `aria-hidden` for accessibility

### Hero Carousel System (`index.html`)
- 11 slides in `images/vistas/` directory (andaria 1-8, actividad 2, actividades 3, actividades noviembre)
- Auto-advance every 5 seconds, pauses on hover/visibility change
- Keyboard navigation: Arrow keys change slides
- Touch/swipe support implemented
- Must sync slide count with indicator dots

### Event Card Pattern
Three types documented in `EVENTOS-OPTIMIZACION.md`:
1. **Featured cards** (`.evento-card-featured`): Large with prominent image
2. **Regular cards** (`.evento-card`): Grid items with badge support
3. **Entertainment cards**: Icon-based for permanent attractions

Always include: date/time with icons, location, lazy-loaded images.

### Cinema Page Special Logic
- Dynamic date selector generates 14 days from today
- Movie data structure defined in `cine-script.js` → `getExampleMovies()`
- **Important**: Direct CORS restriction prevents live Cinestar.com.gt scraping from browser
- See `SINCRONIZACION-CINE-GUIA.md` for backend scraping implementation guide

## Accessibility Requirements

### Must implement on all new pages:
- Skip link: `<a href="#main-content" class="skip-link">`
- Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- ARIA labels on navigation: `aria-label="Navegación secundaria"`, `aria-current="page"`
- Lazy loading: `<img loading="lazy">` on all non-critical images
- Keyboard focus visible: All interactive elements must show `:focus-visible`

## Form Validation Pattern
From `script.js` → `initFormValidation()`:
- Real-time validation on blur
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Visual feedback: `.error` and `.success` classes
- Required fields highlighted before submission

## Performance Optimizations

### Implemented Standards
- **Preload critical CSS**: `<link rel="preload" href="styles.css" as="style">`
- **Font Awesome CDN**: Consistent version 6.0.0
- **Intersection Observer**: For scroll animations and lazy loading
- **Debounce utility**: Available in `window.PaseoAndaria.utils.debounce()`

### Image Handling
- Directory structure: `images/{category}/` (Entretenimiento, Finanzas, Moda, Restaurantes, Tecnologia, eventos, vistas)
- Always use `loading="lazy"` except above-the-fold hero images
- Maintain aspect ratios with `object-fit: cover`

## Responsive Breakpoints
```css
@media screen and (max-width: 768px)  /* Tablets */
@media screen and (max-width: 480px)  /* Mobile */
```
Mobile-first approach: Grid layouts use `auto-fit` with `minmax(350px, 1fr)`

## Development Workflow

### No Build Process
- Direct file editing, no compilation required
- Test by opening HTML files in browser
- Use browser DevTools for debugging

### JavaScript Initialization Pattern
All functionality wrapped in:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    initFunctionName();
});
```

### Utility Functions
Access global utilities via `window.PaseoAndaria.utils`:
- `formatNumber(num)`: Adds thousand separators
- `validateEmail(email)`: Email validation
- `debounce(func, wait)`: Performance optimization for scroll/resize

## Common Pitfalls

1. **Don't use jQuery** - This is vanilla JS only
2. **Don't modify navigation structure** without updating all 6 pages
3. **Cinema sync requires backend** - See `SINCRONIZACION-CINE-GUIA.md` for setup
4. **Avoid inline styles** - Use CSS custom properties from `:root`
5. **Test mobile menu** - Most common breaking point when editing navigation

## Documentation Files
- `README.md`: User-facing project description
- `MENU-INTEGRACION.md`: Navigation system implementation details
- `UX-UI-MEJORAS.md`: Design system improvements log
- `EVENTOS-OPTIMIZACION.md`: Events page optimization guide
- `SINCRONIZACION-CINE-GUIA.md`: Cinema data synchronization technical guide

## Testing Checklist for New Features
- [ ] Mobile menu toggle works
- [ ] Navigation active states correct
- [ ] Breadcrumbs link properly
- [ ] Images lazy load
- [ ] Responsive on 768px and 480px breakpoints
- [ ] Keyboard navigation functional
- [ ] No console errors
- [ ] ARIA attributes present
