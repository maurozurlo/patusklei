class CoinManager {
    constructor(scene, groundY) {
        this.scene = scene;
        this.groundY = groundY;
        this.coins = null;
        this.tunaCansConsecutive = 0; // Consecutive without missing — drives the bonus bellpepper

        // Coin values
        this.TUNA_VALUE = 10;
        this.BELLPEPPER_VALUE = 50;
        this.COINS_FOR_BONUS = 5;

        // Pickup hitbox size (px). Coin sprites are 32×32, so this is the
        // physics body, not the art — bump it up to make collection more
        // forgiving (e.g. 40, 48), drop it toward 32 to make it tighter.
        this.COIN_HITBOX = 48;
    }

    preload() {
        this.scene.load.spritesheet('tunacan_coin', 'images/tunacan_coin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.scene.load.spritesheet('bellpepper_coin', 'images/bellpepper_coin.png', {
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

        // Spawn at varying heights. Level 2 uses lower heights because its jump
        // was capped (−450) for the bird — the higher ones needed apex-perfect
        // timing, so the top of the range is brought down.
        const heightVariations = this.scene.level === 2
            ? [this.groundY - 45, this.groundY - 65, this.groundY - 85]
            : [this.groundY - 60, this.groundY - 90, this.groundY - 120];

        const spawnHeight = Phaser.Utils.Array.GetRandom(heightVariations);

        const coin = this.coins.create(370, spawnHeight, coinType);
        coin.setOrigin(0.5, 0.5);
        coin.play(animKey); // Start the animation

        // Coins move at 70% of obstacle speed - this prevents them from syncing
        coin.body.velocity.x = -obstacleSpeed * 0.7;
        coin.body.setAllowGravity(false);
        coin.setImmovable(true);
        coin.body.setSize(this.COIN_HITBOX, this.COIN_HITBOX, true); // centered, forgiving pickup

        // Store metadata on the coin
        coin.coinValue = coinValue;
        coin.coinType = coinType;
        coin.wasCollected = false;
    }

    collectCoin(player, coin) {
        if (coin.wasCollected) return;

        coin.wasCollected = true;

        // Add points based on coin type
        this.scene.score += coin.coinValue;

        if (coin.coinType === 'tunacan_coin') {
            this.tunaCansConsecutive++;
            this.scene.sfx.tuna.play()
        } else if (coin.coinType === 'bellpepper_coin') {
            this.scene.sfx.pepper.play()
            // Persist across levels — each pepper is +1 boss heart and counts
            // toward the good/bad ending.
            Save.addPepper();
        }



        // Visual feedback (optional: add particle effect or animation here)
        coin.destroy();

        return coin.coinValue;
    }

    // The player has earned a bonus bellpepper (COINS_FOR_BONUS consecutive tuna)
    // that hasn't been spawned yet.
    isBonusOwed() {
        return this.tunaCansConsecutive >= this.COINS_FOR_BONUS;
    }

    // A bellpepper is currently on screen and not yet collected (so the level
    // shouldn't end out from under it).
    hasPendingBellPepper() {
        return this.coins.children.entries.some(
            c => c.coinType === 'bellpepper_coin' && !c.wasCollected
        );
    }

    // Force the earned bellpepper out at a low, easy-to-grab height — used when
    // the level is ending so the reward isn't stranded past the finish line.
    spawnBonus(obstacleSpeed) {
        const coin = this.coins.create(370, this.groundY - 45, 'bellpepper_coin');
        coin.setOrigin(0.5, 0.5);
        coin.play('bellpepper_spin');
        coin.body.velocity.x = -obstacleSpeed * 0.7;
        coin.body.setAllowGravity(false);
        coin.setImmovable(true);
        coin.body.setSize(this.COIN_HITBOX, this.COIN_HITBOX, true); // centered, forgiving pickup
        coin.coinValue = this.BELLPEPPER_VALUE;
        coin.coinType = 'bellpepper_coin';
        coin.wasCollected = false;
        this.tunaCansConsecutive = 0; // bonus consumed
    }

    cleanupOffScreen() {
        this.coins.children.entries.forEach(coin => {
            if (coin.x < -50) {
                // Reset the streak if a tuna can went off screen uncollected.
                if (!coin.wasCollected && coin.coinType === 'tunacan_coin') {
                    this.tunaCansConsecutive = 0;
                }
                coin.destroy();
            }
        });
    }
}