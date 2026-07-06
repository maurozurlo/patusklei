const DEV_MODE = false;
// `let` because MenuScene.toggleMusic reassigns it. Defaults to ON unless the
// user has explicitly turned sound off (stored as the string "false").
let isMusicPlaying = localStorage.getItem('musicPlaying') !== 'false';

// iOS/WebKit treats Web Audio (what Phaser's sound manager uses) as "ambient"
// audio, which the hardware ring/silent switch mutes — confirmed as the actual
// cause of "no sound on iOS" (a <video> with native controls still played,
// because it uses a different audio session category that the switch doesn't
// touch). Opting into "playback" tells WebKit to treat this page's audio like
// media playback, so the switch no longer silences it. Safari 16.4+; harmless
// no-op on browsers without the API.
try {
    if (navigator.audioSession) navigator.audioSession.type = 'playback';
} catch (e) { /* no-op on browsers without the API */ }

// Host-page touch controls bridge. When embedded in the site, the page renders
// real HTML buttons below the canvas (a tap there can't slip off the canvas and
// be dropped, unlike Phaser's on-canvas buttons). They postMessage their pressed
// state; GameScene.getInput merges these flags with the keyboard each frame.
window.__touchControls = { jump: false, crouch: false };
window.addEventListener('message', (event) => {
    const msg = event.data;
    if (!msg || msg.type !== 'patus-control') return;
    if (msg.action === 'jump') window.__touchControls.jump = !!msg.pressed;
    if (msg.action === 'crouch') window.__touchControls.crouch = !!msg.pressed;
});

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
    // The touch pads that drive jump/crouch live in the PARENT page, outside
    // this iframe (see pages/mision.vue) — so every tap on them blurs this
    // iframe. Phaser's default (pauseOnBlur = true) suspends the Web Audio
    // context on blur, which would silence gameplay sound the moment the
    // player uses the touch controls. Disable it once the sound manager exists.
    game.events.once('ready', () => { game.sound.pauseOnBlur = false; });
}

if (document.fonts && document.fonts.load) {
    document.fonts.load('16px "Press Start 2P"')
        .then(() => document.fonts.ready)
        .then(bootGame)
        .catch(bootGame); // never let a font hiccup block the game
} else {
    bootGame();
}