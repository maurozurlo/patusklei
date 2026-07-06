<template>
  <div>
    <!-- Mini Games Section -->
    <section class="games-section" id="mision">
      <p class="mission-eyebrow">DECLARACIÓN DE MISIÓN · ORDIS FRATERNIS PATUSMALIS</p>
      <h2 class="section-title">NUESTRA MISIÓN</h2>

      <!-- The meta gag: a corporate "mission statement" that turns out to be
           a literal mission you have to play. -->
      <div class="mission-statement">
        <p class="mission-lead">
          En la mayoría del mundo veinteveintisei seo optimized ai-first, acá iría un párrafo 'corporativo' sobre
          <span class="strike">cinergias, valor prorrateado y unos anuncio de casino onlain</span>.
        </p>
        <p class="mission-twist">
          Patus Klei no comulga con la enshitificacion del planeta. O bueno no tanto. Aqui la misión es <span class="hl">una misión</span>: ayude a
          Patus Klei a ganar la <span class="hl">Batalla de la Triple Panera</span>.
          Con las manos arriba. Ahora. Abajo. ⬇
        </p>
                <p class="mission-twist">
          ADVERTENCIA: Patus Klei no se hace responsable por la aparición de nuevos ombligos en la persona que juegue el juego. La aparición de ombligos es un efecto secundario catalogado como 'Inusual pero aceptable' del juego y no está cubierta por la garantía.
          Rogamos discreción por parte del jugador y de los padres o tutores del jugador. La aparición de ombligos puede ser permanente o temporal, dependiendo de la cantidad de veces que se juegue el juego.
        </p>
      </div>

      <!-- Briefing + the boss watching -->
      <div class="briefing">
        <div class="briefing-card">
          <h3 class="briefing-title">PARTE DE MISIÓN</h3>
          <ul class="briefing-list">
            <li><span class="b-key">OBJETIVO</span> sobreviva 3 niveles llenos de emoción.</li>
            <li><span class="b-key">EQUIPO</span> tres dedos de corcho, una mandarina con triple chipa, fe.</li>
            <li><span class="b-key">CONTROLES</span> pruebe las flechas y el espacio, ya entenderá (o no).</li>
            <li><span class="b-key">REGLA #1</span> ponga guevo.</li>
            <li><span class="b-key">REGLA #2</span> chequee preventivamente su espacio perimetral por la aparición de ombligos foráneos, a modo de precaución y para tener un estimado de la cantidad de ombligos que usté poseía o poseyó al iniciar el juego.</li>
            <li><span class="b-key">ADVERTENCIA</span> el Lars Wampiola es un perito ventriluquista. Mirar a los ojo del títere anula la garantía, ipso facto Dominus Espiritu Cum gracias a teconología patentada UX OpenTelemetry de mirasión de ojo.</li>
          </ul>
        </div>

        <figure class="boss-watch">
          <video
            src="/assets/video_portrait_puppet.mp4"
            poster="/assets/poster_portrait_puppet.jpg"
            controls
            playsinline
            preload="none"
            aria-label="El boss titiritero te observa"
          ></video>
          <figcaption>EL TITIRITERO LO ESTÁ MIRANDO ●REC</figcaption>
        </figure>
      </div>

      <div class="games-grid">
        <div class="game-card">
          <h3 class="game-title">PATUS KLEI</h3>
          <p class="game-desc">AYUDE A PATUS A GANAR LA BATALLA DE LA TRIPLE PANERA</p>
          <div class="game-frame">
            <iframe ref="gameFrame" src="/game/index.html" frameborder="0" title="Patus Klei"></iframe>
          </div>

          <!-- Touch controls live here, below the canvas, as real HTML buttons.
               Phaser only registers touches that land on the game canvas, so
               on-canvas buttons drop a tap that slips off the edge. These sit
               outside the canvas and post their state into the game. Touch only. -->
          <div class="game-pad" role="group" aria-label="Controles del juego">
            <button
              class="pad-btn pad-btn--crouch"
              type="button"
              aria-label="Agacharse"
              @pointerdown="press($event, 'crouch')"
              @pointerup="release($event, 'crouch')"
              @pointercancel="release($event, 'crouch')"
              @contextmenu.prevent
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18 L4 6 L20 6 Z" /></svg>
            </button>
            <button
              class="pad-btn pad-btn--jump"
              type="button"
              aria-label="Saltar"
              @pointerdown="press($event, 'jump')"
              @pointerup="release($event, 'jump')"
              @pointercancel="release($event, 'jump')"
              @contextmenu.prevent
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6 L20 18 L4 18 Z" /></svg>
            </button>
          </div>

          <p class="game-foot">¿Lo logró? Felicitaciones muchachito, ya puede escuchar el pisco. ¿Perdió? consulte la regla 1.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useSeoMeta, useRequestURL } from '#imports'

