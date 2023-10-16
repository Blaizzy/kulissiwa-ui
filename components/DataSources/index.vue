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
          @click="resetModal(); $emit('close')"
          class="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
        >
          <i class="fas fa-times" ></i>
        </button>
        <h2 class="text-xl font-semibold mb-4">New Data Source</h2>
        <div class="text-base">
        
          <label for="data-type" class="block mb-2">Select data type:</label>
          <select id="data-type" class="block w-full border border-gray-300 rounded-lg p-1 py-2 mb-2" v-model="selectedDataType" @change="resetFiles">
            <option 
              v-for="dataType in dataTypes"
              :key="dataType.value"
              :value="dataType.value"
              :disabled="dataType.disabled"
            >
              {{ dataType.label }}
            </option>
            
          </select>
          <label for="data-type" class="block mb-2" v-show="selectedDataType=='Text' || selectedDataType=='URL'">Name:</label>
          <input
            id="data-source-name"
            type="text"
            class="block w-full border border-gray-300 rounded-lg p-2"
            placeholder="i.e. Docs"
            v-model="name" v-show="selectedDataType=='Text' || selectedDataType=='URL'"/>
        </div>
        <div>
          <form @submit.prevent>
            <div v-if="selectedDataType === 'PDF' || selectedDataType === 'Docx'" class="transition-opacity duration-300 delay-300 mt-3" :class="{ 'opacity-0': !selectedDataType, 'opacity-100': selectedDataType === 'PDF' || selectedDataType === 'Docx' }">
              <div 
                class="file-dropzone border-2 border-dashed border-gray-300 p-5 mb-4 text-center flex flex-col justify-center items-center transition-colors duration-300 rounded"
                @dragenter.prevent.stop="dragEnter" 
                @dragover.prevent.stop="dragOver" 
                @dragleave.prevent.stop="dragLeave" 
                @drop.prevent.stop="dropFile"
                :class="{ 'bg-gray-100': isDragging }"
              >
                <i class="fas fa-arrow-up-from-bracket text-3xl text-gray-300 pb-2 mb-2"></i>
                <p v-if="isDragging" class="text-gray-500 text-sm">Drop your file here</p>
                <p v-else class="text-gray-500 text-sm">Drag & Drop or <span class="text-blue-500 cursor-pointer underline hover:text-blue-600 text-semibold" @click.prevent="selectFile">Click Here</span> to upload</p>
                <p class="text-gray-500 text-xs mt-2">Max file size: {{ maxFileSize }} MB</p>
                <div v-if="selectedDataType === 'PDF'">
                  <input
                    ref="pdfInput"
                    type="file"
                    accept=".pdf"
                    class="hidden"
                    multiple
                    @change="handleFileUpload"
                  />
                </div>
                <div v-if="selectedDataType === 'Docx'">
                  <input
                    ref="docxInput"
                    type="file"
                    accept=".docx"
                    class="hidden"
                    multiple
                    @change="handleFileUpload"
                  />
                </div>
              </div>
              <!-- File Display Area (loop through each uploaded file) -->
              <div v-for="(file, index) in uploadedFiles" :key="index">
                <div class="flex flex-col p-3 rounded bg-gray-100 m-2">
                  <!-- Content (icon, file name, remove icon) -->
                  <div class="flex items-center justify-between mb-2">
                    <!-- File icon based on type -->
                    <img :src="fileIcons[file.file_type.toLowerCase()]" alt="File Icon" class="inline-block mr-2 h-10">
                    
                    <!-- File name -->
                    <div class="flex flex-col flex-grow mr-4 min-w-0">
                      <div class="flex justify-between items-center pb-1">
                        <p class="truncate overflow-hidden text-sm">{{ file.display_name }}</p>
                        
                        <!-- Remove file icon -->
                        <button
                          @click="removeFile(index)"
                          :class="loading ? '' : 'hover:text-gray-700'"
                          :disabled="loading"
                          class="text-gray-500 ml-4"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      <!-- File size and loading progress -->
                      <div class="flex justify-between items-center text-xs">
                        <p class="text-gray-500">{{ file.readableFileSize }}</p>
                        <p v-if="loading" class="text-gray-700">{{ file.loadingProgress }}%</p>
                      </div>
                    </div>
                  </div>

                  <!-- Loading bar -->
                  <div v-if="loading" class="mt-auto">
                    <div class="h-1 bg-white rounded-full">
                      <div class="h-full bg-blue-600 rounded-full animate-pulse" :style="{ width: `${file.loadingProgress}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedDataType === 'URL'" class="mt-2 transition-opacity duration-300 delay-500" :class="{ 'opacity-0': !selectedDataType, 'opacity-100': selectedDataType === 'URL'}">
              <label for="website-url" class="block mb-2 text-md">Website URL:</label>
              <input
                id="website-url"
                type="url"
                class="block w-full border border-gray-300 rounded-lg p-2"
                placeholder="https://example.com" v-model="data"
              />
              <div class="mt-2">

                <!-- checkbox for crawl -->
                <input class="mr-2" type="checkbox" id="crawl" name="crawl" value="crawl" v-model="crawl">
                <label for="crawl" class="text-md">Crawl</label><br>
                <div class="mt-2 text-sm" v-show="onCrawl">
                  <div class=" flex items-center bg-yellow-50 p-1 px-2 rounded-md border border-yellow-300"> 
                    <i class="fas fa-info-circle text-yellow-500  mr-2"></i>
                    <p class="text-gray-700">URL crawling is limited to 300 pages per crawl. Reach out to us if you need more.</p>
                  </div>
                 
                  
                </div>
                <div v-for="(file, index) in uploadedFiles" :key="index">
          
                  <p v-if="loading" class="flex text-gray-700 text-md justify-end">{{ file.loadingProgress }}%</p>
                  <div v-if="loading" class="mt-2">
                    <div class="h-1 bg-white rounded-full">
                      <div class="h-full bg-blue-600 rounded-full animate-pulse" :style="{ width: `${file.loadingProgress}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedDataType === 'Text'" class="mt-2 transition-opacity duration-300 delay-500" :class="{ 'opacity-0': !selectedDataType, 'opacity-100': selectedDataType === 'URL'}">
              <label for="text-data" class="block mb-2 text-md">Text Data:</label>
              <textarea
                id="text-data"
                class="block w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter text here" v-model="data"
              ></textarea>
              <div v-for="(file, index) in uploadedFiles" :key="index">
                <p v-if="loading" class="flex text-gray-700 text-md justify-end">{{ file.loadingProgress }}%</p>
                <div v-if="loading" class="mt-2">
                  <div class="h-1 bg-white rounded-full">
                    <div class="h-full bg-blue-600 rounded-full animate-pulse" :style="{ width: `${file.loadingProgress}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="(error, index) in errors" :key="index">
              <p class="text-red-600 text-xs prose break-words">
               <i class="fas fa-exclamation-circle"></i>
               {{ error }} 
              </p>
            </div>
            <div class="flex justify-end mt-4 items-center text-md">
              <button
                @click="resetModal(); $emit('close')"
                class="bg-red-600 text-white py-1 px-3 rounded-lg m-1"
                v-if="!loading"
              >
                Cancel
              </button>
              <p v-if="loading" class="text-gray-500 mr-2 inline-block  prose break-words animate-pulse"> This will take a few seconds, please wait... </p>  
              <button
                @click="uploadData"
                class=" text-white py-1 px-3 rounded-lg m-1"
                :class="noData ? 'opacity-50 bg-gray-500' : 'bg-blue-600'"
                :disabled="noData"
                v-if="!loading"
              >
                Upload

              </button>
              
              <button
                class="bg-blue-600 text-white py-1 px-3 rounded-lg m-1"
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
import MyWorker from '@/assets/workers/workerData?worker'
import EmbedURLWorker from '@/assets/workers/workerURLs?worker'
import { useAuthStore } from '@/stores/index'


