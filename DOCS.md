# Portfolio Documentation

## Animation Systems

This portfolio uses 6 animation systems:

| System | Component | Usage |
|--------|-----------|-------|
| GSAP | `GSAPHero` | Hero timeline, parallax |
| Anime.js | `AnimeStagger` | Staggered list reveals |
| Lottie | `LottiePlayer` | Vector animations |
| AOS | `AOSInit` | Simple scroll reveals |
| ScrollReveal | `ScrollRevealWrapper` | Grid reveals |
| DiagramReveal | `DiagramReveal` | Image mask reveals |

## Quick Usage

### AOS (Simple)
```tsx
<div data-aos="fade-up">Content</div>
<div data-aos="fade-up" data-aos-delay="200">More content</div>
```

### AnimeStagger
```tsx
<AnimeStagger>
  <div className="anime-item">Item 1</div>
  <div className="anime-item">Item 2</div>
</AnimeStagger>
```

### ScrollReveal
```tsx
<ScrollRevealWrapper className="grid grid-cols-3 gap-8">
  <div className="sr-elem">Item 1</div>
  <div className="sr-elem">Item 2</div>
</ScrollRevealWrapper>
```

## Reduced Motion

Toggle with `useReducedMotion` hook. All animations respect user preference.

## Database Schema

See `supabase_schema.sql` for complete database structure.

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:3000
