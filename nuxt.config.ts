// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
// HMM
  app: {
    baseURL: '/'
  },

  devtools: { enabled: false },

  modules: [
    'nuxt-graphql-client',
    '@vueuse/nuxt',
    'nuxt-svgo',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/robots',
    'nuxt-site-config',
    '@nuxtjs/seo',
    '@pinia/nuxt', 
    '@nuxt/fonts',
    'pinia-plugin-persistedstate/nuxt',

  ],

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700, 800],
      styles: ['normal', 'italic']
    },
    families: [
      { name: 'Lora', provider: 'google' },
      { name: 'Sora', provider: 'google' },
      { name: 'Lexend', provider: 'google' },
    ],
    devtools: false,
    processCSSVariables: true
  },

  'graphql-client': {
    codegen: {
      silent: true,
      skipTypename: true,
      useTypeImports: true,
      dedupeFragments: true,
      onlyOperationTypes: true,
      avoidOptionals: false,
      disableOnBuild: false,
      maybeValue: 'T | null',
      scalars: {}
    }
  },

  // Hygraph base URL for assets
  image: {
    hygraph: {
      baseURL: '',
      format: ['webp']
    }
  },

  runtimeConfig: {
    public: {
      FORM_API: '',
      GQL_HOST: ''
    }
  },

  // Hygraph fix rate limit when testing
  generate: {
    concurrency: 250,
    interval: 200,
  },

  site: {
    url: 'https://thomasjt.com',
    name: 'Thomas J Thorstensson / Frontend Dev.',
    // ...etc
  },

  robots: {
    blockNonSeoBots: true
  },

  plugins: [
    { src: '@/plugins/gsap.client.ts', mode: 'client' }
  ],

  build: {
    transpile: ['gsap'],
  },

  //@ts-ignore
  security: {
    headers: {
      crossOriginEmbedderPolicy: 'credentialless',
      crossOriginOpenerPolicy: 'credentialless',
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/global.scss" as *;',
        },
      },
    },
  },

  svgo: {
    autoImportPath: './assets/svg/',
    defaultImport: 'component',
  },
})