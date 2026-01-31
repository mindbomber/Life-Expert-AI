
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.API_KEY || "";
    this.ai = new GoogleGenAI({ apiKey });
  }

  async sendMessageStream(
    modelName: string,
    systemInstruction: string,
    history: Message[],
    message: string,
    onChunk: (text: string) => void
  ) {
    const chat = this.ai.chats.create({
      model: modelName,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    // Construct history for Gemini chat
    // Note: Gemini chat history is usually handled by the SDK internally if we use chat.sendMessage
    // However, to re-initialize with existing messages, we can pass them.
    // For this app, we'll use a new chat instance and send the history if needed, 
    // but typically a session persists.
    
    // Convert our internal message format to history if needed.
    // Since we're using a single expert session, we'll keep the context.

    try {
      const result = await chat.sendMessageStream({ message });
      let fullText = "";
      for await (const chunk of result) {
        const textChunk = chunk.text;
        if (textChunk) {
          fullText += textChunk;
          onChunk(fullText);
        }
      }
      return fullText;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
