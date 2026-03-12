import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askMathAI(prompt: string, context?: string) {
  try {
    const model = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a mathematical expert. ${context ? `Context: ${context}` : ""}
      Question: ${prompt}
      Provide a clear, concise explanation and the solution. Use LaTeX for math if needed.`,
    });
    const response = await model;
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't process that mathematical request.";
  }
}
