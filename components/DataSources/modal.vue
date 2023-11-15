<template>
    <div
    v-show="showModal"
    class="fixed inset-0 flex justify-center z-50"
    :class="{ 'opacity-0 pointer-events-none': !showModal }">
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-lg w-1/2 h-75% z-50 flex flex-col">
                <div class="flex justify-between items-center px-4 pt-4 pb-4 sticky top-0 z-10 bg-white max-h-20 rounded-lg">
                    <div class="flex rounded-full w-1/2 items-center px-2 border-2 border-gray-200 hover:border-gray-300 text-black">
                        <button class="px-2 text-gray-500 hover:text-black inline-flex items-center">
                            <ClientOnly>
                                <i class="fas fa-search"></i>
                            </ClientOnly>
                        </button>
                        <input type="search"  class="w-full px-1 py-2 rounded-full focus:outline-none bg-inherit" name="search_bar" placeholder="Search data sources..." v-model="searchQuery" @keyup.prevent="onKeyup">
                        <button @click="clearSearch" v-show="searchQuery.length>0" class="px-2 text-gray-500 hover:text-black inline-flex items-center">
                            <ClientOnly>
                                <i class="fas fa-times"></i>
                            </ClientOnly>
                        </button>
                    </div>
                    <div>
                        <button
                        @click="closeModal()"
                        class=" px-2 text-gray-500 hover:text-gray-700"
                        >
                            <ClientOnly>
                                <i class="fas fa-times" ></i>
                            </ClientOnly>
                        </button>
                    </div>
                </div>
                <div class="h-full overflow-y-auto pb-2 px-3">
                    <ListSkeleton v-show="isLoading" v-for="i in 5" :key="i" />

                    <!--TODO:  Add no items found condition-->

                    <!-- Data Sources -->
                    <div v-for="dataSource in dataSources" :key="dataSource.id" class="flex justify-between items-center p-4 border-b border-gray-200 hover:shadow-sm hover:rounded-lg hover:border-gray-100 hover:bg-gray-50">
                        <!-- Filename -->
                        <div class="flex items-center flex-1 truncate">
                            <div class="border border-gray-200 rounded-lg mr-2 p-1 px-1 bg-white flex-shrink-0" >
                                <img :src="getIconForFileType(dataSource.file_type)" :alt="dataSource.name" class="w-6 h-6 rounded-md" />
                            </div>
                            <p class="truncate text-gray-900">{{ dataSource.name }}</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" class="sr-only" 
                                name="select-data-source" 
                                v-model="dataSource.is_active" 
                                @change.prevent="selectDataSource(dataSource)"
                                >
                            <div class="w-12 h-6 rounded-full transition-all flex items-center" :class="{'bg-sky-600': dataSource.is_active, 'bg-gray-300': !dataSource.is_active}">
                            <div class="w-4 h-4 bg-white rounded-full transition-transform duration-200 ml-1" :class="{'translate-x-6': dataSource.is_active, 'translate-x-0': !dataSource.is_active}"></div>
                            </div>
                        </label>
                    </div>
                </div>
                <div class="flex justify-center mt-4 pb-2">
                    <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 border-2 rounded-l-md"
                    :class="{'hover:bg-gray-100 hover:border-gray-300': currentPage !== 1}">
                        <ClientOnly>
                            <i class="fas fa-chevron-left"></i>
                        </ClientOnly>
                    </button>
                    <div class="px-4 py-2 border-t-2 border-b-2">{{ currentPage }} / {{ totalPages }}</div>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 border-2 rounded-r-md"
                    :class="{'hover:bg-gray-100 hover:border-gray-300': currentPage !== totalPages}"
                    >
                        <ClientOnly>
                            <i class="fas fa-chevron-right"></i>
                        </ClientOnly>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Fuse from 'fuse.js'
import { useAuthStore } from '~/stores'
import { useMonthlyUsageStore } from '~/stores/monthly-usage'
import { useTierLimits } from '~/stores/tiers'


