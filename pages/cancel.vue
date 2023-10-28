<template>
    <div class="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
        <title>Cancel Subscription</title>
        <link rel="icon" href="/favicon.ico" />
        </Head>
    
        <main class="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 class="text-6xl font-bold">
            Cancel Subscription
        </h1>
    
        <p class="mt-3 text-2xl">
            Are you sure you want to cancel your subscription?
        </p>
    
        <div class="flex flex-col items-center justify-center mt-8">
            <button
            type="button"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            @click="cancelSubscription"
            >
            Cancel Subscription
            </button>
            <button
            type="button"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            @click="continueSubscription"
            >
            Continue Subscription
            </button>
        </div>
        </main>
    </div>
</template>
<script>
export default {
    methods:{
        async cancelSubscription() {
            navigateTo('/billing')
        },
        async continueSubscription() {
            navigateTo('/checkout')
        }
    }
}
</script>