export default {
  props: {
      isOpen: {
          type: Boolean,
          required: true,
      },
  },
  data() {
    const store = useAuthStore()
    return {
      store: store,
      selectedDataType: "PDF",
      name: "",
      display_name: "",
      uploadedFiles: [],
      data: "",
      errors: [],
      file_type: "",
      crawl: false,
      loading: false,
      loadingProgress: 0,
      maxFileSize: 15,
      dataTypes: [
        { label: 'PDF', value: 'PDF' },
        { label: 'Text', value: 'Text', disabled: false },
        { label: 'Docx', value: 'Docx', disabled: false },
        { label: 'URL', value: 'URL', disabled: false },
        { label: 'CSV', value: 'CSV', disabled: true },
        { label: 'Notion', value: 'Notion', disabled: true },
        // ... add more data types as needed
      ],
      fileIcons: {
        'pdf': '/images/pdf.png',
        'docx': '/images/word.png',
        'url': '/images/web.png',
        'csv': '/images/csv.png',
        'text': '/images/text.png',
      },
      isDragging: false,

    };
  },
  methods: {
    dragEnter() {
      this.isDragging = true;
    },
    dragOver() {
      this.isDragging = true;
    },
    dragLeave() {
      this.isDragging = false;
    },
    dropFile(event) {
      this.isDragging = false;

      if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
        const acceptedFiles = [];
        for (let item of event.dataTransfer.items) {
          if (item.kind === "file") {
            acceptedFiles.push(item.file);
          }
        }
        this.handleFileUpload(event);
      }
    },
    selectFile() {
      if (this.selectedDataType === 'PDF') {
        this.$refs.pdfInput.click();
      } else if (this.selectedDataType === 'Docx') {
        this.$refs.docxInput.click();
      }
    },
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
    removeFile(index) {
      this.uploadedFiles.splice(index, 1);
    },
    resetFiles() {
      this.uploadedFiles = [];
    },
    resetModal() {
      this.name = "";
      this.display_name = "";
      this.loadingProgress = 0; // TODO: Remove when loading multiple files
      this.data = "";
      this.errors = [];
      this.file_type = "";
      this.loading= false;
      this.crawl = false;
      // clear all inputs 
      const inputs = document.querySelectorAll('input[type="file"]')
      inputs.forEach(input => input.value = '')
    },
    async embedURLWorker(file, data_source, user_session, data_type, crawl, excluded_urls){  
      return new Promise((resolve, reject) => {
        const worker = new EmbedURLWorker();
        worker.postMessage({
          data: file.data,  
          data_source: data_source, 
          namespace: user_session.user.id,
          data_type: data_type, 
          crawl: crawl,
          excluded_urls: excluded_urls,
        });
        

        worker.addEventListener('message', (event) => {
          if (event.data.error) {
              console.error(`Error processing file: ${event.data.error} ${file.display_name}`);
              this.$emit('showFailure')
          } else {
              // Handle the result from the worker
              // Maybe update some reactive properties, etc.

              if (event.data.status === 'complete') {
                worker.terminate();
                resolve("Embedding completed");
                this.$emit("showSuccess")
              } else {
                file.loadingProgress = event.data.progress;
              }
          }
        });
      });
    },
    async embedFileWithWorker(action, file, data_source, user_session, file_type, is_file=false) {
      return new Promise((resolve, reject) => {
        const worker = new MyWorker();
        worker.postMessage({
          action: action,
          data: file.data,  
          data_source: data_source, 
          namespace: user_session.user.id,
          data_type: file_type, 
          is_file: is_file,
        });
        

        worker.addEventListener('message', (event) => {
          if (event.data.error) {
              console.error(`Error processing file: ${event.data.error} ${file.display_name}`);
              this.$emit('showFailure')
          } else {
              // Handle the result from the worker
              // Maybe update some reactive properties, etc.

              if (event.data.status === 'complete') {
                worker.terminate();
                resolve("Embedding completed");
                this.$emit("showSuccess")
              } else {
                file.loadingProgress = event.data.progress;
              }
          }
        });
      });

    },
    removeDiarectics(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    },
    async handleFileUpload(event) {
    
      this.errors = []; // Reset the error message

      // Get all the files from the event
      const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

      // Check if the number of files exceeds 5
      if (files.length > 5) {
        this.errors.push('You can only upload a maximum of 5 files at a time.');
        return;  // Exit the function
      }

      // Check if the files combined are larger than 50 MB
      let totalFileSizeInMB = 0;

    
      for (let file of files) {
        // Check file size
        const fileSizeInMB = file.size / (1024 * 1024);  // Convert bytes to MB
        totalFileSizeInMB += fileSizeInMB;
        if (fileSizeInMB > this.maxFileSize) {
          this.errors.push(`The file "${file.name}" exceeds the ${this.maxFileSize} MB limit and was not added.`);
          continue;  // Skip this file
        }
        if (totalFileSizeInMB > this.maxFileSize) {
          this.errors.push(`The combined file size exceeds the 50 MB limit.`);
          continue;  // Skip this file
        }

        let fileType = "";
        if (this.selectedDataType === "Docx") {
          if (file.type.split("/")[1] === "vnd.openxmlformats-officedocument.wordprocessingml.document"){
            fileType = "docx";
          }
        } else {
          fileType = file.type.split("/")[1];
        }

        if (this.selectedDataType.toLowerCase() !== fileType.toLowerCase()) {       
          this.errors.push(`The file "${file.name}" is not a ${this.selectedDataType} file and was not added.`);
          continue;  // Skip this file
        }

        // Push each file's details to the uploadedFiles array
        this.uploadedFiles.push({
          data: file,
          display_name: file.name,
          name: this.removeDiarectics(file.name.split(".")[0]),
          file_type: fileType.toUpperCase(),
          loadingProgress: 0,
        });
      }
      
    },
    
    async uploadData() {
      const supabase = useSupabaseClient();
      const user_session = this.store.user_session

      this.loading = true;
      if (this.selectedDataType == "Text") {
        this.uploadedFiles.push({ data: this.data, display_name: this.name, name: this.name, file_type: 'text', loadingProgress: 15})
      } else if (this.selectedDataType == "URL") {
        this.uploadedFiles.push({ data: this.data, display_name: this.name, name: this.name, file_type: 'url', loadingProgress: 15})
      }

      const promises = this.uploadedFiles.map(async(file) => {
        if (this.selectedDataType == "Text") {
          const { data, error } = await supabase
            .from('data')
            .upsert([
              { name: file.name, content_data: file.data, user_id: `${user_session.user.id}`, file_type: 'text' },
            ]).select();

          if (error) {
            console.error("Error uploading data:", error);
            throw error;
          } else {
            await this.embedFileWithWorker('embedData', file, data[0].id, user_session, file.file_type, false);
          }

        } else if (this.selectedDataType == "URL") {
          const { data, error } = await supabase
            .from('data')
            .upsert([
              { name: file.name, content_data: file.data, user_id: `${user_session.user.id}`, file_type: 'url' },
            ]).select();

          if (error) {
            console.error("Error uploading data:", error);
            throw error;
          } else {
            await this.embedURLWorker(file, data[0].id, user_session, file.file_type, this.crawl, []);
          }
        } else if (this.selectedDataType == "PDF" || this.selectedDataType == "Docx" || this.selectedDataType == "CSV") {
          const unique_name = `${file.name}_${Date.now()}`;
          const { data, error } = await supabase
            .storage
            .from('user_files')
            .upload(`${user_session.user.id}/${unique_name}`, file.data);

          if (error) {
            console.error("Error uploading data:", error);
            throw error;
          } else {
            file.loadingProgress = 7;
            const fileEntry = await this.listFiles(unique_name);
            const { data: insertData, error: insertError } = await supabase
              .from('data')
              .upsert([
                { name: file.name, content_data: `${user_session.user.id}/${unique_name}`, user_id: `${user_session.user.id}`, is_file: true, file_type: file.file_type.toLowerCase() },
              ]).select();

            if (insertError) {
              console.error("Error uploading data:", insertError);
              throw insertError;
            } else {
              file.loadingProgress = 15;
              const file_type = file.file_type.toLowerCase();
              await this.embedFileWithWorker('embedData', file, insertData[0].id, user_session, file_type, true);
            }
          }
        }
      });

      const results = await Promise.allSettled(promises);

      for (let result of results) {
        if (result.status === 'fulfilled') {
          // Your existing code to handle successful file processing

        } else {
          console.error(result.reason);

        }
      }

      this.$emit("refreshData")
      this.loading = false;
      this.uploadedFiles = []; 
      this.resetModal();
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
  },
  watch: {
    // Check if error is set and reset after 5 seconds
    error() {
      if (this.error.length > 0) {
        setTimeout(() => {
          this.errors = [];
        }, 2000);
      }
    },
  },
  computed: {
    isNameEmpty() {
      if (this.selectedDataType=="Text" || this.selectedDataType=="URL") {
        return this.name.length == 0 || this.data.length == 0
      } else if (this.selectedDataType=="PDF" || this.selectedDataType=="Docx" || this.selectedDataType=="CSV") {
        
        return this.uploadedFiles.length == 0
      }
    },
    noData() {
      return this.isNameEmpty;
    },
    readableFileSize() {
      if (!this.data) return '';
      const bytes = this.data.size;

      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Byte';
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    onCrawl(){
      return this.crawl
    }
  },
}

</script>

<style scoped>
.SettingsModal {
  backdrop-filter: blur(4px);
}
</style>
