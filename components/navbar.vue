<template>
    <!-- Side Navbar -->
    <div class="bg-white p-4 flex flex-col border-r border-gray-200"
    :class="{'w-16 rounded items-center': collapsed, 'w-64': !collapsed}"
    id="mainSideNavbar">
        <nav class="text-base">
            <div class="flex py-3 font-semibold mb-4 text-center justify-between">
                <img src="~~/assets/logos/kulissiwa.svg" width="32" height="32" alt="Kulissiwa Logo">
                <button v-show="!collapsed" @click="collapse" class="block py-3 px-2 mb-2 rounded-full hover:bg-sky-50">
                    <svg class="icon icon-tabler icon-tabler-layout-sidebar-left-collapse" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none" stroke="none"/><rect height="16" rx="2" width="16" x="4" y="4"/><path d="M9 4v16"/><path d="M15 10l-2 2l2 2"/></svg>
                </button>
                
            </div>
            <button v-show="collapsed" @click="collapse" class="block py-2 px-2 mb-2 font-bold rounded-full hover:bg-sky-50">
                <Bars3Icon class="w-4 h-4 text-gray-600 "/>
            </button>
            <NuxtLink to="/documents" class="flex items-center py-2 px-2 mb-2 rounded-full hover:bg-sky-50"
            :class="{'bg-sky-100': isSelectedMenu('/documents'), 'justify-center': collapsed}">
                <ClientOnly>
                    <i class="fa-solid fa-database"></i> 
                    <span v-show="!collapsed" class="pl-1.5">Documents</span>    
                </ClientOnly>

            </NuxtLink>
            <NuxtLink to="/chats"  class="flex items-center py-2 px-2 mb-2 rounded-full hover:bg-sky-50"
            :class="{'bg-sky-100': isSelectedMenu('/chats'), 'justify-center': collapsed}">
                <ClientOnly>
                    <i class="fa-solid fa-comments"></i>
                    <span v-show="!collapsed" class="pl-1.5">Chats</span>
                </ClientOnly>
            </NuxtLink>
            
            
            <NuxtLink to="/billing" class="flex items-center py-2 px-2 mb-2 rounded-full hover:bg-sky-50" v-show="!showUpgradeButton"
            :class="{'bg-sky-100': isSelectedMenu('/billing'), 'justify-center': collapsed}">
                <ClientOnly>
                    <i class="fa-solid fa-credit-card"></i>
                    <span v-show="!collapsed" class="pl-1.5">Billing</span>
                </ClientOnly>

            </NuxtLink>

        </nav>
        <button class="mt-auto py-2 px-2 rounded-full hover:bg-sky-500 animated-gradient-bg text-white" v-show="showUpgradeButton">
            <a href="/checkout">
                <ClientOnly>
                    <div class="relative inline-block"> <!-- Container for the icon and animation -->
                        <i class="fa-solid fa-gift"></i>
                        <span class="animate-ping absolute top-0 right-0 inline-flex h-1.5 w-1.5 rounded-full bg-red-600"></span> <!-- Positioning adjusted here -->
                    </div>
                    <span id="upgrade" v-show="!collapsed" class="pl-1.5">Upgrade</span>
                </ClientOnly>
            </a>
        </button>

        <hr class="w-full h-px my-2 border dark:bg-gray-300"
            :class="{'mt-auto ': !showUpgradeButton}">

        <div class="mb-4 py-2 px-2 flex items-start rounded-full hover:bg-sky-50">

            <button class="block" @click="signOut">
                <ClientOnly>
                    <i class="fa-solid fa-right-from-bracket"></i> <span id="logOut" v-show="!collapsed" class="pl-1.5">Logout</span>
                </ClientOnly>
            </button>
        </div>
        <div class="mb-2 flex items-start rounded-full hover:bg-sky-50">
            <div class="flex items-center">
                <img class="rounded-full border-2 border-white"
                :class="{'w-8 h-8': collapsed, 'w-12 h-12': !collapsed}"
                 id="profilePicture" :src="avatar_url" alt="Profile Picture">
                <div id="profileDetails" class="mr-8 pr-8 pl-1.5" v-show="!collapsed">
                    <span class="font-semibold">{{ name }}</span>
                    <p class="text-sm text-gray-600">{{email}}</p>
                </div>
            </div>

        </div>
    </div>

</template>



