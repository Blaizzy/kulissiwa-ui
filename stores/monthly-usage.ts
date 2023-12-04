import { defineStore } from 'pinia'

export const useMonthlyUsageStore = defineStore('monthly_usage',() => {
    const stripe_customer_id = ref(null);
    const tier = ref(null);
    const status = ref(null);
    const filesUploaded = ref(null);
    const messagesSent = ref(null);
    const activeDataSources = ref(new Set())
    const activeDataSourcesCount = ref(0)

    function updateSubscription(data: any) {
        stripe_customer_id.value = data.stripe_customer_id
        tier.value = data.tier
        status.value = data.status
        
    }

    function updateUsage(data: any) {
        filesUploaded.value = data.files_uploaded
        messagesSent.value = data.messages_sent
    }

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

    function reset() {
        tier.value = null
        filesUploaded.value = null
        messagesSent.value = null
        activeDataSourcesCount.value = 0
        activeDataSources.value = new Set()
    }


    return {
        tier, filesUploaded, messagesSent, activeDataSources, activeDataSourcesCount,
        updateSubscription, updateActiveDataSourcesCount, reset,
        updateUsage
    }
})