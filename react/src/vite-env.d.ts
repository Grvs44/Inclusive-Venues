// From https://vitejs.dev/guide/env-and-mode.html
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AZURE_MAP_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
