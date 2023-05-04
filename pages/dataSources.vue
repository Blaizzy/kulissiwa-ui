<template>
    <div class="flex-1 p-8">
        <div class="flex">
            <h1 class="text-3xl font-semibold">Data sources</h1>
            <button @click="newDataSource" class="text-gray-500 hover:text-gray-700 ml-5">
                <i class="fa-solid fa-square-plus"></i>
            </button>
            <DataSources :isOpen="newDataSourceModalOpen" @close="closeNewDataSource" @refresh-data="onDataRefreshed()" />
        </div>

        <div class="container mx-auto px-4 py-6" >
            <div class="flex flex-wrap">
                <div v-for="dataSource in dataSources" :key="dataSource.id" class="bg-white relative p-6 border border-gray-200 rounded-lg shadow-sm w-full my-3 mx-3">
                    <div class="flex items-center">
                        <img :src="dataSource.logo" :alt="dataSource.name" class="mb-2 mr-2 w-12 h-12 rounded-md">
                        <h3 class="mt-2 mb-4 text-gray-900">{{ dataSource.name }}</h3>
                    </div>
                    <div class="absolute top-2 right-2 mt-2 mr-2">
                        <button @click="openSettings(dataSource.id)" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>

                </div>
            </div>
        </div>
        <DataSourcesSettings :isOpen="settingsModalOpen" @close="closeSettings"/>

        <div class="container mx-auto px-4 py-6" v-if="isGroup">
            <div class="flex flex-wrap">
                <div v-for="dataSource in dataSources" :key="dataSource.id" class="bg-white relative p-6 border border-gray-200 rounded-lg shadow-sm w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 my-3 mx-3">
                    <div class="flex items-center">
                        <img :src="dataSource.logo" :alt="dataSource.name" class="mb-2 mr-2 w-12 h-12 rounded-md">
                        <h3 class="mt-2 mb-4 text-gray-900">{{ dataSource.name }}</h3>
                    </div>
                    <div class="absolute top-2 right-2 mt-2 mr-2">
                        <button @click="openSettings(dataSource.id)" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>

                </div>
            </div>
        </div>
        <DataSourcesSettings :isOpen="settingsModalOpen" @close="closeSettings"/>
    </div>
</template>

<script>
import FileUpload from '~~/components/FileUpload.vue';



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
        onDataRefreshed() {
            const supabase = this.initSupabase()
            this.getDataSources(supabase, true)
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
    },
    components: {
        FileUpload
    }

}
</script>

<style>

</style>