<script setup>
definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <chatWindow/>
</template>
<script>
export default {
  data(){
    const { trackPageView } = useMixpanel()
    return {
      trackPageView: trackPageView
    }
  },
  mounted() {
      this.trackPageView();
  },
}
</script>
