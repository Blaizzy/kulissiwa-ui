<template>
    <div class="flex w-full justify-center">
        <LoadingIndicator />
    </div>

</template>

<script >
import LoadingIndicator from '~/components/LoadingIndicator.vue';

export default {
    setup(){
        watchEffect(() => {
            const user = useSupabaseUser()
            if (user.value) {
                navigateTo('/chats')
            }
        })
    },
    components: {
        LoadingIndicator
    },
}
</script>

