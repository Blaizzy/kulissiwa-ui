<template>
    <div class="flex flex-col items-center pt-4 pb-6 bg-white dark:bg-neutral-950 dark:text-gray-400" >

        <div class="flex items-center justify-between w-4/5 xl:w-1/3 px-4">
            <div class="flex pb-4 pt-4 relative">
                <h1 class="text-2xl dark:text-gray-200">Settings</h1>
            </div>
            <pricing :show-modal="open" @close-modal="open = false"/>
        </div>

        <hr class="w-full border-gray-200 dark:border-neutral-800" />
        <div class="flex items-center justify-between w-4/5 xl:w-1/3 px-4">
            <div class="flex pb-4 pt-4 w-1/3">
                <h1 class="text-lg dark:text-gray-200">Account</h1>
            </div>
        </div>
        <div class="flex flex-col gap-4 w-4/5 xl:w-1/3 px-8 bg-neutral-100/50 dark:bg-neutral-900 p-4 rounded-lg font-light">
            <div class="flex items-center justify-between py-2">
                <h1 class="text-md dark:text-gray-200">Name</h1>
                <p class="text-sm dark:text-gray-200">{{ name }}</p>   
            </div>
            <hr class="w-full border-gray-200 dark:border-neutral-800" />
            <div class="flex items-center justify-between py-2">
                <h1 class="text-md dark:text-gray-200">Email</h1>
                <p class="text-sm dark:text-gray-200">{{ email }}</p>   
            </div>
            <hr class="w-full border-gray-200 dark:border-neutral-800" />
            <div class="flex items-center justify-between py-2">
                <h1 class="text-md dark:text-gray-200 w-full">Theme</h1>
                <ModeSwitch/>
            </div>
        </div>

        

        <div class="flex flex-col mt-4 gap-4 w-4/5 xl:w-1/3 px-8 bg-neutral-100/50 dark:bg-neutral-900 p-4 rounded-lg font-light">
            <div class="flex items-center justify-between py-2">
                <h1 class="text-md dark:text-gray-200">Your Plan</h1>
                <p class="text-md animated-gradient-text font-bold" v-if="tier !== 'Free'">{{ tier }}</p> 
                <button v-if="tier == 'Free'" class="flex px-4 py-2 rounded-full bg-neutral-200/50 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 dark:hover:text-gray-300" @click="showPricingModal">
                    <p class="text-sm flex items-center  dark:text-gray-200">Upgrade
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 ml-1">
                            <path fill-rule="evenodd" d="M8.25 3.75H19.5a.75.75 0 01.75.75v11.25a.75.75 0 01-1.5 0V6.31L5.03 20.03a.75.75 0 01-1.06-1.06L17.69 5.25H8.25a.75.75 0 010-1.5z" clip-rule="evenodd" />
                        </svg>

                    </p>
                </button>
            </div>
            
        </div>
        <div class="mt-4 flex justify-end w-4/5 xl:w-1/3 px-4">

            <button class="flex px-4 py-2 rounded-full bg-neutral-100/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 dark:bg-neutral-900 dark:hover:text-gray-300" @click="signOut">
                
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9"/></svg>
                <span id="logOut" class="pl-1.5">Logout</span>

            </button>
        </div>
    </div>

    
    
</template>

<script >
import ModeSwitch from "../../components/ModeSwitch.vue";
import pricing from "../../components/pricing.vue";
import { useAuthStore } from '@/stores/index'
import { useMonthlyUsageStore } from '@/stores/monthly-usage'
export default {
    setup() {
        const monthlyUsageStore = useMonthlyUsageStore()
        let tier = computed(() => monthlyUsageStore?.tier || 'Free');

        const authStore = useAuthStore()
        const user_session = computed(() => authStore.user_session);
        // Use computed properties to handle potentially null values
        const name = computed(() => user_session.value?.user?.user_metadata?.name || '...');
        const email = computed(() => user_session.value?.user?.user_metadata?.email || '...');

  
        return {
            name,
            email,
            user_session,
            tier
        };
    },
    data() {
        return {
            open: false,
            selectedTheme: null,
        }
    },
    methods:{
        async signOut() {
            const supabase = useSupabaseClient()
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.log('Error:', error.message)
            }
   
        },
        isMobileDevice() {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /android|ipad|iphone|ipod/i.test(userAgent);
        },
        showPricingModal(){
            if (this.isMobileDevice()) {
                this.$router.push({ name: 'checkout' })
            }else{
                this.open = !this.open
            }
        }
    },
    components: { ModeSwitch, pricing }
}

</script>