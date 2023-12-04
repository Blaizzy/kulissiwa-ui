import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from 'ai';


export const config = {
    runtime: 'edge',
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
        const body = await request.json();
        const { messages, model_name } = body;
        const tools = [
            {
                name: "retriever",
                description: "Useful for retrieving information from a database or API about a user's request.",
                parameters: {
                    type: "object",
                    properties: {
                        user_query: {
                            type: "string",
                        },
                    },
                    required: ["user_query"],
                }  
            },
        ]
        try {
            // if (!token) {
            //     return res.status(401).json({ error: 'Unauthorized' });
            // }

 
           
            const openai = new OpenAI(process.env.OPENAI_API_KEY);
            const response = await openai.chat.completions.create({
                messages: [{"role": "system", "content": "You are a helpful assistant. Respond to the following prompt by using function_call then summarize actions. Ask for clarification if a user request is ambiguous."}, ...messages],
                model: model_name,
                functions: tools,
                function_call: "auto",
                stream: true,
            });
            
            return new StreamingTextResponse(OpenAIStream(response), {
                status: 200,
                headers: withCORS({
                    'Content-Type': 'text/event-stream; charset=utf-8',
                }),
            });

           
        } catch (error) {
            console.error('OpenAI error:', error);
            return new Response(JSON.stringify(error), {
                status: 500,
                headers: withCORS({ 'Content-Type': 'application/json' }),
            });
        }
        
    }
}