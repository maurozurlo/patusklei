class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    init(data) {
        this.menuKey = data.menuKey || 'MAIN_MENU';
    }

    preload() {
        this.load.image('main_menu', 'images/main_menu.png');
        this.load.image('icon_soundon', 'images/icon_soundon.png');
        this.load.image('icon_soundoff', 'images/icon_soundoff.png');
        this.load.audio('sfx_click', 'audio/sfx_click.wav');

        // Auto-load any backdrop images referenced by lore entries (keyed by
        // their path), so a screen just needs `image: 'images/foo.png'`.
        Object.values(LORE).forEach(entry => {
            if (entry.image) this.load.image(entry.image, entry.image);
        });
    }

    create() {
        // Apply the persisted sound preference (global to the sound manager).
        this.sound.mute = !isMusicPlaying;

        // Click SFX on any UI button (every menu/lore control is interactive).
        this.input.on('gameobjectdown', () => this.sound.play('sfx_click'));

        // TEMPORARY: press D to open the boss-scene placement tool.
        this.input.keyboard.once('keydown-D', () => this.scene.start('DebugScene'));

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

        // Boss victory: good or bad ending based on peppers collected this run.
        if (this.menuKey === 'BOSS_ENDING') {
            const ending = Save.isGoodEnding() ? 'good' : 'bad';
            Save.unlockEnding(ending);
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
                fontSize: '12px',
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
                fontSize: '26px',
                fill: '#ff0000',
                stroke: outline,
                strokeThickness: 6
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

        this.showDebugLevelSelect();
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
        this.add.text(160, 40, lore.title, styles.subtitle)
            .setOrigin(0.5);

        this.add.text(10, 65, lore.text, styles.body);

        const continueButton = this.add.text(160, 190, 'CONTINUAR', styles.buttonPrimary)
            .setOrigin(0.5)
            .setInteractive();

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
                    this.scene.start('MenuScene');
                    break;
            }
        });
    }

    // Show a chain of lore screens; CONTINUAR advances, the last shows FIN and
    // returns to the main menu.
    showLoreSequence(keys, index = 0) {
        this.clearUI();
        const styles = this.getStyles();
        const lore = this.getLoreText(keys[index]);

        this.drawLoreImage(lore);
        this.add.text(160, 40, lore.title, styles.subtitle).setOrigin(0.5);
        this.add.text(10, 65, lore.text, styles.body);

        const last = index === keys.length - 1;
        const button = this.add.text(160, 190, last ? 'FIN' : 'CONTINUAR', styles.buttonPrimary)
            .setOrigin(0.5)
            .setInteractive();

        button.on('pointerdown', () => {
            if (last) this.scene.start('MenuScene');
            else this.showLoreSequence(keys, index + 1);
        });
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

        this.add.text(160, 65, 'G A M E   O V E R', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        const restartButton = this.add.text(160, 160, 'REINICIAR', this.getStyles().danger)
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MenuScene', { menuKey: 'MAIN_MENU' });
        });
    }
}
