<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
           <div class="border-1 bg-sky-50 p-10 shadow-md">
                <h1 class="font-semibold mb-2 pb-1">Transaction Cancelled <i class="fas fa-xmark text-red-500"></i>
                </h1>
                <p>
                    You have successfully cancelled your subscription.
                    <br class="pt-1"/>
                    We are sorry to see you go!
                </p>
                <div class="mt-4 flex flex-col">
                    <button @click="continueSubscription" class="flex items-center text-blue-500 hover:text-blue-700"> 
                        <p class="mr-1"> Renew subscription </p>
                        <i class="fas fa-arrow-right"></i>
                    </button>

                </div>
           </div>
           </div>
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
