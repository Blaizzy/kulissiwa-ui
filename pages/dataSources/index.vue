<template>
    <div class="flex-1 p-8 bg-white">
        <div class="flex justify-between pb-4 px-8 border-b border-gray-200 w-full">
            <div class="flex">
                <h1 class="text-3xl font-semibold">Data sources</h1>
                <button @click="newDataSource" class="text-gray-500 hover:text-gray-700 ml-5">
                    <i class="fa-solid fa-square-plus"></i>
                </button>
                <DataSources :isOpen="newDataSourceModalOpen" @close="closeNewDataSource" @refresh-data="onDataRefreshed()" />
            </div>

            <div class="mt-auto bg-white rounded-full flex items-center border border-gray-200 hover:border-sky-200 ">
                <input type="search"  class="w-full px-4 py-2 rounded-full focus:outline-none" placeholder="Search data sources...">
                <button class="py-2 px-4 text-gray-500 hover:text-black inline-flex items-center">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
        <div class="h-full" style=" overflow-y: auto;">
        <div class="flex flex-wrap p-4 " >
                <div v-for="dataSource in dataSources" :key="dataSource.id" class="basis-1/5 bg-white relative p-4 border-2 border-gray-200 rounded-lg w-full my-3 mx-3 hover:shadow-md hover:border-sky-100 hover:bg-sky-50">
                    <NuxtLink
                        :to="`/dataSources/${dataSource.id}`">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <!-- <img :src="dataSource.logo" :alt="dataSource.name" class="mb-2 mr-2 w-12 h-12 rounded-md"> -->
                            <h3 class="mt-2 mb-4 text-gray-900">{{ dataSource.name }}</h3>
                        </div>

                        <div class="flex">
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
                                        <MenuItem v-slot="{ active }">
                                            <NuxtLink
                                                :class="[
                                                active ? 'bg-sky-500 text-white' : 'text-gray-900',
                                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]"
                                                :to="`/dataSources/${dataSource.id}`"
                                            >
                                                <PencilSquareIcon
                                                :active="active"
                                                class="mr-2 h-5 w-5 text-sky-400 group-hover:text-white"
                                                aria-hidden="true"
                                                />
                                                Edit
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
                   </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FileUpload from '~~/components/FileUpload.vue';

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
        };
    },
    async mounted(){
        // Load data sources from database and append to dataSources array
        const supabase = this.initSupabase()
        this.getDataSources(supabase)

    },
    methods: {
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
                    logo: "https://via.placeholder.com/50"
                })
            })
        },
        async getDataSources(supabase, refresh = false) {
            const { data, error } = await supabase
                .from('data')
                .select('id, name, content_data');

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
            const supabase = this.initSupabase()
            const user_session = await this.getSession(supabase)
            const { error } = await supabase
                .from('data')
                .delete()
                .eq('id', dataSourceId)

            if (error) {
                console.log(error)
                alert('There was an error deleting your data source')
            }else {
                const formData = new FormData();

                formData.append("namespace", user_session.user.id);
                formData.append("data_source", dataSourceId);


                try {
                    const response = await fetch("http://127.0.0.1:8000/delete_item", {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const message = `An error has occured while deleting embedding data: ${response.status}`;
                        console.log(message)
                    }else{
                        const data = await response.json();
                        console.log(data)
                        await this.onDataRefreshed()
                    }
                } catch (err) {
                console.log(err)
                }

            }
        }
    },
    components: {
        FileUpload,
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