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
        twitchFrameRate: 8,         // telegraph speed
        attackFrameRate: 10,        // attack speed
        recoverAfterAttack: 900,    // gap so a jump can land before the next telegraph
        flashDuration: 600,         // hit-flash length (no damage yet — invincible)
    },

    // Strictly alternating; index 0 attacks first.
    order: ['low', 'high'],

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
};
