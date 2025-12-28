class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = null;
        this.bossHealthText = null;
    }

    setup(level) {
        this.scoreText = this.scene.add.text(16, 16, '000000', {
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

        if (level === 3) {
            this.bossHealthText = this.scene.add.text(650, 16, `Boss HP: ${this.scene.bossHealth}`, {
                fontSize: '20px',
                fill: '#ff0000'
            });
        }
    }

    updateScore(score) {
        this.scoreText.setText(score.toString().padStart(6, '0'));
    }

    updateBossHealth(health) {
        if (this.bossHealthText) {
            this.bossHealthText.setText(`Boss HP: ${health}`);
        }
    }
}