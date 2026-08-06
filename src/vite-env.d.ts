/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_FEATURE_FLAGS_ENDPOINT?: string;
  readonly VITE_FEATURE_FLAG_OVERRIDES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
