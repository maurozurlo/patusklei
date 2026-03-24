const DEV_MODE = true;

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
        GameScene
    ],
    scale: {
        mode: Phaser.Scale.NONE, // We'll handle scaling manually
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
    },
    render: {
        roundPixels: true
    }
};

// Initialize Phaser
const game = new Phaser.Game(config);

// Function to resize the canvas to fit the parent div
function resizeGame() {
    const container = document.getElementById('game-container');
    const canvas = game.canvas;
    if (!canvas) return; // Canvas might not be initialized yet

    const parentWidth = container.clientWidth;
    const parentHeight = container.clientHeight;

    const scaleX = parentWidth / config.width;
    const scaleY = parentHeight / config.height;
    const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

    canvas.style.width = config.width * scale + 'px';
    canvas.style.height = config.height * scale + 'px';
}

// Resize on window changes
window.addEventListener('resize', resizeGame);
window.addEventListener('load', resizeGame);

// Initial resize
resizeGame();