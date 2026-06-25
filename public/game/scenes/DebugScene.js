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
// game sprites sit on the ground. Remove this scene (and the D trigger in
// MenuScene + the entries in main.js / index.html) when the boss layout is set.
// ---------------------------------------------------------------------------

// Trivial, auto-placed elements (not draggable).
const DBG_FIXED = [
    { key: 'dbg_bg_boss',    file: 'images/bg_boss.png',    x: 160, y: 100, ox: 0.5, oy: 0.5, depth: -100 },
    // Floor sits above the ground-level boss parts (body/sitting at depth 1) so
    // they look planted, but below patus (depth 4) so he stands on top of it.
    { key: 'dbg_boss_floor', file: 'images/boss_floor.png', x: 160, y: 200, ox: 0.5, oy: 1.0, depth: 1.5 },
];

// Draggable elements. Add new boss parts here as you create them.
const DBG_PLACEABLES = [
    { name: 'boss_body',    file: 'images/boss_body.png',    x: 156, y: 184, depth: 1 },
    { name: 'boss_hand_l',  file: 'images/boss_hand_l.png',  x: 222, y: 162, depth: 0 },
    { name: 'boss_hand_r',  file: 'images/boss_hand_r.png',  x: 89,  y: 163, depth: 0 },
    { name: 'boss_head',    file: 'images/boss_head.png',    x: 157, y: 115, depth: 2 },
    { name: 'boss_sitting', file: 'images/boss_sitting.png', x: 275, y: 193, depth: 1 },
    { name: 'patus',        file: 'images/patus_jump.png',   x: 39,  y: 184, depth: 4 },
];

class DebugScene extends Phaser.Scene {
    constructor() {
        super('DebugScene');
    }

    preload() {
        DBG_FIXED.forEach(item => this.load.image(item.key, item.file));
        DBG_PLACEABLES.forEach(item => this.load.image('dbg_' + item.name, item.file));
    }

    create() {
        this.cameras.main.setBackgroundColor('#202020');

        // Trivial elements (background, floor)
        DBG_FIXED.forEach(item => {
            this.add.image(item.x, item.y, item.key)
                .setOrigin(item.ox, item.oy)
                .setDepth(item.depth);
        });

        // Draggable elements
        this.placeables = [];
        DBG_PLACEABLES.forEach(item => {
            const spr = this.add.image(item.x, item.y, 'dbg_' + item.name)
                .setOrigin(0.5, 1)
                .setDepth(item.depth)
                .setInteractive({ draggable: true, useHandCursor: true });
            spr.placeName = item.name;
            this.placeables.push(spr);
        });

        // Dragging + selection
        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            obj.x = Math.round(dragX);
            obj.y = Math.round(dragY);
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
            data[s.placeName] = { x: Math.round(s.x), y: Math.round(s.y), depth: s.depth };
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

    update() {
        this.selectionBox.clear();
        if (!this.selected) {
            this.infoText.setText('');
            return;
        }
        const b = this.selected.getBounds();
        this.selectionBox.lineStyle(1, 0x00ff00, 1);
        this.selectionBox.strokeRect(b.x, b.y, b.width, b.height);

        const s = this.selected;
        this.infoText.setText(`sel:${s.placeName}  x:${Math.round(s.x)}  y:${Math.round(s.y)}  depth:${s.depth}`);
    }
}
