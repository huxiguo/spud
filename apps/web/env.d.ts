/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_ENV: 'development' | 'production' | 'test'
  VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
