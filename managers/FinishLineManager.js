class FinishLineManager {
    constructor(scene, groundY) {
        this.scene = scene;
        this.groundY = groundY;
        this.finishLine = null;
        this.isSpawned = false;
    }

    preload() {
        this.scene.load.image('cle_welcome', 'assets/images/cle_welcome.png');
    }

    setup() {
        // Nothing to setup initially
    }

    spawnFinishLine(obstacleSpeed) {
        if (this.isSpawned) return;

        this.isSpawned = true;

        // Stop all spawning timers
        this.stopAllSpawning();

        // Create the finish line (piece of land)
        this.finishLine = this.scene.physics.add.sprite(820, this.groundY, 'cle_welcome');
        this.finishLine.setOrigin(0.5, 1);
        this.finishLine.body.velocity.x = -obstacleSpeed;
        this.finishLine.body.setAllowGravity(false);
        this.finishLine.setImmovable(true);
        this.finishLine.setDepth(10);

        console.log('Finish line spawned! Get ready to complete the level!');
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