<script setup>
definePageMeta({
  middleware: 'auth',
});
</script>
<template>
    <div class="flex flex-col h-full w-full">
     
        <div class="flex justify-between items-center pb-4 px-4 pt-4 border-b border-gray-200 w-full bg-white relative"> <!-- Added relative here -->
            <div class="flex">
                <h1 class="text-xl font-semibold">Documents</h1>
                <DataSources :isOpen="newDataSourceModalOpen" @close="closeNewDataSource" @refresh-data="onDataRefreshed()" @show-success="onShowSuccess('Data uploaded sucessfully')" @show-failure="onShowFailure('Data upload failed!')"  />
            </div>
            <div class="flex items-center">
                <a href="mailto:support@kulissiwa.com?subject=Help%20with%20Kulissiwa%20" target="_blank" class="cursor-pointer hover:underline">
                    <p class="font-semibold text-sm">Help</p>
                </a>
            </div>
            <div class="flex absolute top-0 right-0"> <!-- Changed to absolute positioning -->
                <div 
                    v-if="showSuccess" 
                    class="mt-4 mr-1 py-2 px-4 text-lg text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 shadow-md transition-transform transform"
                    :class="{ '-translate-x-full opacity-0': !showSuccess, 'translate-x-0 opacity-100': showSuccess }"
                >   
                    <ClientOnly>
                        <i class="fas fa-square-check mr-2"></i>
                    </ClientOnly>
                    {{successMessage}}
                </div>
                <div 
                    v-if="showFailure" 
                    class="mt-4 mr-1 py-2 px-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 shadow-md transition-transform transform"
                    :class="{ '-translate-x-full opacity-0': !showFailure, 'translate-x-0 opacity-100': showFailure }"
                >   
                    <ClientOnly>
                        <i class="fa fa-square-xmark mr-2"></i>
                    </ClientOnly>
                    {{failureMessage}}
                </div>
            </div>
        </div>

        <div class="flex mt-4 px-4 text-sm py-2" v-if="!noDataFound">
            <div class="mt-auto rounded-full flex  w-1/4 items-center px-2 border-2 border-gray-200 hover:border-gray-300 text-black">
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
            <button @click="newDataSource(); showFilterOptions=false; showSortOptions=false" class="text-white gradient-border rounded-full px-2 shadow-lg hover:scale-105 ml-5">
                <ClientOnly>
                    <i class="fa-solid fa-circle-arrow-up"></i> <span class="pl-1 font-medium">Upload</span>
                </ClientOnly>
            </button>
            <div class="ml-3">
                <button @click="showSortOptions = !showSortOptions; showFilterOptions=false" class=" w-full h-full px-2 py-1 text-black border-2 border-gray-200 rounded-full  hover:border-gray-300 hover:text-black inline-flex items-center" v-if="!noDataFound && !isLoading">
                    <ClientOnly>
                        <i class="fa-solid fa-arrow-up-wide-short"></i> <span class="pl-2">Sort</span>
                    </ClientOnly>
                </button>
                <div v-show="showSortOptions" class="absolute mt-2 w-48 rounded-md shadow-lg z-50 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100" @click="showSortOptions = false;">
                    <div class="py-1">
                        
                            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortData('asc')">
                                Sort Ascending
                                <span v-show="isSort('asc')" class="float-right">
                                    <ClientOnly>
                                        <i class="fa-solid fa-check text-sky-500"></i>
                                    </ClientOnly>
                                </span>
                            </button>
                            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortData('desc')">
                                Sort Descending
                                <span v-show="isSort('desc')" class="float-right">
                                    <ClientOnly>
                                        <i class="fa-solid fa-check text-sky-500"></i>
                                    </ClientOnly>
                                </span>
                            </button>
                            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortData('date')">
                                Sort by Date
                                <span v-show="isSort('date')" class="float-right">
                                    <ClientOnly>
                                        <i class="fa-solid fa-check text-sky-500"></i>
                                    </ClientOnly>
                                </span>
                            </button>
                    </div>
                </div>
            </div>
            <div class="ml-3">
                <!-- Filter Button -->
                <button @click="showFilterOptions = !showFilterOptions; showSortOptions=false" class="ml-2 w-full h-full px-2 py-1 text-black border-2 border-gray-200 rounded-full hover:border-gray-300 hover:text-black inline-flex items-center" v-if="!noDataFound && !isLoading">
                    <ClientOnly>
                        <i class="fa fa-filter"></i> <span class="pl-2">Filter</span>
                    </ClientOnly> 
                </button>
                <div v-show="showFilterOptions" class="absolute mt-2 w-48 rounded-md shadow-lg z-50 bg-white ring-1 ring-black ring-opacity-5">
                    <div class="py-1">
                        <button v-if="isFileTypeInDataSources('pdf')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="selectFileType('pdf')">
                            PDF
                            <span v-show="isFilter('pdf')" class="float-right">
                                <ClientOnly>
                                    <i class="fa-solid fa-check text-sky-500"></i>
                                </ClientOnly>
                            </span>
                        </button>
                        <button v-if="isFileTypeInDataSources('docx')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click.prevent="selectFileType('docx')">
                            DOCX
                            <span v-show="isFilter('docx')" class="float-right">
                                <ClientOnly>
                                    <i class="fa-solid fa-check text-sky-500"></i>
                                </ClientOnly>
                            </span>
                        </button>
                        <button v-if="isFileTypeInDataSources('url')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click.prevent="selectFileType('url')">
                            URL
                            <span v-show="isFilter('url')" class="float-right">
                                <ClientOnly>
                                    <i class="fa-solid fa-check text-sky-500"></i>
                                </ClientOnly>
                            </span>
                        </button>
                        <button v-if="isFileTypeInDataSources('text')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click.prevent="selectFileType('text')">
                            TEXT
                            <span v-show="isFilter('text')" class="float-right">
                                <ClientOnly>
                                    <i class="fa-solid fa-check text-sky-500"></i>
                                </ClientOnly>
                            </span>
                        </button>
                        <!-- ... add more file types to filter by as needed ... -->
                    </div>
                    <div class="flex justify-between border-t border-gray-200 mt-2">
                        <button class="w-1/2 px-4 py-2 text-sm text-gray-700 border-r hover:bg-gray-100 hover:text-gray-900" @click="applyFilter">
                            Apply
                        </button>
                        <button class="w-1/2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="resetFilter">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
            
        </div>

        
        <div class="flex flex-col" v-if="!noDataFound">
            <h2 class="text-md font-semibold pb-2 pt-4 px-4">Files</h2>     
        </div>
        
        <div class="flex-grow overflow-y-auto pb-4"
        :class="noDataFound ? 'flex justify-center items-center' : ''"
        >
            <div class="flex justify-center items-center" v-if="noDataFound">
                    <div class="flex justify-center items-center flex-col">
                        <img src="~~/assets/logos/No-documents-found.png" alt="No Documents Found" class="md:w-1/2 max-lg:w-auto"> 
                        <h1 class="text-2xl font-semibold m-1">No documents found</h1>
                        <h2 class="text-lg m-1">Upload a new document to get started.</h2>
                        <button @click="newDataSource(); showFilterOptions=false; showSortOptions=false" class="text-white py-1 gradient-border rounded-full px-2 shadow-lg hover:scale-105">
                            <ClientOnly>
                                <i class="fa-solid fa-circle-arrow-up"></i> <span class="pl-1 font-medium">Upload</span>
                            </ClientOnly>
                        </button>
                    </div>
                </div>

            
            <div class="mt-2 mx-3 text-sm">
                <!-- Table Headers -->
                <div class="sticky top-0 z-10 flex flex-row justify-between text-gray-500 px-4 py-3  text-md font-normal rounded-lg bg-gray-50" v-if="!noDataFound && !isLoading">
                    <span class="flex-1">Filename</span>
                    <span class="flex-1">Date Created</span>
                    <span class="flex-1">Type</span>
                    <span class="flex-1">Active</span>
                    <span class="flex-1"></span> <!-- This is to align the dropdown menu in the rows -->
                </div>

                <!-- Display skeleton loaders when data is being fetched -->
                <DataSkeleton v-show="isLoading || isFetchingDataSource" v-for="i in 5" :key="i" />

                <!-- Table rows -->
                <div v-for="dataSource in dataSources" :key="dataSource.id" class="flex justify-between items-center p-4 border-b border-gray-200 hover:shadow-sm hover:rounded-lg hover:border-gray-100 hover:bg-gray-50">
                    <!-- Filename -->
                    <div class="flex items-center flex-1 truncate"  :class="dataSourceToDelete === dataSource.id ? 'animate-pulse cursor-not-allowed' : ''">
                        <div class="border border-gray-200 rounded-lg mr-2 p-1 px-1 bg-white flex-shrink-0" >
                            <img :src="getIconForFileType(dataSource.file_type)" :alt="dataSource.name" class="w-6 h-6 rounded-md" />
                        </div>
                        <p class="truncate text-gray-900">{{ dataSource.name }}</p>
                    </div>

                    <!-- Date Created -->
                    <p class="text-gray-500 ml-2 flex-1"  :class="dataSourceToDelete === dataSource.id ? 'animate-pulse cursor-not-allowed' : ''">{{ formatDate(dataSource.created_at) }}</p>

                    <!-- File Type -->
                    <p class="text-gray-500 ml-2 flex-1"  :class="dataSourceToDelete === dataSource.id ? 'animate-pulse cursor-not-allowed' : ''">{{ dataSource.file_type }}</p>
                    
                    <!-- Active -->
                    <label class="flex-1 items-center cursor-pointer">
                        <input type="checkbox" class="sr-only" v-model="dataSource.is_active" @change.prevent="selectDataSource(dataSource)">
                        <div class="w-12 h-6 rounded-full transition-all flex items-center" :class="{'bg-sky-600': dataSource.is_active, 'bg-gray-300': !dataSource.is_active}">
                        <div class="w-4 h-4 bg-white rounded-full transition-transform duration-200 ml-1" :class="{'translate-x-6': dataSource.is_active}"></div>
                        </div>
                    </label>

                    <!-- Dropdown options -->
                    <div class="text-right flex-1"   :class="dataSourceToDelete === dataSource.id ? 'animate-pulse cursor-not-allowed' : ''">
                        <Menu as="div" class="relative inline-block text-left" @click.prevent>
                            <div>
                                <MenuButton class="inline-flex w-full justify-center rounded-full hover:bg-gray-200 px-2 py-2 text-sm font-medium text-black">
                                    <ClientOnly>
                                        <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </ClientOnly>
                                </MenuButton>
                            </div>
                        <transition
                                enter-active-class="transition duration-100 ease-out"
                                enter-from-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0"
                            >
                                <MenuItems
                                class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" style=" z-index: 1000;"
                                >
                                <div class="px-1 py-1">
                                    <MenuItem v-slot="{ disabled }" disabled>
                                        <NuxtLink
                                            :class="[
                                            disabled ? 'opacity-50 cursor-not-allowed' : 'text-gray-900',
                                            active ? 'bg-sky-500 text-white' : 'text-gray-900',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                            
                                            ]"
                                            :to="`/dataSources/${dataSource.id}`"
                                        >   
                                            <div class="flex items-center">
                                                <PencilSquareIcon
                                                :active="active"
                                                class="mr-2 h-5 w-5 text-sky-400"
                                                aria-hidden="true"
                                                />
                                                <p> Edit </p> 
                                            </div>
                                            <span class="inline-flex items-center rounded-md bg-yellow-50 ml-auto px-1.5 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">soon</span>
                                        </NuxtLink>
                                    </MenuItem>
                                </div>
                                <div class="px-1 py-1">
                                    <MenuItem v-slot="{ active }" @click="deleteDataSource(dataSource.id)">
                                        <button

                                            :class="[
                                            active ? 'bg-sky-500 text-white' : 'text-gray-900',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                            ]"
                                        >
                                            <TrashIcon
                                            :active="active"
                                            class="mr-2 h-5 w-5 text-sky-400 group-hover:text-white"
                                            aria-hidden="true"
                                            />
                                            Delete
                                        </button>
                                    </MenuItem>
                                </div>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </div>
                <div class="flex justify-center mt-4 pb-2" v-if="!noDataFound">
                    <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 border-2 rounded-l-md"
                    :class="{'hover:bg-gray-100': currentPage !== 1}">
                        <ClientOnly>
                            <i class="fas fa-chevron-left"></i>
                        </ClientOnly>
                    </button>
                    <div class="px-4 py-2 border-t-2 border-b-2">{{ currentPage }} / {{ totalPages }}</div>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 border-2 rounded-r-md"
                    :class="{'hover:bg-gray-100': currentPage !== totalPages}"
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
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/20/solid'
import DataSkeleton from '~/components/DataSkeleton.vue'
import { useAuthStore } from '@/stores/index'
import { useMonthlyUsageStore } from '~/stores/monthly-usage'
import { useTierLimits } from '~/stores/tiers'

