<template>
    <div class="flex flex-col justify-center px-6 py-12 lg:px-8 dark:bg-neutral-900">
        <div 
            v-if="showSuccess" 
            class="fixed top-4 right-4 py-2 px-4 text-lg text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 shadow-md transition-transform transform"
            :class="{ 'translate-x-full opacity-0': !showSuccess, 'translate-x-0 opacity-100': showSuccess }"
        >
            <i class="fas fa-square-check mr-2"></i>
                {{ successMessage }}
        </div>
        <div 
            v-if="showFailure" 
            class="fixed top-4 right-4 py-2 px-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 shadow-md transition-transform transform"
            :class="{ 'translate-x-full opacity-0': !showFailure, 'translate-x-0 opacity-100': showFailure }"
        >
            <i class="fas fa-square-xmark mr-2"></i>
            {{ failureMessage}}
        </div>

        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-20 w-auto" src="~~/assets/logos/kulissiwa.svg" alt="Kulissiwa" />
            <h2 class="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-300">Welcome back</h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6 bg-inherit px-10 rounded " action="#" method="POST">
                <div>
                    <label for="email" class="text-base font-medium leading-6 text-gray-900 dark:text-gray-400">Email address</label>
                    <div class="mt-2">
                        <input 
                        :class="{ 'border-red-300': emptyEmail }" 
                        @keypress="emptyEmail = false"
                        v-model="email" placeholder="example@email.com" name="email" type="email" autocomplete="email" 
                        class="w-full rounded-md border-2 border-gray-300 p-1.5 text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 dark:bg-inherit dark:border-neutral-600" />
                    </div>
                </div>

            
                <div>
                    <button type="submit" class="flex w-full justify-center rounded-md bg-sky-500 px-3 py-1.5 text-base font-semibold leading-6 text-white  shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 dark:bg-sky-600" @click.prevent="signInWithEmail" v-if="!email_auth_loading" >Sign in</button>
                    <button class="flex w-full justify-center items-center rounded-md bg-sky-500 px-3 py-1.5 leading-6 text-white  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400" disabled v-else>
                        <i class="fas fa-spinner fa-spin px-1.5"></i> 
                        <span> Loading </span>
                    </button>

                </div>

                <div class="inline-flex items-center justify-center w-full">
                    <hr class="w-full h-px my-2 border-1 dark:bg-gray-300">
                    <span class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2  dark:bg-neutral-900 dark:text-gray-300">OR</span>
                </div>

                <div>
                    <button class="flex items-center justify-center w-full px-3  border-2 border-gray-300 text-gray-500 rounded mt-2 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-neutral-700 dark:border-none dark:bg-neutral-800" @click.prevent="signInWithGoogle"
                    :class="email_auth_loading || social_auth_loading ? 'cursor-not-allowed' : ''">
                        <img class="h-9 w-9 pr-2" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkNhcGFfMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTUwIDE1MDsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDE1MCAxNTAiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzFBNzNFODt9Cgkuc3Qxe2ZpbGw6I0VBNDMzNTt9Cgkuc3Qye2ZpbGw6IzQyODVGNDt9Cgkuc3Qze2ZpbGw6I0ZCQkMwNDt9Cgkuc3Q0e2ZpbGw6IzM0QTg1Mzt9Cgkuc3Q1e2ZpbGw6IzRDQUY1MDt9Cgkuc3Q2e2ZpbGw6IzFFODhFNTt9Cgkuc3Q3e2ZpbGw6I0U1MzkzNTt9Cgkuc3Q4e2ZpbGw6I0M2MjgyODt9Cgkuc3Q5e2ZpbGw6I0ZCQzAyRDt9Cgkuc3QxMHtmaWxsOiMxNTY1QzA7fQoJLnN0MTF7ZmlsbDojMkU3RDMyO30KCS5zdDEye2ZpbGw6I0Y2QjcwNDt9Cgkuc3QxM3tmaWxsOiNFNTQzMzU7fQoJLnN0MTR7ZmlsbDojNDI4MEVGO30KCS5zdDE1e2ZpbGw6IzM0QTM1Mzt9Cgkuc3QxNntjbGlwLXBhdGg6dXJsKCNTVkdJRF8yXyk7fQoJLnN0MTd7ZmlsbDojMTg4MDM4O30KCS5zdDE4e29wYWNpdHk6MC4yO2ZpbGw6I0ZGRkZGRjtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDE5e29wYWNpdHk6MC4zO2ZpbGw6IzBENjUyRDtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDIwe2NsaXAtcGF0aDp1cmwoI1NWR0lEXzRfKTt9Cgkuc3QyMXtvcGFjaXR5OjAuMztmaWxsOnVybCgjXzQ1X3NoYWRvd18xXyk7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDt9Cgkuc3QyMntjbGlwLXBhdGg6dXJsKCNTVkdJRF82Xyk7fQoJLnN0MjN7ZmlsbDojRkE3QjE3O30KCS5zdDI0e29wYWNpdHk6MC4zO2ZpbGw6IzE3NEVBNjtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDI1e29wYWNpdHk6MC4zO2ZpbGw6I0E1MEUwRTtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDI2e29wYWNpdHk6MC4zO2ZpbGw6I0UzNzQwMDtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDI3e2ZpbGw6dXJsKCNGaW5pc2hfbWFza18xXyk7fQoJLnN0Mjh7ZmlsbDojRkZGRkZGO30KCS5zdDI5e2ZpbGw6IzBDOUQ1ODt9Cgkuc3QzMHtvcGFjaXR5OjAuMjtmaWxsOiMwMDRENDA7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDt9Cgkuc3QzMXtvcGFjaXR5OjAuMjtmaWxsOiMzRTI3MjM7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDt9Cgkuc3QzMntmaWxsOiNGRkMxMDc7fQoJLnN0MzN7b3BhY2l0eTowLjI7ZmlsbDojMUEyMzdFO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fQoJLnN0MzR7b3BhY2l0eTowLjI7fQoJLnN0MzV7ZmlsbDojMUEyMzdFO30KCS5zdDM2e2ZpbGw6dXJsKCNTVkdJRF83Xyk7fQoJLnN0Mzd7ZmlsbDojRkJCQzA1O30KCS5zdDM4e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzlfKTtmaWxsOiNFNTM5MzU7fQoJLnN0Mzl7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTFfKTtmaWxsOiNGQkMwMkQ7fQoJLnN0NDB7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTNfKTtmaWxsOiNFNTM5MzU7fQoJLnN0NDF7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTVfKTtmaWxsOiNGQkMwMkQ7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDE0IiBkPSJNMTIwLDc2LjFjMC0zLjEtMC4zLTYuMy0wLjgtOS4zSDc1Ljl2MTcuN2gyNC44Yy0xLDUuNy00LjMsMTAuNy05LjIsMTMuOWwxNC44LDExLjUgICBDMTE1LDEwMS44LDEyMCw5MCwxMjAsNzYuMUwxMjAsNzYuMXoiLz48cGF0aCBjbGFzcz0ic3QxNSIgZD0iTTc1LjksMTIwLjljMTIuNCwwLDIyLjgtNC4xLDMwLjQtMTEuMUw5MS41LDk4LjRjLTQuMSwyLjgtOS40LDQuNC0xNS42LDQuNGMtMTIsMC0yMi4xLTguMS0yNS44LTE4LjkgICBMMzQuOSw5NS42QzQyLjcsMTExLjEsNTguNSwxMjAuOSw3NS45LDEyMC45eiIvPjxwYXRoIGNsYXNzPSJzdDEyIiBkPSJNNTAuMSw4My44Yy0xLjktNS43LTEuOS0xMS45LDAtMTcuNkwzNC45LDU0LjRjLTYuNSwxMy02LjUsMjguMywwLDQxLjJMNTAuMSw4My44eiIvPjxwYXRoIGNsYXNzPSJzdDEzIiBkPSJNNzUuOSw0Ny4zYzYuNS0wLjEsMTIuOSwyLjQsMTcuNiw2LjlMMTA2LjYsNDFDOTguMywzMy4yLDg3LjMsMjksNzUuOSwyOS4xYy0xNy40LDAtMzMuMiw5LjgtNDEsMjUuMyAgIGwxNS4yLDExLjhDNTMuOCw1NS4zLDYzLjksNDcuMyw3NS45LDQ3LjN6Ii8+PC9nPjwvc3ZnPg==">
                        <span class="font-semibold text-base">Continue with Google</span>
                    </button>
                </div>

                <div>
                    <button class="flex items-center justify-center w-full px-3  border-2 border-gray-300 text-gray-500 rounded mt-2 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-neutral-700 dark:border-none dark:bg-neutral-800" @click.prevent="signInWithGitHub"
                    :class="email_auth_loading || social_auth_loading ? 'cursor-not-allowed' : ''">
                        <img class="h-8 w-8 pr-2" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwoJLnN0MHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDt9Cl1dPjwvc3R5bGU+PGc+PHBhdGggY2xhc3M9InN0MCIgZD0iTTI1NiwzMkMxMzIuMywzMiwzMiwxMzQuOCwzMiwyNjEuN2MwLDEwMS41LDY0LjIsMTg3LjUsMTUzLjIsMjE3LjljMTEuMiwyLjEsMTUuMy01LDE1LjMtMTEuMSAgIGMwLTUuNS0wLjItMTkuOS0wLjMtMzkuMWMtNjIuMywxMy45LTc1LjUtMzAuOC03NS41LTMwLjhjLTEwLjItMjYuNS0yNC45LTMzLjYtMjQuOS0zMy42Yy0yMC4zLTE0LjMsMS41LTE0LDEuNS0xNCAgIGMyMi41LDEuNiwzNC4zLDIzLjcsMzQuMywyMy43YzIwLDM1LjEsNTIuNCwyNSw2NS4yLDE5LjFjMi0xNC44LDcuOC0yNSwxNC4yLTMwLjdjLTQ5LjctNS44LTEwMi0yNS41LTEwMi0xMTMuNSAgIGMwLTI1LjEsOC43LTQ1LjYsMjMtNjEuNmMtMi4zLTUuOC0xMC0yOS4yLDIuMi02MC44YzAsMCwxOC44LTYuMiw2MS42LDIzLjVjMTcuOS01LjEsMzctNy42LDU2LjEtNy43YzE5LDAuMSwzOC4yLDIuNiw1Ni4xLDcuNyAgIGM0Mi44LTI5LjcsNjEuNS0yMy41LDYxLjUtMjMuNWMxMi4yLDMxLjYsNC41LDU1LDIuMiw2MC44YzE0LjMsMTYuMSwyMywzNi42LDIzLDYxLjZjMCw4OC4yLTUyLjQsMTA3LjYtMTAyLjMsMTEzLjMgICBjOCw3LjEsMTUuMiwyMS4xLDE1LjIsNDIuNWMwLDMwLjctMC4zLDU1LjUtMC4zLDYzYzAsNi4xLDQsMTMuMywxNS40LDExQzQxNS45LDQ0OS4xLDQ4MCwzNjMuMSw0ODAsMjYxLjcgICBDNDgwLDEzNC44LDM3OS43LDMyLDI1NiwzMnoiLz48L2c+PC9zdmc+">
                        <span class="font-semibold text-base">Continue with Github</span>
                    </button>
                </div>
            </form>

        </div>
    </div>

