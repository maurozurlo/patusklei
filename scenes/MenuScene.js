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
                fontFamily: '"Press Start 2P"',
                fontSize: '26px',
                color: '#ffffff',
            },
            subtitle: {
                fontFamily: '"Press Start 2P"',
                fontSize: '18px',
                fill: '#ffcc00'
            },
            body: {
                fontFamily: '"Press Start 2P"',
                fontSize: '12px',
                fill: '#ffffff',
                wordWrap: { width: 310 }
            },
            buttonPrimary: {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                fill: '#00ff00'
            },
            buttonSecondary: {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                fill: '#ffffff'
            },
            danger: {
                fontFamily: '"Press Start 2P"',
                fontSize: '26px',
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
            `SONIDO: ${isMusicPlaying ? 'SI' : 'NO'}`,
            styles.buttonSecondary
        )
            .setOrigin(0.5)
            .setInteractive();

        this.musicButton.on('pointerdown', this.toggleMusic, this);
    }

    toggleMusic() {
        isMusicPlaying = !isMusicPlaying;
        this.musicButton.setText(`SONIDO: ${isMusicPlaying ? 'NO' : 'SI'}`);

        if (isMusicPlaying) {
            this.sound.mute = false;
        } else {
            this.sound.mute = true;
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
                title: 'Ciudad de Cle',
                text: "Patus Klei ha llegado a la mitica ciudad de Cle. Debe enfrentarse al terrible planeamiento urbano y recorrer sus turbulentas calles."
            },
            BOSS_LORE: {
                title: 'la Triple Panera',
                text: "Patus finalmente ha llegado a la guarida del perito ventrilocuista Lars Wampiola. Esquiva los proyectiles, usa la mandarina."
            },
            GAME_COMPLETED: {
                title: 'Victoria: Patus Klei',
                text: "Patus Klei derrotó a Lars Wampiola, perdió un ojo, una uvula, una vesícula y tres dedos del pie que reemplazó heróicamente con corchos. Bien jugado"
            },
            TRUE_ENDING: {
                title: 'El final de verdad',
                text: "Patus Klei encontró a Rodolfa Muschi Klei, su fiel mascota y amiga, Patus vivirá feliz y firmará la paz con Lars Wampiola en china. Gran juego muchachito, gracias por jugar a PATUS KLEI."
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
