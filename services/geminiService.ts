import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface SpriteAnalysisResult {
  rows: number;
  cols: number;
}

export const analyzeSpriteSheet = async (base64Image: string): Promise<SpriteAnalysisResult | null> => {
  try {
    // Remove header if present (data:image/png;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64
            }
          },
          {
            text: "Analyze this sprite sheet image. Count how many rows and columns of distinct character sprites are arranged in the grid. Ignore empty padding if possible. Return the result in JSON format."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rows: { type: Type.INTEGER, description: "Number of rows detected" },
            cols: { type: Type.INTEGER, description: "Number of columns detected" }
          },
          required: ["rows", "cols"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const result = JSON.parse(text) as SpriteAnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};