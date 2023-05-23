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
          <label for="data-type" class="block mb-2" v-show="selectedDataType=='Text' || selectedDataType=='Website'">Name:</label>
          <input
            id="data-source-name"
            type="text"
            class="block w-full border border-gray-300 rounded-lg p-1 mb-1"
            placeholder="i.e. Docs"
            v-model="name" v-show="selectedDataType=='Text' || selectedDataType=='Website'"/>
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
                v-if="!loading"
              >
                Cancel
              </button>
              <button
                @click="uploadData"
                class="bg-blue-600 text-white py-2 px-4 rounded-lg m-1"
                v-if="!loading"
              >
                Upload

              </button>

              <button
                class="bg-blue-600 text-white py-2 px-4 rounded-lg m-1"
                disabled v-else
              >
                <i class="fas fa-spinner fa-spin"></i>

              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </template>

  <script>


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
        file_type: "",
        loading: false,
      };
    },

    methods: {
        async initSupabase(){
          return await useSupabaseClient()
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
        async embedData(supabase, user_session, is_file=false) {

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
            if (is_file){
              formData.append("file", this.data);
            }else{
              formData.append("data", this.data);
            }
            formData.append("namespace", user_session.user.id);
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

        async handleFileUpload(event) {
          this.data = event.target.files[0]
          this.name = event.target.files[0].name.split(".")[0]
          this.file_type = event.target.files[0].type.split("/")[1]
        },
        async uploadData() {
          const supabase = useSupabaseClient()
          const user_session = await this.getSession(supabase)

          this.loading = true

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
              await this.embedData(supabase, user_session)
            }

          }
          else if (this.selectedDataType=="PDF") {
            const unique_name = `${this.name}_${Date.now()}`
            const { data, error } = await supabase
              .storage
              .from('user_files')
              .upload(`${user_session.user.id}/${unique_name}`, this.data)

            if (error){
              alert("Error uploading data")
              console.log(error)
            }else{
              const file = await this.listFiles(unique_name)
              const { data, error } = await supabase
                .from('data')
                .insert([
                  { name: this.name, content_data: file[0].id, user_id: `${user_session.user.id}`, is_file: true, file_type: this.file_type },
                ])

              if (error){
                alert("Error uploading data")
                console.log(error)
              }else{
                await this.embedData(supabase, user_session, true)
                this.loading = false
              }
            }
          }


        },
        async listFiles(file_name = null) {
          const supabase = useSupabaseClient()
          const user_session = await this.getSession(supabase)

          if (file_name) {
            const { data, error } = await supabase
              .storage
              .from('user_files')
              .list(`${user_session.user.id}`, {
                limit: 1,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
                search: file_name
             })

            if (error){
              alert("Error downloading file")
              console.log(error)
            }else{
              return data

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
