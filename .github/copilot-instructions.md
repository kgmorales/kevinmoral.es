# AI Developer Guide for kevinmoral.es

This is a **Next.js 12 personal portfolio/blog** with MDX content, gaming integrations, and real-time APIs. The architecture follows atomic design principles with performance optimizations via Preact aliasing in production.

## Architecture Overview

### Core Stack

- **Next.js 12** with custom webpack config for SVG imports and Preact aliasing
- **MDX Blog System**: Content lives in `data/blog/posts/` with `mdx-bundler` for processing
- **Redis Caching**: Live data from Spotify/Gaming APIs cached via `ioredis`
- **Tailwind CSS** with custom theme in `tailwind.config.js`

### Component Organization (Atomic Design)

```
components/
├── atoms/           # Basic UI elements (Link, Image, Button, etc.)
├── molecules/       # Composed components (Card, Hero, MobileNav)
├── organisms/       # Complex sections (live-game/, purdue/)
└── LayoutWrapper.js # Main layout with sticky header logic
```

## Key Patterns & Conventions

### 1. Data Management

- **Site metadata**: Centralized in `data/siteMetadata.js` - update here for global changes
- **Static data**: Projects (`data/projectsData.js`), navigation (`data/headerNavLinks.js`)
- **Blog content**: MDX files in `data/blog/posts/` with frontmatter metadata

### 2. External API Integration

- **Gaming APIs**: `lib/gaming/` handles Xbox/PlayStation data with error handling via `Promise.allSettled`
- **Spotify**: `lib/spotify/spotify.js` with fallback to last-played when nothing current
- **Caching**: All external APIs cache responses in Redis (5-10 min TTL)

### 3. MDX Processing Pipeline

- Located in `lib/mdx/mdx.js` with extensive remark/rehype plugins
- **Key features**: TOC generation, code titles, math equations (KaTeX), syntax highlighting
- **Images**: Custom `remark-img-to-jsx` converts markdown images to Next.js `Image` components

### 4. Custom Components

- **Link component**: `components/atoms/Link.js` handles internal/external routing
- **Gaming widgets**: Live data components in `components/live-game/` and `components/purdue/`
- **Framer Motion**: Animations defined in `lib/animation/FramerMotionVariants.js`

## Development Workflows

### Environment Setup

```bash
npm run dev        # Development server with hot reload
npm run start      # Development with file watching (uses socket.io)
npm run build      # Production build + sitemap generation
```

### Content Creation

- **Blog posts**: Create `.mdx` files in `data/blog/posts/` with proper frontmatter
- **Projects**: Update `data/projectsData.js` array with new portfolio items
- **Pages**: Standard Next.js pages in `pages/` directory

### Styling Approach

- **Tailwind-first**: Custom utilities in `css/tailwind.css`
- **Component-specific**: CSS modules for complex components (`.module.css` files)
- **Dark theme**: Uses `next-themes` with class-based theming

## Critical Integration Points

### Redis Configuration

- **Required env**: `REDIS_URL` for caching external API responses
- **Key patterns**: `gamerData`, `psn_refresh_token`, `spotify_*`
- **TTL strategy**: 5-minute cache for live data, longer for static content

### External API Keys

- **Spotify**: Requires `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`
- **Gaming**: PSN refresh tokens stored/retrieved from Redis automatically
- **Analytics**: Google Analytics via `GOOGLE_ANALYTICS_GID`

### Security Headers

- Comprehensive CSP in `next.config.js` allows specific external domains
- **Image domains**: Spotify, Xbox, PlayStation, YouTube domains whitelisted

## Performance Optimizations

### Production Aliasing

- **React → Preact**: Automatic aliasing in production builds reduces bundle size
- **Image optimization**: Next.js `Image` component with external domain whitelist
- **Bundle analysis**: Run `npm run analyze` to examine bundle composition

### Caching Strategy

- **API routes**: Set appropriate cache headers (`Cache-Control`)
- **Static assets**: Cached for 1 year via security headers
- **Redis**: External API responses cached to reduce rate limiting

## Common Gotchas

1. **MDX imports**: Components auto-sourced from `components/` directory during bundling
2. **SVG handling**: Custom webpack loader converts SVGs to React components
3. **Windows compatibility**: ESBuild path handling in `lib/mdx/mdx.js`
4. **Gaming APIs**: Error handling crucial due to rate limits and token expiration
5. **Responsive design**: Mobile-first approach with `MobileNav` component for mobile menu

When adding new features, maintain the atomic design structure and ensure external APIs include proper error handling and caching via Redis.
