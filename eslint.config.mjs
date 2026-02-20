// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'comma-dangle': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'never']
    }
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/comma-dangle': ['error', 'never']
    }
  }
)
