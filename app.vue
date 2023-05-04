<template>
  <div class="flex h-screen bg-gray-100">
    <navbar v-if="!isLogin"/>
    <conversations v-if="isChats"/>
    <NuxtPage />
  </div>
</template>

<script>

import conversations from './components/conversations.vue'

export default {
  components: { conversations },
  async mounted() {


    const { data, error } = await useSupabaseClient().auth.getSession()
    console.log(data)

    if (data.session == null) {
        this.$router.push('/login')
    }

  },
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





