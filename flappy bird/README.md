# Flappy Face – Smile-controlled Flappy Bird

A playful Flappy Bird variant where your smile is the controller. The wider you smile, the higher you fly. Built with React + Vite, Tailwind for UI, and an Express + MongoDB backend for the leaderboard.

## Frontend (React + Vite)

- Home Page
  - Hero section with playful gradient, CTA buttons (Play Now, How it Works)
  - Instructions written for smile-based controls (smile to lift, relax to glide)
  - Top 10 leaderboard preview fetched from backend
  - Responsive layout with mobile-first tweaks
- Game Page
  - Two-column layout (desktop):
    - Left: fixed-width camera preview (fills container), current score, best score, and leaderboard
    - Right: Flappy game canvas and controls
  - Mobile (< sm): game on top, then camera + scores + leaderboard
  - Tailwind-powered UI with consistent card widths and subtle hover/blur effects
- Camera & Face Overlay
  - `WebcamView` fills its parent (object-fit: cover) and overlays a mirrored face-box canvas
- Navigation
  - Fixed top navbar with active link underline for current route
- Routing
  - `/` → Home
  - `/play` → Game

### Key Frontend Files

- `src/components/HomePage.jsx`: Home hero, instructions, leaderboard preview, footer
- `src/components/GamePage.jsx`: Game layout (camera/score/leaderboard + game canvas)
- `src/components/GameCanvas.jsx`: Canvas drawing of the game
- `src/components/WebcamView.jsx`: Full-bleed webcam and face-box overlay
- `src/components/NavBar.jsx`: Top navigation with active underline
- `src/components/GameUI.jsx`: Start button, name input, and model-ready state
- `src/hooks/useGameLogic.js`: Game physics, scoring, collisions, and posting score
- `src/hooks/useFaceApi.js`: Face detection callbacks (jump trigger)
- `src/api.js`: `fetchLeaderboard()` and `postScore(name, score)`

## Backend (Express + MongoDB)

- REST API
  - `GET /api/leaderboard` → returns top scores (sorted desc, limited to 10)
  - `POST /api/leaderboard` → add a `{ name, score }` record
- Data Model
  - `Score` schema: `{ name: String (required, max 15), score: Number (required) }` with timestamps
- Server Setup
  - `server/server.js` registers the leaderboard routes and connects to MongoDB
  - `server/routes/leaderBoard.js` contains the GET/POST logic
  - `server/models/Score.js` defines the schema

## Running Locally

### Frontend

```bash
cd "flappy bird"
npm install
npm run dev
```

### Backend

```bash
cd ../server
npm install
npm start
```

Ensure `server` has access to a running MongoDB instance and CORS allows `http://localhost:5173` (or your Vite port).

## Notes

- Tailwind is enabled via `@tailwindcss/vite` and `@import "tailwindcss";` in `src/index.css`.
- The Home page shows only the first 10 leaderboard entries.
- Best Score on the Game page updates live from your current run and seeds from the leaderboard.
