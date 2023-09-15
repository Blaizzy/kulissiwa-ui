<template>
    <!-- Content -->
    <div class="flex flex-col h-full w-full py-8 bg-white" >
        <div class="flex justify-between items-center pb-4 px-8 border-b border-gray-200">
            <div class="flex items-center justiy-center">
                <!-- <img src="~~/assets/logos/ChatGPT.png" alt="Chatbot Avatar" class="w-10 h-10 rounded-full mr-1"> -->
              
                <h1 class="text-2xl font-semibold m-1">GPT-3.5</h1>
            </div>

            <div class="flex items-center" >
               
                    <img :src="file_logo" alt="Data Source Icon" class="w-6 h-6 rounded-md mr-1">
                  
                    <select id="data-type" class="block border border-gray-300 rounded-lg p-1 mr-4" v-model="selectedDataType" @change="getIconForFileType()" >
                        <!-- Add  option bound to dataSources -->
                        <option value="Chat">Chat</option>
                        <option  v-for="dataSource in dataSources" :key="dataSource.id" :value="dataSource.id">
                            {{ dataSource.name }}
                        </option>

                    </select>
                    
               
            
            </div>
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
                    <i class="mt-2 p-1 fas fa-arrow-down fa-xl"></i> 
                </div>
                </div>
                <div class="w-auto px-4 overflow-y-auto" ref="chatWindow" >

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
                            <div class="flex items-start">
                                <div style="background-color: rgb(25, 195, 125);" class="w-10 h-10 rounded-full mr-1 flex items-center justify-center">
                                    <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" class="h-6 w-6 text-white" role="img"><text x="-9999" y="-9999">ChatGPT</text><path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path></svg>
                                </div>
                                <div class="bg-sky-50 text-black shadow rounded-b-lg rounded-r-lg py-2 px-6 inline-block ml-2" v-if="ai_messages[index]">
                                    <div v-html="renderMarkdown(ai_messages[index].content)" class="pt-2 inline-block break-words prose"></div>
                                    <div v-show="ai_messages[index].source_documents" class="pb-2 mt-1">
                                        <div v-html="renderMarkdown(`**Sources 📃**`)"></div>
                                        <div v-for="(source_document, source_index) in ai_messages[index].source_documents" :key="source_index">
                                            <Disclosure v-slot="{ open }">
                                                <DisclosureButton
                                                class="flex w-full border border-gray-300 justify-between rounded-full bg-white px-4 py-2 my-2 text-left text-sm font-medium text-gray-900 hover:bg-sky-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
                                                >
                                                <span v-if="showFilePageReference(source_document)"> {{ source_document.metadata.source }}, p. {{ source_document.metadata.page }}</span>
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
                                    
                                </div>
                                

                                <div class="bg-sky-50 text-black shadow rounded-b-lg rounded-r-lg inline-block py-2 px-6 ml-2" v-else-if="loading_ai_response">
                                    <div class="space-x-1.5">
                                        <i class="fa-solid fa-square fa-beat-fade fa-2xs" style="--fa-animation-delay: 0s;--fa-fade-opacity: 0.1;"></i>
                                        <i class="fa-solid fa-square fa-beat-fade fa-2xs" style="--fa-animation-delay: 0.3s;--fa-fade-opacity: 0.1;"></i>
                                        <i class="fa-solid fa-square fa-beat-fade fa-2xs" style="--fa-animation-delay: 0.6s;--fa-fade-opacity: 0.1;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>


        <!-- Message Input -->
        <div class="flex items-start justify-center w-auto">
            <div class="bg-white rounded-xl flex items-center shadow-md border border-gray-200 w-1/2 hover:border-sky-200">
                <textarea type="text" :rows="rows" class="w-full px-4 h-auto py-3 rounded-xl focus:outline-none" placeholder="Type your message..." 
                    v-model="message" style="resize: none;"  @keydown.enter.exact.prevent="handleEnterPress">
                </textarea>
                <button class="py-2 px-4 text-gray-500 inline-flex items-center" @click.prevent="queryModel" v-if="!loading_ai_response"
                :disabled="isMessageEmpty"
                :class="isMessageEmpty ?'hover:text-gray-500' : 'hover:text-black'"
                >
                    <i class="fas fa-paper-plane"></i>
                </button>

                <button class="py-2 px-4 text-gray-500 hover:text-black inline-flex items-center" disabled v-else >
                    <i class="fas fa-spinner fa-spin"></i>
                </button>

            </div>
        </div>

    </div>



</template>


