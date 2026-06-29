<template>
  <div>
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

      <h2 class="liner-heading">Notas del Disco</h2>
      <div class="liner-notes">
        <p class="liner-intro">
          El siguiente disco ha sido compilado de una compilación de sinfonías proto-otomanas reveladas bajo el velo de la Peste Blanca alias Sars Covideus 2da MMXIX.
          Susodicho en encarnación, con todos sus pelpas en regla, por secreto designeo de Dios y la patría le desea muy feliz día de los faconazos, Interunpendio ragús yerga el mate su cumbre más alta. Urqite 4ever.
        </p>

        <p class="liner-release">released April 20, 2026</p>

        <p class="liner-composed">Todos los Termas Compuestos por Urqite.</p>

        <ul class="lineup">
          <li>
            <span class="lineup-name">Sorongo Von Funiculi</span>
            <span class="lineup-roles">voçes, criolla, bajo criollo, mondiolica v2.0, arte do tapas</span>
          </li>
          <li>
            <span class="lineup-name">Johnn Roberto Garotinho</span>
            <span class="lineup-roles">baço, jitarra no criolla, bata-dedo, tecla/síntesis, mixproducsâon</span>
          </li>
        </ul>

        <p class="liner-note">
          Este disco lo podríamos haber hecho dos personas solas, o quizás una sola, pero como seguimos mucho IA pero poco clonasión barata hubo gente que prestó su cuerpo y tiempo para estos fines, a saber:
        </p>

        <ul class="guest-list">
          <li><span class="guest-name">Daniela D.</span> <span class="guest-role">(Flauta Traversa en Tada Junsui)</span></li>
          <li><span class="guest-name">Leila Chab</span> <span class="guest-role">(Clarinete en Inuit Minué)</span></li>
          <li><span class="guest-name">Willy Rangone</span> <span class="guest-role">(Trompeta, Trombón en Inuit Minué)</span></li>
          <li><span class="guest-name">Morena Mw</span> <span class="guest-role">(Coros Mezzo Soprano en Memorías)</span></li>
          <li><span class="guest-name">Fede Vogliolo</span> <span class="guest-role">(Coros Gregorianos en El Fin)</span></li>
          <li><span class="guest-name">Sergio Rabello</span> <span class="guest-role">(Cello, Viola, Violín en El Fin)</span></li>
          <li><span class="guest-name">María Grig</span> <span class="guest-role">(Cello,Viola, Violín en El Fin)</span></li>
        </ul>

        <p class="liner-master">Masterinzao x Iván Klomp</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@import '~/css/pages.css';

.credits-section {
  min-height: 100vh;
  padding-top: 100px;
}

.credit-card {
  box-shadow: 6px 6px 0 var(--ega-darkcyan);
}

.credit-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 var(--ega-darkcyan), 0 0 20px rgba(85, 255, 255, 0.4);
}

/* Album liner notes: an orange-themed block tying it to the disco/CTA. */
.liner-heading {
  text-align: center;
  font-size: 26px;
  color: var(--ega-orange);
  letter-spacing: 1px;
  margin: 60px 0 28px;
  text-shadow: 2px 2px 0 var(--ega-black), 0 0 16px rgba(255, 136, 0, 0.45);
}

.liner-heading::after {
  content: "";
  display: block;
  width: 120px;
  height: 3px;
  margin: 16px auto 0;
  background: var(--ega-orange);
  box-shadow: 0 0 10px rgba(255, 136, 0, 0.5);
}

.liner-notes {
  max-width: 800px;
  margin: 0 auto;
  background: var(--ega-darkblue);
  border: 4px solid var(--ega-orange);
  padding: 32px 36px;
  box-shadow: 6px 6px 0 var(--ega-brown), 0 0 30px rgba(255, 136, 0, 0.3);
  text-align: left;
  line-height: 1.7;
}

.liner-intro {
  font-style: italic;
  color: var(--ega-lightcyan);
  margin-bottom: 1.4rem;
}

.liner-release {
  color: var(--ega-yellow);
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1.4rem;
}

.liner-composed {
  color: var(--ega-orange);
  font-weight: bold;
  margin-bottom: 1.4rem;
}

.lineup {
  list-style: none;
  margin: 0 0 1.6rem;
  padding: 0;
}

.lineup li {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 136, 0, 0.3);
}

.lineup li:first-child {
  border-top: 1px solid rgba(255, 136, 0, 0.3);
}

.lineup-name {
  display: block;
  color: var(--ega-orange);
  font-weight: bold;
  letter-spacing: 0.5px;
}

.lineup-roles {
  display: block;
  color: var(--ega-lightgreen);
  font-size: 14px;
  margin-top: 2px;
}

.liner-note {
  color: var(--ega-lightgreen);
  margin-bottom: 1.4rem;
}

.guest-list {
  list-style: none;
  margin: 0 0 1.8rem;
  padding: 0;
}

.guest-list li {
  margin-bottom: 8px;
  padding-left: 14px;
  border-left: 3px solid var(--ega-brown);
}

.guest-name {
  color: var(--ega-white);
  font-weight: bold;
}

.guest-role {
  color: var(--ega-lightgray);
  font-size: 14px;
}

.liner-master {
  text-align: center;
  color: var(--ega-yellow);
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-top: 2px solid var(--ega-brown);
  padding-top: 1.2rem;
}

@media (max-width: 768px) {
  .liner-heading {
    font-size: 20px;
  }

  .liner-notes {
    padding: 22px 18px;
  }
}
</style>
