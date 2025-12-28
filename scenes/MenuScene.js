class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    init(data) {
        this.menuKey = data.menuKey || 'MAIN_MENU';
    }

    create() {
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
        return {
            title: {
                fontFamily: 'PixelFont',
                fontSize: '32px',
                fill: '#ffffff'
            },
            subtitle: {
                fontSize: '18px',
                fill: '#ffcc00'
            },
            body: {
                fontSize: '12px',
                fill: '#ffffff',
                wordWrap: { width: 310 }
            },
            buttonPrimary: {
                fontSize: '24px',
                fill: '#00ff00'
            },
            buttonSecondary: {
                fontSize: '18px',
                fill: '#ffffff'
            },
            danger: {
                fontSize: '28px',
                fill: '#ff0000'
            }
        };
    }

    // --------------------------------------------------
    // Main menu
    // --------------------------------------------------

    showMainMenu() {
        this.clearUI();
        const styles = this.getStyles();

        this.add.text(160, 90, 'PATUS KLEI', styles.title)
            .setOrigin(0.5);

        const startButton = this.add.text(160, 145, 'INICIAR JUEGO', styles.buttonPrimary)
            .setOrigin(0.5)
            .setInteractive();

        startButton.on('pointerdown', () => {
            this.showLoreScreen('LEVEL_1_LORE');
        });

        this.musicButton = this.add.text(
            160,
            175,
            `MUSIC: ${isMusicPlaying ? 'ON' : 'OFF'}`,
            styles.buttonSecondary
        )
            .setOrigin(0.5)
            .setInteractive();

        // this.musicButton.on('pointerdown', this.toggleMusic, this);
    }

    toggleMusic() {
        isMusicPlaying = !isMusicPlaying;
        this.musicButton.setText(`MUSIC: ${isMusicPlaying ? 'ON' : 'OFF'}`);

        if (isMusicPlaying) {
            this.music.play();
        } else {
            this.music.pause();
        }
    }

    // --------------------------------------------------
    // Lore screens
    // --------------------------------------------------

    showLoreScreen(key) {
        this.clearUI();
        const styles = this.getStyles();
        const lore = this.getLoreText(key);

        this.add.text(160, 40, lore.title, styles.subtitle)
            .setOrigin(0.5);

        this.add.text(10, 65, lore.text, styles.body);

        const continueButton = this.add.text(160, 190, 'CONTINUAR', styles.buttonPrimary)
            .setOrigin(0.5)
            .setInteractive();

        continueButton.on('pointerdown', () => {
            switch (key) {
                case 'LEVEL_1_LORE':
                    this.scene.start('GameScene', { level: 2 });
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

    // --------------------------------------------------
    // Lore content
    // --------------------------------------------------

    getLoreText(key) {
        const lore = {
            LEVEL_1_LORE: {
                title: 'Los Inicios',
                text: "Apreciado amigo Patus Klei, nacido en agosto de 1907. A los 16 años escuchó el llamado de la tierra de Cle. Construyó su bidet y zarpó. Traga el atún y los morrones. Evita las boyas."
            },
            LEVEL_2_LORE: {
                title: 'The Data Highway',
                text: "The Overlord is now aware of your progress and has increased the bandwidth! Data streams are flying by at high speed, requiring both precision jumping and quick duck maneuvers to avoid the corrupted packets."
            },
            BOSS_LORE: {
                title: 'The Server Core: Final Stand',
                text: "You've reached the central server core, home of the Overlord! He’s firing high-density denial-of-service projectiles. Activate the emergency dynamite controls and bring the system down."
            },
            GAME_COMPLETED: {
                title: 'Victory: The Net is Free!',
                text: "The Server Overlord's core has been shattered. Bandwidth is restored, the internet is free, and you are now a pixel legend."
            }
        };

        return lore[key] || { title: 'Error', text: 'Lore not found.' };
    }

    // --------------------------------------------------
    // Game over
    // --------------------------------------------------

    showGameOver() {
        this.clearUI();

        this.add.text(160, 65, 'G A M E   O V E R', {
            fontSize: '30px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        const restartButton = this.add.text(160, 160, 'REINICIAR', this.getStyles().danger)
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MenuScene', { menuKey: 'MAIN_MENU' });
        });
    }
}
