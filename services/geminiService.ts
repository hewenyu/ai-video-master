
import { GoogleGenAI } from "@google/genai";
import { RESPONSE_SCHEMA } from '../constants';
import { ScriptData, DecisionPoint } from "../types";

interface ParsedResponse {
    script?: ScriptData;
    decisionPoint?: DecisionPoint;
    question?: string;
    confirmation?: string;
}

export const generateScript = async (
    ai: GoogleGenAI,
    systemInstruction: string,
    history: string
): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
                temperature: 0.8,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate script from Gemini API.");
    }
};

export const parseGeminiResponse = (responseText: string): ParsedResponse => {
    try {
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanedText);

        if (data.script) {
            return { script: data.script as ScriptData };
        }
        if (data.decisionPoint) {
            return { decisionPoint: data.decisionPoint as DecisionPoint };
        }
        if (data.question) {
            return { question: data.question as string };
        }
        if (data.confirmation) {
            return { confirmation: data.confirmation as string };
        }
        throw new Error("Response is missing 'script', 'decisionPoint', 'question' or 'confirmation' key.");
    } catch (error) {
        console.error("Failed to parse Gemini response:", error);
        console.error("Raw response text:", responseText);
        throw new Error("Invalid JSON format received from the AI.");
    }
};
