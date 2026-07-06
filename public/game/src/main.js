const DEV_MODE = false;
// `let` because MenuScene.toggleMusic reassigns it. Defaults to ON unless the
// user has explicitly turned sound off (stored as the string "false").
let isMusicPlaying = localStorage.getItem('musicPlaying') !== 'false';

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

// Mobile audio unlock bridge. The game's menus are driven by tapping the canvas
// INSIDE this iframe, so those genuine user gestures never reach the host page —
// which is where our sound actually plays on touch devices (via Howler; see the
// audio bridge below and pages/mision.vue). Forward each gesture up so the host
// can resume/unlock its audio context the moment the player first touches the
// game, instead of staying silent until they hit a host-page pad button.
if (window.parent !== window) {
    const forwardUnlock = () => {
        try {
            window.parent.postMessage({ type: 'patus-audio', cmd: 'unlock' }, window.location.origin);
        } catch (e) { /* cross-origin host: nothing we can do */ }
    };
    ['pointerdown', 'touchstart', 'mousedown'].forEach((evt) =>
        window.addEventListener(evt, forwardUnlock, { capture: true, passive: true }));
}

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

// ---------------------------------------------------------------------------
// Mobile audio bridge. On touch devices the game is driven by the host page's
// pad buttons, which sit OUTSIDE this iframe — so the iframe stops receiving the
// user gestures mobile browsers need to keep its Web Audio context audible, and
// sound drops out. Fix: on touch devices only, keep Phaser permanently muted
// (it still ticks the context, so 'complete'/timing logic — e.g. the level-end
// wait — is unchanged) and mirror every sound out to the host page, which plays
// it with Howler where the real taps are. Desktop is untouched: Phaser plays.
const AUDIO_BRIDGE = window.parent !== window &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

function postAudio(payload) {
    window.parent.postMessage({ type: 'patus-audio', ...payload }, window.location.origin);
}

// Wrap the (already-booted) sound manager so every play/stop/stopAll/mute is
// mirrored to the host. Nothing in the game code changes — it keeps calling the
// same Phaser API; we just also emit an event and force Phaser itself to stay
// muted so the host's Howler is the only thing you actually hear.
function installAudioBridge(sm) {
    const emitPlay = (key, cfg) => postAudio({
        cmd: 'play', key,
        loop: !!(cfg && cfg.loop),
        volume: cfg && cfg.volume != null ? cfg.volume : 1
    });

    // One-shots: scene.sound.play('key').
    const origPlay = sm.play.bind(sm);
    sm.play = (key, extra) => { emitPlay(key, extra); return origPlay(key, extra); };

    // Handles: scene.sound.add('key', cfg) → .play()/.stop() (bgm loops, sfx).
    const origAdd = sm.add.bind(sm);
    sm.add = (key, cfg) => {
        const snd = origAdd(key, cfg);
        const oPlay = snd.play.bind(snd);
        const oStop = snd.stop.bind(snd);
        snd.play = (m, e) => { emitPlay(key, cfg); return oPlay(m, e); };
        snd.stop = () => { postAudio({ cmd: 'stop', key }); return oStop(); };
        return snd;
    };

    const origStopAll = sm.stopAll.bind(sm);
    sm.stopAll = () => { postAudio({ cmd: 'stopAll' }); return origStopAll(); };

    // Force Phaser to stay muted (it's just the silent timing driver) while
    // forwarding the player's real mute preference to the host's Howler. The
    // `mute` accessor lives up the chain on BaseSoundManager, not the immediate
    // prototype, so walk up to find it.
    let desc = null;
    for (let o = sm; o && !desc; o = Object.getPrototypeOf(o)) {
        desc = Object.getOwnPropertyDescriptor(o, 'mute');
    }
    if (desc && desc.set) {
        Object.defineProperty(sm, 'mute', {
            configurable: true,
            get: () => desc.get.call(sm),
            set: (v) => { postAudio({ cmd: 'mute', value: !!v }); desc.set.call(sm, true); }
        });
    }
    sm.mute = !isMusicPlaying; // sync initial preference to the host + mute Phaser
}

// Initialize Phaser only after the pixel font is ready. Phaser renders each
// text object to a texture once, using whatever font is available at that
// moment — boot too early and the fallback (Arial) gets baked in permanently.
let game;
function bootGame() {
    game = new Phaser.Game(config);
    // The sound manager only exists once the game is booted; wrap it then.
    if (AUDIO_BRIDGE) game.events.once('ready', () => installAudioBridge(game.sound));
}

if (document.fonts && document.fonts.load) {
    document.fonts.load('16px "Press Start 2P"')
        .then(() => document.fonts.ready)
        .then(bootGame)
        .catch(bootGame); // never let a font hiccup block the game
} else {
    bootGame();
}