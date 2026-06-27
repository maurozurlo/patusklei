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
    // LIVE FIGHT — dodge core + bomb phase (BossFight.js is the data).
    //
    // Hands cycle idle → twitch (telegraph) → attack → idle, strictly
    // alternating, one at a time. During an attack's damage window we read the
    // player's pose (cheap, no physics overlap); the wrong pose at any window
    // frame is a hit (flash + one heart).
    //
    // Bomb phase (PRD §5): after surviving `cadence.phase1` attacks, Rodolfa
    // walks in and drops a bomb at a hand's bait spot; that hand's NEXT attack
    // slams into the bomb → explosion → hand destroyed. Then the remaining hand
    // attacks `cadence.phase2` times and gets the same treatment → victory.
    // NO DAMAGE YET from the blast — it only destroys the hand.
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
        this.buildBombProps();

        // Fight state.
        this.activeHands = [...BOSS_FIGHT.order]; // 'low' attacks first
        this.turn = 0;
        this.phase = 1;
        this.phaseAttacks = 0;
        this.baitedHand = null;   // hand whose next attack detonates a bomb
        this.cadence = BOSS_FIGHT.cadence;

        this.scene.uiManager.setRodolfaCounter(this.cadence.phase1);
        this.scene.events.once('shutdown', () => this.stopFight());

        this.queueAttack(BOSS_FIGHT.timing.restBeforeTelegraph);
    }

    // Shelf (visible scenery), bombs, explosions and Rodolfa — all created up
    // front; everything but the shelf starts hidden.
    buildBombProps() {
        const P = BOSS_FIGHT.props;

        this.parts.boss_platform = this.scene.add.image(P.platform.x, P.platform.y, 'boss_platform')
            .setOrigin(0.5, 1).setDepth(P.platform.depth);

        this.bombs = {};
        Object.entries(P.bombs).forEach(([id, c]) => {
            this.bombs[id] = this.scene.add.image(c.x, c.y, 'bomb')
                .setOrigin(0.5, 1).setDepth(c.depth).setVisible(false);
        });

        this.explosions = {};
        Object.entries(P.explosions).forEach(([id, c]) => {
            const animKey = 'fight_explosion_' + id;
            if (!this.scene.anims.exists(animKey)) {
                this.scene.anims.create({
                    key: animKey,
                    frames: this.scene.anims.generateFrameNumbers('explosion', { start: 0, end: 5 }),
                    frameRate: 10, repeat: 0
                });
            }
            const ex = this.scene.add.sprite(c.x, c.y, 'explosion')
                .setOrigin(0.5, 0.5).setDepth(c.depth).setVisible(false);
            ex.fightAnimKey = animKey;
            this.explosions[id] = ex;
        });

        const r = P.rodolfa;
        if (!this.scene.anims.exists('rodolfa_walk')) {
            this.scene.anims.create({
                key: 'rodolfa_walk',
                frames: this.scene.anims.generateFrameNumbers('rodolfa', { start: 0, end: r.frames - 1 }),
                frameRate: r.frameRate, repeat: -1
            });
        }
        this.rodolfa = this.scene.add.sprite(r.spawn.x, r.spawn.y, 'rodolfa')
            .setOrigin(0.5, 1).setDepth(r.depth).setVisible(false);
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
        this.fightTimers.push(this.scene.time.delayedCall(delay, () => this.startAttack()));
    }

    // Pick the attacker (forced to the baited hand when a bomb is armed, else
    // the next in rotation), telegraph, then strike.
    startAttack() {
        if (this.scene.isGameOver) return;
        let id;
        if (this.baitedHand) {
            id = this.baitedHand;
        } else {
            id = this.activeHands[this.turn % this.activeHands.length];
            this.turn++;
        }
        // Baited wind-up: start the bomb's beep fuse so it climaxes at the slam.
        if (id === this.baitedHand) this.playBombCountdown();

        this.telegraph(id, () => {
            if (this.scene.isGameOver) return;
            if (id === this.baitedHand) this.baitedAttack(id);
            else this.normalAttack(id);
        });
    }

    // Wind-up: hide rest, play the twitch once, then continue.
    telegraph(id, onDone) {
        const hand = this.hands[id];
        hand.idle.setVisible(false);
        hand.twitch.setVisible(true).play(hand.twitch.fightAnimKey);
        hand.twitch.once('animationcomplete', () => {
            hand.twitch.setVisible(false);
            onDone();
        });
    }

    // Normal strike: play both attack layers; watch the damage window for a bad
    // pose. frame.index is Phaser's 1-based position, matching the authored
    // "frames start at 1" windows. One hit per attack (latched).
    normalAttack(id) {
        const hand = this.hands[id];
        const [d0, d1] = hand.cfg.damageFrames;
        this.attackHitLatched = false;

        hand.back.setVisible(true).play(hand.back.fightAnimKey);
        hand.front.setVisible(true).play(hand.front.fightAnimKey);

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
            this.onAttackResolved();
        });
    }

    // Baited strike: the hand slams into the armed bomb. At the first damage
    // frame it detonates and the hand is destroyed (no player damage yet).
    baitedAttack(id) {
        const hand = this.hands[id];
        const impact = hand.cfg.damageFrames[0];

        hand.back.setVisible(true).play(hand.back.fightAnimKey);
        hand.front.setVisible(true).play(hand.front.fightAnimKey);

        const onFrame = (anim, frame) => {
            if (frame.index >= impact) {
                hand.front.off('animationupdate', onFrame);
                this.detonate(id);
            }
        };
        hand.front.on('animationupdate', onFrame);
    }

    // After a survived attack: tick the phase counter; at the threshold, send
    // Rodolfa with a bomb, otherwise schedule the next attack.
    onAttackResolved() {
        this.phaseAttacks++;
        const threshold = this.phase === 1 ? this.cadence.phase1 : this.cadence.phase2;
        this.scene.uiManager.setRodolfaCounter(Math.max(0, threshold - this.phaseAttacks));

        if (this.phaseAttacks >= threshold) {
            this.startDelivery(this.phase === 1 ? 'low' : 'high');
        } else {
            this.queueAttack(BOSS_FIGHT.timing.recoverAfterAttack);
        }
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
        this.scene.sfx.boss_hit.play();
        this.scene.sfx.patus_hit.play();
        this.scene.loseHeart();
        this.scene.tweens.add({
            targets: p, alpha: 0.25, duration: 70, yoyo: true, repeat: 4,
            onComplete: () => p.setAlpha(1)
        });
    }

    // ----- Rodolfa bomb delivery --------------------------------------------

    startDelivery(targetId) {
        this.scene.uiManager.setRodolfaCounter(0);
        this.runRodolfa(targetId, () => {
            // Bomb is armed (baitedHand set at the drop step); the next attack is
            // forced to the baited hand and detonates it.
            this.queueAttack(700);
        });
    }

    runRodolfa(deliveryId, onDone) {
        const r = BOSS_FIGHT.props.rodolfa;
        this.rodolfa.setPosition(r.spawn.x, r.spawn.y).setFlipX(true).setVisible(true).play('rodolfa_walk');
        this.bombs.carried.setVisible(true);
        this.syncCarriedBomb();
        this.runSteps(r.deliveries[deliveryId], 0, deliveryId, onDone);
    }

    runSteps(steps, i, deliveryId, onDone) {
        if (i >= steps.length) {
            this.rodolfa.setVisible(false);
            onDone();
            return;
        }
        const step = steps[i];
        const next = () => this.runSteps(steps, i + 1, deliveryId, onDone);
        switch (step.action) {
            case 'walk': this.rodolfaMove(step.x, step.y ?? this.rodolfa.y, false, next); break;
            case 'run':  this.rodolfaMove(step.x, this.rodolfa.y, true, next); break;
            case 'jump': this.rodolfaJump(step.x, step.y, next); break;
            case 'drop': this.rodolfaDrop(deliveryId, step.hold ?? 0, next); break;
            default:     next();
        }
    }

    rodolfaMove(x, y, run, done) {
        const r = BOSS_FIGHT.props.rodolfa;
        const speed = run ? r.runSpeed : r.walkSpeed;
        const dist = Math.hypot(x - this.rodolfa.x, y - this.rodolfa.y) || 1;
        this.rodolfa.setFlipX(x < this.rodolfa.x); // art faces right; flip to go left
        if (!this.rodolfa.anims.isPlaying) this.rodolfa.play('rodolfa_walk');
        this.scene.tweens.add({
            targets: this.rodolfa, x, y, duration: (dist / speed) * 1000, ease: 'Linear',
            onUpdate: () => this.syncCarriedBomb(),
            onComplete: done
        });
    }

    rodolfaJump(x, y, done) {
        const up = y < this.rodolfa.y;
        this.rodolfa.setFlipX(x < this.rodolfa.x);
        this.scene.tweens.add({
            targets: this.rodolfa, x, y,
            duration: BOSS_FIGHT.props.rodolfa.jumpDuration,
            ease: up ? 'Sine.out' : 'Sine.in',
            onUpdate: () => this.syncCarriedBomb(),
            onComplete: done
        });
    }

    // Swap the carried bomb for the placed (armed) bomb and mark the hand baited.
    rodolfaDrop(deliveryId, hold, done) {
        this.bombs.carried.setVisible(false);
        const c = BOSS_FIGHT.props.bombs[deliveryId];
        this.bombs[deliveryId].setPosition(c.x, c.y).setVisible(true);
        this.baitedHand = deliveryId;
        this.scene.sfx.bomb_planted.play();
        // TODO: drop animation + a visible bomb timer.
        if (hold > 0) this.fightTimers.push(this.scene.time.delayedCall(hold, done));
        else done();
    }

    // Accelerating beep "fuse" — 3 slow then 3 fast, leading into the boom.
    // Started when the baited hand winds up, so it climaxes near detonation.
    playBombCountdown() {
        const beepTimes = [0, 300, 600, 800, 1000, 1200];
        beepTimes.forEach(t => this.fightTimers.push(
            this.scene.time.delayedCall(t, () => this.scene.sfx.bomb_beep.play())
        ));
    }

    syncCarriedBomb() {
        if (!this.bombs.carried.visible) return;
        const o = BOSS_FIGHT.props.rodolfa.bombOffset;
        this.bombs.carried.setPosition(this.rodolfa.x + o.x, this.rodolfa.y + o.y)
            .setFlipX(this.rodolfa.flipX);
    }

    // ----- Hand destruction / victory ---------------------------------------

    detonate(id) {
        const hand = this.hands[id];
        hand.back.anims.stop(); hand.front.anims.stop();
        [hand.back, hand.front, hand.idle, hand.twitch].forEach(s => s.setVisible(false));
        this.bombs[id].setVisible(false);
        this.playExplosion(id);

        this.activeHands = this.activeHands.filter(h => h !== id);
        this.baitedHand = null;
        this.afterDestroy();
    }

    playExplosion(id) {
        const ex = this.explosions[id];
        this.scene.sfx.explo.play();
        ex.setVisible(true).play(ex.fightAnimKey);
        ex.once('animationcomplete', () => ex.setVisible(false));
    }

    afterDestroy() {
        if (this.activeHands.length === 0) {
            this.victory();
            return;
        }
        // Into phase 2 — only the remaining hand attacks.
        this.phase = 2;
        this.phaseAttacks = 0;
        this.scene.uiManager.setRodolfaCounter(this.cadence.phase2);
        this.queueAttack(BOSS_FIGHT.timing.recoverAfterAttack + 400);
    }

    victory() {
        this.stopFight();
        this.scene.uiManager.setRodolfaCounter(null);
        this.scene.cutscene = true; // lock player input for the scripted run

        // Input is now locked, so handleInput won't clear a mid-jump pose. Drop
        // Patus back to idle (gravity still lands him) so he isn't frozen in the
        // single-frame jump sprite during the collapse.
        const p = this.scene.playerManager.player;
        p.setVelocityX(0);
        p.play('patus_idle');

        // Puppet collapses; Lars (boss_sitting) is revealed.
        ['boss_body', 'boss_head'].forEach(k => {
            if (this.parts[k]) {
                this.scene.tweens.add({
                    targets: this.parts[k], alpha: 0, y: this.parts[k].y + 12, duration: 800
                });
            }
        });
        if (this.parts.boss_sitting) {
            this.parts.boss_sitting.setVisible(true).setAlpha(0);
            this.scene.tweens.add({ targets: this.parts.boss_sitting, alpha: 1, delay: 700, duration: 600 });
        }

        // Beat to let the reveal land, then Patus runs right to Lars.
        this.fightTimers.push(this.scene.time.delayedCall(1300, () => this.runToLars()));
    }

    // Scripted victory walk: Patus runs to just short of Lars, then the game
    // hands off to the 3 ending lore screens (mock — see MenuScene BOSS_ENDING).
    // Driven by velocity (tweening x would fight the Arcade body), stopped after
    // the computed travel time.
    runToLars() {
        const p = this.scene.playerManager.player;
        const larsX = this.parts.boss_sitting ? this.parts.boss_sitting.x : 240;
        const stopX = larsX - 45;             // stop just short of him
        const speed = 100;                    // px/s
        const dist = Math.max(0, stopX - p.x);

        p.play('patus_walk').setFlipX(false);
        p.setVelocityX(speed);

        this.fightTimers.push(this.scene.time.delayedCall((dist / speed) * 1000, () => {
            p.setVelocityX(0);
            p.play('patus_idle');
            this.fightTimers.push(this.scene.time.delayedCall(900, () => {
                this.scene.scene.start('MenuScene', { menuKey: 'BOSS_ENDING' });
            }));
        }));
    }

    stopFight() {
        (this.fightTimers || []).forEach(t => t && t.remove());
        this.fightTimers = [];
    }
}
