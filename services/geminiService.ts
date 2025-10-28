
import { GoogleGenAI, Modality } from "@google/genai";
import { Feature } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const verifyIsPersonalPhoto = async (imageBase64: string): Promise<boolean> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                { text: "Analyze this image. Is it a personal photo, like a portrait, selfie, or a picture primarily featuring one or more people? Please answer with only 'yes' or 'no'." }
            ]
        },
    });
    const text = response.text.toLowerCase().trim();
    return text.includes('yes');
  } catch (error) {
    console.error("Error verifying photo:", error);
    // In case of API error, fail open to not block user, or handle as needed.
    // For this app, we'll fail closed to ensure prompt adherence.
    return false;
  }
};

export const generateCyberpunkImage = async (imageBase64: string, features: Feature[]): Promise<string | null> => {
    try {
        const featureText = features.map(f => f.name).join(', ');
        const prompt = `Transform this personal photo into a high-quality, photorealistic cyberpunk style. 
        Incorporate the following features seamlessly: ${featureText}. 
        The final image should have a dark, neon-lit, futuristic aesthetic. 
        Maintain the person's core likeness but enhance them with the requested cybernetic and stylistic elements.
        The overall mood should be cinematic and atmospheric.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates?.[0]?.content.parts ?? []) {
            if (part.inlineData) {
              return part.inlineData.data;
            }
        }
        return null;

    } catch (error) {
        console.error("Error generating cyberpunk image:", error);
        return null;
    }
};
