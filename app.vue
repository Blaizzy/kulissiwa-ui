<template>
  <div class="flex h-screen">
    <navbar v-if="!isLogin"/>
    <conversations v-if="isChats"/>
    <NuxtPage />
  </div>
</template>

<script>

import conversations from './components/conversations.vue'

export default {
  components: { conversations },
  // async mounted() {


    // const { data, error } = await useSupabaseClient().auth.getSession()

    // if (error) {
    //     console.log(error)
    //     console.log('There was an error loading your data source')
    // }

    // if (data.session == null) {
    //     this.$router.push('/login')
    // }

  // },
  computed: {
    isChats() {
      if (this.$route.name == 'chats-id' || this.$route.name == 'chats') {
        return true
      }else{
        return false
      }
    },
    isLogin() {
      return this.$route.name == 'login'
    }
  }
}

</script>
