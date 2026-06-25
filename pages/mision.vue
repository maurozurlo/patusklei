<template>
  <div>
    <!-- Mini Games Section -->
    <section class="games-section" id="mision">
      <h2 class="section-title">JUEGO INTERACTIVO</h2>
      <div class="games-grid">
        <div class="game-card">
          <h3 class="game-title">PATUS KLEI</h3>
          <p class="game-desc">AYUDE A PATUS A GANAR LA BATALLA DE LA TRIPLE PANERA</p>
          <div class="game-frame">
            <iframe src="/game/index.html" frameborder="0" title="Patus Klei"></iframe>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@import '~/css/pages.css';

.games-section {
  min-height: 100vh;
  padding-top: 100px;
}

.games-section {
    background: var(--ega-darkgray);
    padding: 80px 20px;
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
    padding: 20px;
    text-align: center;
    transition: transform 0.3s;
    max-width: 840px;
    margin: 0 auto;
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

.game-card:hover {
    transform: translateY(-5px);
    border-color: var(--ega-pink);
    box-shadow: 0 0 30px rgba(255, 170, 255, 0.4);
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

.music-section {
    background: var(--ega-darkmagenta);
    padding: 80px 20px;
}

</style>
