import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user_session = ref(null)
    const isAuthenticated = ref(false)
    const token = ref(null)

    function signIn(session: any) {
        user_session.value = session
        isAuthenticated.value = true
        token.value = session.access_token
    }

    function signOut() {
        user_session.value = null
        isAuthenticated.value = false
        token.value = null
    }

    return {
        user_session, isAuthenticated,
        token, signIn, signOut,
    }
})