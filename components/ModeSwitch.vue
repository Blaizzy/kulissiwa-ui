<template>
    <div class="flex flex-col items-center bg-neutral-200/50 rounded-md dark:bg-inherit dark:text-gray-400 font-light" >
        <div class="relative inline-block">
            <div>
                <button @click="open = !open" id="menu" class="flex items-center justify-between w-36 h-10 rounded-md bg-inherit px-4 py-2 text-sm shadow-sm hover:text-gray-500 dark:bg-neutral-800 dark:hover:text-inherit">
                    <div class="flex">
                        <MoonIcon v-if="theme === 'dark'" class="mr-3 h-5 w-5" />
                        <SunIcon v-else-if="theme === 'light'" class="mr-3 h-5 w-5" />
                        <ComputerDesktopIcon v-else class="mr-3 h-5 w-5" />
                        <p>
                            {{ capitalizeFirstLetter(theme) }}</p>
                    </div>
                    <svg :class="{ 'rotate-180': open }" class="ml-2 -mr-1 h-5 w-5 transform transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        <div v-show="open" class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-neutral-100 shadow-lg border dark:bg-neutral-950 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class=" text-gray-700 dark:text-inherit" role="none">
            <!-- Theme options -->
            <p class="flex items-center px-4 py-2 text-sm  hover:bg-neutral-200 dark:hover:bg-neutral-800" role="menuitem" @click.prevent="setThemeClass('system')">
                <ComputerDesktopIcon class="mr-3 h-5 w-5" />
                System
            </p>
            <p class="flex items-center px-4 py-2 text-sm group hover:bg-neutral-200 dark:hover:bg-neutral-800" role="menuitem" @click.prevent="setThemeClass('dark')">
                <MoonIcon class="mr-3 h-5 w-5 dark:group-hover:text-gray-300" />
                Dark
            </p>
            <p class="flex items-center px-4 py-2 text-sm group hover:bg-neutral-200 dark:hover:bg-neutral-800" role="menuitem" @click.prevent="setThemeClass('light')">
                <SunIcon class="mr-3 h-5 w-5 group-hover:text-yellow-600" />
                Light
            </p>
            </div>
        </div>
        </div>
    </div>
  </template>

  <script>
  import { ref } from 'vue';
  import useTheme from '~/composables/useTheme';
  import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/vue/20/solid';

  export default {
    components: {
      MoonIcon,
      SunIcon,
      ComputerDesktopIcon // Replace with the actual icon you want to use for System
    },
    setup() {
      const { theme, setThemeClass } = useTheme();
      
      return {
        theme,
        setThemeClass
      };
    },
    data() {
      return {
        open: false,
        selectedTheme: null,
      }
    },
    methods: {
        capitalizeFirstLetter(string) {
            if (!string) return string; // Return original string if it's empty or not a string
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }
    }
  };
  </script>
