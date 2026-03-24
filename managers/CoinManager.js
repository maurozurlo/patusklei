class CoinManager {
    constructor(scene, groundY) {
        this.scene = scene;
        this.groundY = groundY;
        this.coins = null;

        // Tracking stats
        this.tunaCansCollected = 0;
        this.tunaCansConsecutive = 0; // Consecutive without missing
        this.bellPeppersCollected = 0;
        this.coinsSpawned = 0;
        this.coinsMissed = 0;

        // Coin values
        this.TUNA_VALUE = 10;
        this.BELLPEPPER_VALUE = 50;
        this.COINS_FOR_BONUS = 5;
    }

    preload() {
        this.scene.load.spritesheet('tunacan_coin', 'assets/images/tunacan_coin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.scene.load.spritesheet('bellpepper_coin', 'assets/images/bellpepper_coin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    setup() {
        this.createAnimations();
        this.coins = this.scene.physics.add.group();
    }

    createAnimations() {
        // Tuna can animation (6 frames)
        this.scene.anims.create({
            key: 'tunacan_spin',
            frames: this.scene.anims.generateFrameNumbers('tunacan_coin', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Bell pepper animation (4 frames)
        this.scene.anims.create({
            key: 'bellpepper_spin',
            frames: this.scene.anims.generateFrameNumbers('bellpepper_coin', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }

    spawnCoin(obstacleSpeed) {
        // Determine if we should spawn a bonus coin
        const shouldSpawnBonus = this.tunaCansConsecutive >= this.COINS_FOR_BONUS;

        let coinType, coinValue, animKey;

        if (shouldSpawnBonus) {
            coinType = 'bellpepper_coin';
            coinValue = this.BELLPEPPER_VALUE;
            animKey = 'bellpepper_spin';
            this.tunaCansConsecutive = 0; // Reset counter after spawning bonus
        } else {
            coinType = 'tunacan_coin';
            coinValue = this.TUNA_VALUE;
            animKey = 'tunacan_spin';
        }

        // Spawn at varying heights (can be in the air or on ground)
        const heightVariations = [
            this.groundY - 60, // Low jump height
            this.groundY - 90, // Mid jump height
            this.groundY - 120 // High jump height
        ];

        const spawnHeight = Phaser.Utils.Array.GetRandom(heightVariations);

        const coin = this.coins.create(820, spawnHeight, coinType);
        coin.setOrigin(0.5, 0.5);
        coin.play(animKey); // Start the animation

        // Coins move at 70% of obstacle speed - this prevents them from syncing
        coin.body.velocity.x = -obstacleSpeed * 0.7;
        coin.body.setAllowGravity(false);
        coin.setImmovable(true);

        // Store metadata on the coin
        coin.coinValue = coinValue;
        coin.coinType = coinType;
        coin.wasCollected = false;

        this.coinsSpawned++;
    }

    checkForNearbyObstacles(spawnX, safeDistance) {
        // Check all obstacle groups
        const obstacleManager = this.scene.obstacleManager;

        // Check regular obstacles
        const obstacles = obstacleManager.obstacles.children.entries;
        for (let obstacle of obstacles) {
            if (Math.abs(obstacle.x - spawnX) < safeDistance) {
                return true;
            }
        }

        // Check boss projectiles (if they exist)
        if (obstacleManager.bossProjectiles) {
            const projectiles = obstacleManager.bossProjectiles.children.entries;
            for (let projectile of projectiles) {
                if (Math.abs(projectile.x - spawnX) < safeDistance) {
                    return true;
                }
            }
        }

        // Check dynamites (if they exist)
        if (obstacleManager.dynamites) {
            const dynamites = obstacleManager.dynamites.children.entries;
            for (let dynamite of dynamites) {
                if (Math.abs(dynamite.x - spawnX) < safeDistance) {
                    return true;
                }
            }
        }

        return false;
    }

    collectCoin(player, coin) {
        if (coin.wasCollected) return;

        coin.wasCollected = true;

        // Add points based on coin type
        this.scene.score += coin.coinValue;

        // Track collection stats
        if (coin.coinType === 'tunacan_coin') {
            this.tunaCansCollected++;
            this.tunaCansConsecutive++;
            this.scene.sfx.tuna.play()
        } else if (coin.coinType === 'bellpepper_coin') {
            this.bellPeppersCollected++;
            this.scene.sfx.pepper.play()
        }



        // Visual feedback (optional: add particle effect or animation here)
        coin.destroy();

        return coin.coinValue;
    }

    cleanupOffScreen() {
        this.coins.children.entries.forEach(coin => {
            if (coin.x < -50) {
                // Coin went off screen without being collected
                if (!coin.wasCollected) {
                    this.coinsMissed++;

                    // Reset consecutive counter if a tuna can was missed
                    if (coin.coinType === 'tunacan_coin') {
                        this.tunaCansConsecutive = 0;
                    }
                }
                coin.destroy();
            }
        });
    }

    getStats() {
        return {
            tunaCansCollected: this.tunaCansCollected,
            bellPeppersCollected: this.bellPeppersCollected,
            coinsSpawned: this.coinsSpawned,
            coinsMissed: this.coinsMissed,
            consecutiveStreak: this.tunaCansConsecutive
        };
    }

    reset() {
        this.tunaCansCollected = 0;
        this.tunaCansConsecutive = 0;
        this.bellPeppersCollected = 0;
        this.coinsSpawned = 0;
        this.coinsMissed = 0;
    }
}