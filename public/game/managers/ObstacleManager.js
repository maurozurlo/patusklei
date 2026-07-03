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

        // Level 2 duck-under bird. The hitbox sits at y 102-142 (origin bottom
        // at y=142): a standing Patus (body top 135 on lvl2) is still hit, a
        // crouch ducks under it (< 160), and the lowered jump (apex feet ~117)
        // can't lift him above it. Tunable.
        this.birdConfig = { y: 152, width: 40, height: 40, offsetX: 10, offsetY: 5 };
        this.birdHintShown = false;
        this.jumpHintShown = false;
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

        // Level 2: duck-under bird (4-frame flap, authored at 100ms/frame).
        if (!this.scene.anims.exists('bird_fly')) {
            this.scene.anims.create({
                key: 'bird_fly',
                frames: this.scene.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
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

        // The spawn that reaches the cap lines up with the finish line (both at
        // x=370), so skip its sprite — the counter still advances and triggers
        // the finish line, leaving a clean run-up to the city/boss.
        if (this.scene.obstaclesSpawned >= this.scene.maxObstacles) return;

        // Level 2: every 4th obstacle is a duck-under bird instead of a car. It
        // takes a car's slot, so it's naturally spaced between cars. The first
        // few are cars to let the player warm up.
        if (this.level === 2 && this.scene.obstaclesSpawned % 4 === 0) {
            this.spawnBird(obstacleSpeed);
            return;
        }

        // Level 1: teach jump as the very first obstacle appears (it's still far
        // right, so the player has time to read it before it arrives).
        if (this.level === 1 && !this.jumpHintShown) {
            this.jumpHintShown = true;
            this.scene.uiManager.showHint('jump');
        }

        // Single sprite (level 1) or a random variant from the list (level 2)
        const spriteKey = this.obstacleConfig.variants
            ? Phaser.Utils.Array.GetRandom(this.obstacleConfig.variants)
            : this.obstacleConfig.sprite;
        const animKey = this.obstacleConfig.animation || spriteKey;

        // Each car variant honks its own horn as it drives in.
        const horn = ObstacleManager.CAR_HORNS[spriteKey];
        if (horn && this.scene.sfx?.[horn]) this.scene.sfx[horn].play();

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

    // Flying obstacle (level 2): same obstacles group + collider as the cars
    // (so hitting it is a crash), but airborne at crouch height and un-jumpable.
    spawnBird(obstacleSpeed) {
        const c = this.birdConfig;
        const bird = this.obstacles.create(320 + 50, c.y, 'bird');
        bird.setOrigin(0.5, 1);
        bird.play('bird_fly');
        bird.body.velocity.x = -obstacleSpeed;
        bird.body.setAllowGravity(false);
        bird.setImmovable(true);
        bird.setDepth(9);
        bird.body.setSize(c.width, c.height, false);
        bird.body.setOffset(c.offsetX, c.offsetY);
        bird.isBird = true; // so hitObstacle plays the bird hit cue

        // One-time "duck!" hint the first time a bird shows up.
        if (!this.birdHintShown) {
            this.birdHintShown = true;
            this.scene.uiManager.showHint("crouch");
        }
        return bird;
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

// Car variant → horn sfx key (registered in GameScene.create).
// car_taxi=car_00, car_blue=car_01, car_party=car_02, car_pink=car_03.
ObstacleManager.CAR_HORNS = {
    car_taxi: 'horn_taxi',
    car_blue: 'horn_plain',
    car_party: 'horn_clown',
    car_pink: 'horn_fun',
};