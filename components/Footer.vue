<template>
  <footer>
    <div class="social-links">
      <a href="https://urpite.bandcamp.com" target="_blank">Bandcamp</a>
    </div>
    <p style="color: var(--ega-lightgray);">© 1907-2026 Patus Klei | La Mítica Tierra de Cle</p>
    <p class="easter-egg">CONSIGA SU BIDET DE CLE IMPRESO EN 3D PROSSIMAMENTE</p>
  </footer>
</template>

<style scoped>
footer {
  background: var(--ega-black);
  border-top: 4px solid var(--ega-orange);
  padding: 40px 20px;
  text-align: center;
}

.social-links {
  margin-bottom: 20px;
}

.social-links a {
  color: var(--ega-teal);
  text-decoration: none;
  margin: 0 15px;
  font-size: 18px;
  transition: color 0.3s;
}

.social-links a:hover {
  color: var(--ega-orange);
}

.easter-egg {
  color: var(--ega-darkgray);
  font-size: 12px;
  margin-top: 20px;
}
</style>
