<template>
    <!-- Chat Side Navbar -->
    <div class="flex flex-col items-center bg-white border-r border-gray-200 dark:bg-neutral-950 dark:border-neutral-800 dark:text-gray-400" >
        <div class="flex items-center justify-between w-4/5 lg:w-1/3 px-4">
            <div class="flex pb-4 pt-4 relative">
                <h1 class="text-2xl dark:text-gray-200">Chats</h1>
            </div>
           
        </div>

        <hr class="w-full border-gray-200 dark:border-neutral-800" />

        <div class="flex justify-center items-center w-4/5 lg:w-1/3 px-4 py-2 mt-4">
            <div class="text-sm mt-auto rounded-full flex items-center px-2 w-full mr-2 border-2 border-gray-200 hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-500">
                <button class="px-2 text-gray-500 hover:text-black inline-flex items-center">
                    <ClientOnly>
                        <i class="fas fa-search"></i>
                    </ClientOnly>
                </button>
                <input type="search"  class="w-full px-1 py-2 rounded-full focus:outline-none  bg-inherit" name="search_bar" placeholder="Search chats..." v-model="searchQuery" @keyup.prevent="onKeyup">
                <button @click="clearSearch" v-show="searchQuery.length>0" class="px-2 text-gray-500 hover:text-black inline-flex items-center dark:hover:text-inherit">
                    <ClientOnly>
                        <i class="fas fa-times"></i>
                    </ClientOnly>
                </button>
            </div>
            <div class="font-semibold p-1.5 rounded-full border-2 hover:bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:text-gray-300">
                    <nuxt-link to="/chats" @click="clearMessages">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>

                    </nuxt-link>
                </div>
        </div>
        <div class="w-4/5 lg:w-1/3 px-4" v-if="!noDataFound">
            <h2 class="text-md font-semibold pb-2 pt-4">Conversations</h2>     
        </div>
        <div class="lg:overflow-y-auto w-4/5 lg:w-1/3 px-4 mt-4 bg-neutral-100/50 dark:bg-neutral-900 rounded-lg">

            <ListSkeleton v-show="isLoading" v-for="i in 5" :key="i" />
            <div v-for="(conversation, index) in conversations" :key="conversation.id" class="rounded-lg">
                <!-- <h2 class="text-xl font-semibold mb-2">Today</h2> -->
                <NuxtLink
                        :to="`/chats/${conversation.id}`" 
                        
                        >
                    <div
                        class="p-2 hover:text-sky-500 dark:hover:bg-inherit dark:hover:text-sky-600"
                        :class="{
                            'bg-neutral-100 dark:bg-neutral-800': isSelectedConversation(conversation.id) && !isNewChat(),
                            }"
                        @click="setConversation(conversation.id)"
                    >

                        <div class="flex items-center justify-between">

                            <div class="flex items-center">
                                <span v-show="showDeleteConfirmation && isSelectedConversation(conversation.id)"
                                class="mr-1 ">
                                    <ClientOnly>
                                        <i class="fas fa-trash-alt text-gray-600 dark:text-gray-500"></i>
                                    </ClientOnly>
                                </span>
                                <p v-show="!showTitleEditConfirmation || !isSelectedConversation(conversation.id)" class="text-md p-2 py-4" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 150px;"
                                :class="{'typed-title': !typedTitle && isSelectedConversation(conversation.id)}">
                                    {{ conversation.title }}
                            
                                </p>
                                
                                <input
                                v-show="showTitleEditConfirmation && isSelectedConversation(conversation.id)"
                                type="text" class="text-md p-2 text-gray-600 rounded-md border border-sky-500 dark:bg-neutral-800 dark:text-inherit dark:border-neutral-700" 
                                name="title" v-model="conversationTitle"
                                @change="onTitleInputChange(conversation)">
                            </div>
                            
                            <div
                                class="flex items-center space-x-2"  
                            >
                            <div class="relative inline-block" v-show="!showTitleEditConfirmation && !showDeleteConfirmation">
                                <div>
                                    <button @click.prevent="open = !open" type="button" id="menu-button" class="rounded-full py-1 hover:bg-neutral-200/50 text-sm font-medium text-black dark:bg-inherit dark:hover:bg-neutral-800 dark:text-gray-400" aria-expanded="open" aria-haspopup="true">
                                        
                                        <!-- Heroicon name: chevron-down -->
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                                            <path fill-rule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
                                        </svg>

                                    </button>
                                </div>

                                <div v-if="open && isSelectedConversation(conversation.id)" class="z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md bg-white border dark:bg-neutral-950 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                    <div class="text-black dark:text-gray-400">
                                        <p  @click.prevent="toggleTitleEditConfirmation(conversation.id)" class="flex items-center px-2 py-2 hover:bg-neutral-100/50 dark:hover:bg-neutral-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 pr-1">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                            </svg>
                                            Edit Title
                                        </p>
                                        <p @click.prevent="toggleDeleteConfirmation(conversation.id)" class="flex items-center px-2 py-2 hover:bg-neutral-100/50 dark:hover:bg-neutral-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 pr-1">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>

                                            Delete Chat
                                        </p>
                                    </div>
                                </div>
                            </div>

                                
                                <button v-show="showDeleteConfirmation && isSelectedConversation(conversation.id)"
                                @click.prevent="deleteConversation(conversation.id)">
                                    <ClientOnly>
                                        <i class="fas fa-check text-gray-600 hover:text-green-400 dark:text-gray-500 dark:hover:text-green-400"></i>
                                    </ClientOnly>
                                </button>
                                <button v-show="showDeleteConfirmation && isSelectedConversation(conversation.id)"
                                @click.prevent="toggleDeleteConfirmation(conversation.id)">
                                    <ClientOnly>
                                        <i class="fas fa-xmark text-gray-600 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500"></i>
                                    </ClientOnly>
                                </button>
                                <button v-show="showTitleEditConfirmation && isSelectedConversation(conversation.id)"
                                @click.prevent="editConversationTitle(conversation)">
                                    <ClientOnly>
                                        <i class="fas fa-check text-gray-600 hover:text-green-400 dark:text-gray-500 dark:hover:text-green-400"></i>
                                    </ClientOnly>
                                </button>
                                <button v-show="showTitleEditConfirmation && isSelectedConversation(conversation.id)"
                                @click.prevent="toggleTitleEditConfirmation(conversation.id)">
                                    <ClientOnly>
                                        <i class="fas fa-xmark text-gray-600 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500"></i>
                                    </ClientOnly>
                                </button>

                            </div>
                            
                        </div>
                        
                    </div>
                    <hr class=" border-gray-200 dark:border-neutral-800" v-if="index < conversations.length - 1"/>
                </NuxtLink>
                
                
            </div>
            
 

        </div>
        <div class="flex items-center justify-center pt-4">
                <button @click="nextPage()" 
                class="px-2 py-1 border-2 border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 inline-flex items-center dark:bg-inherit dark:border-neutral-700 dark:hover:border-neutral-500" 
                :class="{'hidden': currentPage === totalPages}"
                v-if="!noDataFound && !isLoading">
                    <ClientOnly>
                        <i class="fa-solid fa-plus"></i> <span class="pl-2">Load more</span>
                    </ClientOnly>
                </button>
            </div>
    </div>
