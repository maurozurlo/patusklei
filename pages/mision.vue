<template>
  <div>
    <!-- Mini Games Section -->
    <section class="games-section" id="mision">
      <h2 class="section-title">JUEGO INTERACTIVO</h2>
      <div class="games-grid">
        <div class="game-card">
          <h3 class="game-title">PATUS KLEI</h3>
          <p class="game-desc">AYUDE A PATUS A GANAR LA BATALLA DE LA TRIPLE PANERA</p>
          <iframe src="/game.html" width="320" height="200" frameborder="0"></iframe>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@import '~/assets/css/pages.css';

.games-section {
  min-height: 100vh;
  padding-top: 100px;
}
</style>
