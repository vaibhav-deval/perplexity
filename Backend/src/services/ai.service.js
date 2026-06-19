import { config } from "dotenv";
config();
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "langchain";
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});
const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});
export async function generateResponse(message) {
  const response = await geminiModel.invoke([new HumanMessage(message)]);
  return response.text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(
      `You are a helpful assistant that generates a title for a chat based on the  message.
      User will provide a message and you will generate a title for the chat. The title should be concise, relevant, and capture the essence of the conversation. Please provide the title in 2-4 words without any additional explanation or context.`,
    ),
    new HumanMessage(
      `Generate a title for the following message: "${message}"`,
    ),
  ]);
  return response.text;
}
