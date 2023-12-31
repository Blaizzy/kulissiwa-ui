import { defineStore } from 'pinia'

export const useUserPreferences = defineStore('user_preferences', () => {
    const user = ref(null)

    function update(data: any) {
        user.value = data
    }

    function reset() {
        user.value = null
    }

    return {
        user, update, reset
    }

})