<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
           <div class="border-1 bg-sky-50 p-10 shadow-md">
                <h1 class="font-semibold mb-2 pb-1">Success <i class="fas fa-check-circle text-green-500"></i>
                </h1>
                <p>
                    You have successfully subscribed to our service.
                    Thank you for your support!
                </p>
                <p class="mt-4">
                    <a href="/chats" class="text-blue-500 hover:text-blue-700">
                        Go back to chats <i class="fas fa-arrow-right"></i>
                    </a>
                </p>
           </div>
        </div>
    </div>
</template>

<script>
import confetti from 'canvas-confetti';

export default {
    data(){
        const { trackEvent } = useMixpanel()
        return {
            trackEvent: trackEvent,
        }
    },
    mounted() {
        this.launchConfetti();
        this.trackEvent('Subscription Success');
    },
    methods: {
        launchConfetti() {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
}
</script>

<style scoped>
/* Any additional styles here */
</style>
