class BackgroundManager {
    constructor(scene) {
        this.scene = scene;
        this.bgBuilds = null;
        this.bgBeach = null;
        this.clouds = [];
        this.waterSprites = [];
    }

    preload() {
        this.scene.load.spritesheet('water_anim', 'assets/images/water_anim.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    setup() {
        this.scene.cameras.main.setBackgroundColor('#00ffff');

        // Setup clouds (behind everything)
        this.setupClouds();

        this.bgBuilds = this.scene.add.tileSprite(
            0,
            60,
            this.scene.scale.width,
            67,
            'bg_builds'
        );
        this.bgBuilds.setOrigin(0, 0);
        this.bgBuilds.setScrollFactor(0);
        this.bgBuilds.tilePositionY = 0;

        this.bgBeach = this.scene.add.tileSprite(
            0,
            40,
            this.scene.scale.width,
            this.scene.scale.height,
            'bg_beach'
        );
        this.bgBeach.setOrigin(0, 0);
        this.bgBeach.setScrollFactor(0);

        // Setup water animation
        this.setupWater();
    }

    setupWater() {
        // Create water animation
        this.scene.anims.create({
            key: 'water_flow',
            frames: this.scene.anims.generateFrameNumbers('water_anim', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        const screenWidth = this.scene.sys.game.config.width;
        const waterHeight = 64; // 2 rows of 32px sprites
        const waterY = this.scene.sys.game.config.height - waterHeight;

        // Calculate how many sprites we need to fill the width
        const numSpritesX = Math.ceil(screenWidth / 32) + 1;
        const numSpritesY = 2; // 64px height = 2 rows

        // Create a grid of water sprites
        for (let row = 0; row < numSpritesY; row++) {
            for (let col = 0; col < numSpritesX; col++) {
                const water = this.scene.add.sprite(
                    col * 32,
                    waterY + (row * 32),
                    'water_anim'
                );
                water.setOrigin(0, 0);
                water.setDepth(5); // Above beach, below obstacles
                water.play('water_flow');

                // Offset animation start for variation
                water.anims.msPerFrame = 125;
                water.anims.currentFrame.index = Phaser.Math.Between(0, 3);

                this.waterSprites.push(water);
            }
        }
    }

    setupClouds() {
        // Create 3-5 clouds spread evenly across the screen
        const numClouds = Phaser.Math.Between(3, 5);
        const screenWidth = this.scene.sys.game.config.width;
        const spacing = screenWidth / numClouds;

        for (let i = 0; i < numClouds; i++) {
            // Spread clouds evenly with some randomness
            const baseX = (i * spacing) + (spacing / 2);
            const randomOffset = Phaser.Math.Between(-50, 50);

            const cloud = this.scene.add.image(
                baseX + randomOffset,
                Phaser.Math.Between(20, 80),
                'cloud'
            );
            cloud.setOrigin(0.5, 0.5);
            cloud.setAlpha(0.7);
            cloud.setDepth(-10); // Behind everything

            // Random speed for parallax effect
            cloud.speed = Phaser.Math.FloatBetween(0.0003, 0.0008);

            this.clouds.push(cloud);
        }
    }

    update(obstacleSpeed) {
        this.bgBuilds.tilePositionX += obstacleSpeed * 0.002;
        this.bgBeach.tilePositionX += obstacleSpeed * 0.001;

        const screenWidth = this.scene.sys.game.config.width;

        // Update clouds with parallax effect
        this.clouds.forEach(cloud => {
            cloud.x -= obstacleSpeed * cloud.speed;

            // Wrap cloud around when it goes off screen (left side)
            if (cloud.x < -cloud.width / 2) {
                cloud.x = screenWidth + cloud.width / 2;
                cloud.y = Phaser.Math.Between(20, 80);
            }
        });
    }
}