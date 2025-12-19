class PlayerManager {
    constructor(scene, groundY) {
        this.scene = scene;
        this.groundY = groundY;
        this.player = null;
        this.foam = null;
        this.splash = null;
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
            key: 'patus_walk',
            frames: this.scene.anims.generateFrameNumbers('patus_walk', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'bidet_foam',
            frames: this.scene.anims.generateFrameNumbers('bidet_foam', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'bidet_splash',
            frames: this.scene.anims.generateFrameNumbers('bidet_splash', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: 0 // Play once
        });
    }

    createPlayer() {
        if (this.scene.level === 1) {
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

            // SPLASH
            this.splash = this.scene.add.sprite(
                this.player.x,
                this.player.y + 30,
                'bidet_splash'
            );
            this.splash.setOrigin(0.5, 1);
            this.splash.setVisible(false);
            this.splash.setDepth(10);

            return;
        }
        this.player = this.scene.physics.add.sprite(50, this.groundY, 'patus_walk');
        this.player.setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(true);
        this.player.body.setSize(18, 40, true);
        this.player.play('patus_walk');
    }

    handleInput(cursors, level) {
        const onGround = this.player.body.touching.down;
        const wasOnGround = this.player.body.wasTouching.down;

        // Jump
        if (cursors.space.isDown && onGround) {
            this.player.setVelocityY(-650);

            // Trigger splash effect in level 1
            if (level === 1 && this.splash) {
                this.splash.setVisible(true);
                this.splash.play('bidet_splash');
            }
        }

        // Hide splash when animation completes
        if (this.splash && this.splash.anims.currentAnim) {
            this.splash.on('animationcomplete', () => {
                this.splash.setVisible(false);
            });
        }

        // Duck (Level 2 & 3)
        if (level >= 2) {
            if (cursors.down.isDown) {
                this.player.body.setSize(this.player.width, this.player.height / 2, true);
            } else {
                this.player.body.setSize(this.player.width, this.player.height, true);
            }
        }
        if (this.foam)
            this.foam.setVisible(onGround);
    }
}