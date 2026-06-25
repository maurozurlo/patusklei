class ObstacleManager {
    constructor(scene, groundY, level = 1) {
        this.scene = scene;
        this.groundY = groundY;
        this.level = level;
        this.obstacles = null;
        this.bossProjectiles = null;
        this.dynamites = null;

        // Level-specific obstacle configuration
        this.obstacleConfig = this.getObstacleConfig(level);
    }

    getObstacleConfig(level) {
        const configs = {
            1: {
                sprite: 'buoy_idle',
                animation: 'buoy_idle',
                width: 18,
                height: 40,
                offsetY: 15
            },
            2: {
                // A car is chosen at random from these variants on every spawn.
                variants: ['car_taxi', 'car_blue', 'car_party', 'car_pink'],
                width: 32,
                height: 24,
                offsetY: 12
            },
            3: {
                // Boss level doesn't use regular obstacles
                sprite: null,
                animation: null
            }
        };

        return configs[level] || configs[1];
    }

    setup() {
        this.createAnimations();
        this.createGroups();
    }

    createAnimations() {
        // Level 1: Buoy animation
        if (!this.scene.anims.exists('buoy_idle')) {
            this.scene.anims.create({
                key: 'buoy_idle',
                frames: this.scene.anims.generateFrameNumbers('buoy_idle', { start: 0, end: 2 }),
                frameRate: 6,
                repeat: -1
            });
        }

        // Level 2: one looping 2-frame animation per car variant.
        ['car_taxi', 'car_blue', 'car_party', 'car_pink'].forEach(key => {
            if (!this.scene.anims.exists(key)) {
                this.scene.anims.create({
                    key,
                    frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
                    frameRate: 8,
                    repeat: -1
                });
            }
        });
    }

    createGroups() {
        this.obstacles = this.scene.physics.add.group();
        this.bossProjectiles = this.scene.physics.add.group();
        this.dynamites = this.scene.physics.add.group();
    }

    spawnObstacle(obstacleSpeed) {
        // Don't spawn regular obstacles in boss level (or if nothing's configured)
        if (this.level === 3) return;
        if (!this.obstacleConfig.sprite && !this.obstacleConfig.variants) return;

        // Track spawned obstacles for finish line trigger
        this.scene.obstaclesSpawned++;

        // Single sprite (level 1) or a random variant from the list (level 2)
        const spriteKey = this.obstacleConfig.variants
            ? Phaser.Utils.Array.GetRandom(this.obstacleConfig.variants)
            : this.obstacleConfig.sprite;
        const animKey = this.obstacleConfig.animation || spriteKey;

        const obstacle = this.obstacles.create(
            320 + 50,
            this.groundY + this.obstacleConfig.offsetY,
            spriteKey
        );

        obstacle.setOrigin(0.5, 1);
        obstacle.play(animKey);
        obstacle.body.velocity.x = -obstacleSpeed;
        obstacle.body.setAllowGravity(false);
        obstacle.setImmovable(true);
        obstacle.setDepth(9);
        obstacle.body.setSize(
            this.obstacleConfig.width,
            this.obstacleConfig.height,
            true
        );
    }

    spawnBossProjectile(obstacleSpeed) {
        const projectile = this.bossProjectiles.create(
            320,
            Phaser.Math.Between(100, 150),
            'boss_projectile'
        );
        projectile.body.velocity.x = -obstacleSpeed * 1.5;
        projectile.body.setAllowGravity(false);
        projectile.setImmovable(true);
        projectile.setDepth(9);
    }

    spawnDynamiteControl(obstacleSpeed) {
        const dynamite = this.dynamites.create(
            320,
            this.groundY - 20,
            'dynamite_control'
        );
        dynamite.body.velocity.x = -obstacleSpeed;
        dynamite.body.setAllowGravity(false);
        dynamite.setImmovable(true);
        dynamite.setDepth(9);
    }

    cleanupOffScreen() {
        const groups = [this.obstacles, this.bossProjectiles, this.dynamites];

        groups.forEach(group => {
            group.children.entries.forEach(entity => {
                if (entity.x < -50) {
                    entity.destroy();
                }
            });
        });
    }

    // Clean up when switching levels
    destroy() {
        if (this.obstacles) this.obstacles.clear(true, true);
        if (this.bossProjectiles) this.bossProjectiles.clear(true, true);
        if (this.dynamites) this.dynamites.clear(true, true);
    }
}