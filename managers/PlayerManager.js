class PlayerManager {
    constructor(scene, groundY) {
        this.scene = scene;
        this.groundY = groundY;
        this.level = scene.level;
        this.player = null;
        this.foam = null;
        this.splash = null;

        // Player configuration per level
        this.config = this.getPlayerConfig(this.level);
    }

    getPlayerConfig(level) {
        const configs = {
            1: {
                sprite: 'patus_bidet_idle',
                animation: 'patus_bidet_idle',
                hasFoam: true,
                hasSplash: true,
                canDuck: false,
                jumpVelocity: -650,
                hitboxWidth: 18,
                hitboxHeight: 40
            },
            2: {
                sprite: 'patus_walk',
                animation: 'patus_walk',
                hasFoam: false,
                hasSplash: false,
                canDuck: true,
                jumpVelocity: -650,
                hitboxWidth: 18,
                hitboxHeight: 40
            },
            3: {
                sprite: 'patus_walk',
                animation: 'patus_walk',
                hasFoam: false,
                hasSplash: false,
                canDuck: true,
                jumpVelocity: -700,
                hitboxWidth: 18,
                hitboxHeight: 40
            }
        };

        return configs[level] || configs[1];
    }

    setup() {
        this.createAnimations();
        this.createPlayer();
        this.createEffects();
    }

    createAnimations() {
        const animations = [
            {
                key: 'patus_bidet_idle',
                spritesheet: 'patus_bidet_idle',
                frames: { start: 0, end: 2 },
                frameRate: 6
            },
            {
                key: 'patus_walk',
                spritesheet: 'patus_walk',
                frames: { start: 0, end: 7 },
                frameRate: 8
            },
            {
                key: 'bidet_foam',
                spritesheet: 'bidet_foam',
                frames: { start: 0, end: 3 },
                frameRate: 10
            },
            {
                key: 'bidet_splash',
                spritesheet: 'bidet_splash',
                frames: { start: 0, end: 5 },
                frameRate: 12,
                repeat: 0 // Play once
            }
        ];

        animations.forEach(anim => {
            if (!this.scene.anims.exists(anim.key)) {
                this.scene.anims.create({
                    key: anim.key,
                    frames: this.scene.anims.generateFrameNumbers(anim.spritesheet, anim.frames),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat !== undefined ? anim.repeat : -1
                });
            }
        });
    }

    createPlayer() {
        this.player = this.scene.physics.add.sprite(
            50,
            this.groundY,
            this.config.sprite
        );

        this.player.setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(true);
        this.player.body.setSize(
            this.config.hitboxWidth,
            this.config.hitboxHeight,
            true
        );
        this.player.play(this.config.animation);
        this.player.setDepth(10);
    }

    createEffects() {
        // Create foam effect (Level 1 only)
        if (this.config.hasFoam) {
            this.foam = this.scene.add.sprite(
                this.player.x,
                this.player.y + 20,
                'bidet_foam'
            );
            this.foam.setOrigin(0.5, 1);
            this.foam.play('bidet_foam');
            this.foam.setDepth(9);
        }

        // Create splash effect (Level 1 only)
        if (this.config.hasSplash) {
            this.splash = this.scene.add.sprite(
                this.player.x,
                this.player.y + 30,
                'bidet_splash'
            );
            this.splash.setOrigin(0.5, 1);
            this.splash.setVisible(false);
            this.splash.setDepth(11);

            // Hide splash when animation completes
            this.splash.on('animationcomplete', () => {
                this.splash.setVisible(false);
            });
        }
    }

    handleInput(cursors, level) {
        const onGround = this.player.body.touching.down;

        // Jump
        if (cursors.space.isDown && onGround) {
            this.player.setVelocityY(this.config.jumpVelocity);
            this.scene.sfx.jump.play();

            // Trigger splash effect if available
            if (this.splash && this.config.hasSplash) {
                this.splash.setVisible(true);
                this.splash.play('bidet_splash');
            }
        }

        // Duck (Level 2+)
        if (this.config.canDuck) {
            if (cursors.down.isDown && onGround) {
                // Reduce hitbox height when ducking
                this.player.body.setSize(
                    this.config.hitboxWidth,
                    this.config.hitboxHeight / 2,
                    true
                );
            } else {
                // Restore full hitbox
                this.player.body.setSize(
                    this.config.hitboxWidth,
                    this.config.hitboxHeight,
                    true
                );
            }
        }

        // Update foam visibility (follows player on ground)
        if (this.foam) {
            this.foam.setVisible(onGround);
        }
    }

    // Clean up when switching levels
    destroy() {
        if (this.player) this.player.destroy();
        if (this.foam) this.foam.destroy();
        if (this.splash) this.splash.destroy();
    }
}