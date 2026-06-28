// ---------------------------------------------------------------------------
// BossFight — data for the LIVE level-3 fight (the dodge core).
//
// Separate from BossLayout.js (the static bake) on purpose: this holds the
// fight-only hand states — rest (idle), telegraph (twitch) and attack — plus
// the per-attack damage windows and the dodge each one requires.
//
// Hands are mapped by BEHAVIOR, not by the _l/_r filename suffix (the monster
// faces the camera, so the sides are mirrored on screen):
//
//   • LOW  attack — the far hand (boss_hand_l) sweeps low across the WHOLE
//                   screen. Safe response: JUMP. Full-canvas (320px) frames,
//                   so it just centers at x=160.
//   • HIGH attack — the near hand (boss_hand_r) strikes overhead. Safe
//                   response: CROUCH. Localized 175px frames near Patus.
//
// Damage windows are Phaser's 1-based frame.index ("animation starts on frame
// 1"), matching how the frames were authored.
//
// Telegraph reuses the twitch spritesheets already loaded by BOSS_LAYOUT
// (boss_hand_l_twitch / boss_hand_r_twitch); only idle + attack layers load new.
// ---------------------------------------------------------------------------
const BOSS_FIGHT = {
    // Timing (ms / fps). These are the main fairness/tuning knobs.
    timing: {
        restBeforeTelegraph: 650,   // pause at idle before the wind-up
        twitchFrameRate: 7,         // telegraph speed (~authored 140-160ms/frame)
        attackFrameRate: 10,        // attack speed
        recoverAfterAttack: 900,    // gap so a jump can land before the next telegraph
        flashDuration: 600,         // hit-flash length (no damage yet — invincible)
    },

    // Both hands start active; the attacker is chosen at random (see pickHand).
    order: ['low', 'high'],

    // Bomb cadence (PRD §5): survive N attacks → Rodolfa delivers a bomb that
    // destroys a hand. Phase 1 destroys the HIGH (crouch) hand, phase 2 the LOW
    // (jump) hand. (Was 2 / 1 while testing the full sequence.)
    cadence: { phase1: 10, phase2: 5 },

    hands: {
        // LOW — far hand, screen-wide low sweep. JUMP to dodge.
        low: {
            dodge: 'jump',
            damageFrames: [6, 10],
            idle:   { key: 'boss_hand_low_idle',  file: 'images/boss_hand_l_idle.png',         x: 226, y: 202, depth: 0, bob: 3 },
            twitch: { key: 'boss_hand_l_twitch',                                                x: 233, y: 196, depth: 0, frames: 6 },
            back:   { key: 'boss_hand_low_back',  file: 'images/boss_hand_l_attack_back.png',  x: 160, y: 200, depth: 0, frameWidth: 320, frameHeight: 200, frames: 15 },
            front:  { key: 'boss_hand_low_front', file: 'images/boss_hand_l_attack_front.png', x: 160, y: 200, depth: 3, frameWidth: 320, frameHeight: 200, frames: 15 },
        },

        // HIGH — near hand, overhead strike. CROUCH to dodge.
        high: {
            dodge: 'crouch',
            damageFrames: [5, 9],
            idle:   { key: 'boss_hand_high_idle',  file: 'images/boss_hand_r_idle.png',         x: 79, y: 203, depth: 0, bob: 3 },
            twitch: { key: 'boss_hand_r_twitch',                                                x: 70, y: 196, depth: 0, frames: 6 },
            back:   { key: 'boss_hand_high_back',  file: 'images/boss_hand_r_attack_back.png',  x: 89, y: 200, depth: 0, frameWidth: 175, frameHeight: 200, frames: 11 },
            front:  { key: 'boss_hand_high_front', file: 'images/boss_hand_r_attack_front.png', x: 93, y: 201, depth: 3, frameWidth: 175, frameHeight: 200, frames: 11 },
        },
    },

    // -----------------------------------------------------------------------
    // Bomb phase placement — Rodolfa delivers bombs (drop/attach/run logic is
    // implemented later). Coordinates captured from the DebugScene.
    // Bottom-center origin unless noted; explosions are CENTERED (0.5, 0.5).
    // -----------------------------------------------------------------------
    props: {
        // Shelf the HIGH-hand bomb sits on (background prop, left side, up high).
        platform: { file: 'images/boss_platform.png', x: 25, y: 112, depth: 4 },

        // Bombs (single 33x15 frame). Same texture, three placements.
        bombs: {
            carried: { x: 303, y: 161, depth: 7 }, // held in Rodolfa's arms at spawn
            low:     { x: 23,  y: 178, depth: 7 }, // ground bomb — LOW hand bait
            high:    { x: 25,  y: 106, depth: 7 }, // shelf bomb — HIGH hand bait
        },

        // Explosions (6 x 100x85, centered origin) over each bomb.
        explosions: {
            low:  { x: 22, y: 167, depth: 8 },
            high: { x: 26, y: 88,  depth: 8 },
        },

        // Rodolfa walks in from the right (faces right in art → flipX when she
        // moves left). bombOffset = carried-bomb minus her anchor, so the held
        // bomb tracks her: (303-306, 161-189) = (-3, -28).
        rodolfa: {
            file: 'images/rodolfa-walk.png',
            frameWidth: 29, frameHeight: 32, frames: 4, frameRate: 10,
            depth: 6,
            bombOffset: { x: -3, y: -28 },
            walkSpeed: 130, runSpeed: 280, jumpDuration: 420, // movement tuning (px/s, ms)

            spawn: { x: 306, y: 189 }, // enters from the right
            exitX: 345,                // runs off the right edge → despawn

            // Captured delivery routines (drop/jump/run logic wired later). She
            // faces left while walking in (art faces right, so flipX), drops the
            // bomb, then flips to face right and runs out.
            deliveries: {
                // LOW: walk to the ground point, hold ~1s while the carried bomb
                // becomes the ground bomb (drop anim TBD), then run off right.
                low: [
                    { action: 'walk', x: 25,  y: 189 },
                    { action: 'drop', bomb: 'low', hold: 1000 },
                    { action: 'run',  x: 345 },
                ],
                // HIGH: walk to a stop short of the shelf, jump up onto it and
                // drop the bomb, jump back down, then run off right.
                high: [
                    { action: 'walk', x: 61, y: 189 },
                    { action: 'jump', x: 25, y: 108 },
                    { action: 'drop', bomb: 'high' },
                    { action: 'jump', x: 61, y: 189 },
                    { action: 'run',  x: 345 },
                ],
            },
        },
    },
};
