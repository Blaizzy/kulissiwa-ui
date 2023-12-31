<template>
    <!-- Content -->
    <div class="flex flex-col bg-white h-screen dark:bg-neutral-950 dark:text-gray-400 z-99" >
        <div class="flex absolute top-0 right-0">
            <div
                v-if="showSuccess"
                class="mt-4 z-0 py-2 px-4 text-lg text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 shadow-md transition-transform transform"
                :class="{ '-translate-x-full opacity-0': !showSuccess, 'translate-x-0 opacity-100': showSuccess }"
            >
                <ClientOnly>
                    <i class="fas fa-square-check mr-2"></i>
                </ClientOnly>
                {{successMessage}}
            </div>
            <div
                v-if="showFailure"
                class="fixed z-0 top-4 right-4 py-2 px-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 shadow-md transition-transform transform"
                :class="{ 'translate-x-full opacity-0': !showFailure, 'translate-x-0 opacity-100': showFailure }"
            >
                <ClientOnly>
                    <i class="fas fa-square-xmark mr-2"></i>
                </ClientOnly>
                    {{failureMessage}}
            </div>
        </div>


        <div class="sticky top-0 z-10 flex justify-between items-center py-4 h-16 border-b border-gray-200 dark:border-neutral-800 dark:bg-neutral-950">
            <NuxtLink to="/chats/list" class="flex p-2 rounded-full border-2 hover:bg-neutral-100 dark:border-neutral-800 mx-4 dark:hover:bg-neutral-800 dark:hover:border-neutral-600"

            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </NuxtLink>

            <div class="flex mx-auto space-x-4 px-2 " v-if="noChatFound">
                <div class="flex parent-card items-center space-x-2 bg-white p-2 px-4 dark:bg-inherit">
                    <img src="~~/assets/logos/kulissiwa.svg" width="24" height="24" alt="Kulissiwa Logo">
                    <p class="text-lg">Kulissiwa</p>
                </div>
            </div>
            <div v-else v-show="!isLoading" class="flex flex-col mx-auto items-center justiy-center truncate">
                <div class="flex">
                    <h1 class="text-xl font-regular m-1 truncate">{{ conversationTitle }}</h1>
                </div>

                <div class="flex items-center text-gray-500 text-sm">
                    <svg class="mr-1 fill-gray-500" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7.39804 12.8085C7.57428 12.9328 7.78476 12.9994 8.00043 12.999C8.21633 12.9992 8.42686 12.9317 8.60243 12.806C8.77993 12.6755 8.91464 12.4952 8.98943 12.288L9.43643 10.915C9.55086 10.5707 9.74391 10.2578 10.0003 10.0011C10.2566 9.74436 10.5693 9.55089 10.9134 9.436L12.3044 8.98499C12.4564 8.93064 12.5936 8.84184 12.7055 8.72555C12.8174 8.60926 12.9008 8.46865 12.9492 8.31473C12.9977 8.1608 13.0098 7.99776 12.9847 7.83836C12.9596 7.67897 12.8979 7.52756 12.8044 7.396C12.6703 7.21007 12.4794 7.07283 12.2604 7.005L10.8854 6.558C10.5409 6.44377 10.2278 6.2508 9.97087 5.99441C9.71396 5.73803 9.52035 5.42528 9.40543 5.081L8.95343 3.693C8.88113 3.49069 8.74761 3.31593 8.57143 3.193C8.43877 3.09927 8.28607 3.03779 8.12548 3.01344C7.96489 2.9891 7.80083 3.00256 7.64636 3.05275C7.49188 3.10295 7.35125 3.1885 7.23564 3.3026C7.12004 3.41669 7.03265 3.55619 6.98043 3.71L6.52343 5.11C6.40884 5.44482 6.21967 5.74923 5.97022 6.00025C5.72076 6.25126 5.41753 6.44232 5.08343 6.559L3.69243 7.007C3.54065 7.06139 3.40352 7.15017 3.29177 7.26638C3.18001 7.3826 3.09666 7.5231 3.04824 7.67688C2.99982 7.83067 2.98764 7.99357 3.01265 8.15285C3.03767 8.31213 3.0992 8.46346 3.19243 8.595C3.32027 8.77445 3.50105 8.90942 3.70943 8.981L5.08343 9.42599C5.52354 9.57248 5.90999 9.84682 6.19343 10.214C6.35585 10.4246 6.4813 10.6613 6.56443 10.914L7.01643 12.305C7.08846 12.5083 7.22179 12.6842 7.39804 12.8085ZM13.5353 16.851C13.6713 16.9472 13.8337 16.9989 14.0003 16.999C14.1654 16.9991 14.3264 16.9481 14.4613 16.853C14.6008 16.7545 14.7058 16.6146 14.7613 16.453L15.0093 15.691C15.0625 15.5326 15.1515 15.3885 15.2693 15.27C15.3867 15.1515 15.5307 15.0627 15.6893 15.011L16.4613 14.759C16.619 14.7045 16.7557 14.6021 16.8523 14.466C16.9257 14.363 16.9736 14.2441 16.9921 14.119C17.0106 13.9939 16.9992 13.8662 16.9588 13.7463C16.9184 13.6265 16.8501 13.518 16.7597 13.4296C16.6692 13.3412 16.5591 13.2756 16.4383 13.238L15.6743 12.989C15.5162 12.9365 15.3724 12.8478 15.2544 12.7302C15.1364 12.6125 15.0473 12.469 14.9943 12.311L14.7423 11.538C14.6886 11.3802 14.586 11.2436 14.4493 11.148C14.3473 11.0751 14.2295 11.0271 14.1056 11.0081C13.9816 10.989 13.8549 10.9994 13.7357 11.0383C13.6164 11.0772 13.508 11.1436 13.4192 11.2322C13.3304 11.3207 13.2636 11.4289 13.2243 11.548L12.9773 12.31C12.925 12.4677 12.8375 12.6113 12.7213 12.73C12.6066 12.8465 12.4667 12.9351 12.3123 12.989L11.5393 13.241C11.3803 13.2949 11.2422 13.3975 11.1447 13.5343C11.0472 13.671 10.9952 13.835 10.9961 14.0029C10.997 14.1708 11.0507 14.3342 11.1496 14.47C11.2486 14.6057 11.3877 14.7068 11.5473 14.759L12.3103 15.006C12.4692 15.0594 12.6136 15.1487 12.7323 15.267C12.8505 15.3853 12.939 15.5299 12.9903 15.689L13.2433 16.463C13.2981 16.6195 13.4001 16.7551 13.5353 16.851Z"/></svg>
                    <p>{{ LLM.model_name }}</p>
                </div>
            </div>
            <div class="flex items-center px-4 cursor-pointer">
                <a href="mailto:support@kulissiwa.com?subject=Help%20with%20Kulissiwa%20" target="_blank" class="hover:underline">
                    <p class="font-semibold text-sm">Help</p>
                </a>
            </div>
            <DataSourcesModal
                :show-modal="showModal" :data-sources="dataSources" :selected-data-type="selectedDataType"
                :current-page="currentPage" :total-items="totalItems" :items-per-page="itemsPerPage"
                :is-fetching-data="isFetchingDataSource"
                @close-modal="showModal = false"
                @update-page="updatePage"
                @error="onShowFailure" @success="onShowSuccess"/>
        </div>


        <div class="overflow-y-auto pb-64 lg:pb-16"
        :class="noChatFound ? 'h-full pb-32' : ''"
        >

            <div class="flex w-full justify-center p-2"
            :class="noChatFound ? 'flex-col h-full' : ''"
            >
                <div class="flex justify-center items-cente text-center" v-if="noChatFound">
                    <div class="flex justify-center items-center flex-col dark:bg-transparent">
                        <h1 class="text-xl lg:text-2xl font-semibold m-1">No chats yet</h1>
                        <p class="text-lg lg:text-xl m-1">Start a new chat by typing a message below
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
                                <div class="bg-sky-500 shadow rounded-b-lg rounded-l-lg px-4 mr-2 dark:bg-sky-600" >
                                    <div v-html="renderMarkdown(user_message.content)" class="text-md inline-block prose break-words py-2 text-white dark:text-gray-200"></div>
                                </div>
                                <img :src="avatar_url" alt="User Avatar" class="w-8 h-8 rounded-full">
                            </div>
                        </div>

                        <!-- Chatbot Message -->
                        <div class="my-4 pb-2">
                            <p class="font-semibold text-md dark:text-gray-500 pt-2 px-2 py-2" v-if="ai_messages[index]">Kulissiwa AI</p>
                            <div class="flex items-start w-auto">

                                <div class="flex flex-col bg-sky-50 text-black shadow rounded-b-lg rounded-r-lg py-2 px-6 ml-2 dark:bg-neutral-900 " v-if="ai_messages[index]">

                                    <div v-html="renderMarkdown(ai_messages[index].content)" class="py-2 inline-block break-words prose dark:text-gray-300 text-sm font-normal leading-6"></div>
                                    <div v-show="ai_messages[index].source_documents" class="pb-2 mt-1">
                                        <Disclosure v-slot="{ open }">
                                            <DisclosureButton
                                            class="flex w-full border border-gray-300 rounded-full bg-white px-4 py-2 my-2 text-left text-sm font-medium text-gray-900 hover:bg-sky-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 dark:bg-neutral-800 dark:text-gray-400 dark:border-none"
                                            >
                                            <span class="bg-gray-300 rounded-full px-3 font-semibold dark:bg-neutral-600 dark:text-gray-400" v-if="sourcesExists(index)"> {{ai_messages[index].source_documents.length}} </span>
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

                                                    <div class="w-full link-container flex flex-col  py-2 px-4 my-2 rounded-full bg-white border border-gray-300 text-sm font-medium hover:bg-sky-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 dark:bg-neutral-900 dark:text-gray-400" v-if="checkURLExists(source_document)">

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
                                                            class="flex w-full border border-gray-300 justify-between rounded-full bg-white px-4 py-2 my-2 text-left text-sm font-medium text-gray-900 hover:bg-sky-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 dark:bg-neutral-800 dark:text-gray-400 dark:border-none"
                                                            >
                                                            <span v-if="checkPageExists(source_document)"> {{ source_document.metadata.source }}, p. {{ source_document.metadata.page }}</span>
                                                            <span v-else> {{ source_document.metadata.source }}</span>
                                                            <ChevronUpIcon
                                                                :class="open ? 'rotate-180 transform' : ''"
                                                                class="h-5 w-5 text-gray-500"
                                                            />
                                                            </DisclosureButton>
                                                            <DisclosurePanel class="px-4 pb-2 text-sm text-gray-500">

                                                                <div v-html="renderMarkdown(source_document.page_content)" v-if="source_document.page_content"></div>
                                                                <div v-html="renderMarkdown(source_document.pageContent)" v-else></div>
                                                            </DisclosurePanel>
                                                        </Disclosure>
                                                    </div>
                                                </div>
                                            </DisclosurePanel>
                                        </Disclosure>
                                    </div>
                                </div>


                                <div class="bg-sky-50 text-black shadow rounded-b-lg rounded-r-lg inline-block py-2 px-6 ml-2 dark:bg-neutral-800 dark:text-gray-400" v-else-if="loading_ai_response">
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
        <div class="flex justify-center">
        <div class="flex justify-center fixed bottom-16 lg:bottom-0 px-4 pb-2 z-30 w-full">
            <div class="rounded-xl flex items-center px-2 border-2 border-gray-200 w-full lg:w-1/2 hover:border-gray-300 bg-white dark:bg-neutral-950 dark:border-neutral-700 dark:hover:border-neutral-600">
                <textarea
                    type="text"
                    :rows="rows"
                    class="bg-white w-full px-4 h-auto py-3 rounded-lg focus:outline-none dark:bg-inherit"
                    placeholder="Type your message..."
                    name="message"
                    v-model="message"
                    style="resize: none;"
                    @keydown.enter.exact.prevent="handleEnterPress"></textarea>
                <button class="py-2 px-4 mr-1 rounded-lg inline-flex items-center " @click.prevent="queryModel" v-if="!loading_ai_response"
                :disabled="isMessageEmpty"
                :class="isMessageEmpty ?'hover:text-gray-500 text-gray-500' : 'bg-sky-500 hover:bg-sky-500 text-white dark:bg-sky-600 dark:hover:bg-sky-500 dark:text-gray-200'"
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

        </div>
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

