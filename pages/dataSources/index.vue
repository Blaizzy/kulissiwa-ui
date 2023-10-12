<script setup>
definePageMeta({
  middleware: 'auth',
});
</script>
<template>
    <div class="flex flex-col h-full w-full">
     
        <div class="flex justify-between items-center pb-4 px-4 pt-6 border-b border-gray-200 w-full bg-white relative"> <!-- Added relative here -->
            <div class="flex">
                <h1 class="text-2xl font-semibold">Data sources</h1>
                <DataSources :isOpen="newDataSourceModalOpen" @close="closeNewDataSource" @refresh-data="onDataRefreshed()" @show-success="onShowSuccess('Data uploaded sucessfully')" @show-failure="onShowFailure('Data upload failed!')"  />
            </div>
            <div class="flex absolute top-0 right-0"> <!-- Changed to absolute positioning -->
                <div 
                    v-if="showSuccess" 
                    class="mt-4 py-2 px-4 text-lg text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 shadow-md transition-transform transform"
                    :class="{ '-translate-x-full opacity-0': !showSuccess, 'translate-x-0 opacity-100': showSuccess }"
                >   
                    <ClientOnly>
                        <i class="fas fa-square-check mr-2"></i>
                    </ClientOnly>
                    {{successMessage}}
                </div>
                <div 
                    v-if="showSuccess" 
                    class="mt-4 py-2 px-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 shadow-md transition-transform transform"
                    :class="{ '-translate-x-full opacity-0': !showFailure, 'translate-x-0 opacity-100': showFailure }"
                >   
                    <ClientOnly>
                        <i class="fa fa-square-xmark mr-2"></i>
                    </ClientOnly>
                    {{failureMessage}}
                </div>
            </div>
        </div>

        <div class="flex mt-4 px-4 text-sm py-2">
            <div class="mt-auto rounded-full flex  w-1/4 items-center px-2 border-2 border-gray-200 hover:border-gray-300 text-black">
                <button class="px-2 text-gray-500 hover:text-black inline-flex items-center">
                    <i class="fas fa-search"></i>
                </button>
                <input type="search"  class="w-full px-1 py-2 rounded-full focus:outline-none bg-inherit" placeholder="Search data sources..." v-model="searchQuery" @keyup.prevent="onKeyup">
            </div>
            <button @click="newDataSource(); showFilterOptions=false; showSortOptions=false" class="text-white gradient-border rounded-full px-2 shadow-lg hover:scale-105 ml-5">
                <i class="fa-solid fa-plus"></i> <span class="pl-1 font-medium">Add New</span>
            </button>
            <div class="ml-3">
                <button @click="showSortOptions = !showSortOptions; showFilterOptions=false" class=" w-full h-full px-2 py-1 text-black border-2 border-gray-200 rounded-full  hover:border-gray-300 hover:text-black inline-flex items-center" v-if="!noDataFound && !isLoading">
                    <i class="fa-solid fa-arrow-up-wide-short"></i> <span class="pl-2">Sort</span>
                </button>
                <div v-show="showSortOptions" class="absolute mt-2 w-48 rounded-md shadow-lg z-50 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100" @click="showSortOptions = false;">
                    <div class="py-1">
                        <ClientOnly>
                            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortData('asc')">
                                Sort Ascending
                                <span v-show="setSort('asc')" class="float-right">
                                    <i class="fa-solid fa-check text-sky-500"></i>
                                </span>
                            </button>
                            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortData('desc')">
                                Sort Descending
                                <span v-show="setSort('desc')" class="float-right">
                                    <i class="fa-solid fa-check text-sky-500"></i>
                                </span>
                            </button>
                            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortData('date')">
                                Sort by Date
                                <span v-show="setSort('date')" class="float-right">
                                    <i class="fa-solid fa-check text-sky-500"></i>
                                </span>
                            </button>
                        </ClientOnly>
                    </div>
                </div>
            </div>
            <div class="ml-3">
                <!-- Filter Button -->
                <button @click="showFilterOptions = !showFilterOptions; showSortOptions=false" class="ml-2 w-full h-full px-2 py-1 text-black border-2 border-gray-200 rounded-full hover:border-gray-300 hover:text-black inline-flex items-center" v-if="!noDataFound && !isLoading">
                    <i class="fa fa-filter"></i> <span class="pl-2">Filter</span>
                </button>
                <div v-show="showFilterOptions" class="absolute mt-2 w-48 rounded-md shadow-lg z-50 bg-white ring-1 ring-black ring-opacity-5">
                    <div class="py-1">
                        <button v-if="isFileTypeInDataSources('pdf')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="selectFileType('pdf')">
                            PDF
                            <span v-show="setFilter('pdf')" class="float-right">
                                <i class="fa-solid fa-check text-sky-500"></i>
                            </span>
                        </button>
                        <button v-if="isFileTypeInDataSources('docx')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click.prevent="selectFileType('docx')">
                            DOCX
                            <span v-show="setFilter('docx')" class="float-right">
                                <i class="fa-solid fa-check text-sky-500"></i>
                            </span>
                        </button>
                        <button v-if="isFileTypeInDataSources('url')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click.prevent="selectFileType('url')">
                            URL
                            <span v-show="setFilter('url')" class="float-right">
                                <i class="fa-solid fa-check text-sky-500"></i>
                            </span>
                        </button>
                        <button v-if="isFileTypeInDataSources('text')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click.prevent="selectFileType('text')">
                            TEXT
                            <span v-show="setFilter('text')" class="float-right">
                                <i class="fa-solid fa-check text-sky-500"></i>
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
            <h2 class="text-lg font-semibold pb-2 pt-4 px-4">Files</h2>         
        </div>
        
        <div class="flex-grow overflow-y-auto pb-4"
        :class="noDataFound ? 'flex justify-center items-center' : ''"
        >
            <div class="flex justify-center items-center" v-if="noDataFound">
                    <div class="flex justify-center items-center flex-col">
                        <img src="~~/assets/logos/No-documents-found.png" alt="No Documents Found" class="md:w-1/2 max-lg:w-auto"> 
                        <h1 class="text-4xl font-semibold m-1">Empty folder</h1>
                        <h2 class="text-2xl m-1">Start uploading files</h2>
                        <ul class="items-center md:text-lg max-lg:text-xl">
                            <li>
                                1. Click on the <i class="fa-solid fa-square-plus text-gray-500"></i> button
                            </li>
                            <li>
                                2. Select a file from your computer
                            </li>
                            <li>
                                3. Click on the <i class="fa-solid fa-upload text-gray-500"></i> button
                            </li>
                            <li>
                                4. Wait for the upload to finish
                            </li>
                        </ul>
                    </div>
                </div>

            
            <div class="mt-2 mx-3 text-sm">
                <!-- Table Headers -->
                <div class="sticky top-0 z-10 flex flex-row justify-between text-gray-500 px-4 py-3  text-md font-normal rounded-lg bg-gray-50" v-if="!noDataFound && !isLoading">
                    <span class="flex-1">Filename</span>
                    <span class="flex-1">Date Created</span>
                    <span class="flex-1">Type</span>
                    <span class="flex-1"></span> <!-- This is to align the dropdown menu in the rows -->
                </div>

                <!-- Display skeleton loaders when data is being fetched -->
                <DataSkeleton v-show="isLoading" v-for="i in 5" :key="i" />

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
                    
                    <!-- Dropdown options -->
                    <div class="text-right flex-1"   :class="dataSourceToDelete === dataSource.id ? 'animate-pulse cursor-not-allowed' : ''">
                        <Menu as="div" class="relative inline-block text-left" @click.prevent>
                            <div>
                                <MenuButton class="inline-flex w-full justify-center rounded-full hover:bg-gray-200 px-2 py-2 text-sm font-medium text-black">
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
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
            </div>
        </div>
    </div>
      

