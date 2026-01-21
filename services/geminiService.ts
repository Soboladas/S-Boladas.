
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getProductRecommendation(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O usuário está procurando por: "${query}". Como um assistente de vendas da loja "Só Boladas" (venda de eletrônicos usados), recomende brevemente que tipo de produto ele deve focar e dê uma dica de economia.`
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return null;
  }
}
