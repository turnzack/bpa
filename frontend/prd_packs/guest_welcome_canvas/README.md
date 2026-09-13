# WELCOME CANVAS

A vibrant and colorful welcome landing page built with React, TypeScript, and Vite. It features an animated gradient background, interactive particle canvas, and smooth scroll animations.

## Features

- **Colorful Hero**: Animated gradient background with dynamic color shifts.
- **Interactive Canvas**: Particle network that reacts to mouse movement.
- **Smooth Animations**: Framer Motion for scroll and hover effects.
- **Responsive**: Works on all screen sizes.
- **Dark Mode**: Toggle between light and dark themes.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Build for production: `npm run build`

## Project Structure

```
src/
  components/       # Reusable UI components
  hooks/            # Custom hooks (e.g., useParticleCanvas)
  styles/           # Global styles and CSS variables
  App.tsx           # Main app component
  main.tsx          # Entry point
```

## Design Guidelines

- Use the CSS variables defined in `styles/global.css` for consistent theming.
- Follow the component structure for maintainability.
- Ensure all animations are performant and respect user preferences (prefers-reduced-motion).

## License

MIT