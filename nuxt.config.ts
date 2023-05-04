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
        openai_api_key: "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",
        supabase:{
            url: "https://jnkqbhwiooorctzxrdlm.supabase.co",
            key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua3FiaHdpb29vcmN0enhyZGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIyNTQ2MTgsImV4cCI6MTk5NzgzMDYxOH0.M78WTGkXUaWSys0wLCMNacJkBR2KBi0_XPJ2nbXWoug"
        }
    }

})
