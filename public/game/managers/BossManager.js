// Builds the static level-3 boss scene: background, floor, and the puppet-master
// monster assembled from separate parts. Coordinates/depths come from the
// placement tool (DebugScene). Bottom-center origin (0.5, 1) matches how the
// game's sprites sit on the ground.
//
// NOTE: the actual boss fight is not implemented yet. `boss_sitting` (the
// puppet master revealed after the monster is defeated) is shown here only
// because this is a static bake — once the fight exists it should stay hidden
// until the puppet is beaten.

const BOSS_LAYOUT = {
    // Fixed backdrop. Floor sits above the ground-level boss parts (depth 1) so
    // they look planted, but below the player (depth 10) so Patus stands on it.
    bg_boss: { x: 160, y: 100, ox: 0.5, oy: 0.5, depth: -100 },
    boss_floor: { x: 160, y: 200, ox: 0.5, oy: 1.0, depth: 1.5 },

    // Puppet monster parts (bottom-center origin).
    boss_hand_l: { x: 222, y: 162, depth: 0 },
    boss_hand_r: { x: 89, y: 163, depth: 0 },
    boss_body: { x: 156, y: 184, depth: 1 },
    boss_head: { x: 157, y: 115, depth: 2 },

    // Puppet master reveal (post-defeat).
    boss_sitting: { x: 275, y: 193, depth: 2 },
};

class BossManager {
    constructor(scene) {
        this.scene = scene;
        this.parts = {};
    }

    setup() {
        const L = BOSS_LAYOUT;

        // Backdrop + floor
        this.addImage('bg_boss', L.bg_boss);
        this.addImage('boss_floor', L.boss_floor);

        // Puppet parts + reveal
        ['boss_hand_l', 'boss_hand_r', 'boss_body', 'boss_head', 'boss_sitting']
            .forEach(name => this.addPart(name, L[name]));

        this.addBob();
    }

    addImage(key, cfg) {
        const img = this.scene.add.image(cfg.x, cfg.y, key)
            .setOrigin(cfg.ox ?? 0.5, cfg.oy ?? 1)
            .setDepth(cfg.depth);
        this.parts[key] = img;
        return img;
    }

    addPart(name, cfg) {
        return this.addImage(name, { ...cfg, ox: 0.5, oy: 1 });
    }

    // Gentle vertical bob on head and body. Different amplitudes/durations (plus
    // a delay) keep them out of sync for a subtle parallax / puppet-on-strings feel.
    addBob() {
        this.scene.tweens.add({
            targets: this.parts.boss_body,
            y: this.parts.boss_body.y - 3,
            duration: 1300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        this.scene.tweens.add({
            targets: this.parts.boss_head,
            y: this.parts.boss_head.y - 4,
            duration: 1600,
            delay: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }
}
