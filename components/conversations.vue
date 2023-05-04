<template>
    <!-- Chat Side Navbar -->
    <div class="w-80 bg-gray-50 p-4">
        <div class="relative mb-4">
            <input type="search" class="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none" placeholder="Search chats...">
            <span class="absolute top-3 right-3 text-gray-500">
                <i class="fas fa-search"></i>
            </span>
        </div>
        <div class="overflow-y-auto h-[calc(100%-2rem)]">
            <div class="mb-4">
                <nuxt-link to="/chats">
                    <div class="bg-white p-4 rounded shadow">

                        <div class="font-semibold">
                            <i class="fa fa-square-plus pr-1"></i>
                            New chat
                        </div>

                    </div>
                </nuxt-link>
            </div>

            <div class="mb-4" v-for="conversation in conversations" :key="conversation.id">
                <!-- <h2 class="text-xl font-semibold mb-2">Today</h2> -->
                <nuxt-link
                        :to="`/chats/${conversation.id}`">
                <div
                    class="bg-white p-4 rounded shadow hover:bg-gray-100/50"
                    :class="{ 'border-gray-300 border-2': isSelectedConversation(conversation.id) && !isNewChat() }"
                    @click="setConversation(conversation.id)"
                >

                        <div class="flex items-center justify-between">

                            <div class="flex items-center">
                                <span v-show="showDeleteConfirmation && isSelectedConversation(conversation.id)"
                                class="mr-1 ">
                                <i class="fas fa-trash-alt text-gray-600"></i></span>
                                <p v-show="!showTitleEditConfirmation || !isSelectedConversation(conversation.id)" class="text-sm text-gray-600">{{ conversation.title }}</p>
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
                                    <i
                                    class="fas fa-pencil text-gray-600 hover:text-black"></i>
                                </button>


                                <button v-show="!showDeleteConfirmation && !showTitleEditConfirmation"
                                @click.prevent="toggleDeleteConfirmation()">
                                    <i class="fas fa-trash-alt text-gray-600 hover:text-black"

                                    ></i>
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
export default {
    data() {
        return {
            conversations: [],
            selectedConversation: null,
            showDeleteConfirmation: false,
            conversationTitle: '',
            showTitleEditConfirmation: false,
        }
    },
    mounted() {
        this.getConversations()
        if (this.showDeleteConfirmation == true) {
            this.showDeleteConfirmation = false
        }
        if (this.showTitleEditConfirmation == true) {
            this.showTitleEditConfirmation = false
        }
        this.selectedConversation  = this.$route.params.id ? this.$route.params.id : null
    },
    methods: {
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

        },

        async getConversations() {
            const supabase = await this.initSupabase()
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.log(error)
            } else {
                if (data){
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
                this.$router.push('/chats')
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

</style>