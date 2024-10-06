
import OpenAI from 'openai'
import { config } from "dotenv"

config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Example function to get the completion
const getCompletion = async (req, res) => {
    const message = req.body.data
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: "user", content: message }  // Provide the prompt as a message
            ],
            max_tokens: 100,
        });
        //return response.choices[0].text.trim();
        if (response && response.choices && response.choices.length > 0) {
            const messageContent = response.choices[0].message.content;
            if (messageContent) {
                res.send(messageContent.trim());  // Extract and return the content from the response
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


export default getCompletion