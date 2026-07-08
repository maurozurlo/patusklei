// Length (ms) of each level's arrival jingle, keyed by level. Used to bound
// reachFinishLine()'s wait so a sound failure (dropped 'complete' event,
// mobile audio context hiccup, etc.) can't soft-lock the level-end.
const END_SOUND_DURATION_MS = { 1: 4500, 2: 8000, 3: 4500 };

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
        // Keep a handle to the arrival jingle so reachFinishLine() can wait for it
        // to finish before leaving for the menu (the scene change stops all sounds,
        // so transitioning early would clip it). Level 1 arrives at the city,
        // level 2 at the boss — each has its own jingle.
        this.endSound = this.scene.level === 2 ? this.scene.sfx.endlvl2 : this.scene.sfx.endlvl1;
        this.endSound.play();

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
    }

    reachFinishLine(player) {
        if (this.scene.isGameOver) return;

        console.log('Level Complete!');

        // Mark as complete
        this.scene.isGameOver = true;
        this.scene.physics.pause();

        // Visual feedback
        player.setTint(0x00ff00); // Green tint for success

        // Only levels 1/2 reach this — level 3 (boss fight) ends via BossManager
        // straight to BOSS_ENDING, and never trips the obstacle-count finish line
        // (see maxObstacles: 999 in LevelManager).
        const goToMenu = () => {
            const nextLevel = this.scene.level + 1;
            Save.unlockLevel(nextLevel); // reached the next level (for a level-select)
            const menuKey = nextLevel === 2 ? 'LEVEL_2_LORE' : 'BOSS_LORE';
            this.scene.scene.start('MenuScene', { menuKey });
        };

        // Muted: nothing to hear, so nothing to wait for.
        if (this.scene.sound.mute) {
            goToMenu();
            return;
        }

        // Let the arrival jingle play out fully before leaving — MenuScene calls
        // sound.stopAll() on entry, so transitioning early would clip it. We still
        // cap the wait at the clip's own known length (END_SOUND_DURATION_MS)
        // rather than trusting 'complete' alone: if the sound fails partway
        // through — which happens — 'complete' never fires and the level would
        // otherwise soft-lock here forever.
        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            goToMenu();
        };
        this.scene.time.delayedCall(END_SOUND_DURATION_MS[this.scene.level] || 1000, finish);
        if (this.endSound && this.endSound.isPlaying) {
            this.endSound.once('complete', finish);
        }
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