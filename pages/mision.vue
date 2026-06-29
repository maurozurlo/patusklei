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
      </div>

      <!-- Briefing + the boss watching -->
      <div class="briefing">
        <div class="briefing-card">
          <h3 class="briefing-title">PARTE DE MISIÓN</h3>
          <ul class="briefing-list">
            <li><span class="b-key">OBJETIVO</span> sobreviva 3 niveles llenos de emoción.</li>
            <li><span class="b-key">EQUIPO</span> tres dedos de corcho, una mandarina con triple chipa, fe.</li>
            <li><span class="b-key">CONTROLES</span> probá las flechas y el espacio, ya vas a entender (o no).</li>
            <li><span class="b-key">REGLA #1</span> ponga guevo.</li>
            <li><span class="b-key">ADVERTENCIA</span> el Lars Wampiola es un titiritero. No oseis mirar a los ojo del títere.</li>
          </ul>
        </div>

        <figure class="boss-watch">
          <video
            src="/assets/video_portrait_puppet.mp4"
            autoplay
            muted
            loop
            playsinline
            controls
            preload="metadata"
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
            <iframe src="/game/index.html" frameborder="0" title="Patus Klei"></iframe>
          </div>
          <p class="game-foot">¿Lo logró? Felicitaciones muchachito, ya puede escuchar el pisco. ¿Perdió? Git guuuuud.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports'

useSeoMeta({
  title: 'Misión · Jugá la Batalla de la Triple Panera | Patus Klei',
  description:
    'Esto no es una declaración de misión, es una misión de verdad: ayudá a Patus Klei a ganar la Batalla de la Triple Panera y bajá al boss titiritero. Jugá el juego gratis en el navegador.',
  ogTitle: 'La misión: ganar la Batalla de la Triple Panera',
  ogDescription: 'Otras webs tienen un mission statement. La nuestra tiene una misión literal: jugala.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
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
