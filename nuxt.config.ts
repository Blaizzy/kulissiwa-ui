// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/supabase',
        '@nuxt/content',

    ],
    css: [
        "~/assets/css/main.css",
        "~/assets/css/prism.css",
        "@fortawesome/fontawesome-svg-core/styles.css"],
    build: {
        transpile: [
            "@fortawesome/vue-fontawesome",
        ]
    },
    plugins: [
        { src: "~/plugins/fontawesome.js", mode: "client"},
        { src: "~/plugins/markdown-it.js", mode: "client"},
    ],
    runtimeConfig: {
        supabase:{
            url: "",
            key: ""
        }
    }

})
