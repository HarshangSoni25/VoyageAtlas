# Voyage / Atlas

[![Live Demo](https://img.shields.io/badge/Live-Demo-0ea5e9?style=for-the-badge)](https://harshangsoni25.github.io/VoyageAtlas/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Powered by Vite](https://img.shields.io/badge/Powered%20by-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

Voyage / Atlas is a cinematic, interactive travel experience built as a single-page React application. It turns destination discovery into a spatial journey, using a realistic interactive Earth as the main exploration interface and combining immersive visuals, animation, destination stories, video, galleries, and location information in one experience.

## Live Website

**https://harshangsoni25.github.io/VoyageAtlas/**

## About the Project

Voyage / Atlas was designed to feel more like an interactive digital atlas than a traditional travel website.

The homepage uses a 3D Earth as the central exploration system. Users can discover destinations, move between places without full-page reloads, and open a cinematic destination experience with animated storytelling and destination-specific media.

The current destination collection includes:

- Edinburgh
- Lauterbrunnen
- Hallstatt
- Santorini
- Eguisheim
- Mount Fuji
- Portofino

## Main Features

### Interactive 3D Earth
- Realistic Earth rendering using Three.js.
- Day, night-map, and cloud textures.
- Automatic globe rotation.
- Interactive manual globe control through click/drag interaction.
- Destination markers connected to the global exploration experience.

### Cinematic Destination Experiences
- Single-page destination transitions without traditional multi-page navigation.
- Destination-specific hero imagery and information.
- Automatic story progression.
- Cinematic text and particle-based reveal effects.
- Avengers: Endgame-inspired dust/particle reconstruction style for major destination titles.
- The particle reveal is triggered again when a different destination is opened.

### Destination Media
- Destination-specific videos.
- Image galleries.
- Responsive media layouts.
- Autoplay, muted, looping destination video experiences where supported.
- Destination-specific content instead of unrelated shared media.

### Discovery & Navigation
- Destination search.
- Index-based destination navigation.
- Return-to-world interaction.
- Internal SPA navigation without full browser page reloads.

### Responsive Experience
Designed to adapt across:
- Desktop
- Laptop
- Tablet
- Mobile

The interface is structured to preserve readability, imagery, and interaction across different screen sizes.

### Performance & Accessibility Considerations
- Vite production builds.
- Lazy/deferred media handling where appropriate.
- Reduced-motion consideration for animated UI.
- Responsive layouts and controlled animation.
- Generated production files kept separate from source assets.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript (ES6+)
- HTML5
- CSS3

### 3D & Visuals
- Three.js
- Custom particle/dust animation effects
- Earth texture maps
- Video and image media

### Deployment
- GitHub
- GitHub Pages
- GitHub Actions
- Vite production build

## Project Structure

```text
VoyageAtlas/
├── public/
│   └── assets/
│       ├── destination images
│       ├── destination videos
│       ├── Earth textures
│       └── background media
├── src/
│   ├── main.jsx
│   └── styles.css
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── .gitignore
```

## Running the Project Locally

Clone the repository:

```bash
git clone https://github.com/HarshangSoni25/VoyageAtlas.git
cd VoyageAtlas
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173/
```

## Production Build

Create a production build with:

```bash
npm run build
```

The generated production files are created inside:

```text
dist/
```

`dist/` and `node_modules/` are excluded from Git because they are generated/dependency directories.

## Deployment

The project is configured for GitHub Pages deployment using GitHub Actions.

When changes are pushed to the `main` branch:

1. Dependencies are installed.
2. The Vite project is built.
3. The generated `dist/` directory is packaged.
4. GitHub Pages deploys the production build.

## Design Direction

Voyage / Atlas focuses on:

- Cinematic travel storytelling
- Spatial navigation
- Realistic 3D visuals
- Minimal futuristic UI
- Strong typography
- Motion and depth
- Destination-focused imagery
- Smooth single-page transitions

The goal is to create a travel website that feels immersive and exploratory rather than like a conventional collection of destination cards.

## Destination Content

Each destination uses its own imagery, video, story content, and location information. The project is structured around a shared destination experience so that all locations maintain a consistent visual system while keeping destination-specific media and information.

## Credits

Built by **Harshang Soni** as a frontend/interactive web project.

## License

This repository is intended as a personal project/portfolio project. Check the licensing and usage rights of any third-party images, videos, fonts, or other external assets before redistributing them.
