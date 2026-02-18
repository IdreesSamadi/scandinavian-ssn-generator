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
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
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
        commaDangle: 'always',
        braceStyle: '1tbs'
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
