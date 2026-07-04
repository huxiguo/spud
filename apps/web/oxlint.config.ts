import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['eslint', 'import', 'typescript', 'unicorn', 'oxc', 'vue'],
  env: {
    browser: true,
  },
  categories: {
    correctness: 'error',
  },
  rules: {
    'eslint/no-unused-vars': 'error',
  },
})
