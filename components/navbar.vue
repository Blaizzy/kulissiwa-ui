<template>
    <!-- Side Navbar -->
    <div class="w-64 bg-white p-4 flex flex-col" id="mainSideNavbar">
        <nav>
            <div class="py-2 font-semibold mb-4 text-center">
                <img src="~~/assets/logos/kulissiwa.svg" width="32" height="32" alt="Kulissiwa Logo">
            </div>
            <button id="collapseButton" @click="collapse" class="block py-2 px-2 mb-2 rounded hover:bg-gray-100">
                <i class="fa-solid fa-arrow-left pr-1 "></i>
                <span></span>
            </button>
            <NuxtLink to="/dashboard" class="block py-2 px-2 mb-2 rounded-full hover:bg-gray-100">
                <i class="fa-solid fa-cubes pr-1"></i>
                <span>Dashboard</span>
            </NuxtLink>
            <NuxtLink to="/dataSources" class="block py-2 px-2 mb-2 rounded-full hover:bg-gray-100">
                <i class="fa-solid fa-database pr-1"></i>
                <span>Data Sources </span>
            </NuxtLink>
            <NuxtLink to="/chats"  class="block py-2 px-2 mb-2 rounded-full hover:bg-gray-100">
                <i class="fa-solid fa-comments fa-sm pr-1"></i>
                <span>Chats</span>
            </NuxtLink>

            <NuxtLink to="/keys" class="block py-2 px-2 mb-2 rounded-full hover:bg-gray-100">
                <i class="fa-solid fa-credit-card pr-1"></i>
                <span>Billing</span>
            </NuxtLink>
        </nav>

        <hr class="mt-auto w-full h-px my-2 border-0 dark:bg-gray-300">
            <div class="mb-4 py-2 px-2 flex items-start rounded-full hover:bg-gray-100">

                <a class="block" @click="signOut">
                    <i class="fa-solid fa-right-from-bracket"></i> <span id="logOut">Logout</span>
                </a>
            </div>
        <div class="mb-2 p-1 flex items-start rounded-full hover:bg-gray-100">

            <img class="w-12 h-12 rounded-full border-2 border-white" id="profilePicture" :src="avatar_url" alt="Profile Picture">
            <div id="profileDetails">
                <span class="font-semibold">{{ name }}</span>
                <p class="text-sm text-gray-600">{{email}}</p>
            </div>
            <!-- <button class="m-2 rounded-full hover:bg-gray-100 text-center" id="settingsButton">
                <i class="fa-solid fa-ellipsis fa-sm"></i>
            </button> -->


        </div>
    </div>

</template>



<script>


export default {
    data(){
        return {
            name:"",
            email:"",
            avatar_url:""
        }
    },
    async mounted() {
        const supabase = useSupabaseClient()

        const { data, error } = await supabase.auth.getSession()

        const user_metadata = data.session.user.user_metadata
        this.name = user_metadata.full_name
        this.email = user_metadata.email
        this.avatar_url = user_metadata.avatar_url
    },
    methods: {
        async signOut() {
            const supabase = useSupabaseClient()
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.log('Error:', error.message)
            }

            this.$router.push('/login')
        },
        collapse() {
            // hide link text on collapse
            let links = document.querySelectorAll('#mainSideNavbar nav span');
            links.forEach(link => {
                link.classList.toggle('hidden');
            });

            // Reduce profile picture size on collapse and expand
            var profilePicture = document.getElementById("profilePicture");
            profilePicture.classList.toggle('w-7');
            profilePicture.classList.toggle('h-6');

            // Hide logout link text on collapse
            var logoutButton = document.getElementById("logOut");
            logoutButton.classList.toggle('hidden');


            var mainSideNavbar = document.getElementById("mainSideNavbar");
            var collapseButton = document.getElementById("collapseButton");
            if (mainSideNavbar.classList.contains("w-64")) {
                mainSideNavbar.classList.remove("w-64");
                mainSideNavbar.classList.add("w-16");
                mainSideNavbar.classList.add("rounded");
                collapseButton.innerHTML = "<i class='fa-solid fa-arrow-right'></i>";
            } else {
                mainSideNavbar.classList.remove("w-16");
                mainSideNavbar.classList.add("w-64");
                collapseButton.innerHTML = "<i class='fa-solid fa-arrow-left'></i> ";
            }

            // Hide profile details on collapse
            var profileDetails = document.getElementById("profileDetails");
            profileDetails.classList.toggle('hidden');

            // Hide settings button on collapse
            var settingsButton = document.getElementById("settingsButton");
            settingsButton.classList.toggle('hidden');


        }
    }

}


</script>

<style>

</style>