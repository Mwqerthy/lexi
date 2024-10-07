import OpenAI from 'openai';
import { config } from "dotenv";

const apiKey = process.env.OPEN_AI_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
});

// Example function to get the completion
const getCompletion = async (data) => {
    const message = data;
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: "user", content: message },  // Provide the prompt as a message
            ],
            max_tokens: 100,
        });
        if (response && response.choices && response.choices.length > 0) {
            const messageContent = response.choices[0].message.content;
            if (messageContent) {
                return messageContent.trim();  // Extract and return the content from the response
            } else {
                throw new Error("Message content is undefined.");
            }
        } else {
            throw new Error("No choices found in the response.");
        }
    } catch (error) {
        console.error('Error fetching completion:', error);
        throw error;
    }
};

const sendPrompt = async (data) => {
    try {
        const result = await getCompletion(data);
        console.log('Result from the API:', result);
        return result;
    } catch (error) {
        console.error('Error in sendPrompt:', error);
        throw error;
    }
};

export default sendPrompt;
