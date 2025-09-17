import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DocumentAnalysis } from "../types";

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    metadata: {
      type: Type.OBJECT,
      properties: {
        fileName: { type: Type.STRING, description: 'The original name of the document file.' },
        fileType: { type: Type.STRING, description: 'The MIME type of the document.' },
        fileSize: { type: Type.NUMBER, description: 'The size of the document in bytes.' },
        company: { type: Type.STRING, description: 'The name of the company that authored the document. Infer if not explicitly stated.' },
        contactPerson: { type: Type.STRING, description: 'The primary contact person mentioned. Infer if not explicitly stated.' },
        documentDate: { type: Type.STRING, description: 'The main date of the document (e.g., "YYYY-MM-DD"). Infer if not explicitly stated.' },
      },
      required: ['fileName', 'fileType', 'fileSize', 'company', 'contactPerson', 'documentDate']
    },
    executiveSummary: {
      type: Type.STRING,
      description: 'A concise, one-paragraph summary of the document\'s purpose and key proposals.'
    },
    fullText: {
        type: Type.STRING,
        description: 'The full, complete, and unabridged text content extracted from the document.'
    },
    briefObjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of the main goals or objectives stated in the document.'
    },
    requirements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of key requirements, specifications, or needs outlined.'
    },
    scope: {
      type: Type.OBJECT,
      properties: {
        inScope: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'A list of items, tasks, or deliverables explicitly included in the project scope.'
        },
        outOfScope: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'A list of items explicitly stated as being outside the project scope.'
        }
      },
      required: ['inScope', 'outOfScope']
    },
    economicProposal: {
      type: Type.OBJECT,
      properties: {
        costs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'A list of all stated costs, fees, or pricing details.'
        },
        timelines: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'A list of key dates, deadlines, or timelines mentioned.'
        },
        resources: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'A list of resources (personnel, equipment, etc.) mentioned as required.'
        }
      },
      required: ['costs', 'timelines', 'resources']
    }
  },
  required: ['metadata', 'executiveSummary', 'fullText', 'briefObjectives', 'requirements', 'scope', 'economicProposal']
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable is not set on the server.");
        return res.status(500).json({ error: "Server configuration error: Missing API key." });
    }

    try {
        const { base64Content, file } = req.body;
        if (!base64Content || !file || !file.name || !file.type || !file.size) {
            return res.status(400).json({ error: "Missing required fields: base64Content or file details." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Content,
                            mimeType: file.type
                        }
                    },
                    {
                        text: `Analyze this document named "${file.name}". First, extract the full, raw text content. Then, based on the content, provide a structured JSON output. The file size is ${file.size} bytes. Fill in all fields of the JSON schema accurately.`
                    }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: analysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData: DocumentAnalysis = JSON.parse(jsonText);
        
        parsedData.metadata.fileName = file.name;
        parsedData.metadata.fileType = file.type;
        parsedData.metadata.fileSize = file.size;
        
        return res.status(200).json(parsedData);

    } catch (error) {
        console.error("Error in /api/analyze handler:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to analyze the document via the AI model.", details: errorMessage });
    }
}
