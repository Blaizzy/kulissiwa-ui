<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="~~/assets/logos/kulissiwa.svg" alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6 bg-white p-10 rounded" action="#" method="POST">
            <div>
                <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div class="mt-2">
                    <input v-bind="email" id="email" name="email" type="email" autocomplete="email" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6" />
                </div>
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    <div class="text-sm">
                        <a href="#" class="font-semibold text-sky-500 hover:text-sky-400">Forgot password?</a>
                    </div>
                </div>
                <div class="mt-2">
                    <input v-bind="password" id="password" name="password" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-400 sm:text-sm sm:leading-6" />
                </div>
            </div>

            <div>
                <button type="submit" class="flex w-full justify-center rounded-md bg-sky-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400" @click="signInWithEmail">Sign in</button>
            </div>

            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-full h-px my-2 border-1 dark:bg-gray-300">
                <span class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2  dark:bg-white">OR</span>
            </div>

            <div>
                <button class="w-full  py-1.5 px-3  border-2 border-gray-300 text-gray-500 rounded mt-2 hover:bg-gray-200" @click="signInWithGoogle">
                    <i class="fa-brands fa-google pr-2"></i>
                    <span class="font-semibold">Continue with Google</span>
                </button>
            </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <a href="#" class="font-semibold leading-6 text-sky-500 hover:text-sky-400">Sign up</a>
        </p>
        </div>
    </div>

</template>

<script>

export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async signInWithEmail(){
            const supabase = useSupabaseClient()
            const { data, error } = await supabase.auth.signInWithPassword({
                email: this.email,
                password: this.password,
            })
            if (error) {
                return alert('Something went wrong !')
            }
            this.$router.push('/')
        },
        async signInWithGoogle() {
            const supabase = useSupabaseClient()
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google'
            })
            if (error) {
                return alert('Something went wrong !')
            }
            this.$router.push('/')
        }
    }

}
</script>
