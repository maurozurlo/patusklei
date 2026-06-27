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

        // Boss fight shows a row of hearts (replaces the old "HP:" text) plus a
        // countdown to Rodolfa's next bomb.
        if (level === 3) {
            this.buildHearts(this.scene.maxHearts);
            this.rodolfaText = this.scene.add.text(8, 28, '', {
                fontFamily: '"Press Start 2P"',
                fontSize: '8px',
                color: '#ffd24a',
                stroke: '#000',
                strokeThickness: 1
            }).setDepth(10);
        }
    }

    // n>0 → attacks remaining; 0 → Rodolfa is here; null → hide.
    setRodolfaCounter(n) {
        if (!this.rodolfaText) return;
        if (n === null || n === undefined) { this.rodolfaText.setText(''); return; }
        this.rodolfaText.setText(n > 0 ? `RODOLFA ${n}` : 'RODOLFA!');
    }

    updateScore(score) {
        this.scoreText.setText(score.toString().padStart(6, '0'));
    }

    // One-time on-screen hint the first time the level-2 bird appears (teaches
    // crouch). Copy/placement are tunable.
    showCrouchHint() {
        const hint = this.scene.add.text(160, 70, 'AGACHATE!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffff00',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(20);

        this.scene.tweens.add({
            targets: hint, alpha: 0, delay: 1600, duration: 700,
            onComplete: () => hint.destroy()
        });
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
