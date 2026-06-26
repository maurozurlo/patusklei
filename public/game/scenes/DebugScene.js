// ---------------------------------------------------------------------------
// DebugScene — boss-scene placement tool (TEMPORARY)
//
// Trigger from the main menu by pressing D. The static boss scene + Patus are
// drawn as non-draggable CONTEXT (already placed); the things we're positioning
// now — Rodolfa, the bombs, the shelf, the explosions — are the draggable
// placeables.
//   • DRAG          move a placeable
//   • click         select a placeable
//   • I / O         move the selected placeable up / down a layer (depth)
//   • J  or [DUMP]  copy the placeable coords (x/y/depth by id) to the clipboard
//   • ESC           back to the main menu
//
// Placeables use a bottom-center origin (0.5, 1) unless they set ox/oy — e.g.
// the explosions use a centered origin so the blast sits over its bomb. Drag,
// press J, and hand me the numbers.
// ---------------------------------------------------------------------------

// Non-draggable scale/context references that aren't part of BOSS_LAYOUT.
const DBG_CONTEXT = [
    { name: 'patus', file: 'images/patus_idle.png', x: 24, y: 185, depth: 10,
      sheet: { frameWidth: 23, frameHeight: 68, frameRate: 3 } },
];

// The items being positioned. Bombs and explosions reuse the same files under
// distinct ids so each instance places independently.
//   rodolfa         — the mole; enters from the right and walks LEFT, so she's
//                     previewed flipped (flip at runtime too).
//   boss_platform   — the shelf the high-hand bomb sits on (background prop).
//   bomb_carried    — bomb held in Rodolfa's arms (attachment point).
//   bomb_low        — ground bomb baited by the LOW hand.
//   bomb_high       — bomb on the shelf, baited by the HIGH hand.
//   explosion_low   — blast for the ground bomb (centered origin).
//   explosion_high  — blast for the shelf bomb (centered origin).
const DBG_EXTRA = [
    { name: 'rodolfa', file: 'images/rodolfa-walk.png', x: 290, y: 185, depth: 6, flipX: true,
      sheet: { frameWidth: 29, frameHeight: 32, frameRate: 10 } }, // authored 100ms/frame

    { name: 'boss_platform', file: 'images/boss_platform.png', x: 230, y: 140, depth: 4 },

    { name: 'bomb_carried', file: 'images/bomb.png', x: 280, y: 165, depth: 7 },
    { name: 'bomb_low',     file: 'images/bomb.png', x: 70,  y: 195, depth: 7 },
    { name: 'bomb_high',    file: 'images/bomb.png', x: 230, y: 132, depth: 7 },

    { name: 'explosion_low',  file: 'images/explosion.png', x: 70,  y: 190, depth: 8, ox: 0.5, oy: 0.5,
      sheet: { frameWidth: 100, frameHeight: 85, frameRate: 10 } }, // authored 100ms/frame
    { name: 'explosion_high', file: 'images/explosion.png', x: 230, y: 128, depth: 8, ox: 0.5, oy: 0.5,
      sheet: { frameWidth: 100, frameHeight: 85, frameRate: 10 } }, // authored 100ms/frame
];

class DebugScene extends Phaser.Scene {
    constructor() {
        super('DebugScene');
    }

    preload() {
        Object.entries(BOSS_LAYOUT).forEach(([name, cfg]) => this.loadAsset(name, cfg));
        DBG_CONTEXT.forEach(item => this.loadAsset(item.name, item));
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

        // Static boss scene + Patus, drawn as non-draggable context.
        Object.entries(BOSS_LAYOUT).forEach(([name, cfg]) => this.addContext(name, cfg));
        DBG_CONTEXT.forEach(item => this.addContext(item.name, item));

        // The draggable placeables we're positioning now.
        this.placeables = [];
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

    // Non-interactive reference sprite (animated if it has a `sheet`).
    addContext(name, cfg) {
        const key = 'dbg_' + name;
        let obj;
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
            obj = this.add.sprite(cfg.x, cfg.y, key).play(animKey);
        } else {
            obj = this.add.image(cfg.x, cfg.y, key);
        }
        obj.setOrigin(cfg.ox ?? 0.5, cfg.oy ?? 1).setDepth(cfg.depth).setAlpha(0.85);
        return obj;
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
        spr.setOrigin(cfg.ox ?? 0.5, cfg.oy ?? 1)
            .setDepth(cfg.depth)
            .setInteractive({ draggable: true, useHandCursor: true });
        if (cfg.flipX) spr.setFlipX(true);
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