import { ChevronUpIcon, CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid';
import { marked, use } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css';
import ClipboardJS from 'clipboard';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { useAuthStore } from '@/stores/index'
import { useMonthlyUsageStore } from '@/stores/monthly-usage'
import DataSourcesModal from '@/components/DataSources/modal.vue'
import { useUserPreferences } from '@/stores/user-preferences'

const maxRows = 4;

export default {
    setup() {

        const renderer = new marked.Renderer();
        const originalParagraph = renderer.paragraph.bind(renderer);

        const replaceIndexWithStyle = (text) => {
            return text.replace(/\[\d+\]/g, (match) => {
                const number = match.slice(1, -1);
                return `<span class="inline-block align-top not-prose text-xs font-semibold text-white bg-sky-500 rounded-full px-1.5 dark:bg-neutral-700 dark:text-gray-400">${number}</span>`;
            });
        };

        renderer.paragraph = (text) => {
            // First, replace the indices with styled spans
            const styledText = replaceIndexWithStyle(text);
            // Then call the original paragraph renderer
            return originalParagraph(styledText);
        };

        // Store the original list item renderer
        const originalListItem = renderer.listitem.bind(renderer);

        // Extend the list item renderer
        renderer.listitem = (text) => {
            return originalListItem(replaceIndexWithStyle(text));
        };
        // Ensure to set the renderer for marked
        marked.setOptions({ renderer });

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
        renderer.strong = function(text) {
            return `<strong class="font-semibold dark:text-white">${text}</strong>`;
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
            renderMarkdown
        };

    },
    data() {
        const store = useAuthStore();
        const monthly_usage = useMonthlyUsageStore();
        const config = useRuntimeConfig()
        const preferences = useUserPreferences();
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
            preferences: preferences,
            monthly_usage: monthly_usage,
            currentPage: 1,
            itemsPerPage: 5,
            totalItems: 0,
            isFetchingDataSource: false,
            LLM: {},
            LLMs: [],
            config: config,
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
        await this.getLLMs(supabase)

        const user_session = this.store.user_session
        if (user_session && user_session.user.user_metadata.avatar_url) {
            this.setUserAvatar(user_session.user.user_metadata.avatar_url)
        }
        if (this.$route.params.id){
            this.conversationId = this.$route.params.id
            this.user_messages = [];
            this.ai_messages = [];
            this.loadMessages(supabase);
            this.getConversationTitle(supabase, this.conversationId)
        }
        watchEffect(() => {
            this.isChatFound()
            this.getActiveDataSourcesCount()
            this.selectedDataType = Array.from(this.monthly_usage.activeDataSources)
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
        async getLLMs(supabase) {
            const { data, error } = await supabase
                .from('LLMs')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.log(error);
                return;
            }
            data.forEach((LLM) => {
                this.LLMs.push({
                    model_name: LLM.model_name,
                    api_name: LLM.api_name,
                    id: LLM.id
                });
            });

            if (this.preferences.user) {
                const selectedLLM = this.LLMs.find((LLM) => LLM.id === this.preferences.user.LLM_id);
                this.LLM = selectedLLM;
                return;
            }
            this.LLM = this.LLMs[0]


        },
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
            return this.monthly_usage.activeDataSourcesCount;
        },

        async getDataSources( supabase = null ){
            if (!supabase) {
                supabase = useSupabaseClient()
            }
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage - 1;
            const { data, error, count } = await supabase
                .from('data')
                .select('id, user_id, name, content_data, is_file, file_type, is_active', { count: 'exact' })
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
                        is_file: dataSource.is_file,
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
                this.showFailure = false
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

            let transformedMessage = {};
            transformedMessage[_type] = content;
            return transformedMessage;
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
            let titlePromise;
            this.loading_ai_response = true;

            if (this.$route.params.id==undefined && this.conversationId=='') {
                titlePromise = this.autoTitle(this.user_messages[0].content)
                .then(async (title) => {
                    return await this.insertData(supabase, 'conversations', [{user_id: user_session.user.id, title: title.content}]);
                })
                .then(async () => {
                    const {data, error} =  await supabase
                        .from('conversations')
                        .select('id, created_at')
                        .order('created_at', { ascending: false })
                        .limit(1)

                    if (error) {
                        console.log(error)
                        this.onShowFailure(error.message)
                    }
                    if (data) {
                        this.conversationId = data[0].id;
                        const { refresh } = useConversations();
                        refresh();
                    }
                });
            }

            // Create a history variable that contains list of all user and ai messages
            // Convert sender key to type
            // Copy user_messages and ai_messages
            let user_messages = [...this.user_messages]
            user_messages = this.user_messages.slice(0, -1).map(this.transformMessage);
            let ai_messages = [...this.ai_messages]
            if (this.ai_messages.length > 0){
                ai_messages = ai_messages.map(this.transformMessage);
            }
            else{
                ai_messages = [];
            }

            // Gt the last 5 messages
            user_messages = user_messages.slice(-5);
            ai_messages = ai_messages.slice(-5);

            // Combine the two lists one element at a time
            let history = this.combineMessages(user_messages, ai_messages);

            // get the last user message
            const last_user_message = this.user_messages[this.user_messages.length - 1];

            try {
                let index=''; // Index of the ai_messages array
                let isFirstIteration = true;
                let model_name = ''

                if (!this.LLM.api_name.includes('gpt') || this.LLM.api_name.includes('vision')){
                    model_name = this.LLMs[0].api_name
                } else {
                    model_name = this.LLM.api_name
                }

                const response = await fetch(this.config.public.chatAPI + `/api/v1/chat`, {
                    method: 'POST',
                    body: JSON.stringify({
                        input: last_user_message.content,
                        model_name: model_name,
                        chat_history: history,
                    }),
                });

                if (!response.body) {
                    throw new Error('ReadableStream not supported');
                }
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let func_args = null;
                let buffer = '';
                while (true) {
                    const { value, done } = await reader.read();

                    if (done) {
                        break;
                    }

                    buffer += decoder.decode(value, { stream: true });

                    // Split the buffer into messages based on your event delimiter
                    const messages = buffer.split('\n\n');
                    buffer = messages.pop(); // Keep the last incomplete message in the buffer

                    for (const message of messages) {
                        const dataLineIndex = message.indexOf('data:');
                        if (dataLineIndex >= 0) {
                            const dataLine = message.slice(dataLineIndex + 5).trim();
                            if (dataLine.includes('function_call')) {
                                const data = JSON.parse(dataLine);
                                if (data.ops[0].path === '/final_output'){
                                    const action = data.ops[0].value.kwargs.additional_kwargs
                                    if (action.function_call.name === 'retriever'){
                                        func_args = JSON.parse(action.function_call.arguments)
                                        break;
                                    }
                                }

                            } else if (dataLine.includes('/logs/ChatOpenAI/streamed_output_str/-')){
                                const data = JSON.parse(dataLine);
                                if (isFirstIteration && data.ops[0].value !== '') {
                                    index = this.ai_messages.push({sender: "ai", content: ''}) - 1;
                                    isFirstIteration = false;
                                }
                                if (index !== '') {
                                    this.ai_messages[index].content += data.ops[0].value;
                                }

                            }
                        }
                    }
                }

                if (func_args) {
                    if (this.selectedDataType.length > 0) {

                        const response = await fetch(this.config.public.chatAPI + `/api/v1/chat/sources`, {
                            method: 'POST',
                            body: JSON.stringify({
                                input: func_args.user_query,
                                model_name: this.LLM.api_name,
                                namespace: user_session.user.id,
                                data_source: this.selectedDataType,
                                chat_history: history,
                            }),
                        });

                        if (!response.body) {
                            throw new Error('ReadableStream not supported');
                        }
                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();

                        let response_dict = '';
                        let buffer = '';
                        while (true) {
                            const { value, done } = await reader.read();

                            if (done) {
                                break;
                            }

                            buffer += decoder.decode(value, { stream: true });

                            // Split the buffer into messages based on your event delimiter
                            const messages = buffer.split('\n\n');
                            buffer = messages.pop(); // Keep the last incomplete message in the buffer

                            for (const message of messages) {
                                const dataLineIndex = message.indexOf('data:');
                                if (dataLineIndex >= 0) {
                                    const dataLine = message.slice(dataLineIndex + 5).trim();
                                    if (dataLine.includes('/logs/FindDocs/final_output')) {
                                        const data = JSON.parse(dataLine);
                                        if (data.ops[0].value.output.length > 0) {
                                            response_dict = JSON.parse(JSON.stringify(data.ops[0].value.output));
                                            response_dict.forEach(item => {
                                                let id = item.metadata.source;
                                                item.metadata.source = this.getSourceName(id);
                                            });
                                            if (isFirstIteration) {
                                                index = this.ai_messages.push({sender: "ai", content: ''}) - 1;
                                                isFirstIteration = false;
                                            }
                                            this.ai_messages[index].source_documents = response_dict;
                                        }
                                    }
                                    if (dataLine.includes('/streamed_output/-')) {
                                        const data = JSON.parse(dataLine);
                                        if (isFirstIteration) {
                                            index = this.ai_messages.push({sender: "ai", content: ''}) - 1;
                                            isFirstIteration = false;
                                        }
                                        this.ai_messages[index].content += data.ops[0].value;
                                    }
                                }
                            }
                        }
                    } else {
                        if (isFirstIteration) {
                            index = this.ai_messages.push({sender: "ai", content: ''}) - 1;
                            isFirstIteration = false;
                        }
                        this.ai_messages[index].content =
                            "No data sources active. Please select a data source to search from. \n\n" +
                            `Click on the database icon on the bottom right corner of the chat window to select a data source or add a new one [here](/documents).`;
                    }
                }
            } catch (err) {
                console.log(err);
            } finally {
                this.loading_ai_response = false;
            }

            if (titlePromise) {
                try {
                    await titlePromise;
                } catch (err) {
                    console.log(err);
                    this.onShowFailure(err.message)
                }
            }

            await this.insertData(
                supabase,
                'messages',
                [
                    {
                        conversation_id: this.conversationId,
                        sender: "human", content: this.user_messages[this.user_messages.length - 1]["content"] ,
                        source_documents: []
                    },
                    {
                        conversation_id: this.conversationId,
                        sender: "ai", content: this.ai_messages[this.ai_messages.length - 1]["content"],
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
