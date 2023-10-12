<template>
    <!-- Chat Side Navbar -->
    <div class="flex flex-col h-full w-80 bg-white p-4 border-r border-gray-200" >
        <div class="mb-2">
            <div class="flex justify-between items-center bg-white p-2">
                <h1 class="text-2xl font-semibold">Chats</h1>
                <div class="font-semibold p-2 rounded-full hover:bg-sky-50">
                    <nuxt-link to="/chats" @click.native="clearMessages">
                        <img src="~~/assets/icons/icons8-new-message-24.png" alt="Chatbot Avatar" class="w-5 h-5">
                    </nuxt-link>
                </div>

            </div>
        </div>

        <div class="flex justify-center items-center mb-4">
            <div class="mt-auto bg-white rounded-full flex items-center w-full border border-gray-200 hover:border-sky-200 ">
                <input type="search"  class="w-full px-4 py-2 rounded-full focus:outline-none" name="search_bar" placeholder="Search chats..." v-model="searchQuery" @keyup.prevent="onKeyup">
                <span class="py-2 px-4 text-gray-500 inline-flex items-center">
                    <ClientOnly>
                        <i class="fas fa-search"></i>
                    </ClientOnly>
                </span>
            </div>
        </div>
        <div class="overflow-y-auto">


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
                                <i class="fas fa-trash-alt text-gray-600"></i></span>
                                <p v-show="!showTitleEditConfirmation || !isSelectedConversation(conversation.id)" class="text-sm text-gray-600" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 150px;"
                                :class="{'typed-title': !typedTitle && isSelectedConversation(conversation.id)}">
                                    {{ conversation.title }}
                            
                                </p>
                                <input
                                v-show="showTitleEditConfirmation && isSelectedConversation(conversation.id)"
                                type="text" class="text-sm text-gray-600 border border-sky-500" v-model="conversationTitle"
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
                                    <i
                                    class="fas fa-check text-gray-600 hover:text-green-400"></i>
                                </button>
                                <button v-show="showDeleteConfirmation"
                                @click.prevent="toggleDeleteConfirmation()">
                                    <i class="fas fa-xmark text-gray-600 hover:text-red-500"

                                    ></i>
                                </button>
                                <button v-show="showTitleEditConfirmation"
                                @click.prevent="editConversationTitle(conversation)">
                                    <i
                                    class="fas fa-check text-gray-600 hover:text-green-400"></i>
                                </button>
                                <button v-show="showTitleEditConfirmation"
                                @click.prevent="toggleTitleEditConfirmation()">
                                    <i class="fas fa-xmark text-gray-600 hover:text-red-500"

                                    ></i>
                                </button>

                            </div>
                        </div>

                    </div>
                </nuxt-link>

            </div>

        </div>
    </div>
</template>

<script>
import Fuse from 'fuse.js';

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
        }
    },
    async created() {
        const { refreshConversations } = useConversations()

        watch(refreshConversations, () => {
            this.updateConversations()
        })
    },
    mounted() {
       
        this.getConversations()
        this.conversations_copy = this.conversations
        if (this.showDeleteConfirmation == true) {
            this.showDeleteConfirmation = false
        }
        if (this.showTitleEditConfirmation == true) {
            this.showTitleEditConfirmation = false
        }
        this.selectedConversation  = this.$route.params.id ? this.$route.params.id : null

    },
    methods: {
        async searchConversations() {
            const fuseOptions = {
                keys: ['title'],  // Adjust this based on your field names
                threshold: 0.3,  // Adjust for search sensitivity
            };
            try {
                let fuse = new Fuse(this.conversations_copy, fuseOptions);
                this.conversations = this.searchQuery 
                    ? fuse.search(this.searchQuery).map(result => result.item) 
                    : [...this.conversations_copy];
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
            await this.getConversations(true)
            if (this.conversations.length > 0) {
                this.$route.params.id = this.conversations[0].id
                this.setConversation(this.conversations[0].id)
                this.typeTitle(this.conversations[0].title);
            }
        },
        async typeTitle(title) {
            this.typedTitle = title;  // Use 'this' to access typedTitle
            this.conversations[0].title = '';  // Use 'this' to access typedTitle
            for (let i = 0; i < this.typedTitle.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 100));  // adjust the speed of typing here
                this.conversations[0].title += this.typedTitle[i];  // Use 'this' to access typedTitle
            }
        },
        async initSupabase() {
            return useSupabaseClient()
        },
        setConversation(id) {
            if (this.selectedConversation !== id) {
               this.showDeleteConfirmation = false
               this.showTitleEditConfirmation = false
            }
            this.selectedConversation = id
            this.conversationTitle = this.conversations.find(conversation => conversation.id === id).title
            // Only type out the title if this is the first conversation
            if (this.selectedConversation === this.conversations[0].id) {
                
            }
        },

        async getConversations(refresh=false) {
            const supabase = await this.initSupabase()
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.log(error)
            } else {
                if (data){
                    if (refresh) {
                        this.conversations = []
                    }
                    data.forEach(conversation => {
                        this.conversations.push(conversation)
                    });
                }
            }
        },
        async deleteConversation() {
            const supabase = await this.initSupabase()
            const { data, error } = await supabase
                .from('conversations')
                .delete()
                .eq('id', this.selectedConversation)

            if (error) {
                console.log('ID' + this.selectedConversation)
                console.log(error)

            } else {
                // remove from conversations from array
                this.conversations = this.conversations.filter(conversation => conversation.id !== this.selectedConversation)
                this.selectedConversation = null
                this.showDeleteConfirmation = false
                if (this.$route.params.id) {
                    this.$router.push('/chats')
                if (this.$route.name == 'chats'){
                    window.location.reload(true)
                }
                }else{
                    await this.getConversations(true)
                }
            }

        },
        async editConversationTitle(conversation) {
                const supabase = await this.initSupabase()
                const { data, error } = await supabase
                    .from('conversations')
                    .update({ title: this.conversationTitle })
                    .eq('id', this.selectedConversation)

                if (error) {
                    console.log(error)
                } else {
                    this.showTitleEditConfirmation = false
                    this.conversations = this.conversations.map(conversation => {
                        if (conversation.id === this.selectedConversation) {
                            return {
                                ...conversation,
                                title: this.conversationTitle
                            }

                        }
                        return conversation
                    })
                }

        },
        toggleDeleteConfirmation() {

            if (this.showDeleteConfirmation) {
                this.showDeleteConfirmation = false
            } else {
                this.showDeleteConfirmation = true
            }
        },
        toggleTitleEditConfirmation() {

            if (this.showTitleEditConfirmation) {
                this.showTitleEditConfirmation = false
            } else {
                this.showTitleEditConfirmation = true
            }
        },
        isSelectedConversation(id) {
            return this.selectedConversation === id;
        },
        onTitleInputChange(conversation) {
            conversation.title = this.conversationTitle;
        },
        isNewChat(){
            return this.$route.params.id ? false : true
        },

    },
   


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