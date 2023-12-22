<template>
    <!-- Mobile Navbar -->
    <div class="lg:hidden flex fixed bottom-0 left-0 z-10 h-16 w-full mt-2 bg-white border-t border-gray-200 dark:bg-neutral-900 dark:border-none">
        <div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium ">
            <NuxtLink to="/documents" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-600">
                    <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
                    <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
                    <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
                    <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
                </svg>
                <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-sky-500 dark:group-hover:text-sky-600">Documents</span>
            </NuxtLink>
            <NuxtLink to="/chats/list" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-neutral-800 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-600">
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                </svg> 
                <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-sky-500 dark:group-hover:text-sky-600">Chats</span>
            </NuxtLink>
            <NuxtLink to="/settings/account" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-neutral-800 group">
                <svg class="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"/>
                </svg>
                <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-600">Settings</span>
            </NuxtLink>
            
        </div>
    </div>
</template>
<script>

</script>
