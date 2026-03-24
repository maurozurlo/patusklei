class BackgroundManager {
    constructor(scene, level = 1) {
        this.scene = scene;
        this.level = level;
        this.bgBuilds = null;
        this.bgGround = null; // Renamed for clarity
        this.clouds = [];
        this.waterSprites = [];

        // Level-specific configuration
        this.config = this.getLevelConfig(level);
    }

    getLevelConfig(level) {
        const configs = {
            1: {
                skyColor: '#00ffff',
                groundTexture: 'bg_beach',
                hasWater: true,
                buildingsY: 60,
                groundY: 40
            },
            2: {
                skyColor: '#87ceeb',
                groundTexture: 'bg_city',
                hasWater: false,
                buildingsY: 30,
                groundY: 0
            }
        };

        return configs[level] || configs[1];
    }

    preload() {
        // Only load water sprite if needed
        if (this.config.hasWater) {
            this.scene.load.spritesheet('water_anim', 'assets/images/water_low.png', {
                frameWidth: 16,
                frameHeight: 16
            });
        }
    }

    setup() {
        this.scene.cameras.main.setBackgroundColor(this.config.skyColor);

        // Setup clouds (behind everything)
        this.setupClouds();

        // Setup buildings layer
        this.bgBuilds = this.scene.add.tileSprite(
            0,
            this.config.buildingsY,
            this.scene.scale.width,
            67,
            'bg_builds'
        );
        this.bgBuilds.setOrigin(0, 0);
        this.bgBuilds.setScrollFactor(0);
        this.bgBuilds.setDepth(-10);

        // Setup ground layer (beach or city)
        this.bgGround = this.scene.add.tileSprite(
            0,
            this.config.groundY,
            this.scene.scale.width,
            this.scene.scale.height,
            this.config.groundTexture
        );
        this.bgGround.setOrigin(0, 0);
        this.bgGround.setScrollFactor(0);
        this.bgGround.setDepth(-8);

        // Setup water animation only for beach level
        if (this.config.hasWater) {
            this.setupWater();
        }
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
        const waterHeight = 48; // 2 rows of 16px sprites
        const waterY = this.scene.sys.game.config.height - waterHeight;

        // Calculate how many sprites we need to fill the width
        const numSpritesX = Math.ceil(screenWidth / 16) + 1;
        const numSpritesY = 4; // 32px height = 2 rows

        // Create a grid of water sprites
        for (let row = 0; row < numSpritesY; row++) {
            for (let col = 0; col < numSpritesX; col++) {
                const water = this.scene.add.sprite(
                    col * 16,
                    waterY + (row * 16),
                    'water_anim'
                );
                water.setOrigin(0, 0);
                water.setDepth(5); // Above beach, below obstacles
                water.play('water_flow');
                water.setDepth(-10); // Behind everything
                // Offset animation start for variation
                water.anims.msPerFrame = 125;
                water.anims.currentFrame.index = Phaser.Math.Between(0, 2);

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
        this.bgGround.tilePositionX += obstacleSpeed * 0.001;

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