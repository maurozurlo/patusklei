# Game Play Details

This page explains how the game behaves from a player and designer point of view.

## 🎯 Objectives

- Reach the finish line for each level before running out of time or colliding
- Collect coins to increase score
- In level 3 (boss fight), dodge the boss's attacks and survive until RMK's entrance — see `BossManager`

The game ends in failure on collision with an obstacle, or losing all hearts in the boss fight. A game over screen appears and the player can restart.

## 🕹 Controls

- **Space** &nbsp;–&nbsp; Jump
- **Down arrow** &nbsp;–&nbsp; Duck (only available from level 2 onward)
- **Pointer** &nbsp;–&nbsp; Click/tap buttons in menus

The main menu also lets you toggle music &#x1F50A;.

## 📦 Scoring & Progression

- Coins spawn periodically; value managed by `CoinManager`.
- Score is six‑digit zero‑padded and updated through `UIManager.updateScore()`.
- Level transitions occur via lore screens in `MenuScene`.
- `LevelManager` controls obstacle speed, spawn intervals, and when the finish line is added.

## 💡 Lore & Themes

Three scripted text screens lead into each level:

1. `LEVEL_1_LORE` – beginning
2. `LEVEL_2_LORE` – arrival in Cle city
3. `BOSS_LORE` – intro to Lars Wampiola

Beating the boss plays a good/bad ending sequence (`LORE_SEQUENCES` in
`data/Lore.js`, chosen by peppers collected — see `Save.isGoodEnding()`),
then a credits roll, back to the main menu.

A hidden `TRUE_ENDING` exists in the code but isn't currently reachable – an easy place to add an easter egg.

## 📊 Technical Notes

- Gravity, jump velocity, and hitboxes are configured per level in `PlayerManager`.
- Backgrounds, obstacles, and other visual elements are handled by dedicated managers; each manager exposes `preload()`, `setup()`, `update()`, and cleanup helpers.
- The game runs at a fixed 320×200 resolution with pixel art style, using Phaser's `pixelArt` mode.

## 🎨 Assets & Audio

Assets live under `/assets` and are referenced by key in the preload step of `GameScene`. Audio includes several SFX and a looping BGM for level 1.

---

Curious where a mechanic lives? Search for the manager class name in the codebase — almost every system is encapsulated that way.