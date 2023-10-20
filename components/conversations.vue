<template>
    <!-- Chat Side Navbar -->
    <div class="flex flex-col h-full w-80 bg-white p-4 border-r border-gray-200" >
        <div class="mb-2">
            <div class="flex justify-between items-center bg-white p-2">
                <h1 class="text-xl font-semibold">Chats</h1>
                <div class="font-semibold p-2 rounded-full hover:bg-sky-50">
                    <nuxt-link to="/chats" @click.native="clearMessages">
                        <img src="~~/assets/icons/icons8-new-message-24.png" alt="Chatbot Avatar" class="w-5 h-5">
                    </nuxt-link>
                </div>

            </div>
        </div>

        <div class="flex justify-center items-center mb-4">
            <div class="text-sm mt-auto bg-white rounded-full flex items-center w-full border-2 border-gray-200 hover:border-gray-300 ">
                <button class="px-2 text-gray-500 hover:text-black inline-flex items-center">
                    <ClientOnly>
                        <i class="fas fa-search"></i>
                    </ClientOnly>
                </button>
                <input type="search"  class="w-full px-1 py-2 rounded-full focus:outline-none" name="search_bar" placeholder="Search chats..." v-model="searchQuery" @keyup.prevent="onKeyup">
                <button @click="clearSearch" v-show="searchQuery.length>0" class="px-2 text-gray-500 hover:text-black inline-flex items-center">
                    <ClientOnly>
                        <i class="fas fa-times"></i>
                    </ClientOnly>
                </button>
            </div>
        </div>
        <div class="overflow-y-auto">

            <ListSkeleton v-show="isLoading" v-for="i in 5" :key="i" />
            <div class="mb-4" v-for="conversation in conversations" :key="conversation.id">
                <!-- <h2 class="text-xl font-semibold mb-2">Today</h2> -->
                <nuxt-link
                        :to="`/chats/${conversation.id}`" >
                <div
                    class="p-3 rounded-full"
                    :class="{
                        'bg-sky-100': isSelectedConversation(conversation.id) && !isNewChat(),
                        'hover:bg-sky-50': !isSelectedConversation(conversation.id)}"
                    @click="setConversation(conversation.id)"
                >

                        <div class="flex items-center justify-between">

                            <div class="flex items-center">
                                <span v-show="showDeleteConfirmation && isSelectedConversation(conversation.id)"
                                class="mr-1 ">
                                    <ClientOnly>
                                        <i class="fas fa-trash-alt text-gray-600"></i>
                                    </ClientOnly>
                                </span>
                                <p v-show="!showTitleEditConfirmation || !isSelectedConversation(conversation.id)" class="text-sm text-gray-600" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 150px;"
                                :class="{'typed-title': !typedTitle && isSelectedConversation(conversation.id)}">
                                    {{ conversation.title }}
                            
                                </p>
                                <input
                                v-show="showTitleEditConfirmation && isSelectedConversation(conversation.id)"
                                type="text" class="text-sm text-gray-600 border border-sky-500" 
                                name="title" v-model="conversationTitle"
                                @change="onTitleInputChange(conversation)">
                            </div>
                            <div
                                class="flex items-center space-x-2"
                                v-show="isSelectedConversation(conversation.id) && !isNewChat()"
                            >
                                <button v-show="!showDeleteConfirmation && !showTitleEditConfirmation"
                                @click.prevent="toggleTitleEditConfirmation()">
                                    <ClientOnly>
                                        <i class="fas fa-pencil text-gray-600 hover:text-black"></i>
                                    </ClientOnly>
                                </button>

                                <button v-show="!showDeleteConfirmation && !showTitleEditConfirmation"
                                @click.prevent="toggleDeleteConfirmation()">
                                    <ClientOnly>
                                        <i class="fas fa-trash text-gray-600 hover:text-black"></i>
                                    </ClientOnly>
                                </button>

                                <button v-show="showDeleteConfirmation"
                                @click.prevent="deleteConversation()">
                                    <ClientOnly>
                                        <i class="fas fa-check text-gray-600 hover:text-green-400"></i>
                                    </ClientOnly>
                                </button>
                                <button v-show="showDeleteConfirmation"
                                @click.prevent="toggleDeleteConfirmation()">
                                    <ClientOnly>
                                        <i class="fas fa-xmark text-gray-600 hover:text-red-500"></i>
                                    </ClientOnly>
                                </button>
                                <button v-show="showTitleEditConfirmation"
                                @click.prevent="editConversationTitle(conversation)">
                                    <ClientOnly>
                                        <i class="fas fa-check text-gray-600 hover:text-green-400"></i>
                                    </ClientOnly>
                                </button>
                                <button v-show="showTitleEditConfirmation"
                                @click.prevent="toggleTitleEditConfirmation()">
                                    <ClientOnly>
                                        <i class="fas fa-xmark text-gray-600 hover:text-red-500"></i>
                                    </ClientOnly>
                                </button>

                            </div>
                        </div>

                    </div>
                </nuxt-link>

            </div>
            <div class="flex items-center justify-center">
                <button @click="nextPage()" 
                class="px-2 py-1 text-black border-2 border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 hover:text-black inline-flex items-center" 
                :class="{'hidden': currentPage === totalPages}"
                v-if="!noDataFound && !isLoading">
                    <ClientOnly>
                        <i class="fa-solid fa-plus"></i> <span class="pl-2">Load more</span>
                    </ClientOnly>
                </button>
            </div>
 

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
                .eq('id', this.selectedConversation);
            if (error) {
                console.log(error);
            }
            else {
                this.showTitleEditConfirmation = false;
                this.conversations = this.conversations.map(conversation => {
                    if (conversation.id === this.selectedConversation) {
                        return {
                            ...conversation,
                            title: this.conversationTitle
                        };
                    }
                    return conversation;
                });
            }
        },
        toggleDeleteConfirmation() {
            if (this.showDeleteConfirmation) {
                this.showDeleteConfirmation = false;
            }
            else {
                this.showDeleteConfirmation = true;
            }
        },
        toggleTitleEditConfirmation() {
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