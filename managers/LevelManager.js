class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacleSpeed = 200;
        this.currentLevel = 1;
    }

    initializeLevel(level) {
        this.currentLevel = level;
        console.log(`Starting Level ${level}: ${this.getLevelName(level)}`);

        // Set speed and max obstacles based on level
        const levelConfig = this.getLevelConfig(level);
        this.obstacleSpeed = levelConfig.speed;
        this.scene.maxObstacles = levelConfig.maxObstacles;

        // Initialize obstacle counter for finish line trigger
        this.scene.obstaclesSpawned = 0;

        // Clean up existing timers
        this.cleanupTimers();

        // Level-specific setup
        this.setupLevelTimers(level);
    }

    getLevelConfig(level) {
        const configs = {
            1: {
                name: 'Beach Run',
                speed: 200,
                maxObstacles: 10,
                obstacleDelay: 3000,
                coinDelay: 2500
            },
            2: {
                name: 'City Sprint',
                speed: 300,
                maxObstacles: 15,
                obstacleDelay: 2000,
                coinDelay: 2000
            },
            3: {
                name: 'Boss Battle',
                speed: 350,
                maxObstacles: 999, // Boss fight doesn't use finish line
                projectileDelay: 1000,
                dynamiteDelay: 5000,
                coinDelay: 3000
            }
        };

        return configs[level] || configs[1];
    }

    getLevelName(level) {
        return this.getLevelConfig(level).name;
    }

    cleanupTimers() {
        const timers = [
            'obstacleTimer',
            'coinTimer',
            'dynamiteTimer',
            'bossProjectileTimer'
        ];

        timers.forEach(timerName => {
            if (this.scene[timerName]) {
                this.scene[timerName].destroy();
                this.scene[timerName] = null;
            }
        });
    }

    setupLevelTimers(level) {
        const config = this.getLevelConfig(level);

        if (level === 1) {
            this.setupLevel1(config);
        } else if (level === 2) {
            this.setupLevel2(config);
        } else if (level === 3) {
            this.setupLevel3(config);
        }
    }

    setupLevel1(config) {
        // Regular obstacles
        this.scene.obstacleTimer = this.scene.time.addEvent({
            delay: config.obstacleDelay,
            callback: () => this.scene.obstacleManager.spawnObstacle(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });

        // Spawn coins periodically
        this.scene.coinTimer = this.scene.time.addEvent({
            delay: config.coinDelay,
            callback: () => this.scene.coinManager.spawnCoin(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });
    }

    setupLevel2(config) {
        // Faster obstacles for city level
        this.scene.obstacleTimer = this.scene.time.addEvent({
            delay: config.obstacleDelay,
            callback: () => this.scene.obstacleManager.spawnObstacle(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });

        // More frequent coins in city level
        this.scene.coinTimer = this.scene.time.addEvent({
            delay: config.coinDelay,
            callback: () => this.scene.coinManager.spawnCoin(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });
    }

    setupLevel3(config) {
        // Boss projectiles
        this.scene.bossProjectileTimer = this.scene.time.addEvent({
            delay: config.projectileDelay,
            callback: () => this.scene.obstacleManager.spawnBossProjectile(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });

        // Dynamite controls
        this.scene.dynamiteTimer = this.scene.time.addEvent({
            delay: config.dynamiteDelay,
            callback: () => this.scene.obstacleManager.spawnDynamiteControl(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });

        // Coins during boss fight
        this.scene.coinTimer = this.scene.time.addEvent({
            delay: config.coinDelay,
            callback: () => this.scene.coinManager.spawnCoin(this.obstacleSpeed),
            callbackScope: this.scene,
            loop: true
        });
    }

    // Clean up when switching levels or ending game
    destroy() {
        this.cleanupTimers();
    }
}