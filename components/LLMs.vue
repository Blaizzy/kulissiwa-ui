<template>
    <div class="flex flex-col items-center bg-neutral-200/50 rounded-md dark:bg-inherit dark:text-gray-400 font-light" >
        <div class="relative inline-block">
            <div class="group">
                <button @click="open = !open" id="menu"
                type="button"
                data-ripple-light="true"
                data-tooltip-target="tooltip-default"
                :disabled="isFreeTier"
                :class="{'opacity-50': isFreeTier}"
                class="flex items-center justify-between w-36 h-10 rounded-md bg-inherit px-4 py-2 text-sm shadow-sm group-hover:text-gray-500 dark:bg-neutral-800 dark:group-hover:text-inherit">
                    <div class="flex">
                        <p v-if="isFreeTier"> Default </p>
                        <p v-else> {{ selectedLLM.model_name }} </p>
                    </div>
                    <svg :class="{ 'rotate-180': open }" class="ml-2 -mr-1 h-5 w-5 transform transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
                <div v-show="isFreeTier" id="tooltip-default"
                data-tooltip="tooltip-default" role="tooltip"
                data-tooltip-placement="default"
                class="absolute z-10 invisible inline-block px-2 py-2 text-sm text-white dark:text-gray-300 transition-opacity duration-300 bg-neutral-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-neutral-700 group-hover:opacity-100 group-hover:visible">
                    Upgrade to change your model
                </div>
            </div>
        <div v-show="open" class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-neutral-100 shadow-lg border dark:bg-neutral-950 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class=" text-gray-700 dark:text-inherit" role="none" v-for="LLM in LLMs" :key="LLM.id">
                <!-- Theme options -->
                <p class="flex items-center px-4 py-2 text-sm  hover:bg-neutral-200 dark:hover:bg-neutral-800" role="menuitem" @click.prevent="selectLLM(LLM)">

                    {{ LLM.model_name }}
                </p>

            </div>
        </div>
        </div>
    </div>
  </template>

<script>
import { useAuthStore } from '@/stores/index';
import { useUserPreferences } from '@/stores/user-preferences'
export default {
    props: {
        isFreeTier: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const isFreeTier = ref(props.isFreeTier)
        watchEffect(() => {
            isFreeTier.value = props.isFreeTier
        })
        return {
            isFreeTier
        }
    },
    data() {
        const authStore = useAuthStore();
        const preferences = useUserPreferences();

        return {
            open: false,
            selectedLLM: {},
            LLMs: [],
            authStore: authStore,
            preferences: preferences

        }
    },
    async mounted() {
        await this.getLLMs();
    },
    methods: {
        async getLLMs() {
            const supabase = useSupabaseClient();
            const { data, error } = await supabase
                .from('LLMs')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.log(error);
                return;
            }

            data.forEach((LLM) => {
                if (LLM.model_name === 'Mistral Small') {
                    return; // This skips the current iteration and continues with the next
                }
                this.LLMs.push({
                    model_name: LLM.model_name,
                    api_name: LLM.api_name,
                    id: LLM.id
                });
            });

            if (this.preferences.user) {
                const LLM = this.LLMs.find((LLM) => LLM.id === this.preferences.user.LLM_id);
                this.selectLLM(LLM);
                return;
            }
            await this.selectLLM(this.LLMs[0]);

        },
        async selectLLM(LLM) {
            this.selectedLLM = {
                model_name: LLM.model_name,
                api_name: LLM.api_name,
                id: LLM.id
            }

            const supabase = useSupabaseClient();
            const { data, error } = await supabase
                .from('user_preferences')
                .upsert(
                    {
                        user_id: this.authStore.user_session.user.id,
                        LLM_id: LLM.id
                    },
                    { onConflict: ['user_id'] }
                ).select();

            if (error) {
                console.log(error);
                return;
            }
            if (data) {
                this.preferences.update(data[0]);
            }
        }
    }
};
</script>
