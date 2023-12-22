<script setup>
definePageMeta({
  middleware: 'auth',
});
</script>

<template>

    <div class="flex-1 isolate bg-white p-9 py-24 sm:py-32 lg:px-0 min-h-screen overflow-y-auto">
        <div class="mx-auto max-w-2xl">
            <div class="lg:pr-4">
                <div class="lg:max-w-lg">
                    <h1 class="mt-2 text-3xl mb-2 font-bold tracking-tight text-gray-900 sm:text-4xl">{{ data_source_name }}</h1>
                </div>
            </div>
            <div class="lg:pr-4">
                <div class="max-w-xl text-base leading-7 text-gray-700">
                    <div v-html="renderMarkdown(data_source_content)"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css';
import ClipboardJS from 'clipboard';

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

        marked.use({
            gfm: true,
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
    data(){
        return {
            data_source_id: '',
            data_source_name: '',
            data_source_content: '',
        }
    },
    async mounted(){
        this.highlightCode();
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
        const supabase = await this.initSupabase()
        if (this.$route.params.id){
            this.data_source_id = this.$route.params.id
        }

        if (this.data_source_id){
            this.loadDataSource(supabase, this.data_source_id)
        }

    },
    methods: {
        async initSupabase() {
            return useSupabaseClient()
        },
        highlightCode() {
            this.$nextTick(() => {
            const codeBlocks = document.querySelectorAll('pre code');
                codeBlocks.forEach((code) => {
                    Prism.highlightElement(code);
                });
            });
        },
        async loadDataSource(supabase, id){
            const { data, error } = await supabase
                .from('data')
                .select('id, name, content_data, isFile')
                .eq('id', id)

            if (error) {
                console.log(error)
                alert('There was an error loading your data source')
            }
            if (data) {
                this.data_source_id = data[0].id
                this.data_source_name = data[0].name
                if (data[0].isFile){
                    const file = await this.getFile(data[0].id)
                    this.data_source_content = file[0].content
                }else{
                    this.data_source_content = data[0].content_data
                }
            }
        },
        async getFile(id){

            const config = useRuntimeConfig()
            const supabase = createClient(
            config.supabase.url,
            config.supabase.key,
            {db: { schema: 'storage' }}
            );

            const { data, error } = await supabase
            .from('objects')
            .select('*')
            .eq('id', id)

            if (error) {
                console.log(error)
                alert('There was an error loading your data source')
            }else{
                return data
            }
        }
    },
    watch: {
        data_source_content: {
            handler: function (val, oldVal) {
                this.highlightCode();
            },
            deep: true
        },
    },
}
</script>