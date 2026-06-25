const GROUND_Y = 185;

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

        // SOUND
        this.load.audio('sfx_crash', 'audio/sfx_crash.wav');
        this.load.audio('sfx_endlvl1', 'audio/sfx_endlvl1.wav');
        this.load.audio('sfx_gameover', 'audio/sfx_gameover.wav');
        this.load.audio('sfx_jump', 'audio/sfx_jump.wav');
        this.load.audio('sfx_pepper', 'audio/sfx_pepper.wav');
        this.load.audio('sfx_tuna', 'audio/sfx_tuna.wav');

        this.load.audio('bgm_lvl1', 'audio/bgm_lvl1.wav');

        // IMAGES
        this.load.image('bg_builds', 'images/bg_builds.png');
        this.load.image('cloud', 'images/cloud.png');
        this.load.image('bg_beach', 'images/bg_beach.png');
        this.load.image('bg_city', 'images/bg_city.png');

        // Boss scene assets (level 3 only)
        if (this.level === 3) {
            this.load.image('bg_boss', 'images/bg_boss.png');
            this.load.image('boss_floor', 'images/boss_floor.png');
            this.load.image('boss_body', 'images/boss_body.png');
            this.load.image('boss_hand_l', 'images/boss_hand_l.png');
            this.load.image('boss_hand_r', 'images/boss_hand_r.png');
            this.load.image('boss_head', 'images/boss_head.png');
            this.load.image('boss_sitting', 'images/boss_sitting.png');
        }

        // OBSTACLES
        this.load.spritesheet('buoy_idle', 'images/buoy_idle.png', {
            frameWidth: 34,
            frameHeight: 62
        });
        // Level 2 cars (each is a 2-frame sheet). One is picked at random per spawn.
        this.load.spritesheet('car_taxi', 'images/car_00.png', {
            frameWidth: 140,
            frameHeight: 64
        });
        this.load.spritesheet('car_blue', 'images/car_01.png', {
            frameWidth: 137,
            frameHeight: 60
        });
        this.load.spritesheet('car_party', 'images/car_02.png', {
            frameWidth: 137,
            frameHeight: 60
        });
        this.load.spritesheet('car_pink', 'images/car_03.png', {
            frameWidth: 137,
            frameHeight: 60
        });

        this.load.spritesheet('patus_bidet', 'images/patus_bidet.png', {
            frameWidth: 54,
            frameHeight: 66
        });

        this.load.spritesheet('patus_walk', 'images/patus_walk.png', {
            frameWidth: 55,
            frameHeight: 76
        });
        this.load.spritesheet('patus_jump', 'images/patus_jump.png', {
            frameWidth: 59,
            frameHeight: 76
        });
        this.load.spritesheet('patus_crouch', 'images/patus_crouch.png', {
            frameWidth: 55,
            frameHeight: 76
        });

        this.load.spritesheet('bidet_foam', 'images/bidet_foam.png', {
            frameWidth: 40,
            frameHeight: 16
        });

        this.load.spritesheet('bidet_splash', 'images/bidet_splash.png', {
            frameWidth: 64,
            frameHeight: 80
        });

        // Managers that own their own asset loading are constructed here so
        // their queued loads run during this scene's load phase. They are
        // reused (not rebuilt) in create().
        this.backgroundManager = new BackgroundManager(this, this.level);
        this.backgroundManager.preload();

        this.coinManager = new CoinManager(this, GROUND_Y);
        this.coinManager.preload();

        this.finishLineManager = new FinishLineManager(this, GROUND_Y);
        this.finishLineManager.preload();
    }

    create() {
        // SOUNDS
        this.sfx = {
            crash: this.sound.add('sfx_crash'),
            endlvl1: this.sound.add('sfx_endlvl1'),
            gameover: this.sound.add('sfx_gameover'),
            jump: this.sound.add('sfx_jump'),
            pepper: this.sound.add('sfx_pepper'),
            tuna: this.sound.add('sfx_tuna'),
            lvl1: this.sound.add('bgm_lvl1', { loop: true }),
        };


        this.obstaclesSpawned = 0;

        // Initialize managers. backgroundManager/coinManager/finishLineManager
        // were already constructed in preload() (they own asset loading); the
        // rest are created here.
        this.playerManager = new PlayerManager(this, GROUND_Y);
        this.obstacleManager = new ObstacleManager(this, GROUND_Y, this.level);
        this.uiManager = new UIManager(this);
        this.levelManager = new LevelManager(this);

        // Setup. Level 3 uses the static boss scene instead of the scrolling background.
        if (this.level === 3) {
            this.bossManager = new BossManager(this);
            this.bossManager.setup();
        } else {
            this.backgroundManager.setup();
        }
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
                (player, finishLine) => this.finishLineManager.reachFinishLine(player),
                null,
                this
            );
        }
    }


    update(time, delta) {
        if (this.isGameOver) return;

        this.playerManager.handleInput(this.cursors);

        // safety clamp: if the player somehow drops below the ground (physics glitch)
        if (this.playerManager.player.y > this.groundY) {
            this.playerManager.player.y = this.groundY;
            this.playerManager.player.setVelocityY(0);
        }

        if (this.level !== 3) {
            this.backgroundManager.update(this.levelManager.obstacleSpeed, delta);
        }
        this.obstacleManager.cleanupOffScreen();
        this.coinManager.cleanupOffScreen();
        this.finishLineManager.cleanupOffScreen();

        // Check if we should spawn the finish line
        if (this.obstaclesSpawned >= this.maxObstacles && !this.finishLineManager.isSpawned) {
            this.finishLineManager.spawnFinishLine(this.levelManager.obstacleSpeed);
            this.setupFinishLineCollision();
        }
    }

    collectCoin(player, coin) {
        // CoinManager.collectCoin already adds the value to this.score,
        // so the UI just mirrors the authoritative running total.
        this.coinManager.collectCoin(player, coin);
        this.uiManager.updateScore(this.score);
    }

    hitObstacle(player, obstacle) {
        if (this.isGameOver) return;

        this.isGameOver = true;
        this.physics.pause();
        player.setTint(0xff0000);

        this.sfx.crash.play();

        // Add a slight delay so the player sees the "red" tint before switching
        this.time.delayedCall(1000, () => {
            // Start MenuScene and pass a data object
            this.scene.start('MenuScene', { menuKey: 'GAME_OVER' });
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
        this.scene.start('MenuScene', { menuKey: 'GAME_COMPLETED' });
    }
}