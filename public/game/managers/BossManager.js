// Builds the static level-3 boss scene: background, floor, and the puppet-master
// monster assembled from separate parts. Coordinates/depths come from the shared
// layout in data/BossLayout.js (tuned with the DebugScene placement tool).
//
// NOTE: the actual boss fight is not implemented yet. `boss_sitting` (the
// puppet master revealed after the monster is defeated) is shown here only
// because this is a static bake — once the fight exists it should stay hidden
// until the puppet is beaten.

class BossManager {
    constructor(scene) {
        this.scene = scene;
        this.parts = {};
    }

    setup() {
        // Fixed backdrop pieces vs. positioned (bottom-center) monster parts.
        Object.entries(BOSS_LAYOUT).forEach(([name, cfg]) => {
            if (cfg.fixed) this.addImage(name, cfg);
            else this.addPart(name, cfg);
        });

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
        if (cfg.sheet) return this.addAnimatedPart(name, cfg);
        return this.addImage(name, { ...cfg, ox: 0.5, oy: 1 });
    }

    // Animated spritesheet part (looping idle). Frames are laid out horizontally,
    // all the same size; the anim is created once and reused.
    addAnimatedPart(name, cfg) {
        const animKey = name + '_anim';
        if (!this.scene.anims.exists(animKey)) {
            this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(name),
                frameRate: cfg.sheet.frameRate ?? 7,
                repeat: -1
            });
        }
        const spr = this.scene.add.sprite(cfg.x, cfg.y, name)
            .setOrigin(0.5, 1)
            .setDepth(cfg.depth)
            .play(animKey);
        this.parts[name] = spr;
        return spr;
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
