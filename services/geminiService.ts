import { DocumentAnalysis } from '../types';

export const analyzeDocument = async (file: File, base64Content: string): Promise<DocumentAnalysis> => {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                base64Content,
                file: {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred during analysis.' }));
            throw new Error(errorData.error || `Server responded with status ${response.status}`);
        }

        const parsedData: DocumentAnalysis = await response.json();
        return parsedData;

    } catch (error) {
        console.error("Error calling /api/analyze:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to analyze the document: ${error.message}`);
        }
        throw new Error("Failed to analyze the document due to an unexpected error.");
    }
};