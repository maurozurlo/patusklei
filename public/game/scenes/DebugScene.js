// ---------------------------------------------------------------------------
// DebugScene — boss-scene placement tool (TEMPORARY)
//
// Trigger from the main menu by pressing D. Composes the level-3 boss scene so
// you can position sprites and read back their coordinates:
//   • DRAG          move a sprite
//   • click         select a sprite
//   • I / O         move the selected sprite up / down a layer (depth)
//   • J  or [DUMP]  copy the layout JSON to the clipboard (also logs to console)
//   • ESC           back to the main menu
//
// All placed coordinates use a bottom-center origin (0.5, 1), matching how the
// game sprites sit on the ground. The boss parts come from the shared layout in
// data/BossLayout.js — drag them, press J, and paste the dump back into that
// file so the tool and the real scene stay in sync. Remove this scene (and the D
// trigger in MenuScene + the entries in main.js / index.html) when it's set.
// ---------------------------------------------------------------------------

// Hide the idle twitch hands while positioning the attack arm (they overlap it).
const DBG_HIDE_TWITCH = true;

// Debug-only sprites that aren't part of the shared static layout:
//   • patus — the real animated player in-game; shown here just for scale.
//   • boss_hand_*_attack — fight-state hands being positioned. They overlap the
//     idle twitch hands, so they live here (not BOSS_LAYOUT) to stay out of the
//     static scene-3 bake until the fight is wired up. The right attack arm is
//     split into two layers: `_back` sits behind the body, `_front` over the face.
//   • boss_hand_r_idle — single-frame resting hand. `bob` previews a gentle
//     vertical sway around its resting position (the dump records that resting y,
//     not the mid-bob value).
const DBG_EXTRA = [
    { name: 'patus', file: 'images/patus_jump.png', x: 40, y: 192, depth: 4 },
    { name: 'boss_hand_r_idle', file: 'images/boss_hand_r_idle.png', x: 79, y: 203, depth: 0,
      bob: { amp: 3, duration: 1300 } },
    { name: 'boss_hand_l_idle', file: 'images/boss_hand_l_idle.png', x: 226, y: 202, depth: 0,
      bob: { amp: 3, duration: 1300 } },
    { name: 'boss_hand_r_attack_back',  file: 'images/boss_hand_r_attack_back.png',  x: 89, y: 200, depth: 0,
      sheet: { frameWidth: 175, frameHeight: 200, frameRate: 10 } },
    { name: 'boss_hand_r_attack_front', file: 'images/boss_hand_r_attack_front.png', x: 93, y: 201, depth: 3,
      sheet: { frameWidth: 175, frameHeight: 200, frameRate: 10 } },
];

class DebugScene extends Phaser.Scene {
    constructor() {
        super('DebugScene');
    }

    preload() {
        Object.entries(BOSS_LAYOUT).forEach(([name, cfg]) => this.loadAsset(name, cfg));
        DBG_EXTRA.forEach(item => this.loadAsset(item.name, item));
    }

    loadAsset(name, cfg) {
        const key = 'dbg_' + name;
        if (cfg.sheet) {
            this.load.spritesheet(key, cfg.file, {
                frameWidth: cfg.sheet.frameWidth,
                frameHeight: cfg.sheet.frameHeight
            });
        } else {
            this.load.image(key, cfg.file);
        }
    }