<script>
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
        return {
            conversationId: '',
            message: '',
            copySuccess: new Set(),
            ai_messages: [],
            user_messages: [],
            dataSources: [],
            selectedDataType: '',
            loading_ai_response: false,
            avatar_url: '/images/avatars/user-default-pic.png',
            file_logo: '/images/chat.png',
            noChatFound: false,
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
        // TODO: Think about how to handle this better
        
        if (this.$route.params.id){
            this.conversationId = this.$route.params.id
            this.user_messages = [];
            this.ai_messages = [];
            this.loadMessages(supabase);
        }

        this.getDataSources(supabase)
        const user_session = await this.getSession(supabase)
        if (user_session && user_session.user.user_metadata.avatar_url) {
            this.setUserAvatar(user_session.user.user_metadata.avatar_url)
        }
        watchEffect(() => {
            this.isChatFound()
        })
    },
    computed: {
        rows() {
            const lineBreaks = (this.message.match(/\n/g) || []).length + 1; // Add one for the first line
            return lineBreaks > maxRows ? maxRows : lineBreaks;
        },
        hasDataSources() {
            return this.dataSources && this.dataSources.length > 0;
        },
        isMessageEmpty() {
            return this.message.trim().length === 0;
        },
    },
    methods: {
        isChatFound(){
    
            if (this.user_messages.length === 0) {
                this.noChatFound = true
            } else {
                this.noChatFound = false
            }
        },
        getSelectedName() {
            const selectedSource = this.dataSources.find(ds => ds.id === this.selectedDataType);
            if (!selectedSource) {
                return 'Select a data source';
            }
            return selectedSource.name;
        },
        getIconForFileType() {
            const selectedSource = this.dataSources.find(ds => ds.id === this.selectedDataType);
            if (!selectedSource || this.selectedDataType === 'Chat') {
                this.file_logo = '/images/chat.png'; // Return a default icon if no match found
            } else {
                const iconMap = {
                    'pdf': '/images/pdf.png',
                    'vnd.openxmlformats-officedocument.wordprocessingml.document': '/images/word.png',
                    'website': '/images/website.png',
                    'csv': '/images/csv.png',
                    'text': '/images/text.png',
                    // Add more mappings as needed
                };
                this.file_logo = iconMap[selectedSource.file_type] || '/images/text.png'; // Default to 'fa-file' if no match
            }
        },
        
        setUserAvatar(avatar_url) {
            this.avatar_url = avatar_url;
        },
        async getDataSources( supabase ){
            const { data, error } = await supabase
            .from('data')
            .select('id, name, content_data, file_type')

            if (error) {
                console.log(error)
                alert('There was an error loading your data sources')
            }

            if (data) {
                data.forEach((dataSource) => {
                    this.dataSources.push({
                        id: dataSource.id,
                        name: dataSource.name,
                        file_type: dataSource.file_type,
                    })
                })
                this.selectedDataType = 'Chat';
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
        showFilePageReference(source_document){
            if (typeof source_document.metadata.page === 'number' ) {
                return true
                
            } else {
                return false
            }
        },
        async getSession(supabase){
          const { data, error } = await supabase.auth.getSession()
          if (error) {
            console.log(error)
            alert("Error getting session")
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
                console.log(error)
                alert('There was an error loading your messages')
            }else{
                // Assuming the backend returns an array of messages with a sender and data properties
                messages.forEach((message) => {
                    if (message.sender === 'ai') {
                        this.ai_messages.push({"sender": message.sender,"content":message.content, "source_documents": message.source_documents});
                    } else {
                        this.user_messages.push({"sender":message.sender, "content":message.content});
                    }
                });

            }

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
            let response_dict;

            try {
                const formData = new FormData();
                formData.append("query",last_user_message.content);

                if (this.selectedDataType == 'Chat'){
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

                    let index = this.ai_messages.push({sender: "ai"}) - 1;
                    this.scrollToBottom();
                    let result = '';
                    while (true) {
                        const { value, done } = await reader.read();
                        
                        if (done) {
                            break;
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
                    if (this.selectedDataType != 'All'){
                        formData.append("data_source", this.selectedDataType);
                    }
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

                    let index = this.ai_messages.push({sender: "ai"}) - 1;
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
                    let result = '';
                    while (true) {
                        const { value, done } = await reader.read();
                        
                        if (done) {
                            break;
                        }

                        let chunk = decoder.decode(value, { stream: true }).replace(/data: /g, '').trim();
        
                        // Split the chunk by new lines
                        const words = chunk.split('\n');

                        // If there's more than one word, join them into a single string
                        if (words.length > 1) {
                            chunk = words.map(word => word.replace(/^"(.*)"$/, '$1')).join('');
                        }
                        if (isJSON(chunk)) {
                            // If the chunk is a potential JSON string, parse it and add it to the result
                            let cleanedString = chunk.replace(/[\cA-\cZ]/g, "");
                            result += cleanedString.split('||JSON_START||')[0];
                            this.ai_messages[index].content = result;
                            
                            let startIndex = chunk.indexOf('||JSON_START||');
                            let endIndex = chunk.indexOf('||JSON_END||');
                            response_dict = JSON.parse(cleanedString.substring(startIndex + '||JSON_START||'.length, endIndex));
                            
                            if (response_dict.source_documents.length > 0)
                                this.ai_messages[index].source_documents = response_dict.source_documents;
                            
                        } else {
                            result += chunk.replace(/^"(.*)"$/, '$1');
                            this.ai_messages[index].content = result;
                        }
                        this.highlightCode();
                    }
                    // replace the source id with the source name
                    if (response_dict.source_documents) 
                        response_dict.source_documents.forEach(item => {
                            let id = item.metadata.source;
                            item.metadata.source = this.getSourceName(id);
                        });
                    else
                        response_dict = {source_documents: []};
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
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    ChevronUpIcon,
    CheckIcon,
    parse
}

};
</script>