const cover = new URL('/booklet/cover.jpg', useRequestURL({ xForwardedHost: true }).origin).href

// Touch controls → game bridge. The buttons live in this page (below the iframe)
// but the game runs inside it, so we relay presses via postMessage; the game
// mirrors them into its input each frame (see public/game/src/main.js).
const gameFrame = ref<HTMLIFrameElement | null>(null)

function sendControl(action: 'jump' | 'crouch', pressed: boolean) {
  gameFrame.value?.contentWindow?.postMessage(
    { type: 'patus-control', action, pressed },
    window.location.origin,
  )
}

function press(e: PointerEvent, action: 'jump' | 'crouch') {
  e.preventDefault()
  // A pad tap is a genuine gesture on THIS page — use it to unlock the host
  // audio context that plays the game's sound (see the audio bridge below).
  unlockAudio()
  const btn = e.currentTarget as HTMLElement
  // Capture the pointer so the matching pointerup still fires on this button
  // even if the thumb slides off it — otherwise the control would stick down.
  btn.setPointerCapture?.(e.pointerId)
  btn.classList.add('is-pressed')
  sendControl(action, true)
}

function release(e: PointerEvent, action: 'jump' | 'crouch') {
  e.preventDefault()
  ;(e.currentTarget as HTMLElement).classList.remove('is-pressed')
  sendControl(action, false)
}

// Audio bridge (mobile). The game runs inside the iframe, but on touch devices
// its gameplay taps land on the pad buttons out here — so the iframe's Web Audio
// never gets the gestures it needs and its sound cuts out. The game therefore
// mutes itself and posts every sound event to this page (see
// public/game/src/main.js); we play it with Howler, where the real host-page
// gestures are. iOS is strict: the audio context only unlocks from a gesture on
// THIS document, and a tap on the game canvas lives inside the iframe. So we hold
// any looping track (menu / level music) until the first gesture that reaches
// this page — a pad tap, a scroll on the way down to the game, a click, or a
// gesture the iframe forwards up (cmd:'unlock') — then start it fresh into the
// now-running context, which is what actually makes it audible on iOS.
// Howler is loaded client-side only (it touches window on import).
let Howl: any = null
let Howler: any = null
const howls = new Map<string, any>()
const loops = new Map<string, number>() // key -> volume; tracks that should loop now
let audioReady = false
let audioUnlocked = false
const audioBacklog: any[] = []

function audioSrc(key: string) {
  // bgm_lvl1/2/3 ship as .ogg; every other clip is .wav.
  const ext = key.startsWith('bgm_lvl') ? 'ogg' : 'wav'
  return `/game/audio/${key}.${ext}`
}

function getHowl(key: string, loop: boolean) {
  let h = howls.get(key)
  if (!h) {
    h = new Howl({ src: [audioSrc(key)], loop })
    howls.set(key, h)
  }
  return h
}

// Start a track (or, for a loop already running, leave it be). Only ever called
// once the context is unlocked, so play() lands in a running context and makes
// sound — playing into a still-suspended one stays silent forever on iOS.
function startHowl(key: string, loop: boolean, volume?: number) {
  const h = getHowl(key, loop)
  h.loop(loop)
  if (volume != null) h.volume(volume)
  if (loop && h.playing()) return // already looping; don't stack a second copy
  h.play()
}

function playAudio(msg: any) {
  if (msg.cmd === 'play') {
    if (msg.loop) {
      // Remember it should be looping; start it now if we're already unlocked,
      // otherwise unlockAudio() starts it on the first gesture that reaches us.
      loops.set(msg.key, msg.volume != null ? msg.volume : 1)
      if (audioUnlocked) startHowl(msg.key, true, msg.volume)
    } else if (audioUnlocked) {
      // One-shots that land before the first gesture are inaudible anyway
      // (nothing is unlocked yet), so there's nothing to queue — just drop them.
      startHowl(msg.key, false, msg.volume)
    }
  } else if (msg.cmd === 'stop') {
    loops.delete(msg.key)
    howls.get(msg.key)?.stop()
  } else if (msg.cmd === 'stopAll') {
    loops.clear()
    howls.forEach((h) => h.stop())
  } else if (msg.cmd === 'mute') {
    Howler?.mute(!!msg.value)
  } else if (msg.cmd === 'unlock') {
    // Forwarded from inside the game iframe: the player just touched the canvas
    // (a menu button), which never reaches this page on its own.
    unlockAudio()
  }
}

function onMessage(event: MessageEvent) {
  if (event.origin !== window.location.origin) return
  const msg = event.data
  if (msg?.type !== 'patus-audio') return
  // Buffer anything that arrives before Howler finishes loading, then flush.
  if (audioReady) playAudio(msg)
  else audioBacklog.push(msg)
}

