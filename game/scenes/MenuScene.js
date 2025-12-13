class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Load any 16-bit style background or title assets here
        // this.load.image('title', 'assets/images/title_screen.png');
        //this.load.audio('bg_music', 'assets/audio/game_theme.mp3');
    }

    create() {
        // Start the background music on the menu
        /*this.music = this.sound.add('bg_music', { loop: true, volume: 0.5 });
        if (isMusicPlaying) {
            this.music.play();
        }*/

        this.showMainMenu();
    }

    showMainMenu() {
        // Clear previous UI elements if any
        this.children.removeAll();

        // ** Title Text **
        this.add.text(160, 100, 'PATUS KLEI', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'PixelFont', // Use a custom pixel font if possible
        }).setOrigin(0.5);

        // ** Start Button **
        const startButton = this.add.text(160, 160, 'START GAME', {
            fontSize: '24px',
            fill: '#00ff00'
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            // Transition to the initial lore screen
            this.showLoreScreen('LEVEL_1_LORE');
        });

        // ** Music Toggle Button **
        this.musicButton = this.add.text(160, 190, `MUSIC: ${isMusicPlaying ? 'ON' : 'OFF'}`, {
            fontSize: '18px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        //this.musicButton.on('pointerdown', this.toggleMusic, this);
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

    // A universal function to show the lore screens
    showLoreScreen(key) {
        this.children.removeAll();
        const loreData = this.getLoreText(key);

        // Black background, white text for lore
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(10, 50, loreData.title, { fontSize: '18px', fill: '#ffcc00' });
        this.add.text(10, 70, loreData.text, { fontSize: '12px', fill: '#ffffff', wordWrap: { width: 310 } });

        const continueButton = this.add.text(160, 190, 'CONTINUE', {
            fontSize: '12px',
            fill: '#00ff00'
        }).setOrigin(0.5).setInteractive();

        continueButton.on('pointerdown', () => {
            // Determine the next action based on the lore key
            switch (key) {
                case 'LEVEL_1_LORE':
                    // Stop music for now, maybe restart it in GameScene or keep it playing
                    // this.music.stop(); 
                    this.scene.start('GameScene', { level: 1 });
                    break;
                case 'LEVEL_2_LORE':
                    this.scene.start('GameScene', { level: 2 });
                    break;
                case 'BOSS_LORE':
                    this.scene.start('GameScene', { level: 3 }); // Boss Fight
                    break;
                case 'GAME_COMPLETED':
                    this.scene.start('MenuScene'); // Go back to main menu
                    break;
            }
        });
    }

    // Dummy function to hold the lore text
    getLoreText(key) {
        const lore = {
            LEVEL_1_LORE: {
                title: 'The Training Grounds',
                text: "The internet has slowed to a crawl. The dreaded Server Overlord has activated the 'Slow-Net Protocol.' You, the last-standing 16-bit runner, must bypass the initial slow-firewall. Your training begins now: practice your leaps to overcome the basic system packets. The journey is long and pixelated."
            },
            LEVEL_2_LORE: {
                title: 'The Data Highway',
                text: "The Overlord is now aware of your progress and has increased the bandwidth! Data streams are flying by at high speed, requiring both precision jumping and quick duck maneuvers to avoid the corrupted packets. Prepare for a surge of difficulty; only the fastest runners survive the highway."
            },
            BOSS_LORE: {
                title: 'The Server Core: Final Stand',
                text: "You've reached the central server core, home of the Overlord! He’s firing high-density denial-of-service projectiles. Your only hope is to activate the emergency dynamite controls, which will periodically spawn nearby. Dodge the attacks, activate the charges, and restore the internet to full speed!"
            },
            GAME_COMPLETED: {
                title: 'Victory: The Net is Free!',
                text: "The Server Overlord's core has been shattered by your dynamite charges! The Slow-Net Protocol is disabled. Bandwidth is restored, and the internet is once again a place of high-speed wonder. You are the hero of the pixelverse. Congratulations, runner!"
            }
        };
        return lore[key] || { title: 'Error', text: 'Lore not found.' };
    }

    // Function to be called from GameScene when the player loses
    showGameOver() {
        this.children.removeAll();
        //   this.cameras.main.setBackgroundColor('#800000'); // Reddish tint for Game Over

        this.add.text(160, 150, 'G A M E   O V E R', {
            fontSize: '50px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        const restartButton = this.add.text(160, 300, 'RESTART GAME', {
            fontSize: '30px',
            fill: '#ff0000'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MenuScene'); // Go back to the main menu
        });
    }
}