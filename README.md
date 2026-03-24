# Patus Klei

A retro‑styled endless runner built with **Phaser 3**. This repository contains the core game logic, assets, and a simple web landing page. The game is the heart of the project — the `index.html`/`game.html` files are just wrappers to launch it.

---

## 🚀 Getting Started

1. **Open in browser**
   - Simply open `game.html` in your browser (no server needed).
   - For development you can use a lightweight HTTP server (e.g. `npx http-server` or `python -m http.server`).

2. **Project layout**
   ```text
   /assets         # images/fonts/audio used by the game
   /managers       # reusable classes for players, obstacles, UI, etc.
   /scenes         # Phaser scenes (MenuScene, GameScene)
   /src            # entrypoint (main.js)
   index.html      # landing page (mini site)
   game.html       # game launch page
   style.css       # global styles
   ```

3. **Dependencies**
   - [Phaser 3](https://phaser.io/) is loaded via CDN in `game.html`.
   - No build step; plain JavaScript, assets shipped directly.

---

## 🎮 Game Overview

Patus Klei is an arcade runner where you control the titular hero through three levels: **Beach**, **City**, and **Boss**. Collect coins, avoid obstacles, and defeat the boss by throwing dynamite.

Controls:

- **Spacebar** = jump
- **Down arrow** = duck (levels 2 & 3)

Lore screens provide story snippets between levels. Music can be toggled from the main menu.

Scoring and UI are handled by `UIManager`. The game features sound effects, background music, and modular level tweaking.

---

## 🧱 Architecture (see `docs/architecture.md`)

High‑level code organization:

- **Scenes** (`MenuScene`, `GameScene`) orchestrate flow and user interaction.
- **Managers** encapsulate subsystems like player, obstacles, background, level logic, coins and finish line.
- `src/main.js` configures Phaser and bootstraps the game.
- Assets are grouped by type under `/assets`.

These abstractions make it easy to extend the game: add new levels, swap sprites, or tweak physics without modifying core loop logic.

---

## 🌱 Contributing & Extending (see `docs/development.md`)

Looking to add features? You're in the right place! A few directions:

- New obstacle types or enemy behaviours via `ObstacleManager`.
- Additional player abilities (double jump, power‑ups) by enhancing `PlayerManager`.
- New scenes (settings, about, extras) based on the existing `MenuScene` pattern.
- Level design tweaks: change speeds, obstacle counts, spawn logic in `LevelManager`.

The existing managers provide hooks for initialization, update loops, and cleanup.

---

## 📄 Additional Documentation

- [Game Play Details](docs/game-play.md)
- [Architecture Notes](docs/architecture.md)
- [Development & Contribution Guide](docs/development.md)

Enjoy building on Patus Klei — and happy coding! 👾
