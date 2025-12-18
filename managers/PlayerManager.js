class PlayerManager {
    constructor(scene, groundY) {
        this.scene = scene;
        this.groundY = groundY;
        this.player = null;
        this.foam = null;
    }

    setup() {
        this.createAnimations();
        this.createPlayer();
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'patus_bidet_idle',
            frames: this.scene.anims.generateFrameNumbers('patus_bidet_idle', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'bidet_foam',
            frames: this.scene.anims.generateFrameNumbers('bidet_foam', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    }

    createPlayer() {
        this.player = this.scene.physics.add.sprite(50, this.groundY, 'patus_bidet_idle');
        this.player.setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(true);
        this.player.body.setSize(18, 40, true);
        this.player.play('patus_bidet_idle');

        // FOAM
        this.foam = this.scene.add.sprite(
            this.player.x,
            this.player.y + 20,
            'bidet_foam'
        );

        this.foam.setOrigin(0.5, 1);
        this.foam.play('bidet_foam');
    }

    handleInput(cursors, level) {
        const onGround = this.player.body.touching.down;

        // Jump
        if (cursors.space.isDown && onGround) {
            this.player.setVelocityY(-650);
        }

        // Duck (Level 2 & 3)
        if (level >= 2) {
            if (cursors.down.isDown) {
                this.player.body.setSize(this.player.width, this.player.height / 2, true);
            } else {
                this.player.body.setSize(this.player.width, this.player.height, true);
            }
        }

        this.foam.setVisible(onGround);
    }
}