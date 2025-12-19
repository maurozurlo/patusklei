class ObstacleManager {
    constructor(scene, groundY) {
        this.scene = scene;
        this.groundY = groundY;
        this.obstacles = null;
        this.bossProjectiles = null;
        this.dynamites = null;
    }

    setup() {
        this.createAnimations();
        this.createGroups();
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'buoy_idle',
            frames: this.scene.anims.generateFrameNumbers('buoy_idle', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });
    }

    createGroups() {
        this.obstacles = this.scene.physics.add.group();
        this.bossProjectiles = this.scene.physics.add.group();
        this.dynamites = this.scene.physics.add.group();
    }

    spawnObstacle(obstacleSpeed) {
        // Track spawned obstacles for finish line trigger
        this.scene.obstaclesSpawned++;

        const buoy = this.obstacles.create(320, this.groundY + 15, 'buoy_idle');
        buoy.setOrigin(0.5, 1);
        buoy.play('buoy_idle');
        buoy.body.velocity.x = -obstacleSpeed;
        buoy.body.setAllowGravity(false);
        buoy.setImmovable(true);
        buoy.setDepth(9);
        buoy.body.setSize(18, 40, true);
    }

    spawnBossProjectile(obstacleSpeed) {
        const projectile = this.bossProjectiles.create(
            800,
            Phaser.Math.Between(150, 350),
            'boss_projectile'
        );
        projectile.body.velocity.x = -obstacleSpeed * 1.5;
        projectile.body.setAllowGravity(false);
        projectile.setImmovable(true);
    }

    spawnDynamiteControl(obstacleSpeed) {
        const dynamite = this.dynamites.create(800, 380, 'dynamite_control');
        dynamite.body.velocity.x = -obstacleSpeed;
        dynamite.body.setAllowGravity(false);
        dynamite.setImmovable(true);
    }

    cleanupOffScreen() {
        this.obstacles.children.entries.forEach(obstacle => {
            if (obstacle.x < -50) obstacle.destroy();
        });

        this.bossProjectiles.children.entries.forEach(projectile => {
            if (projectile.x < -50) projectile.destroy();
        });

        this.dynamites.children.entries.forEach(dynamite => {
            if (dynamite.x < -50) dynamite.destroy();
        });
    }
}