<script>
import { ChevronDoubleLeftIcon, Bars3Icon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/index'
import { useMonthlyUsageStore } from '@/stores/monthly-usage'
import { useTierLimits } from '~/stores/tiers'

export default {
    data(){
        const store = useAuthStore()
        const monthly_usage = useMonthlyUsageStore()
        const tier_limits = useTierLimits()
        return {
            name:"",
            email:"",
            avatar_url:"/images/avatars/user-default-pic.png",
            collapsed: false,
            store: store,
            monthly_usage: monthly_usage,
            tier_limits: tier_limits,
            showUpgradeButton: false,
        }
    },
    async mounted() {
        const supabase = useSupabaseClient()

        await supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                this.store.signIn(session)
                const user_metadata = this.store.user_session.user.user_metadata
                if (Object.keys(user_metadata).length > 0){
                    this.avatar_url = user_metadata.avatar_url
                    this.name = user_metadata.full_name
                    this.email = user_metadata.email
                } else {
                    this.email = this.store.user_session.user.email
                }
                    
            } else if (event === 'SIGNED_OUT') {
                const { data, error } = supabase
                    .from('monthly_usage')
                    .update([
                        { 
                            files_uploaded: this.monthly_usage.filesUploaded,
                            messages_sent: this.monthly_usage.messagesSent,
                            active_data_sources: this.monthly_usage.activeDataSourcesCount,
                        }
                    ])
                    .eq('user_id', this.store.user_session.user.id)
                    .eq('year_month', new Date().toISOString().slice(0,7))

                if (error) {
                    console.log(error)
                }

                this.store.signOut()
                this.monthly_usage.reset()
                this.tier_limits.reset()
                this.resetProfile()
                this.$router.push('/login');
            }
        });

        watchEffect(async() => {
            if (this.store.user_session) {
                this.getActiveDataSourcesCount(supabase)
                this.getSubscription(supabase)
                this.getTiers(supabase)
            }
            
            // Update Files Uploaded
            if (this.monthly_usage.filesUploaded){
                const { data, error } = await supabase
                    .from('monthly_usage')
                    .update([
                        { 
                            files_uploaded: this.monthly_usage.filesUploaded,
                        }
                    ])
                    .eq('user_id', this.store.user_session.user.id)
                    .eq('year_month', new Date().toISOString().slice(0,7))
                
                if (error) {
                    console.log(error)
                }
            }
            
            // Update Tier ID
            if (this.monthly_usage.tier_id) {
                const { data, error } = await supabase
                    .from('monthly_usage')
                    .update([
                        { 
                            tier_id: this.monthly_usage.tier_id,
                        }
                    ])
                    .eq('user_id', this.store.user_session.user.id)
                    .eq('year_month', new Date().toISOString().slice(0,7))
                
                if (error) {
                    console.log(error)
                }
            }
        })
        
    },
    methods: {
        resetProfile(){
            this.avatar_url = "/images/avatars/user-default-pic.png"
            this.name = ""
            this.email = ""
        },
        async signOut() {
            const supabase = useSupabaseClient()
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.log('Error:', error.message)
            }
   
        },
        collapse() {
            if (this.collapsed) this.collapsed = false
            else this.collapsed = true
        },
        isSelectedMenu(name){
            if (this.$route.path === name || this.$route.path.split('/')[1] === name.split('/')[1]) return true
            else return false
        },
        async getTiers(supabase){
            const { data, error } = await supabase
                .from('tiers')
                .select('id, name, file_limit, message_limit, pages_limit, concurrent_upload_limit, active_data_sources_limit')
            
            if (error) {
                console.log(error)
            } 
            if (data) {
                this.tier_limits.updateTiers(data)
                if (this.monthly_usage.tier_id) {
                    const tier = data.filter(tier => tier.id === this.monthly_usage.tier_id)[0]
                    this.monthly_usage.updateTier(tier)
                }
            }
        },
        async getSubscription(supabase){
            const { data, error } = await supabase
                .from('subscriptions')
                .select('id, stripe_customer_id, tier, status')
                .eq('user_id', this.store.user_session.user.id)
            
            if (error) {
                console.log(error)
            } 
            if (data) {
                if (data.length === 0) {
                    this.showUpgradeButton = true
                } else {
                    if (data[0].stripe_customer_id) {
                        this.monthly_usage.updateSubscription(data[0])
                        if (data[0].status === 'active') {
                            this.showUpgradeButton = false
                        } else if (data[0].status === 'canceled'){
                            this.showUpgradeButton = true
                        } else {
                            this.showUpgradeButton = true
                        }
                    }
                }
            }

            const { data: monthly_usage, error: monthly_usage_error } = await supabase
                .from('monthly_usage')
                .select('files_uploaded, messages_sent, year_month')
                .eq('year_month', new Date().toISOString().slice(0,7))

            if (monthly_usage_error) {
                console.log(monthly_usage_error)
            }
            if (monthly_usage) {
                if (monthly_usage.length === 0) {
                    const tier_id = this.monthly_usage.tier_id
                    const user_id = this.store.user_session.user.id
                    const files_uploaded = 0
                    const messages_sent = this.monthly_usage.messagesSent
                    const active_data_sources = this.monthly_usage.activeDataSourcesCount
                    const year_month = new Date().toISOString().slice(0,7)

                    const { data, error } = await supabase
                        .from('monthly_usage')
                        .insert([
                            { 
                                user_id: user_id,
                                tier_id: tier_id,
                                files_uploaded: files_uploaded,
                                messages_sent: messages_sent,
                                year_month: year_month,
                                active_data_sources: active_data_sources,
                            }
                        ])
                    if (error) {
                        console.log(error)
                    }

                    this.monthly_usage.updateUsage({
                        files_uploaded: files_uploaded,
                        messages_sent: messages_sent,
                        year_month: year_month,
                    })

                } else {
                    this.monthly_usage.updateUsage(monthly_usage[0])
                }
            }

        },
        async getActiveDataSourcesCount(supabase){
            const { data, error } = await supabase
                .from('data')
                .select('id, user_id, is_active')
                .eq('user_id', this.store.user_session.user.id)
                .eq('is_active', true)
            
            if (error) {
                console.log(error)
            } 
            if (data) {
                this.monthly_usage.updateActiveDataSourcesCount(data)
            }
        }
    },
    components: {
        ChevronDoubleLeftIcon,
        Bars3Icon
    }

}


</script>

<style>

#mainSideNavbar {
  transition: width 0.3s ease-in-out;
}

</style>