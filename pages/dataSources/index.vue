<script setup>
definePageMeta({
  middleware: 'auth',
});
</script>
<template>
    <div class="flex-1 p-8 bg-white">
        <div 
            v-if="showSuccess" 
            class="fixed top-4 right-4 py-2 px-4 text-lg text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 shadow-md transition-transform transform"
            :class="{ 'translate-x-full opacity-0': !showSuccess, 'translate-x-0 opacity-100': showSuccess }"
        >
            <i class="fas fa-square-check mr-2"></i>
                {{successMessage}}
        </div>
        <div 
            v-if="showFailure" 
            class="fixed top-4 right-4 py-2 px-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 shadow-md transition-transform transform"
            :class="{ 'translate-x-full opacity-0': !showFailure, 'translate-x-0 opacity-100': showFailure }"
        >
            <i class="fas fa-square-xmark mr-2"></i>
                {{failureMessage}}
        </div>

       
        <div class="flex justify-between pb-4 px-8 border-b border-gray-200 w-full">
            <div class="flex">
                <h1 class="text-3xl font-semibold">Data sources</h1>
                <button @click="newDataSource" class="text-gray-500 hover:text-gray-700 ml-5">
                    <i class="fa-solid fa-square-plus"></i>
                </button>
                <DataSources :isOpen="newDataSourceModalOpen" @close="closeNewDataSource" @refresh-data="onDataRefreshed()" @show-success="onShowSuccess('Data uploaded sucessfully')" @show-failure="onShowFailure('Data upload failed!')"  />
            </div>

            <!-- TODO -->
            <!-- <div class="mt-auto bg-white rounded-full flex items-center border border-gray-200 hover:border-sky-200 ">
                <input type="search"  class="w-full px-4 py-2 rounded-full focus:outline-none" placeholder="Search data sources...">
                <button class="py-2 px-4 text-gray-500 hover:text-black inline-flex items-center">
                    <i class="fas fa-search"></i>
                </button>
            </div> -->
        </div>
        <div class="h-full" style=" overflow-y: auto;"
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
        <div class="flex flex-wrap p-4 " >
                <!-- Display skeleton loaders when data is being fetched -->
                <DataSkeleton v-show="isLoading" v-for="i in 5" :key="i" />

                <!-- Display actual data when it's available -->
                
                <div v-for="dataSource in dataSources" :key="dataSource.id" class="basis-1/5 bg-white relative p-4 border-2 border-gray-200 rounded-lg w-full my-3 mx-3 hover:shadow-md hover:border-sky-100 hover:bg-sky-50"
                >
                    <!-- <NuxtLink
                        :to="`/dataSources/${dataSource.id}`"> -->
                    <div class="flex justify-between items-center"
                        :class="dataSourceToDelete === dataSource.id ? 'animate-pulse cursor-not-allowed' : ''"
                    >
                        <div class="flex justify-between items-center">
                            <img :src="getIconForFileType(dataSource.file_type)" :alt="dataSource.name" class="mr-2 w-8 h-8 rounded-md"/>
                            <p class="truncate text-gray-900">{{ dataSource.name }}</p>
                        </div>

                        <div class="flex" 
                          :class="dataSourceToDelete === dataSource.id ? 'animate-pulse cursor-not-allowed' : ''"
                        >
                            <div class="text-right">
                                <Menu as="div" class="relative inline-block text-left" @click.prevent>
                                <div>
                                    <MenuButton
                                    class="inline-flex w-full justify-center rounded-full hover:bg-sky-50 px-4 py-2 text-sm font-medium text-black"
                                    >
                                    <i class="fa-solid fa-ellipsis"></i>
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
                   <!-- </NuxtLink> -->
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

        const supabase = this.initSupabase()
        await this.getDataSources(supabase)

    },
    methods: {
        
        getIconForFileType(fileType) {
            const iconMap = {
                'pdf': '/images/pdf.png',
                'vnd.openxmlformats-officedocument.wordprocessingml.document': '/images/word.png',
                'docx': '/images/word.png',
                'website': '/images/website.png',
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
                })
            })
        },
        async getDataSources(supabase, refresh = false) {
            const { data, error } = await supabase
                .from('data')
                .select('id, name, content_data, file_type, is_file');
            
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