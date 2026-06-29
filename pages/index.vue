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
        <img src="/game/images/main_menu.png" alt="PATUS KLEI" width="800" height="600">
      </div>

      <div class="title-box">
        <h1>PATUS KLEI</h1>
        <p class="tagline">LA VIDA DE PATUS KLEI</p>
        <a href="https://urpite.bandcamp.com/album/patus-klei" class="cta-button" target="_blank">Escuche el Disco</a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@import '~/css/pages.css';

/* ============================================================
   Home hero polish — additive only. Every existing asset, the
   title copy and the Bandcamp CTA are preserved; these rules add
   retro CRT atmosphere, entrance motion and interactivity.
   ============================================================ */

/* CRT scanlines + vignette layered over the whole hero so it reads
   like an old EGA monitor. Sits above the art but ignores pointer
   events, so the CTA stays clickable. */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.12) 0px,
      rgba(0, 0, 0, 0.12) 1px,
      transparent 1px,
      transparent 3px
    ),
    radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.45) 100%);
  mix-blend-mode: multiply;
}

/* Tighten the hero stack: pull the title box up toward the art and
   compact its internal rhythm so it reads as one unit. */
.beach-scene {
  margin-bottom: 16px;
  animation: hero-fade 0.7s ease-out both, hero-float 6s ease-in-out infinite;
}

/* Soft depth behind the framed pixel art (no hard border so the
   art's own dithered edge is untouched). */
.beach-scene img {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 170, 170, 0.25);
}

.title-box {
  padding: 26px 36px;
  animation: hero-rise 0.7s ease-out 0.15s both;
}

.title-box h1 {
  margin-bottom: 8px;
  animation: title-flicker 5s steps(1, end) 1s infinite;
}

.tagline {
  margin-bottom: 22px;
  letter-spacing: 1px;
}

/* Pulse the primary action so it reads as the focal CTA; the pulse
   stops on hover where the existing hover state takes over. */
.cta-button {
  animation: cta-pulse 2.4s ease-in-out infinite;
}

.cta-button:hover {
  animation: none;
}

@keyframes hero-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes hero-rise {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes hero-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(255, 85, 255, 0); }
  50%      { box-shadow: 0 0 24px rgba(255, 85, 255, 0.7); }
}

/* Brief retro flicker on the title, mostly steady. */
@keyframes title-flicker {
  0%, 90%, 94%, 100% { opacity: 1; }
  92%                { opacity: 0.72; }
}

/* Respect users who prefer no motion — drop every hero animation,
   including the global diagonal scroll. */
@media (prefers-reduced-motion: reduce) {
  .beach-scene,
  .title-box,
  .title-box h1,
  .cta-button,
  .diagonal-text {
    animation: none !important;
  }
}
</style>
