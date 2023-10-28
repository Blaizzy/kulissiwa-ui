<template>
    <div>
        <h1>Success!</h1>
        <p>You have successfully subscribed to our service.</p>
        <p>Thank you for your support!</p>
        <a href="/chats">Go to Chats</a>
    </div>
</template>
<script>
export default {
    name: 'Success',
    data() {
        return {
        }
    },
    async mounted() {
        // get session id from url
        // const sessionId = this.$route.query.session_id
        // create update
    },
}
</script>
