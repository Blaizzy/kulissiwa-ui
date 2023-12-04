import { defineStore } from 'pinia'

export const useTierLimits = defineStore('tiers',() => {
   const tiers = ref(null);

    function updateTiers(data: any) {
        tiers.value = data;
    }

    function reset() {
        tiers.value = null;
    }

    return {
        tiers, updateTiers, reset
    }

})  
