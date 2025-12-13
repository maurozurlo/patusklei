const DEBUG_COLLISIONS = false;
class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;
        this.bossHealth = 5; // For level 3
    }

    init(data) {
        // Receive the level information from MenuScene
        this.level = data.level || 1;
        this.isGameOver = false;
        this.score = 0;
        this.bossHealth = 5;
    }

    preload() {
        // Load player, ground, and basic obstacle sprites (16-bit style)
        // this.load.image('player', 'assets/images/runner.png');
        this.load.image('bg_builds', 'assets/images/bg_builds.png');
        this.load.image('bg_beach', 'assets/images/bg_beach.png');
        // this.load.image('obstacle_jump', 'assets/images/crate.png');
        // this.load.image('obstacle_duck', 'assets/images/wire.png');
        // this.load.image('dynamite_control', 'assets/images/dynamite.png');
        // this.load.image('boss_projectile', 'assets/images/bullet.png');

        this.load.spritesheet('buoy_idle', 'assets/images/buoy_idle.png', {
            frameWidth: 34,
            frameHeight: 62
        });

        this.load.spritesheet('patus_bidet_idle', 'assets/images/patus_bidet_idle.png', {
            frameWidth: 54,
            frameHeight: 66
        });
    }

    create() {
        // Constants
        const GROUND_Y = 180;

        this.obstaclesSpawned = 0;
        this.maxObstacles = 0;

        // Background
        this.setupBackground();

        // Physics
        this.setupGround(GROUND_Y);
        this.setupPlayer(GROUND_Y);
        this.setupObstacle();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Game objects
        this.setupGameGroups();
        this.setupCollisions();

        // UI
        this.setupUI();

        // Level
        this.initializeLevel(this.level);
    }

    setupObstacle() {
        this.anims.create({
            key: 'buoy_idle',
            frames: this.anims.generateFrameNumbers('buoy_idle', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });
    }

    setupBackground() {
        this.cameras.main.setBackgroundColor('#00ffff');
        this.bgBuilds = this.add.tileSprite(0, 60, this.scale.width, 67, 'bg_builds');
        this.bgBuilds.setOrigin(0, 0);
        this.bgBuilds.setScrollFactor(0);
        this.bgBuilds.tilePositionY = 0;
        this.bgBeach = this.add.tileSprite(0, 40, this.scale.width, this.scale.height, 'bg_beach');
        this.bgBeach.setOrigin(0, 0);
        this.bgBeach.setScrollFactor(0);


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

    // In your setupPlayer() method:
    setupPlayer(groundY) {
        this.anims.create({
            key: 'patus_bidet_idle',
            frames: this.anims.generateFrameNumbers('patus_bidet_idle', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });

        this.player = this.physics.add.sprite(50, groundY, 'patus_bidet_idle');
        this.player.setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(true);
        this.player.body.setSize(18, 40, true);
        this.player.play('patus_bidet_idle'); // Start the animation
    }

    setupGameGroups() {
        this.obstacles = this.physics.add.group();
        this.bossProjectiles = this.physics.add.group();
        this.dynamites = this.physics.add.group();
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);
        this.physics.add.collider(this.player, this.bossProjectiles, this.hitObstacle, null, this);
        this.physics.add.overlap(this.player, this.dynamites, this.triggerDynamite, null, this);
    }

    setupUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '20px',
            fill: '#000000'
        });

        if (this.level === 3) {
            this.bossHealthText = this.add.text(650, 16, `Boss HP: ${this.bossHealth}`, {
                fontSize: '20px',
                fill: '#ff0000'
            });
        }
    }

    initializeLevel(level) {
        console.log(`Starting Level: ${level}`);

        if (level === 1) {
            this.maxObstacles = 15;
            this.obstaclesSpawned = 0;

            this.obstacleTimer = this.time.addEvent({
                delay: 3000,
                callback: this.spawnObstacle,
                callbackScope: this,
                loop: true
            });
        }

        // Set running speed based on level
        let speed = 200; // Default slow speed for level 1
        if (level === 2) {
            speed = 400; // Faster speed
        } else if (level === 3) {
            speed = 350; // Moderate speed for boss fight
        }

        this.obstacleSpeed = speed;

        // Reset the obstacle/projectile timer
        if (this.obstacleTimer) {
            this.obstacleTimer.destroy();
        }

        // Level-specific spawn setup
        if (level === 1) {
            // Level 1: Only jumping obstacles, slow pace
            this.obstacleTimer = this.time.addEvent({ delay: 3000, callback: this.spawnObstacle, callbackScope: this, loop: true });
        } else if (level === 2) {
            // Level 2: Jumping and ducking obstacles, faster pace
            this.obstacleTimer = this.time.addEvent({ delay: 1500, callback: this.spawnObstacle, callbackScope: this, loop: true, args: [true] }); // Pass true to allow ducking obstacles
        } else if (level === 3) {
            // Level 3: Boss fight, projectiles and dynamite
            this.time.addEvent({ delay: 1000, callback: this.spawnBossProjectile, callbackScope: this, loop: true });
            this.dynamiteTimer = this.time.addEvent({ delay: 5000, callback: this.spawnDynamiteControl, callbackScope: this, loop: true });
        }
    }

    // Placeholder function for spawning any obstacle
    // Replace these methods in your GameScene class:

    spawnObstacle() {
        if (this.level === 1) {
            if (this.obstaclesSpawned >= this.maxObstacles) {
                this.obstacleTimer.remove();
                return;
            }
            this.obstaclesSpawned++;
        }

        const buoy = this.obstacles.create(320, this.groundY, 'buoy_idle');
        buoy.setOrigin(0.5, 1);
        buoy.play('buoy_idle');

        buoy.body.velocity.x = -this.obstacleSpeed;
        buoy.body.setAllowGravity(false);
        buoy.setImmovable(true);
        buoy.setDepth(10);
        buoy.body.setSize(18, 40, true);
    }


    spawnBossProjectile() {
        const projectile = this.bossProjectiles.create(800, Phaser.Math.Between(150, 350), 'boss_projectile');
        projectile.body.velocity.x = -this.obstacleSpeed * 1.5;
        projectile.body.setAllowGravity(false);
        projectile.setImmovable(true);
    }

    spawnDynamiteControl() {
        const dynamite = this.dynamites.create(800, 380, 'dynamite_control');
        dynamite.body.velocity.x = -this.obstacleSpeed;
        dynamite.body.setAllowGravity(false);
        dynamite.setImmovable(true);
    }

    update() {
        if (this.isGameOver) return;

        this.handlePlayerInput();

        this.bgBuilds.tilePositionX += this.obstacleSpeed * 0.002;
        this.bgBeach.tilePositionX += this.obstacleSpeed * 0.001;

        // Clean up off-screen objects
        this.obstacles.children.entries.forEach(obstacle => {
            if (obstacle.x < -50) {
                obstacle.destroy();
            }
        });

        this.bossProjectiles.children.entries.forEach(projectile => {
            if (projectile.x < -50) {
                projectile.destroy();
            }
        });

        this.dynamites.children.entries.forEach(dynamite => {
            if (dynamite.x < -50) {
                dynamite.destroy();
            }
        });

        // Check if player has run far enough for the next level
        /*if (this.level < 3 && this.score > 500) {
            const nextLevel = this.level + 1;
            let loreKey = nextLevel === 2 ? 'LEVEL_2_LORE' : 'BOSS_LORE';

            this.scene.stop();
            this.scene.get('MenuScene').showLoreScreen(loreKey);
            return;
        }*/

        // Increment score
        this.score += this.level;
        this.scoreText.setText('Score: ' + this.score);
    }

    handlePlayerInput() {
        const onGround = this.player.body.touching.down;

        // ** JUMP Logic **
        if (this.cursors.space.isDown && onGround) {
            this.player.setVelocityY(-650);
            // ... (later, change player sprite to jumping)
        }

        // ** DUCK Logic (Level 2 & 3) **
        if (this.level >= 2) {
            if (this.cursors.down.isDown) {
                // Shrink/change the player sprite to a ducking position
                this.player.body.setSize(this.player.width, this.player.height / 2, true);
                // ... (later, change player sprite to ducking)
            } else {
                // Restore player size if they were ducking
                this.player.body.setSize(this.player.width, this.player.height, true);
                // ... (later, change player sprite to running)
            }
        }
    }

    // Game Over condition
    hitObstacle(player, obstacle) {
        if (this.isGameOver) return;

        this.isGameOver = true;
        this.physics.pause();
        this.player.setTint(0xff0000); // Tint player red

        // Stop the current scene and show Game Over screen
        this.scene.stop();
        this.scene.get('MenuScene').showGameOver();
    }

    // Dynamite Trigger (Level 3 only)
    triggerDynamite(player, dynamite) {
        // Player must be jumping (not on the ground) to trigger it
        if (!player.body.touching.down) {
            dynamite.destroy(); // Remove the dynamite control
            this.bossHealth--; // Harm the boss
            this.bossHealthText.setText(`Boss HP: ${this.bossHealth}`);

            // Check for victory
            if (this.bossHealth <= 0) {
                this.winGame();
            }
        }
        // If player runs into it on the ground, it's just a regular obstacle
    }

    winGame() {
        this.physics.pause();
        // Stop the current scene and show Game Completed lore
        this.scene.stop();
        this.scene.get('MenuScene').showLoreScreen('GAME_COMPLETED');
    }
}