class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = null;
        this.bossHealthText = null;
    }

    setup(level) {
        this.scoreText = this.scene.add.text(16, 16, 'Score: 0', {
            fontSize: '20px',
            fill: '#000000'
        });

        if (level === 3) {
            this.bossHealthText = this.scene.add.text(650, 16, `Boss HP: ${this.scene.bossHealth}`, {
                fontSize: '20px',
                fill: '#ff0000'
            });
        }
    }

    updateScore(score) {
        this.scoreText.setText('Score: ' + score);
    }

    updateBossHealth(health) {
        if (this.bossHealthText) {
            this.bossHealthText.setText(`Boss HP: ${health}`);
        }
    }
}