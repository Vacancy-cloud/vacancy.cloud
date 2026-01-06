# Vacancy.Cloud

A modern single-page React website for Vacancy.Cloud - an AI-powered platform for managing vacant and underutilized buildings in Denmark.

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Mapbox GL JS** for interactive maps

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── InteractiveDemo.tsx
│   ├── MapboxMap.tsx
│   ├── BuildingCard.tsx
│   ├── ReportModal.tsx
│   ├── Technology.tsx
│   ├── Team.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── data/               # Static data
│   └── buildings.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── smoothScroll.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Features

- ✅ Responsive design (mobile-first)
- ✅ Interactive Mapbox map with building markers
- ✅ Smooth scroll navigation
- ✅ Contact form with validation
- ✅ Accessible markup (ARIA labels, semantic HTML)
- ✅ Modern SaaS design aesthetic

## Building Data

The app includes 5 building examples:
1. Toldbygning Padborg
2. Kontorejendom Næstved
3. Herregård Rønde
4. Industribygning Kolding (placeholder)
5. Kontorbygning Aarhus (placeholder)

## Mapbox Configuration

The Mapbox access token is configured in `src/components/MapboxMap.tsx`. To use your own token, update the `mapboxgl.accessToken` value.

## License

© 2025 Vacancy.Cloud. All rights reserved.