</template>

<script>
import Fuse from 'fuse.js';
import ConversationsSkeleton from './ListSkeleton.vue';

export default {
    setup() {
        const { clearMessages } = useChat();
        return {
            clearMessages,
        };
    },
    data() {
        return {
            open: false,
            conversations: [],
            selectedConversation: null,
            showDeleteConfirmation: false,
            conversationTitle: '',
            showTitleEditConfirmation: false,
            typedTitle: '',
            searchQuery: '',
            conversations_copy: [],
            debounceTimeout: null,
            isLoading: true,
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            isFetchingDataSource: false,
        };
    },
    async created() {
        const { refreshConversations } = useConversations();
        watch(refreshConversations, () => {
            this.updateConversations();
        });
    },
    mounted() {
        this.getConversations();
        this.conversations_copy = this.conversations;
        if (this.showDeleteConfirmation == true) {
            this.showDeleteConfirmation = false;
        }
        if (this.showTitleEditConfirmation == true) {
            this.showTitleEditConfirmation = false;
        }
        this.selectedConversation = this.$route.params.id ? this.$route.params.id : null;
    },
    methods: {
        clearSearch() {
            this.searchQuery = '';
            this.onKeyup();
        },
        async nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;    
                await this.updatePage(this.currentPage, true);
    
            }
        },
        async updatePage(page, refresh = false) {
            this.isFetchingDataSource = true
            this.currentPage = page
            if (refresh){
                this.dataSources = []
            }
            await this.getConversations()
            this.isFetchingDataSource = false
        },
        searchWithFuse(query) {
            const options = {
                keys: ['name'],
                threshold: 0.3  // Adjust based on your needs
            };

            const fuse = new Fuse(this.conversations_copy, options);
            return fuse.search(query).map(result => result.item);
        },
        async searchConversations() {
            try {
                if (this.searchQuery === '') {
                    this.conversations = this.conversations_copy;
                    return
                }

                const fuseResults = this.searchWithFuse(this.searchQuery);

                if (fuseResults.length > 0) {
                    this.conversations = fuseResults;
                } else {
                    const supabase = useSupabaseClient()
                    const { data, error } = await supabase
                        .from('conversations')
                        .select('*')
                        .textSearch('title', `'${this.searchQuery}'`)

                    if (error) {
                        this.$emit("error", error.message)
                    }
                    if (data) {
                        this.conversations = data
                    }
                }
            }
            catch (error) {
                const message = `An error occurred while searching for conversations: ${error}`;
                console.error(message);
            }
        },
        onKeyup() {
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
            }
            this.debounceTimeout = setTimeout(() => {
                this.searchConversations();
            }, 300);
        },
        beforeDestroy() {
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
            }
        },
        async updateConversations() {
            await this.getConversations(true);
            if (this.conversations.length > 0) {
                this.$route.params.id = this.conversations[0].id;
                this.setConversation(this.conversations[0].id);
                this.typeTitle(this.conversations[0].title);
            }
        },
        async typeTitle(title) {
            this.typedTitle = title; // Use 'this' to access typedTitle
            this.conversations[0].title = ''; // Use 'this' to access typedTitle
            for (let i = 0; i < this.typedTitle.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 100)); // adjust the speed of typing here
                this.conversations[0].title += this.typedTitle[i]; // Use 'this' to access typedTitle
            }
        },
        async initSupabase() {
            return useSupabaseClient();
        },
        setConversation(id) {
            if (this.selectedConversation !== id) {
                this.showDeleteConfirmation = false;
                this.showTitleEditConfirmation = false;
            }
            this.selectedConversation = id;
            this.conversationTitle = this.conversations.find(conversation => conversation.id === id).title;
            // Only type out the title if this is the first conversation
            if (this.selectedConversation === this.conversations[0].id) {
            }
        },
        async getConversations(refresh = false) {
            const supabase = await this.initSupabase();
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage - 1;
            const { data, error, count } = await supabase
                .from('conversations')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(startIndex, endIndex);

            if (error) {
                console.log(error);
            }
            else {
                if (data) {
                    this.totalItems = count;
                    if (refresh) {
                        this.conversations = [];
                    }
                    data.forEach(conversation => {
                        this.conversations.push(conversation);
                    });
                }
            }
            this.isLoading = false;
        },
        async deleteConversation() {
            const supabase = await this.initSupabase();
            const { data, error } = await supabase
                .from('conversations')
                .delete()
                .eq('id', this.selectedConversation);
            if (error) {
                console.log('ID' + this.selectedConversation);
                console.log(error);
            }
            else {
                // remove from conversations from array
                this.conversations = this.conversations.filter(conversation => conversation.id !== this.selectedConversation);
                this.selectedConversation = null;
                this.showDeleteConfirmation = false;
                if (this.$route.params.id) {
                    this.$router.push('/chats');
                    if (this.$route.name == 'chats') {
                        window.location.reload(true);
                    }
                }
                else {
                    await this.getConversations(true);
                }
            }
        },
        async editConversationTitle(conversation) {
            const supabase = await this.initSupabase();
            const { data, error } = await supabase
                .from('conversations')
                .update({ title: this.conversationTitle })
                .eq('id', conversation.id);
            if (error) {
                console.log(error);
            }
            else {
                this.showTitleEditConfirmation = false;
                this.conversations = this.conversations.map(item => {
                    if (item.id === conversation.id) {
                        return {
                            ...conversation,
                            title: this.conversationTitle
                        };
                    }
                    return item;
                });
            }
        },
        toggleDeleteConfirmation(id) {
            this.selectedConversation = id;
            if (this.showDeleteConfirmation) {
                this.showDeleteConfirmation = false;
            }
            else {
                this.showDeleteConfirmation = true;
            }
        },
        toggleTitleEditConfirmation(id) {
            this.selectedConversation = id;
            if (this.showTitleEditConfirmation) {
                this.showTitleEditConfirmation = false;
            }
            else {
                this.showTitleEditConfirmation = true;
            }
        },
        isSelectedConversation(id) {
            return this.selectedConversation === id;
        },
        onTitleInputChange(conversation) {
            conversation.title = this.conversationTitle;
        },
        isNewChat() {
            return this.$route.params.id ? false : true;
        },
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },
        noDataFound() {
            return this.conversations.length == 0 && !this.isLoading;
        },
    },
    components: { ConversationsSkeleton }
}
</script>

<style>

.typed-title::after{
    font-size: 1.5em;
    white-space: pre;
    overflow: hidden;
    border-right: .3em solid black;  /* make cursor bigger and black */
    animation: blink 1s steps(1) infinite;
}
@keyframes blink {
  50% { border-color: black; }
}

</style>