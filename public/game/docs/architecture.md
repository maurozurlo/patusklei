# Architecture Overview

This section helps developers understand the code structure and how different parts of the game interact.

## 🗂 Folder Structure

- **`/assets`** – images, fonts, audio
- **`/scenes`** – Phaser `Scene` classes
- **`/managers`** – encapsulated subsystems that manage game entities and behavior
- **`/src`** – entrypoint (`main.js`) which bootstraps Phaser

## 🔁 Core Flow

1. `main.js` creates the Phaser game using `config` and specifies the scenes.
2. Game starts in `MenuScene`:
   - Displays main menu, lore, or game over based on `menuKey`.
   - Transitions to `GameScene` with level data.
3. `GameScene` is responsible for initializing managers, handling the main update loop, and routing collisions.
4. Managers communicate only with their owning scene and expose simple APIs.
   Typical lifecycle methods are:
   ```js
   preload()   // load assets
   setup()     // create sprites/groups/animations
   update()    // called by GameScene.update if needed
   cleanup()   // destroy objects when switching or resetting
   ```

## 🧩 Key Managers

- **`BackgroundManager`** – parallax backgrounds per level
- **`PlayerManager`** – player sprite, animations, input handling, effects
- **`ObstacleManager`** – dynamic spawning of obstacles (level 1/2 only; level 3 is the boss fight, see `BossManager`)
- **`CoinManager`** – coin placement and collection logic
- **`FinishLineManager`** – spawns finish line when level threshold reached
- **`LevelManager`** – tracks level number, obstacle speed, and triggers level end
- **`UIManager`** – on‑screen score & (level 3) boss health text

Managers keep state localized, making it straightforward to add new behaviours or swap implementations (e.g. a new `EnemyManager`).

## 🛠 Extensibility Tips

- To add a new level, update `PlayerManager.getPlayerConfig()` and accessories in relevant managers.
- For a new obstacle type, extend `ObstacleManager.spawn()` and its preload assets.
- Menu screens are simple; add new keys to `MenuScene` and handle them in `showLoreScreen()` or new helpers.

The existing separation between scenes and managers is designed to make the codebase LLM‑friendly: clear classes with single responsibilities, descriptive names, and minimal global state.
