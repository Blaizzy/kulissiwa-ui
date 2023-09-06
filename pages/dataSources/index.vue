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
                Data uploaded successfully!
        </div>
        <div 
            v-if="showFailure" 
            class="fixed top-4 right-4 py-2 px-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 shadow-md transition-transform transform"
            :class="{ 'translate-x-full opacity-0': !showFailure, 'translate-x-0 opacity-100': showFailure }"
        >
            <i class="fas fa-square-xmark mr-2"></i>
            Data upload failed!
        </div>

        <div 
            v-if="showDeleteSuccess" 
            class="fixed top-4 right-4 py-2 px-4 text-lg text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 shadow-md transition-transform transform"
            :class="{ 'translate-x-full opacity-0': !showDeleteSuccess, 'translate-x-0 opacity-100': showDeleteSuccess }"
        >
            <i class="fas fa-square-check mr-2"></i>
                Data deleted successfully!
        </div>
        <div 
            v-if="showDeleteFailure" 
            class="fixed top-4 right-4 py-2 px-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 shadow-md transition-transform transform"
            :class="{ 'translate-x-full opacity-0': !showDeleteFailure, 'translate-x-0 opacity-100': showDeleteFailure }"
        >
            <i class="fas fa-square-xmark mr-2"></i>
            Data deletion failed!
        </div>
        <div class="flex justify-between pb-4 px-8 border-b border-gray-200 w-full">
            <div class="flex">
                <h1 class="text-3xl font-semibold">Data sources</h1>
                <button @click="newDataSource" class="text-gray-500 hover:text-gray-700 ml-5">
                    <i class="fa-solid fa-square-plus"></i>
                </button>
                <DataSources :isOpen="newDataSourceModalOpen" @close="closeNewDataSource" @refresh-data="onDataRefreshed()" @show-success="onEmbedDataSuccess" @show-failure="onEmbedDataFailure"  />
            </div>

            <!-- TODO -->
            <!-- <div class="mt-auto bg-white rounded-full flex items-center border border-gray-200 hover:border-sky-200 ">
                <input type="search"  class="w-full px-4 py-2 rounded-full focus:outline-none" placeholder="Search data sources...">
                <button class="py-2 px-4 text-gray-500 hover:text-black inline-flex items-center">
                    <i class="fas fa-search"></i>
                </button>
            </div> -->
        </div>
        <div class="h-full" style=" overflow-y: auto;">
        <div class="flex flex-wrap p-4 " >
                <div class="flex justify-center flex-grow items-center" v-if="noDataFound">
                    <img src="~~/assets/logos/No-documents-found.svg" alt="No Documents Found"> 
                </div>
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
                <!-- <div v-if="dataSources.length === 0" class="flex justify-center items-center w-full">
                    <p class="text-gray-500">No data sources found</p>
                    <div class="flex">
                        <button @click="newDataSource" class=" bg-blue-50 py-3 px-2 mb-2 rounded-full hover:bg-sky-50">
                            <p class="text-gray-500">Add new data source</p>
                        </button>
                        <DataSources :isOpen="newDataSourceModalOpen" @close="closeNewDataSource" @refresh-data="onDataRefreshed()" />
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/20/solid'


export default {
    data() {
        return {
            isGroup: false,
            dataSources: [],
            newDataSourceModalOpen: false,
            settingsModalOpen: false,
            activeDataSource: null,
            showSuccess: false,
            showFailure: false,
            showDeleteSuccess: false,
            showDeleteFailure: false,
            dataSourceToDelete: null,
            noDataFound: false,
        };
    },
    async mounted(){
        // Load data sources from database and append to dataSources array
        watchEffect(() => {
            if (this.dataSources.length === 0) {
                this.noDataFound = true
            } else {
                this.noDataFound = false
            }
        })

        const supabase = this.initSupabase()
        this.getDataSources(supabase)
        

    },
    methods: {

        getIconForFileType(fileType) {
            const iconMap = {
                'pdf': '/images/pdf.png',
                'vnd.openxmlformats-officedocument.wordprocessingml.document': '/images/word.png',
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
        async getSession(supabase){
          const { data, error } = await supabase.auth.getSession()
          if (error) {
            console.log(error)
            alert("Error getting session")
          }else{
            return data.session
          }

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
                alert('There was an error loading your data sources')
            }

            if (data) {
                if (refresh) {
                    this.dataSources = []
                }
                this.addDataToList(data)

            }
        },
        async onDataRefreshed() {
            const supabase = this.initSupabase()
            await this.getDataSources(supabase, true)
        },
        onEmbedDataSuccess() {
            this.showSuccess = true
            setTimeout(() => {
                this.showSuccess = false
            }, 3000)
        },
        onEmbedDataFailure() {
            this.showFailure = true
            setTimeout(() => {
                this.showFailure = false
            }, 3000)
        },
        onDeleteDataSuccess() {
            this.showDeleteSuccess = true
            setTimeout(() => {
                this.showDeleteSuccess = false
            }, 3000)
        },
        onDeleteDataFailure() {
            this.showDeleteFailure = true
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
            const user_session = await this.getSession(supabase)
            const item = this.dataSources.find(dataSource => dataSource.id === dataSourceId)
            if (item.is_file){
                
                const { data, file_error } = await supabase
                .storage
                .from('user_files')
                .remove([`${item.content_data}`])
                
                if (file_error) {
                    console.log(file_error)
                    this.onDeleteDataFailure()
                }
            }
            const { error } = await supabase
                .from('data')
                .delete()
                .eq('id', dataSourceId)

        
            if (error) {
                console.log(error)
                this.onDeleteDataFailure()
            
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
                        this.onDeleteDataFailure()
                        console.log(message)
                    }else{
                        const data = await response.json();
                        this.onDeleteDataSuccess()
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
        TrashIcon
    }

}
</script>

<style>

</style>