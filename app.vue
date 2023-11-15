<template>
  
  <div class="flex h-screen">
    <!-- Include custom styles for your widget -->
    <link rel="stylesheet" href="https://kulissiwa-copilot.vercel.app/dist/styles.css">

    <navbar v-if="!isAuth"/>
    <conversations v-if="isChats"/>
    <NuxtPage />

  </div>
</template>

<script>

import conversations from './components/conversations.vue'


export default {

  components: { conversations },
  computed: {
    isChats() {
      if (this.$route.name == 'chats-id' || this.$route.name == 'chats') {
        return true
      }else{
        return false
      }
    },
    isAuth() {
      if ( 
        this.$route.name == 'login' || this.$route.name == 'auth-email-verification' 
        || this.$route.name == 'auth-confirm' || this.$route.name == 'success'
      ) {
        return true
      }else{
        return false
      }
    },
  }
}

</script>
