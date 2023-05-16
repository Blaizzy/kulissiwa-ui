<template>
    <!-- Content -->
    <div class="flex-1 py-8 bg-white " >
        <div class="flex justify-between items-center pb-4 px-8 border-b border-gray-200">
            <div class="flex">
                <img src="~~/assets/logos/gpt-4.svg" alt="Chatbot Avatar" class="w-10 h-10 rounded-full mr-1">
                <h1 class="text-2xl font-semibold m-1">GPT-4</h1>
            </div>


            <!-- <Listbox v-model="selectedDataType">
                <ListboxOptions>
                    <ListboxOption  v-for="dataSource in dataSources" :key="dataSource.id" :value="dataSource.id"  v-slot="{ active, selected }">
                        <li
                        :class="{
                            'bg-blue-500 text-white': active,
                            'bg-white text-black': !active,
                        }"
                        >
                        <CheckIcon v-show="selected" />
                        {{ dataSource.name }}
                        </li>
                    </ListboxOption>
            </ListboxOptions>
            </Listbox> -->
            <div class="flex items-center">
                <select id="data-type" class="block border border-gray-300 rounded-lg p-1 mr-4" v-model="selectedDataType">
                    <option  v-for="dataSource in dataSources" :key="dataSource.id" :value="dataSource.id">
                        {{ dataSource.name }}
                    </option>
                </select>
                <i class="fa-solid fa-gear"></i>
            </div>
        </div>


        <div class="flex mb-4 justify-center p-2 sm:h-[calc(90%-2rem)] lg:h-[calc(90%-2rem)] xl:h-[calc(90%-2rem)] 2xl:h-[calc(94%-2rem)] overflow-y-auto">
            <div class="w-auto px-4" ref="chatWindow" >


                <div v-for="(user_message, index) in user_messages" :key="user_message.content">
                    <div class="my-4" >
                        <div class="flex items-start justify-end">
                            <!-- User Message -->
                            <div class="bg-sky-500  text-white shadow rounded-b-lg rounded-l-lg py-2 px-4 inline-block mr-2">
                                <div v-html="renderMarkdown(user_message.content)"></div>
                            </div>
                            <img :src="avatar_url" alt="User Avatar" class="w-10 h-10 rounded-full">
                        </div>
                    </div>

                    <!-- Chatbot Message -->
                    <div class="my-4 pb-2">
                        <div class="flex items-start">
                            <div class="bg-sky-50 text-black shadow rounded-b-lg rounded-r-lg py-2 px-6 inline-block ml-2 prose" v-if="ai_messages[index]">
                                <div v-html="renderMarkdown(ai_messages[index].content)"></div>

                                <div v-show="ai_messages[index].source_documents" class="pb-4">
                                    <div v-html="renderMarkdown(`**Sources 📃**`)"></div>
                                    <div v-for="(source_document, source_index) in ai_messages[index].source_documents" :key="source_index">
                                        <Disclosure v-slot="{ open }">
                                            <DisclosureButton
                                            class="flex w-full border border-gray-300 justify-between rounded-full bg-white px-4 py-2 my-2 text-left text-sm font-medium text-gray-900 hover:bg-sky-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
                                            >
                                            <span> {{ getSourceName(source_document.metadata.source) }}</span>
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

                            <div class="bg-sky-50 text-black shadow rounded-b-lg rounded-r-lg inline-block py-2 px-6 ml-2" v-else-if="loading_ai_response ">
                                <p>I'm thinking about it...</p>
                                <p class="suspense_block py-1 my-1 w-10/12"></p>
                                <p class="suspense_block py-1 my-1 "></p>
                                <p class="suspense_block py-1 my-1 w-10/12"></p>
                                <p class="suspense_block py-1 my-1"></p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Message Input -->
        <div class="flex justify-center items-center w-auto">
            <div class="mt-auto bg-white rounded-full flex items-center shadow-md border border-gray-200 w-3/4 hover:border-sky-200 ">
                <input type="text" class="w-full px-4 py-2 rounded-full focus:outline-none" placeholder="Type your message..." v-model="message">
                <button class="py-2 px-4 text-gray-500 hover:text-black inline-flex items-center" @click.prevent="queryModel" v-if="!loading_ai_response">
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
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css';
import ClipboardJS from 'clipboard';
import { parse } from '@fortawesome/fontawesome-svg-core';

const exampleCode = `test`;

