class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = null;
        this.hearts = [];        // heart icon sprites (boss fight)
        this.heartbeat = null;   // pulse tween, runs only while at full health
    }

    setup(level) {
        this.scoreText = this.scene.add.text(320 - 16 - (12 * 6), 16, '000000', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffffff',
            stroke: '#000',   // soft yellow
            strokeThickness: 1
        });

        this.scoreText.setResolution(1);

        // light black shadow, offset by 1px
        this.scoreText.setShadow(2, 2, '#000000', 0, false, false);

        this.scoreText.setDepth(10);

        // Boss fight shows a row of hearts (replaces the old "HP:" text).
        if (level === 3) {
            this.buildHearts(this.scene.maxHearts);
        }
    }

    updateScore(score) {
        this.scoreText.setText(score.toString().padStart(6, '0'));
    }

    // ----- Hearts (boss fight) ------------------------------------------------

    buildHearts(max) {
        const startX = 14, y = 16, spacing = 15;
        for (let i = 0; i < max; i++) {
            const h = this.scene.add.image(startX + i * spacing, y, 'heart_full')
                .setOrigin(0.5, 0.5)
                .setDepth(10);
            this.hearts.push(h);
        }
        this.startHeartbeat();
    }

    // Gentle pulse on the whole row, with a rest between beats. Only runs while
    // health is full — the first hit stops it (see updateHearts).
    startHeartbeat() {
        if (this.heartbeat || this.hearts.length === 0) return;
        this.heartbeat = this.scene.tweens.add({
            targets: this.hearts,
            scale: { from: 1, to: 1.3 },
            duration: 130,
            yoyo: true,
            repeat: -1,
            repeatDelay: 850,
            ease: 'Quad.out'
        });
    }

    stopHeartbeat() {
        if (!this.heartbeat) return;
        this.heartbeat.stop();
        this.heartbeat = null;
        this.hearts.forEach(h => h.setScale(1));
    }

    // Reflect the current heart count: first `n` full, the rest damaged. Any
    // damage kills the heartbeat.
    updateHearts(n) {
        if (n < this.hearts.length) this.stopHeartbeat();
        this.hearts.forEach((h, i) => h.setTexture(i < n ? 'heart_full' : 'heart_damage'));
    }
}
