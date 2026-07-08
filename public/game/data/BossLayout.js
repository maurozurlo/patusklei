// ---------------------------------------------------------------------------
// BossLayout — single source of truth for the level-3 boss scene placement.
//
// Shared by:
//   • BossManager        builds the real in-game scene
//   • GameScene.preload  loads the textures / spritesheets listed below
//
// Coordinates use a bottom-center origin (0.5, 1) unless `ox`/`oy` are given.
//   fixed: true   backdrop piece that doesn't move
//   sheet: {...}  animated spritesheet part (frames laid out horizontally)
//
// Hand-tune x/y/depth directly below.
// ---------------------------------------------------------------------------
const BOSS_LAYOUT = {
    // Fixed backdrop. Floor sits above the ground-level parts (depth 1) so they
    // look planted, but below the player (depth 10) so Patus stands on it.
    bg_boss:    { file: 'images/bg_boss.png',    x: 160, y: 100, ox: 0.5, oy: 0.5, depth: -100, fixed: true },
    boss_floor: { file: 'images/boss_floor.png', x: 160, y: 200, ox: 0.5, oy: 1.0, depth: 1.5,  fixed: true },

    // Puppet monster parts. The hands are animated idle-twitch spritesheets.
    boss_hand_l_twitch: { file: 'images/boss_hand_l_twitch.png', x: 233, y: 196, depth: 0, sheet: { frameWidth: 113, frameHeight: 200, frameRate: 7 } },
    boss_hand_r_twitch: { file: 'images/boss_hand_r_twitch.png', x: 70,  y: 196, depth: 0, sheet: { frameWidth: 113, frameHeight: 200, frameRate: 7 } },
    boss_body:          { file: 'images/boss_body.png',          x: 154, y: 200, depth: 1 },
    boss_head:          { file: 'images/boss_head.png',          x: 154, y: 94,  depth: 2 },

    // Puppet master reveal (post-defeat).
    boss_sitting:       { file: 'images/boss_sitting.png',       x: 275, y: 193, depth: 2 },
};