    create() {
        this.cameras.main.setBackgroundColor('#202020');

        // Fixed backdrop pieces (not draggable) vs. draggable parts.
        this.placeables = [];
        Object.entries(BOSS_LAYOUT).forEach(([name, cfg]) => {
            if (DBG_HIDE_TWITCH && name.includes('twitch')) return;
            if (cfg.fixed) {
                this.add.image(cfg.x, cfg.y, 'dbg_' + name)
                    .setOrigin(cfg.ox ?? 0.5, cfg.oy ?? 0.5)
                    .setDepth(cfg.depth);
            } else {
                this.addPlaceable(name, cfg);
            }
        });
        DBG_EXTRA.forEach(item => this.addPlaceable(item.name, item));

        // Dragging + selection
        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            obj.x = Math.round(dragX);
            if (obj.bob) obj.baseY = Math.round(dragY);
            else obj.y = Math.round(dragY);
        });
        this.input.on('dragstart', (pointer, obj) => this.selectSprite(obj));
        this.input.on('gameobjectdown', (pointer, obj) => {
            if (obj.placeName) this.selectSprite(obj);
        });

        // Selection outline (drawn each frame in update)
        this.selectionBox = this.add.graphics().setDepth(2000);
        this.selected = null;
        this.selectSprite(this.placeables[0]);

        // Keyboard controls
        this.input.keyboard.on('keydown-I', () => this.nudgeDepth(1));
        this.input.keyboard.on('keydown-O', () => this.nudgeDepth(-1));
        this.input.keyboard.on('keydown-J', () => this.dumpJSON());
        this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));

        this.buildHUD();
    }

    // Add a draggable, selectable sprite (animated if it has a `sheet`).
    addPlaceable(name, cfg) {
        const key = 'dbg_' + name;
        let spr;
        if (cfg.sheet) {
            const animKey = 'dbg_anim_' + name;
            if (!this.anims.exists(animKey)) {
                this.anims.create({
                    key: animKey,
                    frames: this.anims.generateFrameNumbers(key),
                    frameRate: cfg.sheet.frameRate ?? 7,
                    repeat: -1
                });
            }
            spr = this.add.sprite(cfg.x, cfg.y, key).play(animKey);
        } else {
            spr = this.add.image(cfg.x, cfg.y, key);
        }
        spr.setOrigin(0.5, 1)
            .setDepth(cfg.depth)
            .setInteractive({ draggable: true, useHandCursor: true });
        spr.placeName = name;
        if (cfg.bob) {
            // Oscillate around baseY (the resting position) so dragging/dumping
            // still report the resting y, not the mid-bob value.
            spr.bob = cfg.bob;
            spr.baseY = cfg.y;
            spr.bobT = 0;
        }
        this.placeables.push(spr);
    }

    buildHUD() {
        const small = { fontFamily: 'monospace', fontSize: '8px', color: '#ffffff' };

        this.add.rectangle(160, 9, 320, 18, 0x000000, 0.65).setDepth(1900);
        this.add.text(4, 4, 'DRAG move | I/O layer | J dump | ESC exit', small).setDepth(2001);

        const btn = this.add.text(316, 4, '[DUMP JSON]', {
            ...small, color: '#ffff00', backgroundColor: '#333333', padding: { x: 3, y: 1 }
        }).setOrigin(1, 0).setDepth(2001).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => this.dumpJSON());

        this.add.rectangle(160, 192, 320, 14, 0x000000, 0.65).setDepth(1900);
        this.infoText = this.add.text(4, 188, '', { ...small, color: '#00ff00' }).setDepth(2001);
        this.statusText = this.add.text(316, 188, '', { ...small, color: '#ffff00' })
            .setOrigin(1, 0).setDepth(2001);
    }

    selectSprite(spr) {
        if (spr) this.selected = spr;
    }

    nudgeDepth(delta) {
        if (this.selected) this.selected.setDepth(this.selected.depth + delta);
    }

    dumpJSON() {
        const data = {};
        this.placeables.forEach(s => {
            const y = s.bob ? s.baseY : Math.round(s.y);
            data[s.placeName] = { x: Math.round(s.x), y, depth: s.depth };
        });
        const json = JSON.stringify(data, null, 2);
        console.log('=== BOSS LAYOUT ===\n' + json);

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(json)
                .then(() => this.setStatus('Copied to clipboard!'))
                .catch(() => this.setStatus('Logged to console (F12)'));
        } else {
            this.setStatus('Logged to console (F12)');
        }
    }

    setStatus(msg) {
        this.statusText.setText(msg);
        this.time.delayedCall(2000, () => { if (this.statusText) this.statusText.setText(''); });
    }

    update(time, delta) {
        // Bob preview: smooth (ease in/out) yoyo around each bobbing sprite's
        // resting baseY, matching BossManager's body/head sway.
        this.placeables.forEach(s => {
            if (!s.bob) return;
            s.bobT += delta;
            const offset = -s.bob.amp * (1 - Math.cos(Math.PI * s.bobT / s.bob.duration)) / 2;
            s.y = s.baseY + offset;
        });

        this.selectionBox.clear();
        if (!this.selected) {
            this.infoText.setText('');
            return;
        }
        const b = this.selected.getBounds();
        this.selectionBox.lineStyle(1, 0x00ff00, 1);
        this.selectionBox.strokeRect(b.x, b.y, b.width, b.height);

        const s = this.selected;
        const restY = s.bob ? s.baseY : Math.round(s.y);
        this.infoText.setText(`sel:${s.placeName}  x:${Math.round(s.x)}  y:${restY}  depth:${s.depth}`);
    }
}
