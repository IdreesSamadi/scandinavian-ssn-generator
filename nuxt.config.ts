export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/a11y',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  ssr: false,

  devtools: {
    enabled: true
  },

  app: {
    head: {
      title: 'Scandinavian Countries SSN Generator and Validator',
      meta: [
        { name: 'description', content: 'Generate and validate Scandinavian countries SSNs with ease using this online tool.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'google-site-verification', content: 'P9B2nNydyu8cDuKEkvMB-tSzKLiOJz7LZnT5ZuGa99g' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://idreessamadi.github.io/',
    name: 'Scandinavian Countries SSN Generator and Validator',
    indexable: true
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        braceStyle: '1tbs',
        semi: true
      }
    }
  },

  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-F7BQ4W3Y0P'
      }
    }
  }
})
