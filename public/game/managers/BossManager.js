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

    // -----------------------------------------------------------------------
    // LIVE FIGHT — the dodge core (BossFight.js is the data).
    //
    // Each hand cycles idle → twitch (telegraph) → attack → idle, and the two
    // hands attack strictly alternating, one at a time. During each attack's
    // damage window we read the player's pose (cheap, no physics overlap): if
    // it's the wrong pose at any frame in the window it's a hit. For now a hit
    // is just a flash — Patus is invincible until hearts are wired up.
    // -----------------------------------------------------------------------
    setupFight() {
        // The static bake loops the twitch sheets as idle hands and shows the
        // post-defeat reveal (boss_sitting). The live fight replaces both.
        ['boss_hand_l_twitch', 'boss_hand_r_twitch'].forEach(k => this.parts[k]?.setVisible(false));
        this.parts.boss_sitting?.setVisible(false);

        this.fightTimers = [];
        this.hands = {};
        this.attackHitLatched = false;
        Object.entries(BOSS_FIGHT.hands).forEach(([id, cfg]) => this.buildFightHand(id, cfg));

        this.attackIndex = 0;
        this.scene.events.once('shutdown', () => this.stopFight());

        this.queueAttack(BOSS_FIGHT.timing.restBeforeTelegraph);
    }

    buildFightHand(id, cfg) {
        // Resting hand (single frame), with the same gentle bob as the bake.
        const idle = this.scene.add.image(cfg.idle.x, cfg.idle.y, cfg.idle.key)
            .setOrigin(0.5, 1).setDepth(cfg.idle.depth);
        if (cfg.idle.bob) {
            this.scene.tweens.add({
                targets: idle, y: cfg.idle.y - cfg.idle.bob,
                duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut'
            });
        }

        // Telegraph + attack layers, hidden until their turn. The attack arm is
        // split _back (behind the body) / _front (over the face) for depth.
        const t = BOSS_FIGHT.timing;
        const twitch = this.makeFightAnim(id + '_twitch', cfg.twitch, t.twitchFrameRate);
        const back   = this.makeFightAnim(id + '_back',   cfg.back,   t.attackFrameRate);
        const front  = this.makeFightAnim(id + '_front',  cfg.front,  t.attackFrameRate);
        [twitch, back, front].forEach(s => s.setVisible(false));

        this.hands[id] = { cfg, idle, twitch, back, front };
    }

    // Build a play-once sprite for one fight state. `cfg.key` is the loaded
    // texture; `cfg.frames` is the frame count.
    makeFightAnim(animId, cfg, frameRate) {
        const animKey = 'fight_' + animId;
        if (!this.scene.anims.exists(animKey)) {
            this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(cfg.key, { start: 0, end: cfg.frames - 1 }),
                frameRate,
                repeat: 0
            });
        }
        const spr = this.scene.add.sprite(cfg.x, cfg.y, cfg.key).setOrigin(0.5, 1).setDepth(cfg.depth);
        spr.fightAnimKey = animKey;
        return spr;
    }

    queueAttack(delay) {
        this.fightTimers.push(this.scene.time.delayedCall(delay, () => this.telegraph()));
    }

    // Wind-up: hide rest, play the twitch once, then strike.
    telegraph() {
        if (this.scene.isGameOver) return;
        const id = BOSS_FIGHT.order[this.attackIndex % BOSS_FIGHT.order.length];
        const hand = this.hands[id];

        hand.idle.setVisible(false);
        hand.twitch.setVisible(true).play(hand.twitch.fightAnimKey);
        hand.twitch.once('animationcomplete', () => {
            hand.twitch.setVisible(false);
            this.attack(id);
        });
    }

    // Strike: play both attack layers; watch the damage window for a bad pose.
    attack(id) {
        if (this.scene.isGameOver) return;
        const hand = this.hands[id];
        const [d0, d1] = hand.cfg.damageFrames; // 1-based, matches frame.index
        this.attackHitLatched = false;

        hand.back.setVisible(true).play(hand.back.fightAnimKey);
        hand.front.setVisible(true).play(hand.front.fightAnimKey);

        // frame.index is Phaser's 1-based position in the anim, matching the
        // authored "frames start at 1" windows. One hit per attack (latched).
        const onFrame = (anim, frame) => {
            if (this.attackHitLatched) return;
            if (frame.index >= d0 && frame.index <= d1 && !this.isPlayerSafe(hand.cfg.dodge)) {
                this.attackHitLatched = true;
                this.registerHit();
            }
        };
        hand.front.on('animationupdate', onFrame);

        hand.front.once('animationcomplete', () => {
            hand.front.off('animationupdate', onFrame);
            hand.back.setVisible(false);
            hand.front.setVisible(false);
            hand.idle.setVisible(true);
            this.attackIndex++;
            this.queueAttack(BOSS_FIGHT.timing.recoverAfterAttack);
        });
    }

    // Cheap pose check — no physics overlap.
    //   jump   → safe only while airborne
    //   crouch → safe only while ducking
    isPlayerSafe(dodge) {
        const p = this.scene.playerManager.player;
        if (dodge === 'jump')   return !p.body.touching.down;
        if (dodge === 'crouch') return p.isCrouching === true;
        return false;
    }

    // A failed dodge: drop one heart (latched to one per attack) and flash Patus.
    registerHit() {
        const p = this.scene.playerManager.player;
        this.scene.loseHeart();
        this.scene.tweens.add({
            targets: p, alpha: 0.25, duration: 70, yoyo: true, repeat: 4,
            onComplete: () => p.setAlpha(1)
        });
    }

    stopFight() {
        (this.fightTimers || []).forEach(t => t && t.remove());
        this.fightTimers = [];
    }
}
