<template>
    <div class="flex w-full justify-center">
        <LoadingIndicator />
    </div>

</template>

<script >
import LoadingIndicator from '~/components/LoadingIndicator.vue';

export default {
    setup(){
        watchEffect(async () => {
            const user = useSupabaseUser()
            if (user.value) {
                const { identifyUser } = useMixpanel()
                await identifyUser(`${user.value.email}`)
                navigateTo('/documents')
            }
        })
    },
    components: {
        LoadingIndicator
    },
}
</script>

