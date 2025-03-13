// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devServer: {
    host: '0.0.0.0'
  },

  devtools: { enabled: true },

  modules: [
    'nuxt-graphql-client',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    'nuxt-svgo',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/robots',
    'nuxt-site-config',
    '@nuxtjs/seo'
  ],

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

  runtimeConfig: {
    public: {
      GQL_HOST: 'https://eu-west-2.cdn.hygraph.com/content/cm4tetqve01n107umfec1iqbg/master'
    }
  },

  // Hygraph fix rate limit when testing
  generate: {
    concurrency: 250,
    interval: 200,
  },

  // Hygraph base URL for assets
  image: {
    hygraph: {
      baseURL: 'https://eu-west-2.graphassets.com/cm4tev3k1008n01uo6egngvzu'
    }
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
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginOpenerPolicy: 'unsafe-none'
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

  fonts: {
    provider: 'google'
  },

  svgo: {
    autoImportPath: './assets/svg/',
    defaultImport: 'component',
  },
})