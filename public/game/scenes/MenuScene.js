class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    init(data) {
        this.menuKey = (data && data.menuKey) || 'MAIN_MENU';
        this.forceEnding = (data && data.forceEnding) || null; // debug: 'good'|'bad'
        this.retryLevel = (data && data.level) || 1; // GAME_OVER: level to retry
    }

    preload() {
        this.load.image('main_menu', 'images/main_menu.png');
        this.load.image('icon_soundon', 'images/icon_soundon.png');
        this.load.image('icon_soundoff', 'images/icon_soundoff.png');
        this.load.audio('sfx_click', 'audio/sfx_click.wav');
        this.load.audio('sfx_gameover', 'audio/sfx_gameover.wav');
        this.load.audio('bgm_menu', 'audio/bgm_menu.wav');
        this.load.audio('bgm_goodend', 'audio/bgm_goodend.ogg');
        this.load.audio('bgm_badend', 'audio/bgm_badend.ogg');

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

        // Boss victory: peppers decide good/bad in a real run; the debug D key
        // forces one (forceEnding) so they can be compared. Computed up front so
        // both the ending's own track and showLoreSequence below can use it.
        if (this.menuKey === 'BOSS_ENDING') {
            this.ending = this.forceEnding || (Save.isGoodEnding() ? 'good' : 'bad');
        }

        // Looping menu/lore background track. Global mute (above + toggleMusic)
        // covers it, so there's nothing per-sound to manage here. Skipped on the
        // Game Over screen, which has its own jingle (sfx_gameover). The boss
        // ending plays its own good/bad track instead, which keeps looping through
        // the credits roll since sound isn't stopped between showLoreSequence and
        // showCredits (only the scene changes stop it).
        if (this.menuKey === 'GAME_OVER') {
            // no bgm; showGameOver() plays sfx_gameover instead
        } else if (this.menuKey === 'BOSS_ENDING') {
            this.sound.add(this.ending === 'good' ? 'bgm_goodend' : 'bgm_badend', { loop: true }).play();
        } else {
            this.sound.add('bgm_menu', { loop: true }).play();
        }

        // Click SFX on any UI button (every menu/lore control is interactive).
        this.input.on('gameobjectdown', () => this.sound.play('sfx_click'));

        // DEBUG: press D to cycle good ↔ bad ending (to compare them quickly).
        this.input.keyboard.on('keydown-D', () => {
            const next = this.forceEnding === 'good' ? 'bad' : 'good';
            this.scene.start('MenuScene', { menuKey: 'BOSS_ENDING', forceEnding: next });
        });

        // SPACE / ENTER trigger the current screen's primary button (start /
        // continue / restart) so the menus aren't click-only. Each screen arms
        // its action via setPrimaryAction(). `event.repeat` is ignored so a key
        // still held from gameplay (space is jump) can't auto-repeat through
        // screens — only a fresh press counts. Dialogue screens manage their own
        // keys, so they leave _primaryAction null.
        this.input.keyboard.addCapture('SPACE,ENTER');
        this._primaryAction = null;
        const primary = (event) => {
            if (event.repeat || !this._primaryAction) return;
            this.sound.play('sfx_click');
            this._primaryAction();
        };
        this.input.keyboard.on('keydown-SPACE', primary);
        this.input.keyboard.on('keydown-ENTER', primary);

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

        if (this.menuKey === 'BOSS_ENDING') {
            if (!this.forceEnding) Save.unlockEnding(this.ending);
            this.showLoreSequence(LORE_SEQUENCES[this.ending]);
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
        this._primaryAction = null; // each screen re-arms its own keyboard action
    }

    // Arm SPACE/ENTER for the current screen's primary button (see create()).
    // Pass null (via clearUI) to disable keyboard advance on a screen.
    setPrimaryAction(fn) {
        this._primaryAction = fn;
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
            .setInteractive({ useHandCursor: true });
        this.bob(startButton);

        const start = () => {
            Save.startNewGame(); // fresh run: reset peppers, bump timesPlayed
            this.showLoreScreen('LEVEL_1_LORE');
        };
        startButton.on('pointerdown', start);
        this.setPrimaryAction(start); // SPACE / ENTER also start the game

        // Sound toggle icon, anchored top-right with a little padding.
        const pad = 8;
        this.musicButton = this.add.image(320 - pad, pad, isMusicPlaying ? 'icon_soundon' : 'icon_soundoff')
            .setOrigin(1, 0)
            .setDepth(60)
            .setInteractive({ useHandCursor: true });

        this.musicButton.on('pointerdown', this.toggleMusic, this);

        // Level select, unlocked once the game's been beaten (persisted in Save).
        if (Save.isGameCompleted()) this.showLevelSelect();
    }

    // Post-game level select: jump straight into any level (skips lore). Shown on
    // the main menu only after the game's been beaten once (see showMainMenu).
    showLevelSelect() {
        this.add.rectangle(160, 193, 320, 15, 0x000000, 0.6).setDepth(50);
        this.add.text(50, 189, 'NIVELES:', {
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
            .setInteractive({ useHandCursor: true });
        this.bob(continueButton, { delay: 450 });

        const advance = () => {
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
        };
        continueButton.on('pointerdown', advance);
        this.setPrimaryAction(advance);
    }

    // Play a chain of ending screens. Each entry renders either as a typewriter
    // dialogue (it has a `dialogue` array) or a plain narration screen. The last
    // one returns to the main menu.
    showLoreSequence(keys, index = 0) {
        const entry = this.getLoreText(keys[index]);
        const last = index === keys.length - 1;
        const next = () => {
            // After the final ending screen, roll the credits before the menu.
            if (last) this.showCredits();
            else this.showLoreSequence(keys, index + 1);
        };

        if (entry.dialogue) this.showDialogue(entry, next);
        else this.renderNarration(entry, last, next);
    }

    // Scrolling credits roll, shown once the ending sequence finishes (and so also
    // reachable via the debug D-key ending preview). The whole CREDITS list is laid
    // into a container and tweened up from below the screen; when the last line
    // clears the top — or the player taps / presses SPACE·ENTER to skip — it
    // returns to the main menu. Content lives in data/Credits.js.
    showCredits() {
        this.clearUI();
        const styles = this.getStyles();
        const nameStyle = { ...styles.subtitle, fontSize: '14px', align: 'center' };
        const roleStyle = { ...styles.body, fontSize: '8px', align: 'center', wordWrap: { width: 280 } };

        // Build the roll: each entry is an optional name line + a role line.
        const roll = this.add.container(0, 210);
        let y = 0;
        CREDITS.forEach(entry => {
            if (entry.name) {
                const nameText = this.add.text(160, y, entry.name, nameStyle).setOrigin(0.5, 0);
                roll.add(nameText);
                y += nameText.height + 4;
            }
            const roleText = this.add.text(160, y, entry.role, roleStyle).setOrigin(0.5, 0);
            roll.add(roleText);
            y += roleText.height + 24;
        });

        let ended = false;
        const finish = () => {
            if (ended) return; // tween end + a skip tap could both fire
            ended = true;
            this.scene.start('MenuScene', { menuKey: 'MAIN_MENU' });
        };

        // Scroll the whole roll up until the last line clears the top (~40 px/sec,
        // slow enough to read), then exit to the menu.
        const distance = 210 + y;
        this.tweens.add({
            targets: roll,
            y: -y,
            duration: (distance / 40) * 1000,
            ease: 'Linear',
            onComplete: finish
        });

        // Persistent skip hint, kept legible with a backing bar as text scrolls past.
        this.add.rectangle(160, 192, 320, 14, 0x000000, 0.7).setDepth(10);
        this.add.text(160, 192, 'SALTAR', { ...styles.body, fontSize: '8px', fill: '#888888' })
            .setOrigin(0.5)
            .setDepth(11);

        // Defer skip binding one tick so the tap/key that opened this screen isn't
        // counted as a skip (same guard as showDialogue).
        this.time.delayedCall(0, () => {
            this.input.once('pointerdown', finish);
            this.setPrimaryAction(finish);
        });
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
            .setInteractive({ useHandCursor: true });
        button.on('pointerdown', onNext);
        this.setPrimaryAction(onNext);
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

        const retryButton = this.add.text(160, 145, '¿REINTENTAR?', this.getStyles().danger)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        this.bob(retryButton);

        // Retry drops straight back into the level that was lost (skips its lore).
        const retry = () => this.scene.start('GameScene', { level: this.retryLevel });
        retryButton.on('pointerdown', retry);
        this.setPrimaryAction(retry);
    }
}
