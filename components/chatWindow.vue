<template>
    <!-- Content -->
    <div class="flex flex-col h-full w-full py-8 bg-white" >
        <div class="flex absolute top-0 right-0">
            <div 
                v-if="showSuccess" 
                class="mt-4 py-2 px-4 text-lg text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 shadow-md transition-transform transform"
                :class="{ '-translate-x-full opacity-0': !showSuccess, 'translate-x-0 opacity-100': showSuccess }"
            >   
                <ClientOnly>
                    <i class="fas fa-square-check mr-2"></i>
                </ClientOnly>
                {{successMessage}}
            </div>
            <div 
                v-if="showFailure" 
                class="fixed top-4 right-4 py-2 px-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 shadow-md transition-transform transform"
                :class="{ 'translate-x-full opacity-0': !showFailure, 'translate-x-0 opacity-100': showFailure }"
            >   
                <ClientOnly>
                    <i class="fas fa-square-xmark mr-2"></i>
                </ClientOnly>
                    {{failureMessage}}
            </div>
        </div>
        

        <div class="flex justify-center items-center pb-4 border-b border-gray-200"  >
            
            <div class="flex space-x-4 bg-white px-2 " v-if="noChatFound">


                <!-- GPT-3.5 Card -->
                <div class="flex parent-card items-center space-x-2 bg-white p-2 px-4 rounded-lg border-2 border-gray-200 hover:border-gray-300">
                    <div class="p-3 rounded-full hover:scale-110">
                        <!-- Put your GPT icon here -->
                        <div style="background-color: rgb(25, 195, 125);" class="w-7 h-7  p-1.5 rounded-full flex items-center justify-center ">
                            <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" class="h-6 w-6 text-white" role="img"><text x="-9999" y="-9999">ChatGPT</text><path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path></svg>
                        </div>
                    </div>
                    <div>
                        <p class="font-semibold text-md">GPT-3.5</p>
                        <p class="text-gray-500 text-xs">Temperature: 0</p>
                    </div>
                </div>
                

                <!-- Data Sources Card -->
                <div @click="showModal = true" class="flex parent-card items-center space-x-2 bg-white p-2 px-4 rounded-lg border-2 border-gray-200 hover:border-gray-300">
                    <div class="p-3 rounded-full hover:scale-110 hover:text-sky-600">
                        <!-- Put your GPT icon here -->
                        <ClientOnly>
                            <i class="fa-solid fa-database w-7 h-7"></i>
                        </ClientOnly> 
                    </div>
                    
                    <div>       
                        <p class="font-semibold text-md">Data Sources</p>
                        <p class="text-gray-500 text-xs">{{ getActiveDataSourcesCount() }} active</p>
                    </div>     
                </div>

            </div> 
            <div v-else v-show="!isLoading" class="flex flex-col items-center justiy-center">
                <div class="flex">
                    <h1 class="text-xl font-semibold m-1">{{ conversationTitle }}</h1>
                </div>

                <div class="flex items-center text-gray-500 text-sm">
                    <svg class="mr-1 fill-gray-500" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7.39804 12.8085C7.57428 12.9328 7.78476 12.9994 8.00043 12.999C8.21633 12.9992 8.42686 12.9317 8.60243 12.806C8.77993 12.6755 8.91464 12.4952 8.98943 12.288L9.43643 10.915C9.55086 10.5707 9.74391 10.2578 10.0003 10.0011C10.2566 9.74436 10.5693 9.55089 10.9134 9.436L12.3044 8.98499C12.4564 8.93064 12.5936 8.84184 12.7055 8.72555C12.8174 8.60926 12.9008 8.46865 12.9492 8.31473C12.9977 8.1608 13.0098 7.99776 12.9847 7.83836C12.9596 7.67897 12.8979 7.52756 12.8044 7.396C12.6703 7.21007 12.4794 7.07283 12.2604 7.005L10.8854 6.558C10.5409 6.44377 10.2278 6.2508 9.97087 5.99441C9.71396 5.73803 9.52035 5.42528 9.40543 5.081L8.95343 3.693C8.88113 3.49069 8.74761 3.31593 8.57143 3.193C8.43877 3.09927 8.28607 3.03779 8.12548 3.01344C7.96489 2.9891 7.80083 3.00256 7.64636 3.05275C7.49188 3.10295 7.35125 3.1885 7.23564 3.3026C7.12004 3.41669 7.03265 3.55619 6.98043 3.71L6.52343 5.11C6.40884 5.44482 6.21967 5.74923 5.97022 6.00025C5.72076 6.25126 5.41753 6.44232 5.08343 6.559L3.69243 7.007C3.54065 7.06139 3.40352 7.15017 3.29177 7.26638C3.18001 7.3826 3.09666 7.5231 3.04824 7.67688C2.99982 7.83067 2.98764 7.99357 3.01265 8.15285C3.03767 8.31213 3.0992 8.46346 3.19243 8.595C3.32027 8.77445 3.50105 8.90942 3.70943 8.981L5.08343 9.42599C5.52354 9.57248 5.90999 9.84682 6.19343 10.214C6.35585 10.4246 6.4813 10.6613 6.56443 10.914L7.01643 12.305C7.08846 12.5083 7.22179 12.6842 7.39804 12.8085ZM13.5353 16.851C13.6713 16.9472 13.8337 16.9989 14.0003 16.999C14.1654 16.9991 14.3264 16.9481 14.4613 16.853C14.6008 16.7545 14.7058 16.6146 14.7613 16.453L15.0093 15.691C15.0625 15.5326 15.1515 15.3885 15.2693 15.27C15.3867 15.1515 15.5307 15.0627 15.6893 15.011L16.4613 14.759C16.619 14.7045 16.7557 14.6021 16.8523 14.466C16.9257 14.363 16.9736 14.2441 16.9921 14.119C17.0106 13.9939 16.9992 13.8662 16.9588 13.7463C16.9184 13.6265 16.8501 13.518 16.7597 13.4296C16.6692 13.3412 16.5591 13.2756 16.4383 13.238L15.6743 12.989C15.5162 12.9365 15.3724 12.8478 15.2544 12.7302C15.1364 12.6125 15.0473 12.469 14.9943 12.311L14.7423 11.538C14.6886 11.3802 14.586 11.2436 14.4493 11.148C14.3473 11.0751 14.2295 11.0271 14.1056 11.0081C13.9816 10.989 13.8549 10.9994 13.7357 11.0383C13.6164 11.0772 13.508 11.1436 13.4192 11.2322C13.3304 11.3207 13.2636 11.4289 13.2243 11.548L12.9773 12.31C12.925 12.4677 12.8375 12.6113 12.7213 12.73C12.6066 12.8465 12.4667 12.9351 12.3123 12.989L11.5393 13.241C11.3803 13.2949 11.2422 13.3975 11.1447 13.5343C11.0472 13.671 10.9952 13.835 10.9961 14.0029C10.997 14.1708 11.0507 14.3342 11.1496 14.47C11.2486 14.6057 11.3877 14.7068 11.5473 14.759L12.3103 15.006C12.4692 15.0594 12.6136 15.1487 12.7323 15.267C12.8505 15.3853 12.939 15.5299 12.9903 15.689L13.2433 16.463C13.2981 16.6195 13.4001 16.7551 13.5353 16.851Z"/></svg>
                    <p>GPT-3.5</p>                    
                </div>
            </div>
            <DataSourcesModal 
                :show-modal="showModal" :data-sources="dataSources" :selected-data-type="selectedDataType"  
                :current-page="currentPage" :total-items="totalItems" :items-per-page="itemsPerPage"
                :is-fetching-data="isFetchingDataSource"
                @close-modal="showModal = false"
                @update-page="updatePage"
                @failure="onShowFailure" @success="onShowSuccess"/>
        </div>


        <div class="flex-grow overflow-y-auto mb-4 border-b border-gray-200">
               
            
    
            <div class="flex justify-center p-2"
            :class="noChatFound ? 'flex-col h-full' : ''"
            >
                <div class="flex justify-center items-center" v-if="noChatFound">
                    <div class="flex justify-center items-center flex-col">
                    <img src="~~/assets/logos/No-chats-found.jpg" alt="No Chat Found" class="md:w-1/3 max-lg:w-1/2"> 
                    <h1 class="text-4xl font-semibold m-1">No chats yet</h1>
                    <p class="text-2xl m-1">Start a new chat by typing a message below
                    </p>
                    <ClientOnly>
                        <i class="mt-2 p-1 fas fa-arrow-down fa-xl"></i> 
                    </ClientOnly>
                    
                </div>
                </div>
                <div class="w-auto px-4 overflow-y-auto" ref="chatWindow" >
                    <LoadingIndicator v-show="isLoading"/>

                    <div v-for="(user_message, index) in user_messages" :key="user_message.content">
                        <div class="my-4" >
                            <div class="flex items-start justify-end">
                                <!-- User Message -->
                                <div class="bg-sky-500 text-white shadow rounded-b-lg rounded-l-lg px-4 mr-2 prose break-words" >
                                    <div v-html="renderMarkdown(user_message.content)"></div>
                                </div>
                                <img :src="avatar_url" alt="User Avatar" class="w-10 h-10 rounded-full">
                            </div>
                        </div>

                        <!-- Chatbot Message -->
                        <div class="my-4 pb-2">
                            <div class="flex items-start w-auto">
                                <div style="background-color: rgb(25, 195, 125);" class="w-10 h-10 rounded-full mr-1 flex items-center justify-center">
                                    <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" class="h-6 w-6 text-white" role="img"><text x="-9999" y="-9999">ChatGPT</text><path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path></svg>
                                </div>
                                <div class="flex flex-col bg-sky-50 text-black shadow rounded-b-lg rounded-r-lg py-2 px-6 ml-2" v-if="ai_messages[index]">
                                    <div v-html="renderMarkdown(ai_messages[index].content)" class="pt-2 inline-block break-words prose"></div>
                                    <div v-show="ai_messages[index].source_documents" class="pb-2 mt-1">
                                        <Disclosure v-slot="{ open }">
                                            <DisclosureButton
                                            class="flex w-full border border-gray-300 rounded-full bg-white px-4 py-2 my-2 text-left text-sm font-medium text-gray-900 hover:bg-sky-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
                                            >
                                            <span class="bg-gray-300 rounded-full px-3 font-semibold" v-if="sourcesExists(index)"> {{ai_messages[index].source_documents.length}} </span>
                                            <div class="flex w-full justify-between ml-2">
                                                <p class="font-semibold" v-if="sourcesGreaterThanOne(index)">sources</p>
                                                <p class="font-semibold" v-else>source</p>
                                                <ChevronUpIcon
                                                    :class="open ? 'rotate-180 transform' : ''"
                                                    class="h-5 w-5 text-gray-500"
                                                />
                                            </div>
                                            </DisclosureButton>
                                            <DisclosurePanel class="px-4 pb-2 text-sm text-gray-500">
                                                <div v-for="(source_document, source_index) in ai_messages[index].source_documents" :key="source_index" class="flex break-words prose">
                                    
                                                    <div class="w-full link-container flex flex-col  py-2 px-4 my-2 rounded-full bg-white border border-gray-300 text-sm font-medium hover:bg-sky-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75" v-if="checkURLExists(source_document)">
                                                        
                                                        <span> 
                                                            {{ source_document.metadata.source }}: 
                                                            <a :href="source_document.metadata.url" target="_blank" class="mr-1.5"> 
                                                            {{ source_document.metadata.url }} </a> 
                                                            <ClientOnly>
                                                                <i class="fas fa-solid fa-arrow-up-right-from-square link-icon"></i>
                                                            </ClientOnly>

                                                        </span>
                                                    </div>
                                                
                                                    <div class="flex flex-col w-full" v-else>
                                                        <Disclosure v-slot="{ open }">
                                                            <DisclosureButton
                                                            class="flex w-full border border-gray-300 justify-between rounded-full bg-white px-4 py-2 my-2 text-left text-sm font-medium text-gray-900 hover:bg-sky-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
                                                            >
                                                            <span v-if="checkPageExists(source_document)"> {{ source_document.metadata.source }}, p. {{ source_document.metadata.page }}</span>
                                                            <span v-else> {{ source_document.metadata.source }}</span>
                                                            <ChevronUpIcon
                                                                :class="open ? 'rotate-180 transform' : ''"
                                                                class="h-5 w-5 text-gray-500"
                                                            />
                                                            </DisclosureButton>
                                                            <DisclosurePanel class="px-4 pb-2 text-sm text-gray-500">
                                                                <div v-html="renderMarkdown(source_document.page_content)"></div>
                                                            </DisclosurePanel>
                                                        </Disclosure>
                                                    </div>
                                                </div>
                                            </DisclosurePanel>
                                        </Disclosure>
                                    </div>
                                </div>
                                

                                <div class="bg-sky-50 text-black shadow rounded-b-lg rounded-r-lg inline-block py-2 px-6 ml-2" v-else-if="loading_ai_response">
                                    <div class="space-x-1.5">
                                        <ClientOnly>
                                            <i class="fa-solid fa-square fa-beat-fade fa-2xs" style="--fa-animation-delay: 0s;--fa-fade-opacity: 0.1;"></i>
                                            <i class="fa-solid fa-square fa-beat-fade fa-2xs" style="--fa-animation-delay: 0.3s;--fa-fade-opacity: 0.1;"></i>
                                            <i class="fa-solid fa-square fa-beat-fade fa-2xs" style="--fa-animation-delay: 0.6s;--fa-fade-opacity: 0.1;"></i>
                                        </ClientOnly>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>


        <!-- Message Input -->
        <div class="flex items-center justify-center w-auto">
            <div class="rounded-xl flex items-center px-2 border-2 border-gray-200 w-1/2 hover:border-gray-300">
                <textarea 
                    type="text" 
                    :rows="rows" 
                    class="bg-white w-full px-4 h-auto py-3 rounded-xl focus:outline-none" 
                    placeholder="Type your message..." 
                    name="message"
                    v-model="message" 
                    style="resize: none;"  
                    @keydown.enter.exact.prevent="handleEnterPress"></textarea>
                <button class="py-2 px-4 mr-1 rounded-lg inline-flex items-center " @click.prevent="queryModel" v-if="!loading_ai_response"
                :disabled="isMessageEmpty"
                :class="isMessageEmpty ?'hover:text-gray-500 text-gray-500' : 'hover:bg-sky-500 animated-gradient-bg text-white'"
                >
                    <ClientOnly>
                        <i class="fas fa-paper-plane"></i>
                    </ClientOnly>
                </button>

                <button class="py-2 px-4 text-gray-500 hover:text-black inline-flex items-center" disabled v-else >
                    <ClientOnly>
                        <i class="fas fa-spinner fa-spin"></i>
                    </ClientOnly>
                </button>

            </div>
            <button class="py-2 px-4 ml-2 rounded-full inline-flex items-center" @click="showModal=true" :class="{'hover:text-gray-500 text-gray-500': !hasDataSources, 'hover:border-gray-300 border-2 border-gray-200 text-gray-500': hasDataSources}">
                <ClientOnly>
                    <i class="fas fa-database"></i>
                </ClientOnly>
            </button>
        </div>

    </div>



