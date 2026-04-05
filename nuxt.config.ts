export default defineNuxtConfig({
  compatibilityDate: '2026-03-09',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],

  colorMode: {
    classSuffix: ''
  },

  css: [
    '@/assets/css/main.css',
    'vue3-toastify/dist/index.css'
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
})