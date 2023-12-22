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
        <h2 class="text-xl font-semibold mb-4">Settings</h2>
        <div>
          <label for="data-type" class="block mb-2">Select data type:</label>
          <select id="data-type" class="block w-full border border-gray-300 rounded-lg">
            <option>PDF</option>
            <option>Website</option>
            <option>CSV</option>
            <!-- Add more data types as needed -->
          </select>
        </div>

        <div class="flex justify-end mt-4">
          <div class="mx-1">
            <button @click="uploadData" class="bg-red-600 text-white py-2 px-4 rounded-lg">
              Delete
            </button>
          </div>
          <div class="mx-1">
            <button @click="uploadData" class="bg-sky-500 text-white py-2 px-4 rounded-lg">
              Update
            </button>
          </div>
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
    methods: {
        uploadData() {
          alert("Upload data");
            // Implement the upload functionality here
        },
    }
};
  </script>

  <style scoped>
  .SettingsModal {
    backdrop-filter: blur(4px);
  }
  </style>