</template>


<script>
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue';

import { ChevronUpIcon, CheckIcon } from '@heroicons/vue/20/solid';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css';
import ClipboardJS from 'clipboard';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { useAuthStore } from '@/stores/index'
import DataSourcesModal from '@/components/DataSources/modal.vue'

const maxRows = 4;

export default {
    setup() {

        const renderer = new marked.Renderer();

        renderer.code = function(code, lang) {
            if (lang === 'markdown') {
                return marked(code); // render it as markdown content
            }
            let highlightedCode = code;
            if (lang && Prism.languages[lang]) {
                try {
                    highlightedCode = Prism.highlight(code, Prism.languages[lang], lang);
                } catch (error) {
                    console.error(`Error highlighting code with Prism: ${error}`);
                }
            }
            const escapedForHtml = code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
            return `
                <div class="code-block-container">
                    <pre class="language-${lang}"><code>${highlightedCode}</code></pre>
                    <button class="copy-code-button border border-gray-300 text-gray-300 rounded px-1 hover:text-white hover:border-white" data-clipboard-text="${escapedForHtml}">
                        <i class="icon fas fa-copy"></i>
                        <i class="icon fas fa-check" style="display:none;"></i>
                    </button>
                </div>
            `;
        };
        renderer.table = function(header, body) {
            return `
                <div class="overflow-x-auto overflow-y-auto">
                    <table class="min-w-full">
                        <thead>
                            ${header}
                        </thead>
                        <tbody>
                            ${body}
                        </tbody>
                    </table>
                </div>
            `;
        };


        marked.use({
            gfm: true,
            tables: true,
            breaks: true,
            renderer
        });



        // Create a method to render markdown
        const renderMarkdown = (source) => {
            if (!source) {
                return '';
            }
            const correctedSource = source.replace(/\\n/g, '\n').replace(/\\\"/g, '\"');
            const tokens = marked.lexer(correctedSource);

            // Convert the tokens back to HTML
            return marked.parser(tokens);
        };
        return {
            renderMarkdown,
        };

    },
    data() {
        const store = useAuthStore();
        return {
            showModal: false,
            conversationId: '',
            conversationTitle: '',
            message: '',
            copySuccess: new Set(),
            ai_messages: [],
            user_messages: [],
            dataSources: [
                // { id: 1, name: 'Chat', file_type:'chat', selected: true },
            ],
            selectedDataType: [],
            isDropdownOpen: false,
            loading_ai_response: false,
            avatar_url: '/images/avatars/user-default-pic.png',
            file_logo: '/images/chat.png',
            noChatFound: false,
            showFailure: false,
            failureMessage: '',
            showSuccess: false,
            successMessage: '',
            isLoading: true,
            selectedDataSourceName: '',
            pendingUpdates: [],
            isDropdownOpen: false,
            store: store,
            currentPage: 1,
            itemsPerPage: 5,
            totalItems: 0,
            isFetchingDataSource: false,
        };
    },
    async created() {
        const { clearMessagesFlag } = useChat();

        watch(clearMessagesFlag, () => {
            this.user_messages = [];
            this.ai_messages = [];
        })
    },
    async mounted() {
        this.$nextTick(() => {
            const clipboard = new ClipboardJS('.copy-code-button');
            clipboard.on('success', (e) => {
                console.log('Copied to clipboard!');
                const uniqueId = e.trigger.getAttribute('data-unique-id');
                const icons = e.trigger.querySelectorAll('.icon');
                icons[0].style.display = 'none';
                icons[1].style.display = 'inline-block';
                e.trigger.disabled = true; // Disable the button
                setTimeout(() => {
                    icons[1].style.display = 'none';
                    icons[0].style.display = 'inline-block';
                    e.trigger.disabled = false; // Re-enable the button
                }, 1500);
                e.clearSelection();
            });

            clipboard.on('error', (e) => {
            console.log('Failed to copy to clipboard!');
            });
        });

        const supabase = useSupabaseClient()

        await this.getDataSources(supabase)
        
        const user_session = this.store.user_session
        if (user_session && user_session.user.user_metadata.avatar_url) {
            this.setUserAvatar(user_session.user.user_metadata.avatar_url)
        }
        if (this.$route.params.id){
            this.conversationId = this.$route.params.id
            this.user_messages = [];
            this.ai_messages = [];
            this.loadMessages(supabase);
            this.getConversationTitle(supabase, this.conversationId);
        } 
        watchEffect(() => {
            this.isChatFound()
            this.getActiveDataSourcesCount()
            this.selectedDataType = Array.from(this.store.activeDataSources)
        })
        
    },
    computed: {
        rows() {
            const lineBreaks = (this.message.match(/\n/g) || []).length + 1; // Add one for the first line
            return lineBreaks > maxRows ? maxRows : lineBreaks;
        },
        hasDataSources() {
            if (this.isFetchingDataSource) {
                return true;
            }
            return this.dataSources && this.dataSources.length > 0;
        },
        isMessageEmpty() {
            return this.message.trim().length === 0;
        },

    },
    methods: {
        async updatePage(page, refresh = false) {
            this.isFetchingDataSource = true
            this.currentPage = page
            if (refresh){
                this.dataSources = []
            }
            await this.getDataSources()
            this.isFetchingDataSource = false
        },
        async getConversationTitle(supabase, conversationId){
            if (conversationId){
                const { data, error } = await supabase
                .from('conversations')
                .select('title')
                .eq('id', conversationId)
                if (error) {
                    console.log(error)
                    this.onShowFailure(error.message)
                }
                if (data) {
                    this.conversationTitle = data[0].title
                }
            } else {
                return 'Chat'
            }
        },
        sourcesGreaterThanOne(index){
            
            if (
                this.ai_messages[index] && 
                this.ai_messages[index].source_documents && 
                this.ai_messages[index].source_documents.length > 1
            ) {
                return true
            } else {
                return false
            }
        },
        sourcesExists(index){
            if (
                this.ai_messages[index] && 
                this.ai_messages[index].source_documents && 
                this.ai_messages[index].source_documents.length > 0
            ) {
                return true
            } else {
                return false
            }
        },
        isChatFound(){
            if (this.user_messages.length === 0 && this.$route.params.id === undefined) {
                this.isLoading = false;
                this.noChatFound = true;
            } else {
                this.noChatFound = false;
            }
        },
        getSelectedName() {
            const selectedSource = this.dataSources.find(ds => ds.id === this.selectedDataType);
            if (!selectedSource) {
                return 'Select a data source';
            }
            return selectedSource.name;
        },
        setUserAvatar(avatar_url) {
            this.avatar_url = avatar_url;
        },
        getActiveDataSourcesCount() {
            return this.store.activeDataSourcesCount;
        },
        
        async getDataSources( supabase = null ){
            if (!supabase) {
                supabase = useSupabaseClient()
            }
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage - 1;
            const { data, error, count } = await supabase
                .from('data')
                .select('id, user_id, name, content_data, file_type, is_active', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(startIndex, endIndex);

            if (error) {
                console.log(error)
                this.onShowFailure(error.message)
            }

            if (data) {
                this.totalItems = count;
                data.forEach((dataSource) => {
                    this.dataSources.push({
                        id: dataSource.id,
                        name: dataSource.name,
                        user_id: dataSource.user_id,
                        content_data: dataSource.content_data,
                        file_type: dataSource.file_type,
                        is_active: dataSource.is_active,
                    })
                })                                
            }
        },
        highlightCode() {
            this.$nextTick(() => {
            const codeBlocks = document.querySelectorAll('pre code');
                codeBlocks.forEach((code) => {
                    Prism.highlightElement(code);
                });
            });
        },
        initSupabase(){
          return useSupabaseClient()
        },
        checkPageExists(source_document){
            if (typeof source_document.metadata.page === 'number' ) {
                return true
                
            } else {
                return false
            }
        },
        checkURLExists(source_document){
            if (typeof source_document.metadata.url === 'string' ) {
                return true
                
            } else {
                return false
            }
        },
        async getSession(supabase){
          const { data, error } = await supabase.auth.getSession()
          if (error) {
            console.log(error)
            this.onShowFailure(error.message)
          }else{
            return data.session
          }

        },
        async scrollToBottom() {
            await nextTick();

            const chatWindow = this.$refs.chatWindow;
            const scrollBottom = chatWindow.scrollHeight - chatWindow.clientHeight;
            const isScrolledToBottom = Math.abs(chatWindow.scrollTop - scrollBottom) < 5;
            if (isScrolledToBottom) {
            chatWindow.scrollTop = scrollBottom;
            }
        },

        async loadMessages(supabase) {
            const { data: messages, error } = await supabase
                .from('messages')
                .select('id, sender, content, source_documents')
                .order('id', { ascending: true })
                .eq('conversation_id', this.conversationId)

            if (error) {
                this.isLoading = false;
                this.onShowFailure(error.message)
            }else{
                // Assuming the backend returns an array of messages with a sender and data properties
                messages.forEach((message) => {
                    if (message.sender === 'ai') {
                        this.ai_messages.push({"sender": message.sender,"content":message.content, "source_documents": message.source_documents});
                    } else {
                        this.user_messages.push({"sender":message.sender, "content":message.content});
                    }
                });
                this.isLoading = false;
            }

        },
        onShowFailure(message) {
            this.showFailure = true
            this.failureMessage = message
            setTimeout(() => {
                this.showDeleteFailure = false
            }, 3000)
        },
        onShowSuccess(message) {
            this.showSuccess = true
            this.successMessage = message
            setTimeout(() => {
                this.showSuccess = false
            }, 3000)
        },
        async insertData(supabase, table, data){
            const { error } = await supabase
                .from(table)
                .insert(data)

            if (error) {
                console.log(error)
                alert('There was an error saving your data')
            }

        },
        async autoTitle(firstMessage){
            try {   
                const query = `Please summarize the following message as a single sentence of less than 5 words:\n` + firstMessage;
                const formData = new FormData();
                formData.append("query", query);

                const response = await fetch("https://blaizzy--kulissiwa-auto-title-fastapi-app.modal.run", {
                    method: 'POST',
                    body: formData
                });

                if (!response.body) {
                    console.log("No response body")
                }else{
                    return response.json();
                }
                
            } catch (err) {
                console.log(err);
            }

        },
        transformMessage(userMessage) {
            let _type = userMessage.sender;
            let content = userMessage.content;

            let senderName = _type === 'human' ? 'Human' : 'AI';

            return {
                type: _type,
                data: {
                    content: content,
                    additional_kwargs: {
                        // sender_name: senderName
                    }
                }
            };
        },
        combineMessages(user_messages, ai_messages) {
            let combinedMessages = [];
            for (let i = 0; i < Math.max(user_messages.length, ai_messages.length); i++) {
                if (i < user_messages.length) {
                    combinedMessages.push(user_messages[i]);
                }
                if (i < ai_messages.length) {
                    combinedMessages.push(ai_messages[i]);
                }
            }
            return combinedMessages;
        },
        handleEnterPress() {
            if (!this.isMessageEmpty) {
                this.queryModel();
            }
        },
        async queryModel() {
            // Prevent sending if the message is empty or only whitespace

            const supabase = this.initSupabase()
            const user_session = await this.getSession(supabase)

            this.user_messages.push({sender: "human", content: this.message});
            this.message = '';

            this.loading_ai_response = true;
            
            if (this.$route.params.id==undefined && this.conversationId=='') {

                const title = await this.autoTitle(this.user_messages[0].content)
                await this.insertData(supabase, 'conversations', [{user_id: user_session.user.id, title: title.content}])
                const { data, error } = await supabase
                    .from('conversations')
                    .select('id, created_at')
                    .order('created_at', { ascending: false })
                    .limit(1)

                if (error) {
                    console.log(error)
                }
                if (data) {
                    this.conversationId = data[0].id;
                    const { refresh } = useConversations();
                    refresh();
                    
                }
            }

            // get the last user message
            const last_user_message = this.user_messages[this.user_messages.length - 1];
            try {
                const formData = new FormData();
                formData.append("query",last_user_message.content);

                if (this.selectedDataType.length === 0){
                    // Create a history variable that contains list of all user and ai messages
                    // Convert sender key to type
                    // Copy user_messages and ai_messages
                    let user_messages = this.user_messages.slice(0, -1).map(this.transformMessage);
                    let ai_messages = ''
                    if (this.ai_messages.length > 0){
                        ai_messages = this.ai_messages.map(this.transformMessage);
                    }
                    else{
                        ai_messages = [];
                    }
                    // Combine the two lists one element at a time
                    let history = this.combineMessages(user_messages, ai_messages);
                    // Convert the history to a string and append to formData
                    formData.append("history", JSON.stringify({"messages": history}));
                    const response = await fetch("https://blaizzy--kulissiwa-chat-chat.modal.run/", {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.body) {
                        throw new Error('ReadableStream not supported');
                    }
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');

                    let index=''; // Index of the ai_messages array
                    this.scrollToBottom();
                    let result = '';
                    let isFirstIteration = true; // Is this the first iteration of the while loop?
                    while (true) {
                        const { value, done } = await reader.read();
                        
                        if (done) {
                            break;
                        }
                        if (isFirstIteration) {
                            index = this.ai_messages.push({sender: "ai"}) - 1;
                            isFirstIteration = false;
                        }
                        let chunk = decoder.decode(value, { stream: true }).replace(/data: /g, '').trim();
        
                        // Split the chunk by new lines
                        const words = chunk.split('\n');

                        // If there's more than one word, join them into a single string
                        if (words.length > 1) {
                            chunk = words.map(word => word.replace(/^"(.*)"$/, '$1')).join('');
                        }
                       
                        result += chunk.replace(/^"(.*)"$/, '$1');

                        this.ai_messages[index].content = result;
                        
                        this.highlightCode();
                    }
                    
                }
                else{
                    formData.append("data_source", this.selectedDataType);
                    formData.append("namespace", user_session.user.id);
                    

                    const response = await fetch("https://blaizzy--kulissiwa-chat-with-sources-chat-with-sources.modal.run", {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.body) {
                        throw new Error('ReadableStream not supported');
                    }
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    this.scrollToBottom();
                    function isJSON(chunk) {
                        if (typeof chunk !== 'string') return false;
                        // Locate the delimiters
                        let startIndex = chunk.indexOf('||JSON_START||');
                        let endIndex = chunk.indexOf('||JSON_END||');

                        if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
                            return false;
                        }

                        // Extract potential JSON (considering the length of '||JSON_START||' to get the actual JSON start)
                        const potentialJSON = chunk.substring(startIndex + '||JSON_START||'.length, endIndex);


                        try {
                            let parsed = JSON.parse(potentialJSON);  
                            return parsed && typeof parsed === 'object' && Array.isArray(parsed.source_documents) && parsed.source_documents.length >= 0;
                        } catch (e) {
                            return false;
                        }
                    }
                    let result = ''; // The final result
                    let jsonBuffer = ''; // Buffer for potential JSON strings
                    let collectingJSON = false; // Are we currently collecting a JSON string?   
                    let response_dict = '';
                    let index=''; // Index of the ai_messages array
                    let isFirstIteration = true; // Is this the first iteration of the while loop?
                    while (true) {
                        const { value, done } = await reader.read();
                        
                        if (done) {
                            break;
                        }

                        let chunk = decoder.decode(value, { stream: true }).replace(/data: /g, '').trim();
        
                        // Split the chunk by new lines
                        const words = chunk.split('\n');

                        if (isFirstIteration) {
                            index = this.ai_messages.push({sender: "ai"}) - 1;
                            isFirstIteration = false;
                        }
                        // If there's more than one word, join them into a single string
                        if (words.length > 1) {
                            chunk = words.map(word => word.replace(/^"(.*)"$/, '$1')).join('');
                        }
                        if (collectingJSON || chunk.includes('||JSON_START||')) {
                            jsonBuffer += chunk;

                            // Only attempt parsing if we detect the end delimiter
                            if (jsonBuffer.includes('||JSON_END||')) {
                                if (isJSON(jsonBuffer)) {
                                    let cleanedString = jsonBuffer.replace(/[\cA-\cZ]/g, "");
                                    result += cleanedString.split('||JSON_START||')[0];
                                    this.ai_messages[index].content = result;
                                    
                                    let startIndex = cleanedString.indexOf('||JSON_START||');
                                    let endIndex = cleanedString.indexOf('||JSON_END||');
                                    response_dict = JSON.parse(cleanedString.substring(startIndex + '||JSON_START||'.length, endIndex));
                                    if (response_dict.source_documents.length > 0) {
                                        // replace the source id with the source name
                                        if (response_dict.source_documents){ 
                                            response_dict.source_documents.forEach(item => {
                                                let id = item.metadata.source;
                                                item.metadata.source = this.getSourceName(id);
                                            });
                                        }else{
                                            response_dict = {source_documents: []};
                                        }
                                        this.ai_messages[index].source_documents = response_dict.source_documents;
                                        
                                    }

                                    // Reset the buffer and collecting state
                                    jsonBuffer = '';
                                    collectingJSON = false;
                                } else {
                                    // If not a valid JSON, just add to result and reset the buffer and collecting state
                                    result += jsonBuffer;
                                    this.ai_messages[index].content = result;
                                    jsonBuffer = '';
                                    collectingJSON = false;
                                }
                            } else {
                                collectingJSON = true;
                            }
                        } else {
                            result += chunk.replace(/^"(.*)"$/, '$1');
                            this.ai_messages[index].content = result;
                        }
                        this.highlightCode();
                    }
                    
                } 
            } catch (err) {
                console.log(err);
            } finally {
                this.loading_ai_response = false;
            }

            await this.insertData(
                supabase,
                'messages',
                [
                    {
                        conversation_id: this.conversationId, 
                        sender: this.user_messages[this.user_messages.length - 1]["sender"], content: this.user_messages[this.user_messages.length - 1]["content"] , 
                        source_documents: []
                    },
                    {
                        conversation_id: this.conversationId,
                        sender: this.ai_messages[this.ai_messages.length - 1]["sender"], content: this.ai_messages[this.ai_messages.length - 1]["content"], 
                        source_documents: this.ai_messages[this.ai_messages.length - 1]["source_documents"]
                    }
                ]
            )

        },
        getSourceName(id){
            const matchingDataSource =  this.dataSources.find(dataSource => dataSource.id == id);
            return matchingDataSource ? matchingDataSource["name"] : "Unknown";
        }
    },
    watch: {
        user_messages: {
            handler: function (val, oldVal) {
                this.highlightCode();
            },
            deep: true
        },
        ai_messages: {
            handler: function (val, oldVal) {
                this.highlightCode();
            },
            deep: true
        },
        
    },
    components: {
    LoadingIndicator,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    ChevronUpIcon,
    CheckIcon,
    parse,
    DataSourcesModal
}

};
</script>

<style>
/* Hide the link icon by default */
.link-icon {
    visibility: hidden;
    transition: visibility 0.3s; /* optional: smooth visibility transition */
}

/* Show the link icon on container hover */
.link-container:hover .link-icon {
    visibility: visible;
}

.parent-card:hover .hover\:scale-110 {
    transform: scale(1.10);
}
.parent-card:hover .hover\:text-sky-600 {
    color: #0284c7;
}
</style>
