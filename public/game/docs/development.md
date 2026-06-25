# Development & Contribution Guide

This document outlines steps for working on the project and ideas for new features.

## 🛠 Setup

No build tools are required. To start coding:

1. Serve the directory from a local HTTP server (some browsers restrict `file://` audio loading).
2. Edit source files directly in your editor; refresh the browser to see changes.
3. To speed up experimentation, set `DEV_MODE = true` in `src/main.js` and enable `debug` flags in the physics config.

## 📐 Coding Conventions

- ES6 classes are used for scenes and managers.
- Files are named with `PascalCase.js` for classes.
- Managers assume their scene is passed into the constructor and must **not** reference global variables (except `isMusicPlaying` for menu).
- Asset keys are string literals; keep them consistent between preload and usage.

## ✅ Testing New Features

- Add console logs or breakpoints inside manager `update()` methods to trace behaviour.
- Use the Physics debug toggles when `DEV_MODE` is true to inspect hitboxes and bodies.
- To quickly jump between levels during testing, invoke `this.scene.start('GameScene', { level: X });` from the browser console.

## 💡 Feature Ideas

- **Additional Levels**: beach/models, urban, etc. Add sprites, tweak speeds.
- **Power‑ups**: temporary invincibility, speed boosts, double jump, etc.
- **Alternate Endings**: make the `TRUE_ENDING` reachable by collecting a hidden item.
- **Settings Menu**: adjust volume, difficulty, controls.
- **Mobile Support**: add touch controls and scale tweaking.
- **Leaderboard**: store high scores in localStorage.

## 📁 New File Suggestions

- Create new managers (e.g. `PowerUpManager.js`) following the existing pattern.
- Add a `scenes/SettingsScene.js` or `scenes/CreditsScene.js` with simple menus.
- For major refactors, update the documentation in `docs/` and consider adding comments above complex logic.

## 🧼 Clean-up

When clearing or restarting the game, use manager `destroy()` methods if defined. Many managers handle this implicitly when the scene is restarted, but explicit cleanup prevents leaks during hot‑reloading.

> **Tip:** Because the game is small, modularity is your friend. Keep each new feature encapsulated and the scenes file slim.

Happy hacking! 
