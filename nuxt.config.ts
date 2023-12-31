// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
      head: {
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1',
        title: 'Kulissiwa - ChatGPT trained on your internal data sources',
        link: [
          { rel: 'icon', type: 'image/svg', href: '/favicon.png' }
        ],
        script: [
          {
            children: `

                  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }


            `,
          },
        ],
      },
  },

  modules: [
      '@nuxtjs/tailwindcss',
      '@nuxtjs/supabase',
      '@nuxt/content',
      '@pinia/nuxt',

  ],

  css: [
      "~/assets/css/main.css",
      "~/assets/css/prism.css",
      "@fortawesome/fontawesome-svg-core/styles.css"],

  build: {

      transpile: [
          "@fortawesome/vue-fontawesome",
          '@headlessui/vue',
      ],

  },

  plugins: [
      { src: "~/plugins/fontawesome.js", mode: "client"},
  ],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      chatAPI: process.env.CHAT_API || 'http://localhost:8787',
      dataAPI: process.env.DATA_API || 'https://blaizzy--kulissiwa-data-data-dev.modal.run',
    },
  },
  supabase:{
      // redirect: false,
      redirectOptions: {
        login: '/login',
        callback: '/auth/confirm',
        exclude: ['/auth/email-verification'],
      },
  },
  devtools: {
    enabled: false,
  },

})
