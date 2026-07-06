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
  ignorePatterns: [
    // 忽略uni_modules目录
    '**/uni_modules/',
    // 忽略原生插件目录
    '**/nativeplugins/',
    'dist',
    // unplugin-auto-import 生成的类型文件，每次提交都改变，所以加入这里吧，与 .gitignore 配合使用
    'auto-import.d.ts',
    // vite-plugin-uni-pages 生成的类型文件，每次切换分支都一堆不同的，所以直接 .gitignore
    'uni-pages.d.ts',
    // 插件生成的文件
    'src/pages.json',
    'src/manifest.json',
  ],
})
