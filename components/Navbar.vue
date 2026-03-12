<template>
  <nav class="navbar" :class="{ active: mobileMenuOpen }">
    <div class="navbar-container">
      <div class="navbar-logo">PATUS KLEI</div>
      <button
        class="navbar-toggle"
        @click="toggleMobileMenu"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggle-bar"></span>
        <span class="navbar-toggle-bar"></span>
        <span class="navbar-toggle-bar"></span>
      </button>
      <ul class="navbar-menu">
        <li><NuxtLink to="/" @click="closeMobileMenu">{{ t('inicio') }}</NuxtLink></li>
        <li><NuxtLink to="/historia" @click="closeMobileMenu">{{ t('historia') }}</NuxtLink></li>
        <li><NuxtLink to="/mision" @click="closeMobileMenu">{{ t('mision') }}</NuxtLink></li>
        <li><NuxtLink to="/credito" @click="closeMobileMenu">{{ t('credito') }}</NuxtLink></li>
        <li><button class="lang-toggle-nav" @click="toggleLanguage">{{ langText }}</button></li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
const currentLang = ref('es')

const langText = computed(() => currentLang.value === 'es' ? 'ES / EN' : 'ES / EN')

const translations = {
  es: {
    inicio: 'Inicio',
    historia: 'Historia',
    mision: 'Mision',
    credito: 'Credito',
  },
  en: {
    inicio: 'Home',
    historia: 'Story',
    mision: 'Mission',
    credito: 'Credits',
  },
}

const t = (key: string) => {
  return translations[currentLang.value as keyof typeof translations][key as any] || key
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'es' ? 'en' : 'es'
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--ega-black);
  border-bottom: 4px solid var(--ega-orange);
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(255, 136, 0, 0.4);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.navbar-logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--ega-orange);
  text-shadow: 2px 2px 0 var(--ega-red);
  letter-spacing: 1px;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  z-index: 1001;
}

.navbar-toggle-bar {
  width: 25px;
  height: 3px;
  background: var(--ega-orange);
  margin: 3px 0;
  transition: all 0.3s;
  box-shadow: 0 0 5px var(--ega-orange);
}

.navbar-menu {
  display: flex;
  list-style: none;
  align-items: center;
  gap: 5px;
  margin: 0;
  padding: 0;
}

.navbar-menu li {
  margin: 0;
}

.navbar-menu a {
  color: var(--ega-teal);
  text-decoration: none;
  padding: 8px 16px;
  display: block;
  font-size: 14px;
  transition: all 0.3s;
  border: 2px solid transparent;
  position: relative;
}

.navbar-menu a:hover {
  color: var(--ega-orange);
  border: 2px solid var(--ega-orange);
  background: var(--ega-darkgray);
  box-shadow: 0 0 10px rgba(255, 136, 0, 0.3);
}

.lang-toggle-nav {
  background: var(--ega-darkgray);
  border: 2px solid var(--ega-teal);
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  color: var(--ega-yellow);
  transition: all 0.3s;
  font-family: 'Courier New', monospace;
}

.lang-toggle-nav:hover {
  background: var(--ega-orange);
  color: var(--ega-black);
  border-color: var(--ega-orange);
  box-shadow: 0 0 10px rgba(255, 136, 0, 0.5);
}

@media (max-width: 768px) {
  .navbar-toggle {
    display: flex;
  }

  .navbar-menu {
    position: fixed;
    top: 60px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 60px);
    background: var(--ega-black);
    flex-direction: column;
    justify-content: flex-start;
    padding: 30px 20px;
    gap: 0;
    transition: left 0.3s ease-in-out;
    border-right: 4px solid var(--ega-orange);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
  }

  .navbar.active .navbar-menu {
    left: 0;
  }

  .navbar.active .navbar-toggle-bar:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
  }

  .navbar.active .navbar-toggle-bar:nth-child(2) {
    opacity: 0;
  }

  .navbar.active .navbar-toggle-bar:nth-child(3) {
    transform: rotate(-45deg) translate(8px, -8px);
  }

  .navbar-menu li {
    width: 100%;
    margin: 0;
  }

  .navbar-menu a {
    width: 100%;
    padding: 15px 20px;
    font-size: 18px;
    border-bottom: 2px solid var(--ega-darkgray);
  }

  .navbar-menu a:hover {
    border: 2px solid var(--ega-orange);
  }

  .lang-toggle-nav {
    width: 100%;
    padding: 15px 20px;
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>
