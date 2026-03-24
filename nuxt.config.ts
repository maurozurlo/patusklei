export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  css: ['~/css/style.css'],
  vite: {
    define: {
      global: 'globalThis',
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Patus Klei',
      meta: [
        {
          name: 'description',
          content: 'La Vida de Patus Klei - The Life of Patus Klei',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },
  nitro: {
    routeRules: {
      '/game.html': {
        headers: {
          'x-frame-options': 'SAMEORIGIN',
          'content-security-policy': "frame-ancestors 'self'",
        },
      },
      '/': {
        headers: {
          'x-frame-options': 'SAMEORIGIN',
          'content-security-policy': "frame-ancestors 'self'",
        },
      },
    },
  },
})