</template>

<script>
export default {
    data() {
        const redirectTo = `${useRuntimeConfig().public.baseUrl}`
        return {
            email: "",
            showSuccess: false,
            showFailure: false,
            successMessage: "",
            failureMessage: "",
            emptyEmail: false,
            email_auth_loading: false,
            social_auth_loading: false,
            redirectTo: redirectTo
        }
    },
    methods: {
        getURL(){
            return 
        },
        async  signInWithEmail() {
            if (!this.email) {
                this.onLoginFailure("Please enter an email address")
                this.emptyEmail = true
                return
            } else {
                if (this.email.includes("@gmail.com")) {
                    this.onLoginFailure("Please sign in with Google")
                    return
                }
            }

            const supabase = useSupabaseClient()
            this.email_auth_loading = true
            const { data, error } = await supabase.auth.signInWithOtp({
                email: this.email,
                options: {
                    emailRedirectTo: 'https://app.kulissiwa.com/chats'
                }
            })
            if (error) {
               this.onLoginFailure(error.message)  
               this.email_auth_loading = false
            } else {
                this.onLoginSuccess("Check your email inbox for a login link")
                this.$router.push('/auth/email-verification')
            }
        },
        async signInWithGoogle() {
            const supabase = useSupabaseClient()
            this.social_auth_loading = true
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: this.redirectTo + '/auth/confirm'
                }
            })
            if (error) {
                this.onLoginFailure(error.message)
                this.social_auth_loading = false
            } else {
                this.onLoginSuccess("Successfully logged in with Google")
            }
        
            
        },
        async signInWithGitHub() {
            const supabase = useSupabaseClient()
            this.social_auth_loading = true
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: this.redirectTo + '/auth/confirm'
                }
            })
            if (error) {
                this.onLoginFailure(error.message)
                this.social_auth_loading = false
            }else {
                this.onLoginSuccess("Successfully logged in with GitHub")
            }
        },
        onLoginSuccess(message) {
            this.successMessage = message
            this.showSuccess = true
            setTimeout(() => {
                this.showSuccess = false
                this.successMessage = ""
            }, 3000)
        },
        onLoginFailure(message) {
            this.failureMessage = message
            this.showFailure = true
            setTimeout(() => {
                this.showFailure = false
                this.failureMessage = ""
            }, 3000)
        }
    }

}
</script>