</template>

<script>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/20/solid'
import DataSkeleton from '~/components/DataSkeleton.vue'
import { useAuthStore } from '@/stores/index'
import Fuse from 'fuse.js'

export default {

    data() {
        const store = useAuthStore()
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
            searchQuery: '',
            showSortOptions: false,
            showFilterOptions: false,
            selectedFileType: '',
            dataSources_copy: [],
            debounceTimeout: null,
        };
    },
    async mounted(){
        // Load data sources from database and append to dataSources array
        watchEffect(() => {
            if (this.dataSources.length === 0 !== this.isLoading) {
                this.noDataFound = true
            } else {
                this.noDataFound = false
            }
        })
        this.sort = 'date'
        await this.getDataSources()
        this.dataSources_copy = this.dataSources

    },
    methods: {
        isFileTypeInDataSources(fileType) {
            return this.dataSources.some(dataSource => dataSource.file_type === fileType);
        },
        setFilter(fileType) {
            return this.selectedFileType === fileType;
        },
        setSort(sort) {
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
                this.dataSources = this.dataSources.filter((dataSource) => dataSource.file_type === this.selectedFileType);
            }
            this.showFilterOptions = false;  
        },
        async resetFilter() {
            this.selectedFileType = '';
            await this.getDataSources(true)
            this.showFilterOptions = false;
        },
        async searchConversations() {
            const fuseOptions = {
                keys: ['name'],  // Adjust this based on your field names
                threshold: 0.3,            // Adjust for search sensitivity
            };    
            try {
                let fuse = new Fuse(this.dataSources_copy, fuseOptions);

                // If there's a search query, search using Fuse and update dataSources.
                // If not, reset dataSources to its original state.
                this.dataSources = this.searchQuery 
                    ? fuse.search(this.searchQuery).map(result => result.item)
                    : [...this.dataSources_copy];
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
                this.searchConversations();
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
                    name: dataSource.name,
                    content_data: dataSource.content_data,
                    file_type: dataSource.file_type,
                    is_file: dataSource.is_file,
                    created_at: dataSource.created_at,
                })
            })
        },
        async getDataSources(refresh = false) {
            const supabase = await this.initSupabase()
            const { data, error } = await supabase
                .from('data')
                .select('id, name, content_data, file_type, is_file, created_at')
                .order('created_at', { ascending: true });
            
            if (error) {
                console.log(error)
                this.onShowFailure('There was an error loading your data sources')
            }

            if (data) {
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
                this.showDeleteFailure = false
            }, 3000)
        },
        newDataSource() {
            this.newDataSourceModalOpen = true;
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
            }
            else {
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