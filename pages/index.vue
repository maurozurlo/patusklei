<template>
  <div>
    <!-- Hero Section -->
    <section class="hero" id="inicio">
      <div class="text-overlay">
        <div class="diagonal-text">PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div>
        <div class="diagonal-text">PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div>
        <div class="diagonal-text">PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div>
        <div class="diagonal-text">PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div>
        <div class="diagonal-text">PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div>
        <div class="diagonal-text">PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div>
      </div>
      <div class="beach-scene">
        <img src="/patushero.png" alt="PATUS KLEI" width="800" height="600">
      </div>

      <div class="title-box">
        <h1>PATUS KLEI</h1>
        <p class="tagline">LA VIDA DE PATUS KLEI</p>
        <a href="#music-section" class="cta-button">🎵 Escuche el Disco</a>
      </div>
    </section>

    <!-- Story Section -->
    <section class="story-section" id="historia">
      <div class="story-container">
        <div class="story-box">
          <p class="story-text">
            <span class="highlight">Apreciado amigo Patus Klei</span>, nacido el <span class="highlight">37 de agosto de 1907</span> en Bélgica, hijo de Andre Von Karté Klei y Luisana Ann Muschi Platze Klei.
            A los 16 años llegó a <span class="highlight">La Mítica Tierra de Cle</span> a bordo de un <span class="highlight">bidet</span>. Allí conoció a su peor enemigo hasta el momento, el perito ventrilocuista <span class="highlight">Lars Wampiola</span>.<br><br>

            Durante años Patus y Lars pelearon una batalla por razones desconocidas hasta por ellos mismos.
            Patus luchó en la <span class="highlight">Guerra de La Triple Panera</span>. Le dispararon en la cara, el cuello, el ombligo y la úvula. Perdió un ojo, una vesícula y tres dedos del pie que reemplazó heróicamente con corchos.<br><br>

            Describiendo sus experiencias en la batalla de la panera, se escuchó decir a Patus: <span class="highlight">"Siempre coma su mandarina con triple chipa"</span>.<br><br>

            Con el paso del tiempo fue enviado a China a firmar la paz con Lars Wampiola. El tratado fue celebrado con un panduro y una Crush de Pomelo. Patus vivió sus últimos años en La Mítica Tierra de Cle, donde era conocido por tener un <span class="highlight">topo de mascota llamado RODOLFA MUSCHI KLEI</span>. Fallece en 2007 tras trastabillar mientras se lavaba el pelo en la pileta de la cocina.
          </p>
        </div>
      </div>
    </section>

    <!-- Mini Games Section -->
    <section class="games-section" id="mision">
      <h2 class="section-title">⚡ JUEGO INTERACTIVO ⚡</h2>
      <div class="games-grid">
        <div class="game-card">
          <h3 class="game-title">PATUS KLEI</h3>
          <p class="game-desc">AYUDE A PATUS A GANAR LA BATALLA DE LA TRIPLE PANERA</p>
          <iframe src="/game.html" width="320" height="200" frameborder="0"></iframe>
        </div>
      </div>
    </section>

    <!-- Music Section -->
    <section class="music-section" id="music-section">
      <h2 class="section-title">🎵 ESCUCHE EL DISCO 🎵</h2>
      <div class="music-player">
        <p style="margin-bottom: 20px; color: var(--ega-teal);">Disponible en Bandcamp EL 25 DEL 12 DE 2025</p>
        <div>
          <h2 id="countdown-container" style="color: var(--ega-orange);">
            <span id="countdown"></span>
          </h2>
        </div>
      </div>
    </section>

    <!-- Credits Section -->
    <section class="credits-section" id="credito">
      <h2 class="section-title">RESUMEN CREDITICIO</h2>
      <div class="credits-grid">
        <div class="credit-card">
          <p class="credit-role">Doble de Chilavert</p>
          <p class="credit-name">Sorongo Fon Funiculi</p>
        </div>
        <div class="credit-card">
          <p class="credit-role">Guardián de la Panera</p>
          <p class="credit-name">Jhonn Roberto Garotinho</p>
        </div>
        <div class="credit-card">
          <p class="credit-role">Arte</p>
          <p class="credit-name">Vladimir Pánduro</p>
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
        container.innerHTML = '<a href="https://urpite.bandcamp.com" class="cta-button">▶️ DISPONIBLE AHORA</a>'
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

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })
})
</script>

<style scoped>
@import '~/assets/css/pages.css';
</style>
