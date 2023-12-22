<template>
  
  <div class="flex h-screen dark:bg-neutral-900">
    <!-- Include custom styles for your widget -->
    <navbar v-if="!isAuth"/>
    <NuxtPage class="overflow-y-auto w-full"/>
    <mobileNavBar v-if="!isAuth"/>
  </div>
</template>

<script>

import conversations from './components/conversationsWindow.vue'
import mobileNavBar from './components/mobileNavBar.vue'

export default {
 
  components: { conversations, mobileNavBar },
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
