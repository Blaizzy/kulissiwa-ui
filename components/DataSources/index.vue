<template>
    <div
      class="fixed inset-0 flex items-center justify-center z-50"
      :class="{ 'opacity-0 pointer-events-none': !isOpen }"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50" :class="{ 'opacity-0': !isOpen, 'opacity-100': isOpen }"></div>
      <div
        class="bg-white w-1/3 rounded-lg p-6 shadow-lg transform transition ease-in-out duration-300"
        :class="{ 'opacity-0 scale-90': !isOpen, 'opacity-100 scale-100': isOpen }"
      >
        <button
          @click="$emit('close')"
          class="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
        >
          <i class="fas fa-times" ></i>
        </button>
        <h2 class="text-xl font-semibold mb-4">New Data Source</h2>
        <div>
          <label for="data-type" class="block mb-2">Name:</label>
          <input
            id="data-source-name"
            type="text"
            class="block w-full border border-gray-300 rounded-lg p-1 mb-1"
            placeholder="i.e. Docs"
            v-model="name"/>
          <label for="data-type" class="block mb-2">Select data type:</label>
          <select id="data-type" class="block w-full border border-gray-300 rounded-lg p-1" v-model="selectedDataType">
            <option>PDF</option>
            <option>Website</option>
            <option>CSV</option>
            <option>Text</option>
            <!-- Add more data types as needed -->
          </select>
        </div>
        <div class="mt-4">
          <form @submit.prevent>
            <div v-if="selectedDataType === 'PDF'">
              <input
                type="file"
                @change="handleFileUpload"
                accept=".pdf"
              />
            </div>
            <div v-else-if="selectedDataType === 'Website'">
              <label for="website-url" class="block mb-2">Website URL:</label>
              <input
                id="website-url"
                type="url"
                class="block w-full border border-gray-300 rounded-lg p-1"
                placeholder="https://example.com"
              />
            </div>
            <div v-else-if="selectedDataType === 'CSV'">
              <input
                type="file"
                @change="handleFileUpload"
                accept=".csv"
              />
            </div>
            <div v-else-if="selectedDataType === 'Text'">
              <label for="text-data" class="block mb-2">Text Data:</label>
              <textarea
                id="text-data"
                class="block w-full border border-gray-300 rounded-lg p-1"
                placeholder="Enter text here" v-model="data"
              ></textarea>
            </div>
            <p v-if="error.length>0" class="text-red-600"> {{ error }} </p>
            <div class="flex justify-end mt-4">
              <button
                @click="$emit('close')"
                class="bg-red-600 text-white py-2 px-4 rounded-lg m-1"
              >
                Cancel
              </button>
              <button
                @click="uploadData"
                class="bg-blue-600 text-white py-2 px-4 rounded-lg m-1"
              >
                Upload
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { createClient } from '@supabase/supabase-js'

  export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
    },
    data() {
      return {
        selectedDataType: "Text",
        name: "",
        data: "",
        error: "",
      };
    },
    methods: {
        initSupabase(){
          const config = useRuntimeConfig()
          return createClient(config.supabase.url, config.supabase.key)
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
        async emdedData(supabase, user_session) {

          const { data, error } = await supabase
            .from('data')
            .select('id')
            .order('created_at', { ascending: false })
            .limit(1);

          if (error) {
            console.log(error)
            this.error = "Error getting data source"
          }else{
            const formData = new FormData();
            formData.append("namespace", user_session.user.id);
            formData.append("data", this.data);
            formData.append("data_source", data[0].id);
            formData.append("data_type", this.selectedDataType);

            try {
              const response = await fetch("http://127.0.0.1:8000/embed_data", {
                  method: 'POST',
                  body: formData,
              });

              if (!response.ok) {
                this.error = "Error embedding data, please refresh and try again"
                setTimeout(() => {
                  this.error = ""
                }, 10000);
              }else{
                const data = await response.json();
                this.$emit('refreshData')
                this.$emit('close')
              }
            } catch (err) {
              console.log(err)
            }
          }

        },
        async uploadData() {
          const supabase = this.initSupabase()
          const user_session = await this.getSession(supabase)

          if (this.selectedDataType=="Text") {
            const { data, error } = await supabase
              .from('data')
              .insert([
                { name: this.name, content_data: this.data, user_id: `${user_session.user.id}` },
              ])
            if (error){
              alert("Error uploading data")
              console.log(error)
            }else{
              await this.emdedData(supabase, user_session)
            }

          }

        },
    }
};
  </script>

  <style scoped>
  .SettingsModal {
    backdrop-filter: blur(4px);
  }
  </style>
