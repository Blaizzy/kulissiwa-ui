<template>
    <!-- Side Navbar -->
    <div class="hidden lg:flex h-screen flex-col dark:text-gray-400 bg-neutral-100/50 dark:bg-neutral-900 p-4 border-r border-gray-200 dark:border-0"
    :class="{'w-16 items-center': collapsed, 'w-64': !collapsed}"
    id="mainSideNavbar">
    <pricing :show-modal="open" @close-modal="open = false"/>
        <nav class="text-base">
            <div class="flex py-3 font-semibold mb-4 text-center justify-between">
                <img src="~~/assets/logos/kulissiwa.svg" width="32" height="32" alt="Kulissiwa Logo">
                <button v-show="!collapsed" @click="collapse" class="block py-3 px-2 mb-2 rounded-full hover:bg-sky-50 dark:hover:bg-neutral-800 dark:hover:text-gray-300">
                    <svg class="icon icon-tabler icon-tabler-layout-sidebar-left-collapse" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none" stroke="none"/><rect height="16" rx="2" width="16" x="4" y="4"/><path d="M9 4v16"/><path d="M15 10l-2 2l2 2"/></svg>
                </button>
                
            </div>
            
            <button v-show="collapsed" @click="collapse" class="block py-2 px-2 mb-2 font-bold rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800 dark:hover:text-gray-300">
                <Bars3Icon class="w-4 h-4"/>
            </button>
            <NuxtLink to="/documents" class="flex items-center py-2 px-2 mb-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800 dark:hover:text-gray-300"
            :class="{'bg-neutral-200/50 dark:text-gray-100 dark:bg-neutral-800': isSelectedMenu('/documents'), 'justify-center': collapsed}">
                <ClientOnly>
                    <div v-if="isSelectedMenu('/documents')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
                            <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
                            <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
                            <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
                        </svg>

                    </div>
                    <div v-else>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                    </div>

                    <span v-show="!collapsed" class="pl-1.5">Documents</span>    
                </ClientOnly>

            </NuxtLink>
            <NuxtLink to="/chats/list"  class="flex items-center py-2 px-2 mb-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800 dark:hover:text-gray-300"
            :class="{'bg-neutral-200/50 dark:text-gray-100 dark:bg-neutral-800': isSelectedMenu('/chats'), 'justify-center': collapsed}">


                    <div v-if="isSelectedMenu('/chats')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                        </svg>

                    </div>
                    <div v-else>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                    </div>
                    <span v-show="!collapsed" class="pl-2">Chats</span>
                
            </NuxtLink>
            <div class="flex flex-col px-4 mb-2 ">
                <ul v-show="!collapsed" class="flex list-inside" v-for="conversation in conversations" :key="conversation.id">
                    <NuxtLink
                        :to="`/chats/${conversation.id}`" 
                        
                        >
                    <li class="px-4 py-2 text-sm w-full border-l-2 text-gray-500 border-gray-100 hover:border-gray-300 dark:border-neutral-800 dark:hover:border-neutral-600 dark:hover:text-gray-300">
                    {{ conversation.title }} 
                    </li>
                    </NuxtLink>
                </ul>
            </div>
            
            
            <NuxtLink to="/billing" class="flex items-center py-2 px-2 mb-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800 dark:hover:text-gray-300" v-show="!showUpgradeButton"
            :class="{'bg-neutral-200/50 dark:text-gray-100 dark:bg-neutral-800': isSelectedMenu('/billing'), 'justify-center': collapsed}">
                <div v-if="isSelectedMenu('/billing')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                        <path fill-rule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clip-rule="evenodd" />
                    </svg>

                </div>
                <div v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                </div>
                    <span v-show="!collapsed" class="pl-1.5">Billing</span>
                

            </NuxtLink>

        </nav>
        <div class="mt-auto flex flex-col" v-show="showUpgradeButton">
            <span id="upgrade" v-show="!collapsed" class="font-medium  dark:text-gray-300">Try Pro</span>
            <p class="font-light text-md text-gray-500" v-show="!collapsed">
                Upgrade to upload more documents, and access powerful AI models.
            </p>
            <button class="mt-2 py-2 px-2 rounded-lg bg-sky-500 dark:bg-neutral-800 text-white" @click="showPricingModal">
                
                    <ClientOnly>
                        <div class="relative inline-block"> <!-- Container for the icon and animation -->
                            <i class="fa-solid fa-gift"></i>
                            <span class="animate-ping absolute top-0 right-0 inline-flex h-1.5 w-1.5 rounded-full bg-red-600"></span> <!-- Positioning adjusted here -->
                        </div>
                        <span id="upgrade" v-show="!collapsed" class="pl-1.5">Learn more</span>
                    </ClientOnly>
            
            </button>
        </div>

        <hr class="w-full h-px my-2 border-gray-300 dark:border-neutral-700"
            :class="{'mt-auto ': !showUpgradeButton}">

       
        <div class="flex items-start rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800 dark:hover:text-gray-300">
            <NuxtLink to="/settings/account">
                <div class="flex items-center py-1">
                    <div class="flex items-center">
                        <img class="rounded-full border-2 border-white"
                        :class="{'w-6 h-6': collapsed, 'w-8 h-8': !collapsed}"
                        id="profilePicture" :src="avatar_url" alt="Profile Picture">
                        <div id="profileDetails" class="pl-2 text-black dark:text-gray-200 text-md" v-show="!collapsed">
                            <p class="text-ellipsis overflow-hidden w-9/12">{{ email }}</p>
                        </div>
                    </div>
                    
                    <div v-show="!collapsed" class="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>

                    </div>
                </div>
            </NuxtLink>
            
        </div>
    </div>


    <div class="lg:hidden fixed bottom-0 left-0 z-50 h-16 w-full bg-white border-t border-gray-200 dark:bg-neutral-900 dark:border-none">
        <div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium ">
            <NuxtLink to="/documents" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-600">
                    <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
                    <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
                    <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
                    <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
                </svg>
                <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-sky-500 dark:group-hover:text-sky-600">Documents</span>
            </NuxtLink>
            <NuxtLink to="/chats/list" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-neutral-800 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-600">
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                </svg> 
                <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-sky-500 dark:group-hover:text-sky-600">Chats</span>
            </NuxtLink>
            <NuxtLink to="/settings/account" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-neutral-800 group">
                <svg class="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"/>
                </svg>
                <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-600">Settings</span>
            </NuxtLink>
            
        </div>
    </div>


