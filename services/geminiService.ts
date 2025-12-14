import { GoogleGenAI, Type } from "@google/genai";
import { WordCategory } from "../types";

const SYSTEM_INSTRUCTION = `
You are an educational assistant for a classroom game called "Impostor" (like Spyfall). 
Your goal is to generate vocabulary lists based on a topic provided by the teacher.
The words should be distinct, clear, and suitable for the requested difficulty level or language.
`;

export const generateVocabularyList = async (topic: string, language: string = 'English'): Promise<WordCategory | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key not found");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a list of 15 unique words related to the topic: "${topic}". The words should be in ${language}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categoryName: {
              type: Type.STRING,
              description: "A short, catchy title for the category (in the user's requested language if possible)"
            },
            words: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 15 nouns or verbs related to the topic"
            }
          },
          required: ["categoryName", "words"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    return {
      id: `gen-${Date.now()}`,
      name: data.categoryName,
      words: data.words,
      isCustom: true
    };

  } catch (error) {
    console.error("Error generating vocabulary:", error);
    return null;
  }
};