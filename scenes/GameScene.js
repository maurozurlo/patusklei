const DEBUG_COLLISIONS = false;

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;
        this.bossHealth = 5;
        this.maxObstacles = 10;
    }

    init(data) {
        this.level = data.level || 1;
        this.isGameOver = false;
        this.score = 0;
        this.bossHealth = 5;
    }

    preload() {
        this.load.image('bg_builds', 'assets/images/bg_builds.png');
        this.load.image('cloud', 'assets/images/cloud.png');
        this.load.image('bg_beach', 'assets/images/bg_beach.png');

        this.load.spritesheet('buoy_idle', 'assets/images/buoy_idle.png', {
            frameWidth: 34,
            frameHeight: 62
        });

        this.load.spritesheet('patus_bidet_idle', 'assets/images/patus_bidet_idle.png', {
            frameWidth: 54,
            frameHeight: 66
        });

        // Preload background elements
        if (!this.backgroundManager) {
            this.backgroundManager = new BackgroundManager(this);
        }
        this.backgroundManager.preload();

        // Preload coins
        if (!this.coinManager) {
            this.coinManager = new CoinManager(this, 180);
        }
        this.coinManager.preload();

        // Preload finish line
        if (!this.finishLineManager) {
            this.finishLineManager = new FinishLineManager(this, 180);
        }
        this.finishLineManager.preload();
    }

    create() {
        const GROUND_Y = 180;

        this.obstaclesSpawned = 0;

        // Initialize managers
        this.backgroundManager = new BackgroundManager(this);
        this.playerManager = new PlayerManager(this, GROUND_Y);
        this.obstacleManager = new ObstacleManager(this, GROUND_Y);
        this.coinManager = new CoinManager(this, GROUND_Y);
        this.finishLineManager = new FinishLineManager(this, GROUND_Y);
        this.uiManager = new UIManager(this);
        this.levelManager = new LevelManager(this);

        // Setup
        this.backgroundManager.setup();
        this.setupGround(GROUND_Y);
        this.playerManager.setup();
        this.obstacleManager.setup();
        this.coinManager.setup();
        this.finishLineManager.setup();
        this.setupCollisions();
        this.uiManager.setup(this.level);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Start level
        this.levelManager.initializeLevel(this.level);
    }

    setupGround(groundY) {
        this.groundY = groundY;
        this.ground = this.add.rectangle(
            this.scale.width / 2,
            groundY + 4,
            this.scale.width,
            8,
            0x000000,
            0
        );
        this.physics.add.existing(this.ground, true);
    }

    setupCollisions() {
        this.physics.add.collider(this.playerManager.player, this.ground);
        this.physics.add.collider(
            this.playerManager.player,
            this.obstacleManager.obstacles,
            this.hitObstacle,
            null,
            this
        );
        this.physics.add.collider(
            this.playerManager.player,
            this.obstacleManager.bossProjectiles,
            this.hitObstacle,
            null,
            this
        );
        this.physics.add.overlap(
            this.playerManager.player,
            this.obstacleManager.dynamites,
            this.triggerDynamite,
            null,
            this
        );
        this.physics.add.overlap(
            this.playerManager.player,
            this.coinManager.coins,
            this.collectCoin,
            null,
            this
        );
    }

    setupFinishLineCollision() {
        // Setup collision after finish line is spawned
        if (this.finishLineManager.finishLine) {
            this.physics.add.overlap(
                this.playerManager.player,
                this.finishLineManager.finishLine,
                (player, finishLine) => this.finishLineManager.reachFinishLine(player, finishLine),
                null,
                this
            );
        }
    }

    update() {
        if (this.isGameOver) return;

        this.playerManager.handleInput(this.cursors, this.level);
        this.backgroundManager.update(this.levelManager.obstacleSpeed);
        this.obstacleManager.cleanupOffScreen();
        this.coinManager.cleanupOffScreen();
        this.finishLineManager.cleanupOffScreen();

        // Check if we should spawn the finish line
        if (this.obstaclesSpawned >= this.maxObstacles && !this.finishLineManager.isSpawned) {
            this.finishLineManager.spawnFinishLine(this.levelManager.obstacleSpeed);
            this.setupFinishLineCollision();
        }

        // Increment score
        //this.score += this.level;
        //this.uiManager.updateScore(this.score);
    }

    collectCoin(player, coin) {
        const coinValue = this.coinManager.collectCoin(player, coin);
        this.uiManager.updateScore(coinValue + this.score);
    }

    hitObstacle(player, obstacle) {
        if (this.isGameOver) return;

        this.isGameOver = true;
        this.physics.pause();
        player.setTint(0xff0000);

        // Add a slight delay so the player sees the "red" tint before switching
        this.time.delayedCall(1000, () => {
            // Start MenuScene and pass a data object
            this.scene.start('MenuScene', { showGameOver: true });
        });
    }

    triggerDynamite(player, dynamite) {
        if (!player.body.touching.down) {
            dynamite.destroy();
            this.bossHealth--;
            this.uiManager.updateBossHealth(this.bossHealth);

            if (this.bossHealth <= 0) {
                this.winGame();
            }
        }
    }

    winGame() {
        this.physics.pause();
        this.scene.stop();
        this.scene.get('MenuScene').showLoreScreen('GAME_COMPLETED');
    }
}