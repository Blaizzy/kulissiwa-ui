import { ref } from 'vue'

const conversations = ref([])
const refreshConversations = ref(false)

const refresh = () => {
    refreshConversations.value = !refreshConversations.value
}

export default function useConversations() {
    return {
        conversations,
        refreshConversations,
        refresh,
    }
}
