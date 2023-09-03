<template>
    <div class="flex">
      <img :src="fileLogo" alt="Data Source Icon" class="w-6 h-6 rounded-md mr-1">
      <select 
        id="data-type" 
        class="block border border-gray-300 rounded-lg p-1 mr-4" 
        v-model="selectedDataType" 
        @change="emitChange"
      >
        <option 
          v-for="dataSource in dataSources" 
          :key="dataSource.id" 
          :value="dataSource.id"
        >
          {{ dataSource.name }}
        </option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    props: ['dataSources', 'fileLogo'],
    data() {
      return {
        selectedDataType: null
      };
    },
    methods: {
      emitChange() {
        this.$emit('change');
      }
    }
  };
  </script>