const GROUND_Y = 185;

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;
        this.bossHealth = 5;
        this.maxObstacles = 10;
    }

    init(data) {
        this.level = data.level || 1;
        this.isGameOver = false;
        this.score = 0;
        this.bossHealth = 5;

        // Player hearts (boss fight): 3 base +1 per bell pepper collected this
        // run (persisted in Save), capped so the heart row stays sane.
        this.maxHearts = 3 + Math.min(Save.getPeppers(), 5);
        this.hearts = this.maxHearts;

        // True while a scripted sequence (e.g. the victory run) drives Patus and
        // player input is locked out.
        this.cutscene = false;

        // On-screen control state (mobile). Merged with the keyboard each frame.
        this.touchJump = false;
        this.touchCrouch = false;
    }
    preload() {

        // SOUND
        this.load.audio('sfx_crash', 'audio/sfx_crash.wav');
        this.load.audio('sfx_endlvl1', 'audio/sfx_endlvl1.wav');
        this.load.audio('sfx_gameover', 'audio/sfx_gameover.wav');
        this.load.audio('sfx_jump', 'audio/sfx_jump.wav');
        this.load.audio('sfx_pepper', 'audio/sfx_pepper.wav');
        this.load.audio('sfx_tuna', 'audio/sfx_tuna.wav');

        // Hit feedback + boss bomb sequence.
        this.load.audio('sfx_patus_hit', 'audio/sfx_patus_hit.wav');
        this.load.audio('sfx_birdhit', 'audio/sfx_birdhit.wav');
        this.load.audio('sfx_boss_hit', 'audio/sfx_boss_hit.wav');
        this.load.audio('sfx_bomb_planted', 'audio/sfx_bomb_planted.wav');
        this.load.audio('sfx_bomb_beep', 'audio/sfx_bomb_beep.wav');
        this.load.audio('sfx_explo', 'audio/sfx_explo.wav');

        this.load.audio('bgm_lvl1', 'audio/bgm_lvl1.wav');

        // IMAGES
        this.load.image('bg_builds', 'images/bg_builds.png');
        this.load.image('cloud', 'images/cloud.png');
        this.load.image('bg_beach', 'images/bg_beach.png');
        this.load.image('bg_city', 'images/bg_city.png');

        // Boss scene assets (level 3 only) — driven by the shared BOSS_LAYOUT.
        if (this.level === 3) {
            Object.entries(BOSS_LAYOUT).forEach(([name, cfg]) => {
                if (cfg.sheet) {
                    this.load.spritesheet(name, cfg.file, {
                        frameWidth: cfg.sheet.frameWidth,
                        frameHeight: cfg.sheet.frameHeight
                    });
                } else {
                    this.load.image(name, cfg.file);
                }
            });

            // Live-fight hand sprites (idle + attack layers). The telegraph
            // reuses the twitch sheets loaded above; only these are new.
            Object.values(BOSS_FIGHT.hands).forEach(h => {
                this.load.image(h.idle.key, h.idle.file);
                [h.back, h.front].forEach(s => this.load.spritesheet(s.key, s.file, {
                    frameWidth: s.frameWidth, frameHeight: s.frameHeight
                }));
            });

            // Player heart icons (HUD).
            this.load.image('heart_full', 'images/heart_full.png');
            this.load.image('heart_damage', 'images/heart_damage.png');

            // Bomb-phase props (Rodolfa, bomb, shelf, explosion).
            this.load.spritesheet('rodolfa', 'images/rodolfa-walk.png', { frameWidth: 29, frameHeight: 32 });
            this.load.spritesheet('explosion', 'images/explosion.png', { frameWidth: 100, frameHeight: 85 });
            this.load.image('bomb', 'images/bomb.png');
            this.load.image('boss_platform', 'images/boss_platform.png');

            // Progressive puppet damage (body + head) as each hand is destroyed.
            ['boss_body_dmg1', 'boss_body_dmg2', 'boss_head_dmg1', 'boss_head_dmg2']
                .forEach(k => this.load.image(k, 'images/' + k + '.png'));
        }

        // OBSTACLES
        this.load.spritesheet('buoy_idle', 'images/buoy_idle.png', {
            frameWidth: 34,
            frameHeight: 62
        });
        // Level 2 cars (each is a 2-frame sheet). One is picked at random per spawn.
        this.load.spritesheet('car_taxi', 'images/car_00.png', {
            frameWidth: 140,
            frameHeight: 64
        });
        this.load.spritesheet('car_blue', 'images/car_01.png', {
            frameWidth: 137,
            frameHeight: 60
        });
        this.load.spritesheet('car_party', 'images/car_02.png', {
            frameWidth: 137,
            frameHeight: 60
        });
        this.load.spritesheet('car_pink', 'images/car_03.png', {
            frameWidth: 137,
            frameHeight: 60
        });

        // Level 2 duck-under bird (flies between cars; must be crouched under).
        this.load.spritesheet('bird', 'images/bird.png', {
            frameWidth: 60,
            frameHeight: 45
        });

        this.load.spritesheet('patus_bidet', 'images/patus_bidet.png', {
            frameWidth: 54,
            frameHeight: 66
        });

        this.load.spritesheet('patus_walk', 'images/patus_walk.png', {
            frameWidth: 55,
            frameHeight: 76
        });
        this.load.spritesheet('patus_jump', 'images/patus_jump.png', {
            frameWidth: 59,
            frameHeight: 76
        });
        this.load.spritesheet('patus_crouch', 'images/patus_crouch.png', {
            frameWidth: 55,
            frameHeight: 76
        });

        // 2-frame breathing idle used in the boss fight (level 3).
        this.load.spritesheet('patus_idle', 'images/patus_idle.png', {
            frameWidth: 23,
            frameHeight: 68
        });

        // Single-frame static crouch pose for the boss fight (Patus isn't running).
        this.load.spritesheet('patus_crouch_idle', 'images/patus_crouch_idle.png', {
            frameWidth: 36,
            frameHeight: 42
        });

        this.load.spritesheet('bidet_foam', 'images/bidet_foam.png', {
            frameWidth: 40,
            frameHeight: 16
        });

        this.load.spritesheet('bidet_splash', 'images/bidet_splash.png', {
            frameWidth: 64,
            frameHeight: 80
        });

        // Managers that own their own asset loading are constructed here so
        // their queued loads run during this scene's load phase. They are
        // reused (not rebuilt) in create().
        this.backgroundManager = new BackgroundManager(this, this.level);
        this.backgroundManager.preload();

        this.coinManager = new CoinManager(this, GROUND_Y);
        this.coinManager.preload();

        this.finishLineManager = new FinishLineManager(this, GROUND_Y);
        this.finishLineManager.preload();
    }

    create() {
        // SOUNDS
        this.sfx = {
            crash: this.sound.add('sfx_crash'),
            endlvl1: this.sound.add('sfx_endlvl1'),
            gameover: this.sound.add('sfx_gameover'),
            jump: this.sound.add('sfx_jump'),
            pepper: this.sound.add('sfx_pepper'),
            tuna: this.sound.add('sfx_tuna'),
            lvl1: this.sound.add('bgm_lvl1', { loop: true }),
            patus_hit: this.sound.add('sfx_patus_hit'),
            birdhit: this.sound.add('sfx_birdhit'),
            boss_hit: this.sound.add('sfx_boss_hit'),
            bomb_planted: this.sound.add('sfx_bomb_planted'),
            bomb_beep: this.sound.add('sfx_bomb_beep'),
            explo: this.sound.add('sfx_explo'),
        };


        this.obstaclesSpawned = 0;

        // Initialize managers. backgroundManager/coinManager/finishLineManager
        // were already constructed in preload() (they own asset loading); the
        // rest are created here.
        this.playerManager = new PlayerManager(this, GROUND_Y);
        this.obstacleManager = new ObstacleManager(this, GROUND_Y, this.level);
        this.uiManager = new UIManager(this);
        this.levelManager = new LevelManager(this);

        // Setup. Level 3 uses the static boss scene instead of the scrolling background.
        if (this.level === 3) {
            this.bossManager = new BossManager(this);
            this.bossManager.setup();
        } else {
            this.backgroundManager.setup();
        }
        this.setupGround(GROUND_Y);
        this.playerManager.setup();
        this.obstacleManager.setup();
        this.coinManager.setup();
        this.finishLineManager.setup();
        this.setupCollisions();
        this.uiManager.setup(this.level);

        // Kick off the boss dodge core once the player exists (the hit checks
        // read the player's pose).
        if (this.level === 3) {
            this.bossManager.setupFight();
        }

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createMobileControls();

        // Start level
        this.levelManager.initializeLevel(this.level);
    }

    // On-screen jump/crouch buttons for touch devices. They drive the same
    // touchJump/touchCrouch flags that get merged with the keyboard in getInput,
    // so PlayerManager.handleInput needs no changes. Crouch is held (press to
    // duck, release to stand); jump behaves like the space key.
    createMobileControls() {
        const hasTouch = this.sys.game.device.input.touch || (navigator.maxTouchPoints > 0);
        if (!hasTouch) return;

        // One extra touch pointer (so both buttons can be held at once). Guarded
        // because create() runs every level and addPointer accumulates.
        if (this.input.manager.pointersTotal < 3) this.input.addPointer(1);

        // Bottom-right, clear of Patus (bottom-left) and the score (top-right).
        const up = this.makeTouchButton(290, 128, '▲');   // ▲ jump
        up.on('pointerdown', () => { this.touchJump = true; });
        ['pointerup', 'pointerout', 'pointerupoutside'].forEach(
            ev => up.on(ev, () => { this.touchJump = false; }));

        const down = this.makeTouchButton(290, 174, '▼'); // ▼ crouch
        down.on('pointerdown', () => { this.touchCrouch = true; });
        ['pointerup', 'pointerout', 'pointerupoutside'].forEach(
            ev => down.on(ev, () => { this.touchCrouch = false; }));
    }

    makeTouchButton(x, y, glyph) {
        return this.add.text(x, y, glyph, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.35)',
            padding: { x: 14, y: 10 }
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(1000)
            .setAlpha(0.85)
            .setInteractive({ useHandCursor: true });
    }

    // Keyboard OR on-screen buttons — handleInput only reads space/down.
    getInput() {
        return {
            space: { isDown: this.cursors.space.isDown || this.touchJump },
            down: { isDown: this.cursors.down.isDown || this.touchCrouch }
        };
    }

    setupGround(groundY) {
        this.groundY = groundY;
        this.ground = this.add.rectangle(
            this.scale.width / 2,
            groundY + 4,
            this.scale.width,
            8,
            0x000000,
            0
        );
        this.physics.add.existing(this.ground, true);
    }

    setupCollisions() {
        this.physics.add.collider(this.playerManager.player, this.ground);
        this.physics.add.collider(
            this.playerManager.player,
            this.obstacleManager.obstacles,
            this.hitObstacle,
            null,
            this
        );
        this.physics.add.collider(
            this.playerManager.player,
            this.obstacleManager.bossProjectiles,
            this.hitObstacle,
            null,
            this
        );
        this.physics.add.overlap(
            this.playerManager.player,
            this.obstacleManager.dynamites,
            this.triggerDynamite,
            null,
            this
        );
        this.physics.add.overlap(
            this.playerManager.player,
            this.coinManager.coins,
            this.collectCoin,
            null,
            this
        );
    }

    setupFinishLineCollision() {
        // Setup collision after finish line is spawned
        if (this.finishLineManager.finishLine) {
            this.physics.add.overlap(
                this.playerManager.player,
                this.finishLineManager.finishLine,
                (player, finishLine) => this.finishLineManager.reachFinishLine(player),
                null,
                this
            );
        }
    }


    update(time, delta) {
        if (this.isGameOver) return;

        // Player is locked out while a scripted sequence drives Patus.
        if (!this.cutscene) {
            this.playerManager.handleInput(this.getInput());
        }

        // safety clamp: if the player somehow drops below the ground (physics glitch)
        if (this.playerManager.player.y > this.groundY) {
            this.playerManager.player.y = this.groundY;
            this.playerManager.player.setVelocityY(0);
        }

        if (this.level !== 3) {
            this.backgroundManager.update(this.levelManager.obstacleSpeed, delta);
        }
        this.obstacleManager.cleanupOffScreen();
        this.coinManager.cleanupOffScreen();
        this.finishLineManager.cleanupOffScreen();

        // Check if we should end the level (spawns the finish line, plus a last
        // earned bellpepper first if one is owed).
        if (this.obstaclesSpawned >= this.maxObstacles && !this.finishLineManager.isSpawned) {
            this.finishLineManager.beginLevelEnd(this.levelManager.obstacleSpeed, this.coinManager);
        }
    }

    // Called by BossManager when a hand attack catches Patus in the wrong pose.
    // Drops one heart (damaged icon + stops the heartbeat). Death/restart at 0
    // is still TODO — for now hearts just clamp at zero.
    loseHeart() {
        if (this.hearts <= 0) return;
        this.hearts--;
        this.uiManager.updateHearts(this.hearts);
        // TODO: if (this.hearts <= 0) -> fade + restart level 3 (skip lore).
    }

    collectCoin(player, coin) {
        // CoinManager.collectCoin already adds the value to this.score,
        // so the UI just mirrors the authoritative running total.
        this.coinManager.collectCoin(player, coin);
        this.uiManager.updateScore(this.score);
    }

    hitObstacle(player, obstacle) {
        if (this.isGameOver) return;

        this.isGameOver = true;
        this.physics.pause();
        player.setTint(0xff0000);

        // The level-2 bird gets its own hit cue; everything else is a crash.
        if (obstacle && obstacle.isBird) {
            this.sfx.birdhit.play();
            this.sfx.patus_hit.play();
        } else {
            this.sfx.crash.play();
        }

        // Add a slight delay so the player sees the "red" tint before switching
        this.time.delayedCall(1000, () => {
            // Start MenuScene and pass a data object
            this.scene.start('MenuScene', { menuKey: 'GAME_OVER' });
        });
    }

    triggerDynamite(player, dynamite) {
        if (!player.body.touching.down) {
            dynamite.destroy();
            this.bossHealth--;

            if (this.bossHealth <= 0) {
                this.winGame();
            }
        }
    }

    winGame() {
        this.physics.pause();
        this.scene.stop();
        this.scene.start('MenuScene', { menuKey: 'GAME_COMPLETED' });
    }
}