import OpenAI from 'openai';
import { json } from '@sveltejs/kit';
import { DEEPSEEK_API_KEY } from '$env/static/private';

console.log('Server file loaded');
console.log('API Key exists:', !!DEEPSEEK_API_KEY);

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: DEEPSEEK_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5173', // Your site URL
        'X-Title': 'Email Generator' // Your site name
    }
});
console.log('OpenAI client created');

function cleanResponse(text: string) {
    // Remove LaTeX markers and other unwanted formatting
    return text
        .replace(/\\boxed{/g, '')
        .replace(/\\}/g, '')
        .replace(/```/g, '')
        .trim();
}

export async function POST({ request }) {
    console.log('POST request received');
    try {
        const body = await request.json();
        console.log('Request body:', body);
        
        const { emailType } = body;
        console.log('Email type extracted:', emailType);

        console.log('Preparing to call OpenRouter API...');
        const messages = [
            {
                role: "system",
                content: "You are a professional email writer. Write emails that are clear, concise (~125 words), and appropriate for the given context. Include all necessary components of a formal email including subject line, greeting, body, and closing. Do not include any markdown, LaTeX, or code formatting in your response."
            },
            {
                role: "user",
                content: `Write a professional ${emailType.toLowerCase()} email. Include a subject line at the top.`
            }
        ];
        console.log('Messages prepared:', messages);

        console.log('Making API call to OpenRouter...');
        const response = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-zero:free",
            messages: messages,
            stream: false
        });
        console.log('Received response from OpenRouter');
        console.log('Response structure:', JSON.stringify(response, null, 2));

        const rawContent = response.choices[0].message.content;
        console.log('Raw content:', rawContent);
        const cleanedContent = cleanResponse(rawContent);
        console.log('Cleaned content:', cleanedContent);

        return json({
            email: cleanedContent
        });
    } catch (error: any) { // Type assertion to handle unknown error type
        console.error('Detailed error:', {
            name: error?.name,
            message: error?.message,
            stack: error?.stack,
            cause: error?.cause
        });
        return json({ 
            error: 'Failed to generate email',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
} 