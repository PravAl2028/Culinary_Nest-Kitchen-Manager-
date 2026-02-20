import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Ingredient, User, WeeklyPlanItem } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API Key is missing!");
    }
    return new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
};

export const generateRecipeDetails = async (dishName: string): Promise<string> => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Provide a concise recipe for "${dishName}". Include ingredients list and numbered steps. Keep it under 300 words. Format nicely with markdown (use **bold** for importance).`,
        });
        return response.text || "Could not generate recipe.";
    } catch (error) {
        console.error("AI Error:", error);
        return "Failed to connect to AI Chef. Please check your internet connection or API key.";
    }
};

export const suggestDishes = async (
    pantryText: string,
    knownRecipes: Recipe[],
    scope: 'cookbook' | 'global',
    history?: string
): Promise<{ suggestions: string[]; reasoning: string }> => {
    const ai = getClient();
    const recipesList = knownRecipes.map(r => r.name).join(', ');

    const prompt = `
    Context: I am planning a meal.
    Ingredients available at home: ${pantryText || "Not specified"}.
    My known Cookbook recipes: ${recipesList}.
    
    Task: Suggest 4 dishes.
    Constraint: ${scope === 'cookbook' 
        ? "ONLY suggest dishes that are strictly in my known Cookbook list that match the ingredients (if any)." 
        : "Suggest ANY dish (new or from cookbook) that can be made with the available ingredients."}
    
    1. List 4 dish names.
    2. Provide a short reasoning paragraph.

    ${history ? `Chat Context: ${history}` : ''}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "List of recommended dish names"
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: "A friendly paragraph explaining the choices"
                        }
                    }
                }
            }
        });
        
        const json = JSON.parse(response.text || "{}");
        return {
            suggestions: json.suggestions || [],
            reasoning: json.reasoning || "Here are some ideas based on your pantry."
        };
    } catch (error) {
        console.error("AI Error:", error);
        return {
            suggestions: [],
            reasoning: "AI is currently taking a nap. Please try again later."
        };
    }
};

export const chatWithChef = async (message: string): Promise<string> => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: message,
            config: {
                systemInstruction: "You are a helpful, warm, and encouraging kitchen assistant. Help the user with cooking questions, measurements, or ideas.",
            }
        });
        return response.text || "I didn't catch that.";
    } catch (e) {
        console.error(e);
        return "Sorry, I'm having trouble thinking right now.";
    }
};

export const generateWeeklyPlan = async (users: User[]): Promise<WeeklyPlanItem[]> => {
    const ai = getClient();
    
    let preferencesText = "";
    users.forEach(u => {
        if (u.preferences) {
            preferencesText += `User ${u.name} likes:\n`;
            preferencesText += `- Breakfast: ${u.preferences.breakfast.join(", ")}\n`;
            preferencesText += `- Lunch: ${u.preferences.lunch.join(", ")}\n`;
            preferencesText += `- Dinner: ${u.preferences.dinner.join(", ")}\n\n`;
        }
    });

    if (!preferencesText) return [];

    const prompt = `
    Create a 7-day meal plan (Monday to Sunday) with Breakfast, Lunch, and Dinner for a family.
    
    Here are the individual preferences of the family members:
    ${preferencesText}
    
    Goal:
    - Choose a common dish for the whole family for each meal.
    - Try to satisfy everyone's preferences throughout the week (rotate favorites).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.STRING, description: "Day of the week (e.g., Monday)" },
                            breakfast: { type: Type.STRING },
                            lunch: { type: Type.STRING },
                            dinner: { type: Type.STRING },
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        console.error(e);
        return [];
    }
}