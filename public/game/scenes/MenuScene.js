class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    init(data) {
        this.menuKey = (data && data.menuKey) || 'MAIN_MENU';
        this.forceEnding = (data && data.forceEnding) || null; // debug: 'good'|'bad'
    }

    preload() {
        this.load.image('main_menu', 'images/main_menu.png');
        this.load.image('icon_soundon', 'images/icon_soundon.png');
        this.load.image('icon_soundoff', 'images/icon_soundoff.png');
        this.load.audio('sfx_click', 'audio/sfx_click.wav');
        this.load.audio('sfx_gameover', 'audio/sfx_gameover.wav');

        // Auto-load any backdrop images referenced by lore entries (keyed by
        // their path), so a screen just needs `image: 'images/foo.png'`.
        Object.values(LORE).forEach(entry => {
            if (entry.image) this.load.image(entry.image, entry.image);
        });

        // Speaker portraits for the ending dialogue.
        Object.values(PORTRAITS).forEach(p => this.load.image(p, p));
    }

    create() {
        // Stop anything the previous scene left playing (the sound manager is
        // global and doesn't stop sounds on a scene change).
        this.sound.stopAll();

        // Apply the persisted sound preference (global to the sound manager).
        this.sound.mute = !isMusicPlaying;

        // Click SFX on any UI button (every menu/lore control is interactive).
        this.input.on('gameobjectdown', () => this.sound.play('sfx_click'));

        // DEBUG: press D to cycle good ↔ bad ending (to compare them quickly).
        this.input.keyboard.on('keydown-D', () => {
            const next = this.forceEnding === 'good' ? 'bad' : 'good';
            this.scene.start('MenuScene', { menuKey: 'BOSS_ENDING', forceEnding: next });
        });

        const loreScreens = [
            'LEVEL_1_LORE',
            'LEVEL_2_LORE',
            'BOSS_LORE',
            'GAME_COMPLETED'
        ];

        if (loreScreens.includes(this.menuKey)) {
            this.showLoreScreen(this.menuKey);
            return;
        }

        // Boss victory: peppers decide good/bad in a real run; the debug D key
        // forces one (forceEnding) so they can be compared.
        if (this.menuKey === 'BOSS_ENDING') {
            const ending = this.forceEnding || (Save.isGoodEnding() ? 'good' : 'bad');
            if (!this.forceEnding) Save.unlockEnding(ending);
            this.showLoreSequence(LORE_SEQUENCES[ending]);
            return;
        }

        if (this.menuKey === 'GAME_OVER') {
            this.showGameOver();
            return;
        }

        this.showMainMenu();
    }

    // --------------------------------------------------
    // Shared helpers
    // --------------------------------------------------

    clearUI() {
        this.children.removeAll();
        this.cameras.main.setBackgroundColor('#000000');
    }

    // Gentle looping vertical bob (titles + continue buttons).
    bob(obj, { amp = 3, duration = 900, delay = 0 } = {}) {
        this.tweens.add({
            targets: obj, y: obj.y - amp, duration, delay,
            yoyo: true, repeat: -1, ease: 'Sine.inOut'
        });
        return obj;
    }

    getStyles() {
        // Black outline on the pixel text, per the designer's spec (~4px stroke
        // at 18px — scaled per size). strokeThickness values are tunable.
        const outline = '#000000';
        return {
            title: {
                fontFamily: '"Press Start 2P"',
                fontSize: '26px',
                color: '#ffffff',
                stroke: outline,
                strokeThickness: 6
            },
            subtitle: {
                fontFamily: '"Press Start 2P"',
                fontSize: '18px',
                fill: '#ffcc00',
                stroke: outline,
                strokeThickness: 4
            },
            body: {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                fill: '#ffffff',
                wordWrap: { width: 310 },
                stroke: outline,
                strokeThickness: 2
            },
            buttonPrimary: {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                fill: '#FFFF55',
                stroke: outline,
                strokeThickness: 4
            },
            buttonSecondary: {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                fill: '#ffffff',
                stroke: outline,
                strokeThickness: 4
            },
            danger: {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                fill: '#ff0000',
                stroke: outline,
                strokeThickness: 4
            }
        };
    }

    // --------------------------------------------------
    // Main menu
    // --------------------------------------------------

    showMainMenu() {
        this.clearUI();
        const styles = this.getStyles();

        // Full-screen menu artwork (320x200) behind the buttons.
        this.add.image(160, 100, 'main_menu').setOrigin(0.5);

        const startButton = this.add.text(160, 145, 'INICIAR JUEGO', styles.buttonPrimary)
            .setOrigin(0.5)
            .setInteractive();
        this.bob(startButton);

        startButton.on('pointerdown', () => {
            Save.startNewGame(); // fresh run: reset peppers, bump timesPlayed
            this.showLoreScreen('LEVEL_1_LORE');
        });

        // Sound toggle icon, anchored top-right with a little padding.
        const pad = 8;
        this.musicButton = this.add.image(320 - pad, pad, isMusicPlaying ? 'icon_soundon' : 'icon_soundoff')
            .setOrigin(1, 0)
            .setDepth(60)
            .setInteractive({ useHandCursor: true });

        this.musicButton.on('pointerdown', this.toggleMusic, this);

        // this.showDebugLevelSelect(); // DEBUG level selector — uncomment to skip to a level
    }

    // TEMPORARY: jump straight into any level (skips lore). Remove with the boss work.
    showDebugLevelSelect() {
        this.add.rectangle(160, 193, 320, 15, 0x000000, 0.6).setDepth(50);
        this.add.text(50, 189, 'DEBUG LVL:', {
            fontFamily: 'monospace', fontSize: '8px', color: '#888888'
        }).setDepth(51);

        [1, 2, 3].forEach((lvl, i) => {
            this.add.text(150 + i * 26, 189, `[${lvl}]`, {
                fontFamily: 'monospace', fontSize: '8px', color: '#ffff00'
            })
                .setDepth(51)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.scene.start('GameScene', { level: lvl }));
        });
    }

    toggleMusic() {
        isMusicPlaying = !isMusicPlaying;
        this.musicButton.setTexture(isMusicPlaying ? 'icon_soundon' : 'icon_soundoff');
        this.sound.mute = !isMusicPlaying;
        localStorage.setItem('musicPlaying', isMusicPlaying);
    }

    // --------------------------------------------------
    // Lore screens
    // --------------------------------------------------

    showLoreScreen(key) {
        this.clearUI();
        const styles = this.getStyles();
        const lore = this.getLoreText(key);

        this.drawLoreImage(lore);
        this.add.text(160, 40, lore.title, styles.subtitle).setOrigin(0.5);

        this.add.text(10, 65, lore.text, styles.body);

        const continueButton = this.add.text(160, 180, 'CONTINUAR', styles.buttonPrimary)
            .setOrigin(0.5)
            .setInteractive();
        this.bob(continueButton, { delay: 450 });

        continueButton.on('pointerdown', () => {
            switch (key) {
                case 'LEVEL_1_LORE':
                    this.scene.start('GameScene', { level: 1 });
                    break;
                case 'LEVEL_2_LORE':
                    this.scene.start('GameScene', { level: 2 });
                    break;
                case 'BOSS_LORE':
                    this.scene.start('GameScene', { level: 3 });
                    break;
                case 'GAME_COMPLETED':
                    this.scene.start('MenuScene', { menuKey: 'MAIN_MENU' });
                    break;
            }
        });
    }

    // Play a chain of ending screens. Each entry renders either as a typewriter
    // dialogue (it has a `dialogue` array) or a plain narration screen. The last
    // one returns to the main menu.
    showLoreSequence(keys, index = 0) {
        const entry = this.getLoreText(keys[index]);
        const last = index === keys.length - 1;
        const next = () => {
            // Explicit menuKey: scene.start with no data reuses the previous data.
            if (last) this.scene.start('MenuScene', { menuKey: 'MAIN_MENU' });
            else this.showLoreSequence(keys, index + 1);
        };

        if (entry.dialogue) this.showDialogue(entry, next);
        else this.renderNarration(entry, last, next);
    }

    // Plain narration screen (title + body + optional image), advanced by a button.
    renderNarration(entry, last, onNext) {
        this.clearUI();
        const styles = this.getStyles();
        this.drawLoreImage(entry);
        this.add.text(160, 40, entry.title, styles.subtitle).setOrigin(0.5);
        this.add.text(10, 65, entry.text, styles.body);
        const button = this.add.text(160, 180, last ? 'FIN' : 'CONTINUAR', styles.buttonPrimary)
            .setOrigin(0.5)
            .setInteractive();
        button.on('pointerdown', onNext);
        this.bob(button, { delay: 450 });
    }

    // ----- Ending dialogue (typewriter VN box) ------------------------------
    // Designer's layout: scene image 320x147 on top, dialogue box across the
    // bottom, 36x36 portrait, 8px speaker + body. Tap / SPACE / ENTER advances;
    // the first tap on a still-typing line completes it.
    showDialogue(entry, onDone) {
        this.clearUI();

        if (entry.image && this.textures.exists(entry.image)) {
            this.add.image(160, 0, entry.image).setOrigin(0.5, 0);
        }

        this.add.rectangle(160, 173, 316, 52, 0x000000, 0.85).setStrokeStyle(2, 0x6a6a6a);

        this.dlgPortrait = this.add.image(8, 155, 'main_menu').setOrigin(0, 0).setVisible(false);
        this.dlgSpeaker = this.add.text(50, 151, '', {
            fontFamily: '"Press Start 2P"', fontSize: '8px',
            color: '#ff5555', stroke: '#000000', strokeThickness: 2
        });
        this.dlgText = this.add.text(50, 163, '', {
            fontFamily: '"Press Start 2P"', fontSize: '8px',
            color: '#ffffff', stroke: '#000000', strokeThickness: 2,
            wordWrap: { width: 260 }, lineSpacing: 3
        });
        this.dlgArrow = this.add.text(308, 191, '▼', { fontFamily: 'Arial', fontSize: '12px', color: '#ffffff' })
            .setOrigin(0.5).setVisible(false);
        this.dlgArrowTween = this.tweens.add({
            targets: this.dlgArrow, alpha: { from: 1, to: 0.2 }, duration: 450, yoyo: true, repeat: -1
        });

        this.dlgLines = entry.dialogue;
        this.dlgIndex = 0;
        this.dlgOnDone = onDone;

        // Defer input binding one tick: the tap/key that opened this screen
        // (e.g. CONTINUAR) is still being processed and would count as an advance.
        this.dlgBindTimer = this.time.delayedCall(0, () => {
            this.input.on('pointerdown', this.advanceDialogue, this);
            this.input.keyboard.on('keydown-SPACE', this.advanceDialogue, this);
            this.input.keyboard.on('keydown-ENTER', this.advanceDialogue, this);
        });

        this.startDialogueLine();
    }

    startDialogueLine() {
        const line = this.dlgLines[this.dlgIndex];
        this.dlgSpeaker.setText(line.speaker || '');

        const portrait = PORTRAITS[line.speaker];
        if (portrait && this.textures.exists(portrait)) this.dlgPortrait.setTexture(portrait).setVisible(true);
        else this.dlgPortrait.setVisible(false);

        this.dlgFull = line.text || '';
        this.dlgChars = 0;
        this.dlgTyping = true;
        this.dlgText.setText('');
        this.dlgArrow.setVisible(false);

        if (this.dlgTimer) this.dlgTimer.remove();
        this.dlgTimer = this.time.addEvent({
            delay: 35, loop: true,
            callback: () => {
                this.dlgChars++;
                this.dlgText.setText(this.dlgFull.slice(0, this.dlgChars));
                if (this.dlgChars >= this.dlgFull.length) this.finishTyping();
            }
        });
    }

    finishTyping() {
        if (this.dlgTimer) { this.dlgTimer.remove(); this.dlgTimer = null; }
        this.dlgText.setText(this.dlgFull);
        this.dlgTyping = false;
        this.dlgArrow.setVisible(true);
    }

    advanceDialogue() {
        this.sound.play('sfx_click');
        if (this.dlgTyping) { this.finishTyping(); return; } // first tap completes the line
        this.dlgIndex++;
        if (this.dlgIndex >= this.dlgLines.length) {
            this.cleanupDialogue();
            this.dlgOnDone();
        } else {
            this.startDialogueLine();
        }
    }

    cleanupDialogue() {
        if (this.dlgTimer) { this.dlgTimer.remove(); this.dlgTimer = null; }
        if (this.dlgBindTimer) { this.dlgBindTimer.remove(); this.dlgBindTimer = null; }
        if (this.dlgArrowTween) { this.dlgArrowTween.stop(); this.dlgArrowTween = null; }
        this.input.off('pointerdown', this.advanceDialogue, this);
        this.input.keyboard.off('keydown-SPACE', this.advanceDialogue, this);
        this.input.keyboard.off('keydown-ENTER', this.advanceDialogue, this);
    }

    // --------------------------------------------------
    // Lore content
    // --------------------------------------------------

    getLoreText(key) {
        // Content lives in data/Lore.js (LORE) so it's editable in one place.
        return LORE[key] || { title: 'Error', text: 'Lore not found.' };
    }

    // Optional full-screen backdrop for a lore screen (entry.image is a path).
    drawLoreImage(lore) {
        if (lore && lore.image) {
            this.add.image(160, 100, lore.image).setOrigin(0.5).setDepth(-1);
        }
    }

    // --------------------------------------------------
    // Game over
    // --------------------------------------------------

    showGameOver() {
        this.clearUI();
        this.sound.play('sfx_gameover');

        this.add.text(160, 65, 'G A M E   O V E R', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        const restartButton = this.add.text(160, 145, 'REINICIAR', this.getStyles().danger)
            .setOrigin(0.5)
            .setInteractive();
        this.bob(restartButton);

        restartButton.on('pointerdown', () => {
            this.scene.start('MenuScene', { menuKey: 'MAIN_MENU' });
        });
    }
}
