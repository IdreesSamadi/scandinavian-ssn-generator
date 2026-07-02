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
    name: 'Scandinavian SSN Generator and Validator',
    indexable: true,
    trailingSlash: true
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sweden', '/denmark', '/norway', '/finland', '/iceland']
    }
  },

  eslint: {
    config: {
      stylistic: {
        braceStyle: '1tbs',
        semi: true
      }
    }
  },

  fonts: {
    families: [
      { name: 'Familjen Grotesk', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Spline Sans Mono', provider: 'google', weights: [400, 500, 600] }
    ]
  },

  icon: {
    mode: 'svg'
  },

  robots: {
    // robots.txt must live at the domain root, which a GitHub Pages
    // project site cannot control — keep the meta tag, skip the file
    robotsTxt: false
  },

  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-F7BQ4W3Y0P'
      }
    }
  },

  sitemap: {
    // Auto-collected sources double the GitHub Pages base path; list routes explicitly
    excludeAppSources: true,
    urls: ['/', '/sweden', '/denmark', '/norway', '/finland', '/iceland']
  }
});
