class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacleSpeed = 200;
    }

    initializeLevel(level) {
        console.log(`Starting Level: ${level}`);

        // Set speed based on level
        if (level === 1) {
            this.obstacleSpeed = 200;
        } else if (level === 2) {
            this.obstacleSpeed = 400;
        } else if (level === 3) {
            this.obstacleSpeed = 350;
        }

        // Clean up existing timers
        if (this.scene.obstacleTimer) {
            this.scene.obstacleTimer.destroy();
        }
        if (this.scene.dynamiteTimer) {
            this.scene.dynamiteTimer.destroy();
        }

        // Level-specific setup
        if (level === 1) {
            this.setupLevel1();
        } else if (level === 2) {
            this.setupLevel2();
        } else if (level === 3) {
            this.setupLevel3();
        }
    }

    setupLevel1() {
        this.scene.maxObstacles = 15;
        this.scene.obstaclesSpawned = 0;

        this.scene.obstacleTimer = this.scene.time.addEvent({
            delay: 3000,
            callback: () => this.scene.obstacleManager.spawnObstacle(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });

        // Spawn coins periodically
        this.scene.coinTimer = this.scene.time.addEvent({
            delay: 2500,
            callback: () => this.scene.coinManager.spawnCoin(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });
    }

    setupLevel2() {
        this.scene.obstacleTimer = this.scene.time.addEvent({
            delay: 1500,
            callback: () => this.scene.obstacleManager.spawnObstacle(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });

        // Spawn coins more frequently in level 2
        this.scene.coinTimer = this.scene.time.addEvent({
            delay: 2000,
            callback: () => this.scene.coinManager.spawnCoin(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });
    }

    setupLevel3() {
        // Boss projectiles
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => this.scene.obstacleManager.spawnBossProjectile(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });

        // Dynamite controls
        this.scene.dynamiteTimer = this.scene.time.addEvent({
            delay: 5000,
            callback: () => this.scene.obstacleManager.spawnDynamiteControl(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });

        // Coins during boss fight
        this.scene.coinTimer = this.scene.time.addEvent({
            delay: 3000,
            callback: () => this.scene.coinManager.spawnCoin(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });
    }
}