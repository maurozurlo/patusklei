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
                sprite: 'patus_bidet',
                animation: 'patus_bidet',
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
                jumpVelocity: -550,
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
                key: 'patus_bidet',
                spritesheet: 'patus_bidet',
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
                key: 'patus_crouch',
                spritesheet: 'patus_crouch',
                frames: { start: 0, end: 7 },
                frameRate: 8
            },
            {
                key: 'patus_jump',
                spritesheet: 'patus_jump',
                frames: { start: 0, end: 0 }, // Single frame
                frameRate: 1
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

    updateBodySize(height) {
        const width = this.config.hitboxWidth;
        this.player.body.setSize(width, height, false);

        // Center the hitbox horizontally within the (wider) sprite frame and
        // pin it to the feet. Offsets are measured from the top-left of the
        // frame regardless of the sprite's display origin.
        const offsetX = (this.player.width - width) / 2;
        const offsetY = this.player.height - height;
        this.player.body.setOffset(offsetX, offsetY);
    }

    createPlayer() {
        // Start a bit in from the left edge instead of hugging the wall.
        const startX = 24;
        this.player = this.scene.physics.add.sprite(
            startX,
            this.groundY,
            this.config.sprite
        );

        this.player.setOrigin(.5, 1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(true);

        this.player.play(this.config.animation);
        this.player.setDepth(10);

        this.player.isCrouching = false;

        this.player.standHeight = this.config.hitboxHeight;
        this.player.crouchHeight = this.config.hitboxHeight / 2;
        this.updateBodySize(this.player.standHeight);

    }

    createEffects() {
        // Create foam effect (Level 1 only)
        if (this.config.hasFoam) {
            this.foam = this.scene.add.sprite(
                this.player.x,
                this.player.y,
                'bidet_foam'
            );
            this.foam.setOrigin(0.5, .7);
            this.foam.play('bidet_foam');
            this.foam.setDepth(10);
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

    handleInput(cursors) {
        const onGround = this.player.body.touching.down;
        const useJumpAnim = this.level > 1; // level 1 keeps the bidet sprite while jumping

        // Jump
        if (cursors.space.isDown && onGround) {
            this.player.setVelocityY(this.config.jumpVelocity);
            this.scene.sfx.jump.play();

            // Play jump animation only on levels that actually have one
            if (useJumpAnim && this.player.anims.currentAnim?.key !== 'patus_jump') {
                this.player.play('patus_jump');
                // body size/offset is already correct for the standing sprite; we don't
                // adjust here because we don't change sprite on level 1.
            }

            // Trigger splash effect if available
            if (this.splash && this.config.hasSplash) {
                this.splash.setVisible(true);
                this.splash.play('bidet_splash');
            }
        }

        // Duck (Level 2+)
        if (this.config.canDuck) {

            if (cursors.down.isDown) {

                if (!this.player.isCrouching && onGround) {
                    this.player.isCrouching = true;

                    if (this.player.anims.currentAnim?.key !== 'patus_crouch') {
                        this.player.play('patus_crouch');
                    }
                    this.updateBodySize(this.player.crouchHeight);
                }

            } else {

                if (this.player.isCrouching) {
                    this.player.isCrouching = false;

                    if (this.player.anims.currentAnim?.key !== 'patus_walk') {
                        this.player.play('patus_walk');
                    }


                    this.updateBodySize(this.player.standHeight);
                }
            }
        }

        // Return to appropriate animation when landing
        if (onGround && !cursors.space.isDown) {
            if (this.config.canDuck && cursors.down.isDown) {
                // Duck logic (existing code)
                if (!this.player.isCrouching) {
                    this.player.isCrouching = true;
                    if (this.player.anims.currentAnim?.key !== 'patus_crouch') {
                        this.player.play('patus_crouch');
                    }
                    this.updateBodySize(this.player.crouchHeight);
                }
            } else {
                // Return to walk/bidet animation
                if (this.player.isCrouching) {
                    this.player.isCrouching = false;
                    this.updateBodySize(this.player.standHeight);
                }

                const targetAnim = this.config.animation;
                if (this.player.anims.currentAnim?.key !== targetAnim) {
                    this.player.play(targetAnim);
                }
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