import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['eslint', 'import', 'typescript', 'unicorn', 'oxc'],
  rules: {
    'eslint/no-unused-vars': 'error',
  },
})