import Fuse from 'fuse.js'

export default {
    data() {
        const store = useAuthStore()
        const monthly_usage = useMonthlyUsageStore()
        const tier_limits = useTierLimits();
        return {
            isGroup: false,
            dataSources: [],
            newDataSourceModalOpen: false,
            settingsModalOpen: false,
            activeDataSource: null,
            showSuccess: false,
            showFailure: false,
            dataSourceToDelete: null,
            noDataFound: false,
            isLoading: true,
            successMessage:'',
            failureMessage:'',
            store: store,
            monthly_usage: monthly_usage,
            tier_limits: tier_limits,
            searchQuery: '',
            showSortOptions: false,
            showFilterOptions: false,
            selectedFileType: '',
            dataSources_copy: [],
            debounceTimeout: null,
            sort: 'date',
            pendingUpdates: [],
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            isFetchingDataSource: false,
         };
    },
    async mounted(){
        // Load data sources from database and append to dataSources array
        watchEffect(() => {
            if (this.dataSources.length === 0 !== this.isLoading && this.dataSources_copy.length === 0) {
                this.noDataFound = true
            } else {
                this.noDataFound = false
            }
        })

        await this.getDataSources()
        this.dataSources_copy = this.dataSources
        await this.updateSelectedDataSources()
    },
    methods: {
        clearSearch() {
            this.searchQuery = '';
            this.onKeyup();
        },
        async nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;    
                await this.updatePage(this.currentPage, true);
    
            }
        },
        async prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                await this.updatePage(this.currentPage, true);
            }
        },
        async updatePage(page, refresh = false) {
            this.isFetchingDataSource = true
            this.currentPage = page
            if (refresh){
                this.dataSources = []
            }
            await this.getDataSources()
            this.isFetchingDataSource = false
        },
        canUploadDataSource() {
            const filesUploaded = this.monthly_usage.filesUploaded; 
            let tier_mame = this.monthly_usage.tier; 
            if (this.monthly_usage.tier == null) {
                tier_mame = 'FREE';
            }
            const tier_limit = this.tier_limits.tiers.find(tier => tier.name === tier_mame);
            if (tier_limit.file_limit === -1) {
                return true;
            }         
            return filesUploaded < tier_limit.file_limit;
        },
        canActivateMoreDataSources() {
            const active_data_sources = this.monthly_usage.activeDataSourcesCount;
            const tier_limit = this.tier_limits.tiers.find(tier => tier.name === this.monthly_usage.tier);
            let tier_mame = this.monthly_usage.tier; 
            if (this.monthly_usage.tier == null) {
                tier_mame = 'FREE';
            }

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
                this.onShowFailure('You have reached your active data sources limit. Please upgrade your plan to activate more data sources.');
            } 
        },
        async updateSelectedDataSources(upsert = false) {
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
                        this.onShowFailure(message)
                    }
                    if (data) {
                        this.onShowSuccess('Data sources updated successfully')
                        this.monthly_usage.updateActiveDataSourcesCount(this.pendingUpdates)
                        this.pendingUpdates = [];
                    }
                }
            }, 500);
    
        },
        isFileTypeInDataSources(fileType) {
            return this.dataSources_copy.some(dataSource => dataSource.file_type === fileType);
        },
        isFilter(fileType) {
            return this.selectedFileType === fileType;
        },
        isSort(sort) {
            return this.sort === sort;
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
        sortData(sort) {
            if (sort == "asc"){
                this.sort = 'asc'
                this.dataSources.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });
            }else if (sort == "desc"){
                this.sort = 'desc'
                this.dataSources.sort((a, b) => {
                    if (a.name > b.name) return -1;
                    if (a.name < b.name) return 1;
                    return 0;
                });
            }else{
                this.sort = 'date'
                this.dataSources.sort((a, b) => {
                    return new Date(a.created_at) - new Date(b.created_at);
                });
            }
        },
        selectFileType(fileType) {
            this.selectedFileType = fileType;
        },
        async applyFilter() {
            if (this.selectedFileType) {
                this.dataSources = this.dataSources_copy.filter((dataSource) => dataSource.file_type === this.selectedFileType);
            }
            this.showFilterOptions = false;  
        },
        async resetFilter() {
            this.selectedFileType = '';
            await this.getDataSources(true)
            this.showFilterOptions = false;
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
                        const message = `An error occurred while searching: ${error}`;
                        this.onShowFailure(message);
                    }
                    if (data) {
                        this.dataSources = data
                    }
                }
            } catch (error) {
                const message = `An error occurred while searching: ${error}`;
                this.onShowFailure(message);
                // Handle the error appropriately based on your application needs.
                // For instance, you might want to show a user-friendly error message.
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
        beforeDestroy() {
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
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
                // Add more mappings as needed
            };
            return iconMap[fileType] || '/images/text.png'; // Default to 'text.png' if no match
        },
        initSupabase() {
            return useSupabaseClient()
        },
        addDataToList(data){
            data.forEach((dataSource) => {
                this.dataSources.push({
                    id: dataSource.id,
                    user_id: dataSource.user_id,
                    name: dataSource.name,
                    content_data: dataSource.content_data,
                    file_type: dataSource.file_type,
                    is_file: dataSource.is_file,
                    created_at: dataSource.created_at,
                    is_active: dataSource.is_active,
                })
            })
        },
        async getDataSources(refresh = false) {
            const supabase = await this.initSupabase()
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage - 1;

            const { data, error, count } = await supabase
                .from('data')
                .select('id, user_id, name, content_data, file_type, created_at, is_active', { count: 'exact' })
                .order('created_at', { ascending: true })
                .range(startIndex, endIndex);

            if (data) {
                this.totalItems = count;
                if (refresh) {
                    this.dataSources = []
                }
                this.addDataToList(data)
            }
            this.isLoading = false;
        },
        async onDataRefreshed() {
            const supabase = this.initSupabase()
            await this.getDataSources(supabase, true)
        },
        onShowSuccess(message) {
            this.showSuccess = true
            this.successMessage = message
            setTimeout(() => {
                this.showSuccess = false
                this.successMessage = ''
            }, 3000)
        },
        onShowFailure(message) {
            this.showFailure = true
            this.failureMessage = message
            setTimeout(() => {
                this.showFailure = false
                this.failureMessage = ''
            }, 3000)
        },
        newDataSource() {
            if (this.canUploadDataSource()) {
                this.newDataSourceModalOpen = true;
            } else {
                this.onShowFailure('You have reached your file upload limit. Please upgrade your plan to upload more files');
            }
        },
        closeNewDataSource() {
            this.newDataSourceModalOpen = false;

        },
        openSettings(dataSourceId) {
            this.activeDataSource = dataSourceId;
            this.settingsModalOpen = true;
        },
        closeSettings() {
            this.settingsModalOpen = false;
 
        },
        async deleteDataSource(dataSourceId) {
            this.dataSourceToDelete = dataSourceId
            const supabase = this.initSupabase()
            const user_session = this.store.user_session
            const item = this.dataSources.find(dataSource => dataSource.id === dataSourceId)
            if (item.is_file){
                
                const { data, file_error } = await supabase
                .storage
                .from('user_files')
                .remove([`${item.content_data}`])
                
                if (file_error) {
                    this.onShowFailure("File deletion failed!")
                }
            }
            const { error } = await supabase
                .from('data')
                .delete()
                .eq('id', dataSourceId)

        
            if (error) {
                this.onShowFailure("Data deletion failed!")
            } else {
                const formData = new FormData();

                formData.append("namespace", user_session.user.id);
                formData.append("data_source", dataSourceId);


                try {
                    const response = await fetch("https://blaizzy--kulissiwa-data-data.modal.run/delete_data", {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const message = `An error has occured while deleting embedding data: ${response.status}`;
                        this.onShowFailure(message)
                    }else{
                        this.onShowSuccess("Data deleted successfully!")
                        if (this.monthly_usage.filesUploaded > 0){
                            this.monthly_usage.filesUploaded -= 1;
                        }
                        await this.onDataRefreshed()
                    }
                } catch (err) {
                console.log(err)
                }

            }
        }
    },
    computed: {
        onSort() {
            return this.sort === 'asc';
        },
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },
    },
    components: {
        Menu,
        MenuButton,
        MenuItems,
        MenuItem,
        ChevronDownIcon,
        PencilSquareIcon,
        TrashIcon,
        DataSkeleton,
    }

}
</script>

<style>


</style>