</template>



<script>
import { ChevronDoubleLeftIcon, Bars3Icon, CircleStackIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/index'
import { useMonthlyUsageStore } from '@/stores/monthly-usage'
import { useTierLimits } from '~/stores/tiers'


export default {

    data(){
        const store = useAuthStore()
        const monthly_usage = useMonthlyUsageStore()
        const tier_limits = useTierLimits()
        return {
            open: false,
            conversations: [],
            currentPage: 1,
            itemsPerPage: 5,
            totalItems: 0,
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

        this.getConversations(supabase)
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
        },
        async getConversations(supabase, refresh = false) {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage - 1;
            const { data, error, count } = await supabase
                .from('conversations')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(startIndex, endIndex);

            if (error) {
                console.log(error);
            }
            else {
                if (data) {
                    this.totalItems = count;
                    if (refresh) {
                        this.conversations = [];
                    }
                    data.forEach(conversation => {
                        this.conversations.push(conversation);
                    });
                }
            }
            this.isLoading = false;
        },
        resetProfile(){
            this.avatar_url = "/images/avatars/user-default-pic.png"
            this.name = ""
            this.email = ""
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
    Bars3Icon,
    CircleStackIcon,
}

}


</script>

<style>

#mainSideNavbar {
  transition: width 0.3s ease-in-out;
}

</style>