// First user gesture that reaches THIS page (a pad tap, a scroll, a click, or a
// gesture forwarded up from inside the game iframe): resume the context, then
// start every track that should be looping right now — the menu / level music
// held back while we were locked. Starting them fresh into the now-running
// context is what makes them audible on iOS.
function unlockAudio() {
  if (audioUnlocked || !Howler) return
  const finish = () => {
    if (audioUnlocked) return
    audioUnlocked = true
    loops.forEach((volume, key) => startHowl(key, true, volume))
  }
  const ctx = Howler.ctx
  if (ctx && ctx.state !== 'running' && ctx.resume) ctx.resume().then(finish, finish)
  else finish()
}

const UNLOCK_EVENTS = ['touchstart', 'touchend', 'pointerdown', 'click']

onMounted(async () => {
  window.addEventListener('message', onMessage)
  const howler = await import('howler')
  Howl = howler.Howl
  Howler = howler.Howler
  getHowl('sfx_click', false) // force the AudioContext to exist so unlock can resume it
  audioReady = true
  audioBacklog.splice(0).forEach(playAudio)
  // Capture phase so this runs before the pad buttons' own preventDefault.
  UNLOCK_EVENTS.forEach((evt) =>
    document.addEventListener(evt, unlockAudio, { capture: true, passive: true }),
  )
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  UNLOCK_EVENTS.forEach((evt) =>
    document.removeEventListener(evt, unlockAudio, { capture: true } as any),
  )
  howls.forEach((h) => h.unload())
  howls.clear()
})

useSeoMeta({
  title: 'Misión · Jugá la Batalla de la Triple Panera | Patus Klei',
  description:
    'Esto no es una declaración de misión, es una misión de verdad: ayudá a Patus Klei a ganar la Batalla de la Triple Panera y bajá al boss titiritero. Jugá el juego gratis en el navegador.',
  ogTitle: 'La misión: ganar la Batalla de la Triple Panera',
  ogDescription: 'Otras webs tienen un mission statement. La nuestra tiene una misión literal: jugala.',
  ogType: 'website',
  ogImage: cover,
  twitterCard: 'summary_large_image',
  twitterImage: cover,
})
</script>

<style scoped>
@import '~/css/pages.css';

.games-section {
    min-height: 100vh;
    background: var(--ega-darkgray);
    padding: 100px 20px 80px;
}

.mission-eyebrow {
    text-align: center;
    color: var(--ega-teal);
    font-size: 13px;
    letter-spacing: 3px;
    margin-bottom: 12px;
}

/* The meta-joke statement: framed like a corporate mission, undercut. */
.mission-statement {
    max-width: 780px;
    margin: 0 auto 50px;
    text-align: center;
}

.mission-lead {
    color: var(--ega-lightgray);
    font-size: 17px;
    line-height: 1.6;
    margin-bottom: 14px;
}

.mission-lead .strike {
    text-decoration: line-through;
    text-decoration-color: var(--ega-red);
    opacity: 0.7;
}

.mission-twist {
    color: var(--ega-white);
    font-size: 22px;
    line-height: 1.5;
    font-weight: bold;
}

.mission-twist .hl,
.mission-lead .hl {
    color: var(--ega-orange);
}

/* Briefing block: parte de misión + the boss watching via the portrait clip. */
.briefing {
    max-width: 1000px;
    margin: 0 auto 56px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
    gap: 28px;
    align-items: stretch;
}

.briefing-card {
    background: var(--ega-black);
    border: 4px solid var(--ega-orange);
    padding: 26px 28px;
    box-shadow: 6px 6px 0 var(--ega-brown), 0 0 30px rgba(255, 136, 0, 0.25);
}

.briefing-title {
    color: var(--ega-orange);
    font-size: 18px;
    letter-spacing: 2px;
    margin-bottom: 18px;
    border-bottom: 2px solid var(--ega-brown);
    padding-bottom: 10px;
}

.briefing-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.briefing-list li {
    color: var(--ega-lightgreen);
    font-size: 15px;
    line-height: 1.5;
    padding: 9px 0;
    border-bottom: 1px solid rgba(255, 136, 0, 0.18);
}

.briefing-list li:last-child {
    border-bottom: none;
}

.b-key {
    display: inline-block;
    color: var(--ega-yellow);
    font-weight: bold;
    letter-spacing: 1px;
    margin-right: 8px;
    min-width: 96px;
}

.boss-watch {
    position: relative;
    margin: 0;
    border: 4px solid var(--ega-purple);
    background: #000;
    box-shadow: 6px 6px 0 var(--ega-darkmagenta), 0 0 30px rgba(136, 0, 255, 0.35);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.boss-watch video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    flex: 1;
}

