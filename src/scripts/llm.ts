import { LLMonitorHandler } from "langchain/callbacks/handlers/llmonitor";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const Prompt = async (llmprompt: string) => {
  const prompt = llmprompt;
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-0125-preview",
  });
  return chatCompletion.choices[0].message;
};
