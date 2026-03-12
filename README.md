# ♛ N Queens Game

<div align="center">

![N Queens Game](https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=for-the-badge&logo=pwa&logoColor=white)

**A polished, interactive N-Queens puzzle game with an AI solver and beautiful dark UI.**

[Play Now](#how-to-run-locally) · [Report Bug](https://github.com) · [Request Feature](https://github.com)

</div>

---

## 📖 Description

**N Queens** is a classic logic puzzle where you must place **N chess queens** on an **N×N board** such that no two queens threaten each other — no two queens share the same row, column, or diagonal.

This web implementation brings the puzzle to life with a **glassmorphic dark UI**, real-time conflict highlighting, a visual backtracking AI solver, smart hints, difficulty modes, and a built-in timer — all wrapped in a production-quality design.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎮 **Interactive Board** | Click any square to place or remove a queen |
| ⚡ **AI Solver** | Animated visual backtracking solver shows the algorithm in action |
| 👣 **Solve Step** | Place one correct queen at a time |
| 💡 **Smart Hints** | Highlights the next valid queen position from the solution |
| 🔴 **Conflict Detection** | Instantly highlights queens that are attacking each other |
| 🏆 **Best Time Tracker** | Persists your fastest solve time per board size via localStorage |
| ⏱️ **Live Timer** | Starts on first move, pauses on win |
| 🔔 **Sound Effects** | Audio feedback for placing, removing queens, and winning |
| 🎯 **Difficulty Modes** | Beginner (full help), Normal (hints + conflicts), Expert (no hints/conflicts) |
| 📐 **Board Sizes** | Choose from 4×4 up to 12×12 |
| 📱 **Fully Responsive** | Adapts to any screen size from mobile to desktop |
| 🌑 **Tab Detection** | Changes browser tab title when you switch away |
| 📲 **PWA Support** | Installable on any device — works offline after first load |

---

## 🛠 Technologies Used

- **[Next.js 16](https://nextjs.org/)** — React framework with App Router
- **[React 19](https://react.dev/)** — UI rendering and state management
- **[TypeScript 5](https://www.typescriptlang.org/)** — Type-safe game logic
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first styling
- **[next-pwa 5](https://github.com/shadowwalker/next-pwa)** — Service worker & PWA manifest integration
- **Custom CSS** — Keyframe animations, glassmorphism, glow effects
- **Web Audio API** — Sound effects via `<audio>` elements
- **localStorage** — Persisting personal best times

---

## 🧠 How the Game Works

The **N-Queens problem** is a combinatorial constraint satisfaction puzzle:

1. **Goal:** Place exactly N queens on an N×N chessboard
2. **Constraint:** No two queens may share a row, column, or diagonal
3. **Solution:** There is at least one valid solution for every N ≥ 4

### The AI Solver

The built-in solver uses **recursive backtracking**:

```
Place queen in row 0, column 0..N-1 (first safe column)
  → Recurse to next row
  → If conflict → backtrack and try next column
  → If all rows filled → solution found!
```

The **visual solver** (`Solve` button) animates each placement and backtrack step with a 200ms delay, letting you watch the algorithm think in real time.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18 or later
- npm / yarn / pnpm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/n-queens-game.git
cd n-queens-game

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser
# Navigate to http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📲 PWA — Install as an App

This game is a fully installable **Progressive Web App (PWA)**. After building for production, browsers will offer an "Install" prompt.

### What this means
- **Offline support** — The service worker caches all assets on first load; you can play without an internet connection afterwards
- **Install to home screen** — Works on Android, iOS (via Safari > Share > Add to Home Screen), and desktop Chrome/Edge
- **App-like experience** — Launches in `standalone` mode (no browser chrome), with theme colour `#7c3aed` and a custom splash background `#050b18`

### Key PWA files

| File | Purpose |
|---|---|
| `next.config.ts` | Wraps Next.js config with `next-pwa` (disabled in dev) |
| `public/manifest.json` | Web App Manifest — name, icons, theme colour, display mode |
| `next-pwa.d.ts` | TypeScript declaration for `next-pwa` module |
| `public/sw.js` *(auto-generated)* | Service worker produced by `next-pwa` at build time |

> **Note:** PWA features (service worker, caching) are **disabled in development** (`NODE_ENV=development`) to keep hot-reload working. Run `npm run build && npm start` to test the full PWA experience locally.

### Icon requirements

The manifest references two icon files that you should place in `/public/`:

```
public/
├── web-app-manifest-192x192.png
└── web-app-manifest-512x512.png
```

Generate them from any 512×512 source image using tools like [Favicon.io](https://favicon.io) or [RealFaviconGenerator](https://realfavicongenerator.net).

---

## 🎮 Controls

| Action | How |
|---|---|
| Place / remove a queen | Click a board square |
| Get a hint | Click **💡 Hint** button |
| Place one correct queen | Click **→ Step** button |
| Watch AI solve | Click **⚡ Solve** button |
| Reset the board | Click **↺ Reset** button |
| Change difficulty | Use the **Difficulty** dropdown |
| Change board size | Use the **Board** dropdown |

---

## 🎨 Design System

The UI is built around a **dark glassmorphism aesthetic** inspired by Chess.com and NYT Games:

- **Background:** Animated deep-space gradient with floating orbs
- **Container:** Frosted glass card with violet glow border
- **Board tiles:** Warm chess-wood tones (`#e2c99f` light / `#b58863` dark)
- **Conflict tiles:** Red highlight with CSS `shake` animation
- **Hint tiles:** Amber glow with infinite pulse animation
- **Queen entry:** Scale+rotate pop animation (`queenPop` keyframe)
- **Solved state:** Gradient shimmer celebration banner
- **Typography:** Geist Sans (Next.js default) — clean and modern

---

## 🔮 Future Improvements

- [ ] **Multiple Solutions** — Browse all valid solutions for a given N
- [ ] **Custom Themes** — Light mode, high-contrast, neon theme
- [ ] **Leaderboard** — Online scoreboard via Supabase or Firebase
- [ ] **Puzzle Mode** — Pre-placed queens that constrain your solution
- [ ] **Undo/Redo** — Move history with keyboard shortcuts (Ctrl+Z)
- [ ] **Tutorial Mode** — Guided step-by-step walkthrough for beginners
- [ ] **Touch Drag** — Drag queens around the board on mobile
- [ ] **Accessibility** — Full keyboard navigation and ARIA labels

---

## 👤 Author

<div align="center">

**Your Name**

[![GitHub](https://img.shields.io/badge/GitHub-%40your--username-181717?style=flat&logo=github)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0a66c2?style=flat&logo=linkedin)](https://linkedin.com/in/your-profile)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blueviolet?style=flat)](https://your-site.com)

*Built with ♛ and TypeScript*

</div>

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

⭐ If you enjoyed this project, please give it a star!

</div>