.boss-watch::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.18) 0px,
        rgba(0, 0, 0, 0.18) 1px,
        transparent 1px,
        transparent 3px
    );
    mix-blend-mode: multiply;
}

.boss-watch figcaption {
    position: relative;
    z-index: 2;
    background: var(--ega-black);
    color: var(--ega-pink);
    font-size: 11px;
    letter-spacing: 1px;
    text-align: center;
    padding: 8px 6px;
}

.games-grid {
    max-width: 1000px;
    margin: 0 auto;
    /* Single game: a plain centered block so the card uses its full max-width
       instead of a fractional auto-fit grid track. */
}

.game-card {
    background: var(--ega-black);
    border: 4px solid var(--ega-purple);
    padding: 24px;
    text-align: center;
    max-width: 840px;
    margin: 0 auto;
    box-shadow: 6px 6px 0 var(--ega-darkmagenta), 0 0 30px rgba(136, 0, 255, 0.35);
    /* Kill the iOS drag-to-select blue highlight over the play area. */
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
}

/* Keeps the game at its native 320x200 (8:5) aspect ratio, responsive down to mobile.
   768x480 at 8:5 gives the requested ~480 height with no letterboxing. */
.game-frame {
    width: 100%;
    max-width: 768px;
    margin: 20px auto 0;
    aspect-ratio: 8 / 5;
    background: #000;
}

.game-frame iframe {
    width: 100%;
    height: 100%;
    display: block;
    border: 0;
}

/* Touch controls: real HTML buttons below the canvas, styled like the face
   buttons on a handheld console. Hidden on pointer devices (keyboard plays),
   shown only where the primary input is touch. */
.game-pad {
    display: none;
    gap: 34px;
    justify-content: center;
    align-items: center;
    width: max-content;
    margin: 18px auto 0;
    padding: 14px 30px;
    border: 2px solid #000;
    border-radius: 20px;
    background: linear-gradient(180deg, #2c2c2c, #161616);
    box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.08),
        inset 0 -3px 6px rgba(0, 0, 0, 0.6),
        0 6px 16px rgba(0, 0, 0, 0.55);
}

@media (hover: none) and (pointer: coarse) {
    .game-pad {
        display: flex;
    }
}

.pad-btn {
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
    user-select: none;
    width: 76px;
    height: 76px;
    padding: 0;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 3px solid rgba(0, 0, 0, 0.55);
    cursor: pointer;
    color: #1a1a1a;
    /* Domed plastic: a soft top highlight over the button's base colour. */
    background:
        radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0) 55%),
        var(--btn-color);
    box-shadow:
        0 6px 0 var(--btn-shadow),
        /* the button's "throw" */
        0 9px 12px rgba(0, 0, 0, 0.45),
        /* drop shadow on the housing */
        inset 0 2px 3px rgba(255, 255, 255, 0.65),
        inset 0 -4px 5px rgba(0, 0, 0, 0.35);
    transition: transform .05s ease, box-shadow .05s ease;
}

.pad-btn svg {
    width: 34px;
    height: 34px;
    display: block;
    fill: currentColor;
    stroke: rgba(0, 0, 0, 0.35);
    stroke-width: 1;
    stroke-linejoin: round;
}

/* Pressed: sink the button into the housing and collapse its throw. */
.pad-btn.is-pressed {
    transform: translateY(5px);
    box-shadow:
        0 1px 0 var(--btn-shadow),
        0 2px 4px rgba(0, 0, 0, 0.4),
        inset 0 2px 3px rgba(255, 255, 255, 0.4),
        inset 0 -2px 3px rgba(0, 0, 0, 0.35);
}

.pad-btn--jump {
    --btn-color: var(--ega-orange);
    --btn-shadow: #a85a00;
}

.pad-btn--crouch {
    --btn-color: var(--ega-teal);
    --btn-shadow: #009a66;
}

.game-title {
    font-size: 24px;
    color: var(--ega-orange);
    margin-bottom: 10px;
}

.game-desc {
    color: var(--ega-lightgray);
    font-size: 14px;
}

.game-foot {
    color: var(--ega-teal);
    font-size: 14px;
    line-height: 1.5;
    margin-top: 20px;
}

.music-section {
    background: var(--ega-darkmagenta);
    padding: 80px 20px;
}

@media (max-width: 768px) {
    .briefing {
        grid-template-columns: 1fr;
    }

    .boss-watch {
        max-width: 300px;
        margin: 0 auto;
    }

    .mission-twist {
        font-size: 19px;
    }

    .b-key {
        display: block;
        min-width: 0;
        margin-bottom: 2px;
    }
}
</style>
