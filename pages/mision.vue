<template>
  <div>
    <!-- Mini Games Section -->
    <section class="games-section" id="mision">
      <h2 class="section-title">JUEGO INTERACTIVO</h2>
      <div class="games-grid">
        <div class="game-card">
          <h3 class="game-title">PATUS KLEI</h3>
          <p class="game-desc">AYUDE A PATUS A GANAR LA BATALLA DE LA TRIPLE PANERA</p>
          <iframe src="/game/index.html" width="640" height="400" frameborder="0"></iframe>
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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.game-card {
    background: var(--ega-black);
    border: 4px solid var(--ega-purple);
    padding: 20px;
    text-align: center;
    transition: transform 0.3s;

    min-height: 768px;
}

.game-card iframe {
    padding: 24px;
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
