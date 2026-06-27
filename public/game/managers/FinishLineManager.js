class FinishLineManager {
    constructor(scene, groundY) {
        this.scene = scene;
        this.groundY = groundY;
        this.finishLine = null;
        this.isSpawned = false;
    }

    preload() {
        this.scene.load.image('cle_welcome', 'images/cle_welcome.png');
        this.scene.load.image('boss_welcome', 'images/boss_welcome.png');
    }

    setup() {
        // Nothing to setup initially
    }

    getFinishTexture() {
        // Level 1 arrives at the city, level 2 at the boss.
        const textures = { 1: 'cle_welcome', 2: 'boss_welcome' };
        return textures[this.scene.level] || 'cle_welcome';
    }

    // Called once the obstacle cap is hit. Claims the level-end immediately and
    // stops spawning. If the player earned a final bellpepper that never made it
    // out, send it first with runway and delay the (faster) arrival sprite so it
    // doesn't overtake the pepper — otherwise you'd see a coin you can't reach.
    beginLevelEnd(obstacleSpeed, coinManager) {
        if (this.isSpawned) return;
        this.isSpawned = true;     // claim now so update() won't re-enter
        this.stopAllSpawning();    // no more obstacles/coins from here

        // Earned-but-unspawned bellpepper → send it out now. Already in flight →
        // just wait. Either way, delay the faster finish line so the pepper
        // reaches the player first instead of being left behind the goal.
        let delay = 0;
        if (coinManager && coinManager.isBonusOwed()) {
            coinManager.spawnBonus(obstacleSpeed);
            delay = 1500;
        } else if (coinManager && coinManager.hasPendingBellPepper()) {
            delay = 1500;
        }
        this.scene.time.delayedCall(delay, () => this.createFinishLine(obstacleSpeed));
    }

    createFinishLine(obstacleSpeed) {
        this.scene.sound.play('sfx_endlvl1');

        // The finish line (piece of land) the player rides in on.
        this.finishLine = this.scene.physics.add.sprite(370, this.groundY, this.getFinishTexture());
        this.finishLine.setOrigin(0.5, 1);
        this.finishLine.body.velocity.x = -obstacleSpeed;
        this.finishLine.body.setAllowGravity(false);
        this.finishLine.setImmovable(true);
        this.finishLine.setDepth(10);

        this.scene.setupFinishLineCollision();
    }

    stopAllSpawning() {
        // Stop obstacle spawning
        if (this.scene.obstacleTimer) {
            this.scene.obstacleTimer.remove();
            this.scene.obstacleTimer = null;
        }

        // Stop coin spawning
        if (this.scene.coinTimer) {
            this.scene.coinTimer.remove();
            this.scene.coinTimer = null;
        }

        // Stop boss projectiles (level 3)
        if (this.scene.bossProjectileTimer) {
            this.scene.bossProjectileTimer.remove();
            this.scene.bossProjectileTimer = null;
        }

        // Stop dynamite spawning (level 3)
        if (this.scene.dynamiteTimer) {
            this.scene.dynamiteTimer.remove();
            this.scene.dynamiteTimer = null;
        }
    }

    reachFinishLine(player) {
        if (this.scene.isGameOver) return;

        console.log('Level Complete!');

        // Mark as complete
        this.scene.isGameOver = true;
        this.scene.physics.pause();

        // Visual feedback
        player.setTint(0x00ff00); // Green tint for success

        this.scene.time.delayedCall(1000, () => {
            if (this.scene.level < 3) {
                const nextLevel = this.scene.level + 1;
                Save.unlockLevel(nextLevel); // reached the next level (for a level-select)
                const menuKey = nextLevel === 2 ? 'LEVEL_2_LORE' : 'BOSS_LORE';
                this.scene.scene.start('MenuScene', { menuKey });
            } else {
                this.scene.scene.start('MenuScene', { menuKey: 'GAME_COMPLETED' });
            }
        });

    }

    cleanupOffScreen() {
        if (this.finishLine && this.finishLine.x < -this.finishLine.width) {
            // Player missed the finish line somehow
            console.log('Missed the finish line!');
            this.finishLine.destroy();
        }
    }

    reset() {
        this.isSpawned = false;
        if (this.finishLine) {
            this.finishLine.destroy();
            this.finishLine = null;
        }
    }
}