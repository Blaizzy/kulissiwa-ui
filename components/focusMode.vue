<template>
    <div class="relative inline-block text-gray-500">
        <div class="group relative flex items-center justify-center">
            <button @click="open = !open" id="dropdownTopButton" data-dropdown-toggle="dropdownTop"
                    class="flex items-center justify-between w-fit h-fit rounded-full bg-inherit px-4 py-2 hover:text-gray-700 hover:bg-neutral-200/50 dark:bg-neutral-800 dark:group-hover:text-inherit">
                <div class="flex items-center">
                    <font-awesome-icon :icon="['fas', selectedMode.icon]" size="xs" class="mr-1"/>
                    <p class=" text-xs">
                        {{ selectedMode.name }}
                    </p>
                </div>
                <svg :class="{ 'rotate-180': open }" class="ml-2 -mr-1 h-3 w-3 transform transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
            <div class="absolute bottom-full mb-2 hidden group-hover:block" v-if="!open">
                <div class="bg-neutral-800 text-white rounded py-1 px-4 right-0">
                    <p class="text-xs">Choose the source focus</p>
                </div>
                <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve">
                    <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
                </svg>
            </div>
        </div>


        <!-- Dropdown menu -->
        <div v-show="open" id="dropdownTop" class="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" style="bottom: 100%; margin-bottom: .5rem;">
            <ul class="dark:text-gray-200" aria-labelledby="dropdownTopButton">
                <li v-for="mode in focus_modes" :key="mode.id" @click.prevent="selectMode(mode.id)">
                    <a href="#" class="px-4 py-2 hover:bg-neutral-200/50 dark:hover:bg-gray-600 dark:hover:text-white flex items-center">
                        <div>
                            <div class="flex items-center text-gray-700 text-xs">
                                <font-awesome-icon :icon="['fas', mode.icon]" class="icon-class mr-2"/>
                                <p class="font-semibold">{{ mode.name }}</p>
                            </div>
                            <p class="text-xs text-gray-500">{{ mode.description }}</p>
                        </div>
                    </a>
                </li>

            </ul>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            open: false,
            // selectedMode: {},
            focus_modes: [
                {
                    id: 1,
                    name: 'Creative',
                    description: 'Generate text without searching for sources.',
                    icon: 'fa-lightbulb',
                    selected: false,
                },
                {
                    id: 2,
                    name: 'Documents',
                    description: 'Search all documents with citations and sources.',
                    icon: 'fa-file-alt',
                    selected: true,
                },
            ]
        }
    },
    async mounted() {
        this.$emit('mode', this.selectedMode)
    },
    methods: {
        selectMode(mode_id) {
            this.focus_modes = this.focus_modes.map(mode => ({
                ...mode,
                selected: mode.id === mode_id
            }));

            this.$emit('mode', this.selectedMode)
            this.open = false

        },

    },
    computed: {
        selectedMode() {
            return this.focus_modes.find(mode => mode.selected);
        }
    }

};
</script>
