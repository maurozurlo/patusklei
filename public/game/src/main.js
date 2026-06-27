const DEV_MODE = false;
// `let` because MenuScene.toggleMusic reassigns it. Defaults to ON unless the
// user has explicitly turned sound off (stored as the string "false").
let isMusicPlaying = localStorage.getItem('musicPlaying') !== 'false';

// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 200,
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            debug: DEV_MODE
        }
    },
    scene: [
        MenuScene,
        GameScene,
        DebugScene // TEMPORARY: boss-scene placement tool (press D in the menu)
    ],
    scale: {
        // FIT scales the 320x200 canvas up to fill the parent while keeping
        // the aspect ratio, and handles resize + input mapping automatically.
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
    },
    render: {
        roundPixels: true
    }
};

// Initialize Phaser only after the pixel font is ready. Phaser renders each
// text object to a texture once, using whatever font is available at that
// moment — boot too early and the fallback (Arial) gets baked in permanently.
let game;
function bootGame() {
    game = new Phaser.Game(config);
}

if (document.fonts && document.fonts.load) {
    document.fonts.load('16px "Press Start 2P"')
        .then(() => document.fonts.ready)
        .then(bootGame)
        .catch(bootGame); // never let a font hiccup block the game
} else {
    bootGame();
}