// Game Configuration
const config = {
    type: Phaser.AUTO,
    // Small resolution to enhance the 16-bit aesthetic
    width: 320,
    height: 200,
    parent: 'game-container', // Element ID if you want to place it in a specific div
    pixelArt: true, // Crucial for clean 16-bit graphics
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 }, // Standard gravity for platformers
            debug: DEBUG_COLLISIONS,
            debugShowBody: DEBUG_COLLISIONS,
            debugShowStaticBody: DEBUG_COLLISIONS
        }

    },
    antialias: false,
    scene: [
        MenuScene,  // Always load the main menu first
        GameScene
        // Later, you could break GameScene into Level1Scene, Level2Scene, BossScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
        roundPixels: true
    }
};

// FONT
function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}
loadFont('Press Start 2P', 'assets/PressStart2P-Regular.ttf');
// Initialize the Phaser Game
const game = new Phaser.Game(config);

// Global state for music toggle
let isMusicPlaying = true;