<template>
    <div class="flex flex-col h-full w-full">
     
        <div class="flex justify-between items-center pb-4 px-4 pt-4 border-b border-gray-200 w-full bg-white relative">
            <div class="flex">
                <h1 class="text-xl font-semibold">AI Copilot</h1>
            </div>
        </div>
    
        <div class="flex flex-col mt-4 px-4 text-sm py-2">
            <!-- Label for the dropdown -->
            <label for="menu-button" class="block text-lg font-medium text-gray-700 mr-2">Model</label>

            <!-- Dropdown list -->
            <div class="relative inline-block text-left w-1/5">
                <div>
                    <button @click="open = !open" type="button" id="menu-button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-expanded="open" aria-haspopup="true">
                        {{ selectedModel || 'Options' }}
                        <!-- Heroicon name: chevron-down -->
                        <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div v-if="open" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                    <div class="py-1" role="none">
                        <a href="#" @click="selectModel('GPT-3.5-Turbo')" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">GPT-3.5-Turbo</a>
                        <a href="#" @click="selectModel('GPT-4')" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">GPT-4</a>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="flex flex-col mt-4 px-4 text-sm py-2">
            <label for="menu-button" class="block text-lg font-medium text-gray-700 mr-2">Instructions</label>
            <textarea class="w-full h-32 border border-gray-300 rounded-lg py-2 px-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter instructions here..."></textarea>

        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';

const open = ref(false);
const selectedModel = ref(null);

const selectModel = (model) => {
    selectedModel.value = model;
    open.value = false;
};
</script>
