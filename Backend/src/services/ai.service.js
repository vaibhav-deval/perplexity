import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.AI_API_KEY,
});

export async function generateResponse() {
  model.invoke("what is GENAI explain under 100 words.").then((response) => {
    console.log(response.text);
  });
}
