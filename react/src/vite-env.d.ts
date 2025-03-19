// From https://vitejs.dev/guide/env-and-mode.html
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AZURE_MAP_KEY: string
  readonly VITE_DEFAULT_LATITUDE?: string
  readonly VITE_DEFAULT_LONGITUDE?: string
  readonly VITE_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
