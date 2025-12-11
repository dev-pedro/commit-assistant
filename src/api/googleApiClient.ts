import * as vscode from 'vscode';
import {
    GenerativeModel,
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai';

export async function generateCommitMessageWithGoogle(
    apiKey: string,
    googleModel: string,
    prompt: string
): Promise<string> {
    const genAI = new GoogleGenerativeAI(apiKey);
    let model: GenerativeModel;
    try {
        model = genAI.getGenerativeModel({ model: googleModel });
    } catch (error: any) {
        throw new Error(`[GoogleGenerativeAI Error]: Failed to get model '${googleModel}'. ${error.message}`);
    }

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];

    try {
        const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], safetySettings });
        return result.response.text();
    } catch (error: any) {
        // Lança o erro para ser tratado no 'suggestCommitMessage'
        throw error;
    }
}

export async function listGoogleModels(apiKey: string): Promise<{ name: string, displayName: string }[]> {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.json() as { error: { message: string } };
            throw new Error(`Failed to fetch models: ${response.statusText} - ${errorBody.error.message}`);
        }
        const data = await response.json() as { models: Array<{ name: string; displayName: string; supportedGenerationMethods: string[] }> };

        // Filtra e mapeia os modelos para o formato desejado
        const filteredModels = data.models
            .filter(model => model.supportedGenerationMethods.includes('generateContent'))
            .map(model => ({
                name: model.name.replace('models/', ''),
                displayName: model.displayName,
            }));

        return filteredModels;

    } catch (error: any) {
        throw new Error(`Error listing Google models: ${error.message}`);
    }
}