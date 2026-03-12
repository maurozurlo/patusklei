<template>
  <div>
    <!-- Music Section -->
    <section class="music-section" id="music-section">
      <h2 class="section-title">ESCUCHE EL DISCO</h2>
      <div class="music-player">
        <p style="margin-bottom: 20px; color: var(--ega-teal);">Disponible en Bandcamp EL 25 DEL 12 DE 2025</p>
        <div>
          <h2 id="countdown-container" style="color: var(--ega-orange);">
            <span id="countdown"></span>
          </h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  const target = new Date('2025-12-25T00:00:00').getTime()

  function updateCountdown() {
    const now = new Date().getTime()
    const diff = target - now

    if (diff <= 0) {
      const container = document.getElementById('countdown-container')
      if (container) {
        container.innerHTML = '<a href="https://urpite.bandcamp.com" class="cta-button">DISPONIBLE AHORA</a>'
      }
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    const countdownEl = document.getElementById('countdown')
    if (countdownEl) {
      countdownEl.textContent = `${days} DÍAS ${hours} HORAS ${minutes} MINUTOS ${seconds} SEGUNDOS`
    }
  }

  updateCountdown()
  setInterval(updateCountdown, 1000)
})
</script>

<style scoped>
@import '~/assets/css/pages.css';

.music-section {
  min-height: 100vh;
  padding-top: 100px;
}
</style>
