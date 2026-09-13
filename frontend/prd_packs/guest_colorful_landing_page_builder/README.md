# COLORFUL LANDING PAGE BUILDER

## Overview
A modern, colorful landing page builder that allows users to create stunning landing pages with drag-and-drop components, real-time preview, and customizable color themes. Built with React, TypeScript, and Vite.

## Features
- **Drag-and-Drop Editor**: Intuitive drag-and-drop interface for adding and arranging components.
- **Real-Time Preview**: See changes instantly as you edit.
- **Color Themes**: Choose from a variety of vibrant color palettes or create custom ones.
- **Responsive Design**: Ensure your landing page looks great on all devices.
- **Export**: Export your landing page as HTML/CSS or a React component.
- **Dark Mode**: Toggle between light and dark modes for the editor.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, CSS Modules
- **State Management**: Zustand
- **Backend (optional)**: Node.js, Express
- **Database (optional)**: MongoDB

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Build for Production
`npm run build`

## Project Structure
```
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Main pages (Editor, Preview, etc.)
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── App.tsx
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

## Architecture
- **State Management**: Zustand for global state (components, themes, etc.)
- **Component System**: Each landing page component is a React component with props for customization.
- **Theme System**: CSS variables for colors, easily switchable.
- **Export Functionality**: Generate HTML/CSS from the component tree.

## Contributing
Contributions are welcome! Please read the contributing guidelines.

## License
MIT