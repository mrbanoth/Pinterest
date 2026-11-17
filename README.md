# Pinterest — Visual Discovery & Idea Boards

A modern React + TypeScript Pinterest clone inspired by `in.pinterest.com`, featuring a curated landing showcase, multi-column masonry feed, editorial collections, interactive pin detail studio, user & creator profiles, idea boards, and a pin publishing studio backed by organized JSON mock data.

Maintained by [@mrbanoth](https://github.com/mrbanoth).

---

## Features

- **Landing Showcase (`#/landing`)**: Rotating visual theme hero with a 5-column staggered masonry waterfall, clickable visual search prompts, board previews, and creator studio callout.
- **Home Feed (`#/home`)**: Responsive 2–5 column masonry grid with category filters, feed sorting (*For You*, *Most Saved*, *Following*), live search autocomplete, and hover overlays for quick board saving and link sharing.
- **Explore & Curated Collections (`#/explore`)**: Editorial collection spotlights, category discovery portals, and curated visual stories.
- **Pin Detail Studio (`#/pin/:id`)**: High-resolution split view with fullscreen lightbox zoom, interactive copyable color palette swatches, board picker, like counter, creator follow toggle, studio notes/comments, and related pins.
- **Profile & Boards (`#/profile` / `#/profile/:username`)**: Creator profiles with 3-panel board collage cards, *Boards*, *Created*, and *Saved Pins* tabs, profile editing, and board creation.
- **Board Detail (`#/board/:id`)**: Board management view with pin removal, board editing, privacy toggle (*Secret Board*), and deletion.
- **Create Pin Studio (`#/create`)**: Upload images from your device or choose studio presets, attach categories, tags, destination links, and publish directly to a board.

---

## Project Structure

```text
├── index.html
├── metadata.json
├── package.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── assets/
    │   └── images/           # Curated visual assets
    ├── components/
    │   ├── boards/           # BoardCard, CreateBoardModal
    │   ├── common/           # AuthModal, SafeImage, Toast
    │   ├── layout/           # Navbar, MobileNav
    │   └── pins/             # MasonryGrid, PinCard, SaveToBoardModal
    ├── context/
    │   └── AppContext.tsx    # Hash routing, JSON state & localStorage persistence
    ├── data/                 # Organized JSON mock datasets
    │   ├── boards.json
    │   ├── categories.json
    │   ├── collections.json
    │   ├── notifications.json
    │   ├── pins.json
    │   └── users.json
    ├── pages/                # Landing, HomeFeed, Explore, PinDetail, Profile, BoardDetail, CreatePin
    └── types/
        └── index.ts
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mrbanoth/Pinterest.git
cd Pinterest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app runs on `http://localhost:3000`.

### 4. Type-check & build for production

```bash
npm run lint
npm run build
```

---

## Tech Stack

- **React 19** & **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** icons

---

## Repository

- GitHub: [https://github.com/mrbanoth/Pinterest](https://github.com/mrbanoth/Pinterest)
- Author: [@mrbanoth](https://github.com/mrbanoth)
