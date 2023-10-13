<template>
    <!-- Side Navbar -->
    <div class="bg-white p-4 flex flex-col border-r border-gray-200"
    :class="{'w-16 rounded': collapsed, 'w-64': !collapsed}"
    id="mainSideNavbar">
        <nav class="text-base">
            <div class="flex py-3 font-semibold mb-4 text-center justify-between">
                <img src="~~/assets/logos/kulissiwa.svg" width="32" height="32" alt="Kulissiwa Logo">
                <ChevronDoubleLeftIcon class="w-8 h-8 text-gray-600 py-1 px-2 rounded-full hover:bg-sky-50" id="collapseButton" @click="collapse" />
            </div>
            <button v-show="collapsed" @click="collapse" class="block py-3 px-2 mb-2 font-semibold rounded-full hover:bg-sky-100">
                <Bars3Icon class="w-4 h-4 text-gray-600"/>
            </button>
            <!-- <NuxtLink to="/dashboard" class="block py-3 px-2 mb-2 rounded-full hover:bg-sky-50">
                <i class="fa-solid fa-cubes"></i>
                    <span v-show="!collapsed" class="pl-1.5">Dashboard</span>
  
            </NuxtLink> -->
            <NuxtLink to="/dataSources" class="block py-3 px-2 mb-2 rounded-full hover:bg-sky-50"
            :class="{'bg-sky-100': isSelectedMenu('/dataSources')}">
                <i class="fa-solid fa-database"></i>
 
                <span v-show="!collapsed" class="pl-1.5">Data Sources</span>
         
        
            </NuxtLink>
            <NuxtLink to="/chats"  class="block py-3 px-2 mb-2 rounded-full hover:bg-sky-50"
            :class="{'bg-sky-100': isSelectedMenu('/chats')}">
                <i class="fa-solid fa-comments fa-sm"></i>
                
                <span v-show="!collapsed" class="pl-1.5">Chats</span>
                
            </NuxtLink>

            <!-- <NuxtLink to="/billing" class="block py-3 px-2 mb-2 rounded-full hover:bg-sky-50">
                <i class="fa-solid fa-credit-card"></i>
               
                    <span v-show="!collapsed" class="pl-1.5">Billing</span>
                
            </NuxtLink> -->
        </nav>

        <hr class="mt-auto w-full h-px my-2 border dark:bg-gray-300">

        <div class="mb-4 py-2 px-2 flex items-start rounded-full hover:bg-sky-50">

            <button class="block" @click="signOut">
                <i class="fa-solid fa-right-from-bracket"></i> <span id="logOut" v-show="!collapsed" class="pl-1.5">Logout</span>
            </button>
        </div>
        <div class="mb-2 flex items-start rounded-full hover:bg-sky-50">
            <div class="flex items-center">
                <img class="rounded-full border-2 border-white"
                :class="{'w-8 h-8': collapsed, 'w-12 h-12': !collapsed}"
                 id="profilePicture" :src="avatar_url" alt="Profile Picture">
                <div id="profileDetails" class="mr-8 pr-8 pl-1.5">
                    <span class="font-semibold" v-show="!collapsed">{{ name }}</span>
                    <p class="text-sm text-gray-600" v-show="!collapsed">{{email}}</p>
                </div>
            </div>


        </div>
    </div>

</template>



<script>
import { ChevronDoubleLeftIcon, Bars3Icon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/index'

export default {
    data(){
        const store = useAuthStore()
        return {
            name:"",
            email:"",
            avatar_url:"/images/avatars/user-default-pic.png",
            collapsed: false,
            store: store
        }
    },
    mounted() {
        const supabase = useSupabaseClient()

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
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
                this.store.signOut()
                this.resetProfile()
                this.$router.push('/login');
            }
        });
        
        
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