export default {
    setup() {


        // Create a local markdown instance
        const markdown = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            highlight: (str, lang) => {
                if (lang && Prism.languages[lang]) {
                    try {

                        return Prism.highlight(str, Prism.languages[lang], lang);
                    } catch (error) {
                        console.error(`Error highlighting code with Prism: ${error}`);
                    }
                }

                return '';
            },
        });

        markdown.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const code = token.content.trim();
        const escapedCode = markdown.utils.escapeHtml(code);

        const content = `
            <div class="code-block-container">
                <pre class="language-${token.info}"><code>${escapedCode}</code></pre>
                <button class="copy-code-button border border-gray-300 text-gray-300 rounded px-1 hover:text-white hover:border-white" data-clipboard-text="${escapedCode}" data-unique-id="${idx}">
                    <i class="icon fas fa-copy"></i>
                    <i class="icon fas fa-check" style="display:none;"></i>
                </button>
            </div>
        `;


        return content;
        }

        // Create a method to render markdown
        const renderMarkdown = (source) => markdown.render(source);

        // Expose the `renderMarkdown` method to the template
        return {
            renderMarkdown,
        // ...
        };
    },
    data() {
        return {
            exampleCode,
            conversationId: '',
            message: '',
            copySuccess: new Set(),
            ai_messages: [],
            user_messages: [],
            dataSources: [],
            selectedDataType: '',
            loading_ai_response: false,
            avatar_url: 'https://via.placeholder.com/40',
        };
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
        // TODO: Think about how to handle this better
        const supabase = this.initSupabase();
        if (this.$route.params.id){
            this.conversationId = this.$route.params.id
            this.user_messages = [];
            this.ai_messages = [];
            this.loadMessages(supabase);
        }

        this.getDataSources(supabase)
        const user_session = await this.getSession(supabase)
        if (user_session) {
            this.setUserAvatar(user_session.user.user_metadata.avatar_url)
        }
    },
    methods: {
        setUserAvatar(avatar_url) {
            this.avatar_url = avatar_url;
        },
        async getDataSources( supabase ){
            const { data, error } = await supabase
            .from('data')
            .select('id, name, content_data')

            if (error) {
                console.log(error)
                alert('There was an error loading your data sources')
            }

            if (data) {
                data.forEach((dataSource) => {
                    this.dataSources.push({
                        id: dataSource.id,
                        name: dataSource.name
                    })
                })
                if (this.dataSources.length > 0) this.selectedDataType = this.dataSources[0].id
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
                        this.ai_messages.push({"content":message.content, "source_documents": message.source_documents});
                    } else {
                        this.user_messages.push({"content":message.content});
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
        async queryModel() {
            const supabase = this.initSupabase()
            const user_session = await this.getSession(supabase)

            this.user_messages.push({content: this.message});
            this.message = '';

            this.loading_ai_response = true;

            // get the last user message
            const last_user_message = this.user_messages[this.user_messages.length - 1];
            let response_dict = {};

            try {
                const formData = new FormData();
                formData.append("query",last_user_message.content);
                formData.append("data_source",this.selectedDataType);
                formData.append("namespace", user_session.user.id);

                const response = await fetch("http://127.0.0.1:8000/chat_with_sources", {
                    method: 'POST',
                    body: formData
                });

                if (!response.body) {
                    throw new Error('ReadableStream not supported');
                }
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                let result = '';
                let index = this.ai_messages.push(' ') - 1;
                this.scrollToBottom();
                const delimiter = "||JSON||";
                while (true) {
                    const { value, done } = await reader.read();

                    if (done) {
                        console.log('Stream complete');
                        break;
                    }

                    const chunk = decoder.decode(value, { stream: true });

                    if (chunk.includes(delimiter)) {
                        const json_string = chunk.split(delimiter)[1];
                        response_dict = JSON.parse(json_string);
                        if (response_dict.source_documents.length > 0) {
                            result += chunk.split(delimiter)[0];

                            this.ai_messages.splice(index, 1, {"content": result , "source_documents": response_dict.source_documents});
                        }

                    }else{
                        result += chunk;
                        this.ai_messages.splice(index, 1,  {"content": result });
                    }
                    this.highlightCode();
                }

                console.log(result);
                console.log("Received JSON object:", response_dict);
            } catch (err) {
                console.log(err);
            } finally {
                this.loading_ai_response = false;
            }

            if (this.$route.params.id==undefined && this.conversationId=='') {
                await this.insertData(supabase, 'conversations', [{user_id: user_session.user.id}])
                const { data, error } = await supabase
                    .from('conversations')
                    .select('id, created_at')
                    .order('created_at', { ascending: false })
                    .limit(1)
                if (error) {
                    console.log(error)
                    alert('Failed to get conversation ID')
                }
                if (data) {
                    this.conversationId = data[0].id;
                }
            }
            await this.insertData(
                supabase,
                'messages',
                [
                    {conversation_id: this.conversationId, sender: 'human', content: this.user_messages[this.user_messages.length - 1]["content"] , source_documents: []},
                    {conversation_id: this.conversationId, sender: 'ai', content: this.ai_messages[this.ai_messages.length - 1]["content"], source_documents: response_dict.source_documents}
                ]
            )

        },
        getSourceName(id){
            const matchingDataSource =  this.dataSources.find(dataSource => dataSource.id == id);
            return matchingDataSource ? matchingDataSource["name"] : "Unknown";
        }
    },
    watch: {
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


<style scoped>
.suspense_block {
    height: 100%;
    display: flex;
    animation: pulse-bg 1s infinite;
}
@keyframes pulse-bg {
    0% {
        background: rgb(194, 194, 194);
    }
    50% {
        background: rgb(167, 167, 167);
    }
    100% {
        background: gray;
    }
}


</style>
