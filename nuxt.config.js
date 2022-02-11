export default {
  server: {
    port: 3009
  },

  ssr: true,

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-instantsearch', 'instantsearch.js/es'],
  },
}
