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
        }
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
        // { src: "~/plugins/markdown-it.js", mode: "client"},
    ],
    runtimeConfig: {
        supabase:{
            url: "",
            key: "",
        },
    },



})
