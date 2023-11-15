
import {
  RunnableSequence,
  RunnableMap,
  RunnableBranch,
  RunnableLambda,
  Runnable,
} from "langchain/schema/runnable";
import { HumanMessage, AIMessage, BaseMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import {
  PromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { EmbeddingsFilter } from "langchain/retrievers/document_compressors/embeddings_filter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from "langchain/vectorstores/pinecone";

export const config = {
    runtime: 'edge',
};

const RESPONSE_TEMPLATE = `You are an expert researcher and writer, tasked with answering any question.

Generate a comprehensive and informative, yet concise answer of 250 words or less for the
given question based solely on the provided search results (URL and content). You must
only use information from the provided search results. Use an unbiased and
journalistic tone. Combine search results together into a coherent answer. Do not
repeat text. Cite search results using [\${{number}}] notation. Only cite the most
relevant results that answer the question accurately. Place these citations at the end
of the sentence or paragraph that reference them - do not put them all at the end. If
different results refer to different entities within the same name, write separate
answers for each entity. If you want to cite multiple results for the same sentence,
format it as \`[\${{number1}}] [\${{number2}}]\`. However, you should NEVER do this with the
same number - if you want to cite \`number1\` multiple times for a sentence, only do
\`[\${{number1}}]\` not \`[\${{number1}}] [\${{number1}}]\`

You should use bullet points in your answer for readability. Put citations where they apply
rather than putting them all at the end.

If there is nothing in the context relevant to the question at hand, just say "Hmm,
I'm not sure." Don't try to make up an answer.

Anything between the following \`context\` html blocks is retrieved from a knowledge
bank, not part of the conversation with the user.

<context>
    {context}
<context/>

REMEMBER: If there is no relevant information within the context, just say "Hmm, I'm
not sure." Don't try to make up an answer. Anything between the preceding 'context'
html blocks is retrieved from a knowledge bank, not part of the conversation with the
user.`;

const REPHRASE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone Question:`;

const getBaseRetriever = async (embeddings, namespace, data_source) => {
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        { pineconeIndex: pineconeIndex, namespace: namespace},

    )
    return vectorStore.asRetriever(
        {
            searchKwargs: {
                topK: 5,
                filter: {
                    "source": {"$in": data_source}
                }
            },
        }
    );
}


const _getRetriever = async (namespace, data_source) => {
    const embeddings = new OpenAIEmbeddings({})
    const baseCompressor = new EmbeddingsFilter({
        embeddings: embeddings,
        similarityThreshold: 0.7,
    })

    const baseRetriever = await getBaseRetriever(embeddings, namespace, data_source);
    

    const retriever = new ContextualCompressionRetriever({
        baseCompressor,
        baseRetriever,
    }).withConfig({
        runName: "FinalSourceRetriever",
    });
    return retriever;
};

const serializeHistory = (input) => {
    const chatHistory = input.chat_history || [];
    const convertedChatHistory = [];
    for (const message of chatHistory) {
        if (message.role === "user") {
            convertedChatHistory.push(new HumanMessage({content: message.content}));
        } else if (message.role === "assistant") {
            convertedChatHistory.push(new AIMessage({content: message.content}));
        }
    }
    return convertedChatHistory;
};

const formatDocs = (docs) => {
    return docs
    .map((doc, index) => `<doc id="${index}">${doc.content}</doc>`)
    .join("\n");
};

const createRetrieverChain = (llm, retriever) => {
    const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(REPHRASE_TEMPLATE);
    const condenseQuestionChain = RunnableSequence.from([
        CONDENSE_QUESTION_PROMPT,
        llm,
        new StringOutputParser(),
    ]).withConfig({ 
        runName: "CondenseQuestion",
    });

    const hasHistoryCheckFN = RunnableLambda.from(
        (input) => input.chat_history.lenght > 0,
    ).withConfig({
        runName: "HasChatHistoryCheck",
    });

    const conversationChain = condenseQuestionChain.pipe(retriever).withConfig({
        runName: "RetrievalChainWithHistory",
    });

    const basicRetrievalChain = RunnableLambda.from(
        (input) => input.question,
    )
    .withConfig({
        runName: "BasicRetrievalChain",
    })
    .pipe(retriever)
    .withConfig({
        runName: "RetrievalChainWithNoHistory",
    });

    return RunnableBranch.from([
        [hasHistoryCheckFN, conversationChain],
        basicRetrievalChain,
    ]).withConfig({
        runName: "RouteDependingOnChatHistory",
    });
};


const formatChatHistoryAsString = (history) => {
    return history
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");
};

const createChain = (llm, retriever) => {
    const retrieverChain = createRetrieverChain(llm, retriever).pipe(
        RunnableLambda.from(formatDocs).withConfig({
            runName: "FormatDocumentChunks",
        }),
    );

    
    const context = RunnableMap.from({
        context: RunnableSequence.from([
            ({ question, chat_history }) => ({
                question,
                chat_history: formatChatHistoryAsString(chat_history),
            }),
            retrieverChain,
        ]),
        question: RunnableLambda.from((input) => input.question).withConfig({
            runName: "Itemgetter:question",
        }),
        chat_history: RunnableLambda.from((input) => input.chat_history).withConfig({
            runName: "Itemgetter:chat_history",
        }),
    }).withConfig({
        tags: ["RetrieveDocs"]
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", RESPONSE_TEMPLATE],
        new MessagesPlaceholder("chat_history")
        ["human", "{question}"],
    ])

    const responseSynthesizerChain = RunnableSequence.from([
        prompt,
        llm,
        new StringOutputParser(),
    ]).withConfig({
        tags: ["GenerateResponse"]
    });

    return RunnableSequence.from([
        {
            question: RunnableLambda.from((input) => input.question).withConfig({
                runName: "Itemgetter:question",
            }),
            chat_history: RunnableLambda.from(serializeHistory).withConfig({
                runName: "SerializeHistory",
            }),
        },
        context,
        responseSynthesizerChain,

    ]);

};

function withCORS(headers) {
    // Default CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Replace '*' with your client's origin for better security
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // Tells browsers to cache the OPTIONS response for 1 day
    };
  
    // Merge any additional headers
    return { ...corsHeaders, ...headers };
}


export default async function handleChat(request) {
    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: withCORS({}),
            status: 204
        });
    }
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            const input = body.input;
            const model_name = body.model_name;
            const namespace = body.namespace;
            const data_source = body.data_source;
            // const llm = new ChatOpenAI({
            //     modelName: model_name,
            //     temperature: 0,
            
            // })
            
            console.log(process.env.PINECONE_API_KEY);
            console.log(process.env.PINECONE_ENVIRONMENT);
            
            
          
            // const retriever = await _getRetriever(namespace, data_source);
            // const answerChain = createChain(llm, retriever);

            // const response = await answerChain.run(input);
            // console.log(response);

            // const stream = await answerChain.streamLog(input, streamOptions = {
            //     includeNames: body.includeNames,
            // })
            return new Response("Working", {
                status: 200,
                headers: withCORS({
                    'Content-Type': 'text/event-stream; charset=utf-8',
                }),
            });
        } catch (error) {
            console.log(error);
            return new Response(error.stack || error, { status: 500, headers: withCORS({ 'Content-Type': 'application/json' }) });
        }
    }
}