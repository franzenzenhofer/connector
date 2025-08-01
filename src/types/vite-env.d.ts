/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot?: {
    readonly accept: (callback: () => void) => void
    readonly dispose: (callback: () => void) => void
  }
}