export default {
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
        dataSources: {
            type: Array,
            required: true,
        },

        selectedDataType: {
            type: Array,
            required: true,
        },
        totalItems: {
            type: Number,
            required: true,
        },
        currentPage: {
            type: Number,
            required: true,
        },
        itemsPerPage: {
            type: Number,
            required: true,
        },
        isFetchingData: {
            type: Boolean,
            required: true,
        },
    },
    
    setup(props) {
        const showModal = ref(props.showModal)
        const dataSources_copy = ref(props.dataSources)
        const dataSources = ref(props.dataSources)
        const totalItems = ref(props.totalItems)
        const isLoading = ref(props.isFetchingData)
        watchEffect(() => {
            showModal.value = props.showModal
            dataSources_copy.value = props.dataSources
            dataSources.value = props.dataSources
            totalItems.value = props.totalItems
            isLoading.value = props.isFetchingData
        })
        function updateDataSource(dataSource) {
            const index = dataSources.value.findIndex(ds => ds.id === dataSource.id);
            dataSources.value[index] = dataSource;
        }

        const selectedDataType = ref(props.selectedDataType)

        const currentPage = ref(props.currentPage)
        const itemsPerPage = ref(props.itemsPerPage)
        return {
            showModal,
            dataSources,
            dataSources_copy,
            selectedDataType,
            totalItems,
            currentPage,
            itemsPerPage,
            isLoading,
            updateDataSource
        }
    },
    data() {
        const store = useAuthStore();
        const monthly_usage = useMonthlyUsageStore();
        const tier_limits = useTierLimits();
        return {
            searchQuery: '',
            debounceTimeout: null,
            pendingUpdates: [],
            store: store,
            monthly_usage: monthly_usage,
            tier_limits: tier_limits,
        }
    },
    async mounted() {
        await this.updateSelectedDataSources()
    },
    methods: {
        clearSearch() {
            this.searchQuery = '';
            this.onKeyup();
        },
        closeModal() {
            this.$emit("close-modal");
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;    
                this.$emit("update-page", this.currentPage, true);
    
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.$emit("update-page", this.currentPage, true);
            }
        },
        getIconForFileType(fileType) {
            const iconMap = {
                'pdf': '/images/pdf.png',
                'vnd.openxmlformats-officedocument.wordprocessingml.document': '/images/word.png',
                'docx': '/images/word.png',
                'url': '/images/web.png',
                'csv': '/images/csv.png',
                'text': '/images/text.png',
                'chat': '/images/chat.png',
                // Add more mappings as needed
            };
            return iconMap[fileType] || '/images/text.png'; // Default to 'text.png' if no match
        },
        searchWithFuse(query) {
            const options = {
                keys: ['name'],
                threshold: 0.3  // Adjust based on your needs
            };

            const fuse = new Fuse(this.dataSources_copy, options);
            return fuse.search(query).map(result => result.item);
        },
        async searchDataSources() {
        
            try {   
                if (this.searchQuery === '') {
                    this.dataSources = this.dataSources_copy
                    return
                }

                const fuseResults = this.searchWithFuse(this.searchQuery);

                if (fuseResults.length > 0) {
                    this.dataSources = fuseResults
                } else {
                    const supabase = useSupabaseClient()
                    const { data, error } = await supabase
                        .from('data')
                        .select('*')
                        .textSearch('name', `'${this.searchQuery}'`)

                    if (error) {
                        this.$emit("error", error.message)
                    }
                    if (data) {
                        this.dataSources = data
                    }
                }
            } catch (error) {
                const message = `An error occurred while searching: ${error}`;
                this.$emit("error", message)
            }
            
        },
        onKeyup() {
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
            }
            this.debounceTimeout = setTimeout(() => {
                this.searchDataSources();
            }, 300);
        },
        canActivateMoreDataSources() {
            const active_data_sources = this.monthly_usage.activeDataSourcesCount;
            const tier_limit = this.tier_limits.tiers.find(tier => tier.name === this.monthly_usage.tier);
            if (tier_limit.active_data_sources_limit === -1) {
                return true;
            }
    
            return active_data_sources < tier_limit.active_data_sources_limit 
        },
        async selectDataSource(dataSource) {
            if (this.canActivateMoreDataSources() || dataSource.is_active === false) {
                this.pendingUpdates.push(dataSource);
                await this.updateSelectedDataSources(true);
            } else {
                dataSource.is_active = false;
                this.$emit("error", "You have reached the maximum number of active data sources for your current plan. Please upgrade to activate more data sources.")
            } 
        },
        async updateSelectedDataSources(upsert=false) {
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
            }
            this.debounceTimeout = setTimeout(async () => {
                
                if (upsert) {
                    const supabase = useSupabaseClient()
                    const { data, error } = await supabase
                        .from('data')
                        .upsert(
                            this.pendingUpdates,
                            { onConflict: 'id' }
                        )
                        .select();

                    if (error) {
                        console.log(error)
                        const message = `An error occurred while updating data sources: ${error}`;
                        this.$emit("error", message)
                    }
                    if (data) {
                        this.$emit("success", "Data sources updated successfully")
                        this.selectedDataType = this.dataSources
                            .filter(dataSource => dataSource.is_active)
                            .map(dataSource => dataSource.id);
                        
                        this.monthly_usage.updateActiveDataSourcesCount(this.pendingUpdates)
                        this.pendingUpdates = [];
                    }
                }
            }, 500);
            
        },
        
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },
    },
}
</script>
