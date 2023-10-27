import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user_session = ref(null)
    const isAuthenticated = ref(false)
    const token = ref(null)
    const activeDataSources = ref(new Set())
    const activeDataSourcesCount = ref(0)
    const subscription = ref(null)
    
    function updateActiveDataSourcesCount(data: []) {
        data.forEach((item: any) => {
            if (item.is_active === true) {
                activeDataSources.value.add(item.id);
            } else if (item.is_active === false) {
                activeDataSources.value.delete(item.id);
            }
        });
    
        activeDataSourcesCount.value = activeDataSources.value.size;
    }
    function updateSubscription(sub: any) {
        subscription.value = sub
    } 
    
    function signIn(session: any) {
        user_session.value = session
        isAuthenticated.value = true
        token.value = session.access_token
    }
    
    function signOut() {
        user_session.value = null
        isAuthenticated.value = false
        token.value = null
        activeDataSourcesCount.value = 0
        activeDataSources.value = new Set()
    }


    return {
        user_session, isAuthenticated, activeDataSourcesCount, 
        activeDataSources, token, subscription, 
        signIn, signOut, updateActiveDataSourcesCount,
        updateSubscription 
    }
})