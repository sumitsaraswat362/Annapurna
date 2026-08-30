import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from './secrets';

export const DEFAULT_MODEL = 'gemini-2.5-flash';

let _aiInstance: GoogleGenAI | null = null;

export async function getAI(): Promise<GoogleGenAI> {
  if (_aiInstance) return _aiInstance;
  try {
    const apiKey = await getGeminiApiKey();
    _aiInstance = new GoogleGenAI({ apiKey });
  } catch {
    _aiInstance = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID || 'project-a9c284f8-6bca-440a-a0c',
      location: 'us-central1',
    });
  }
  return _aiInstance;
}

// Backward-compatible sync export for existing code
let _syncInstance: GoogleGenAI | null = null;
function getSyncAI(): GoogleGenAI {
  if (_syncInstance) return _syncInstance;
  if (process.env.GEMINI_API_KEY) {
    _syncInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } else {
    _syncInstance = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID || 'project-a9c284f8-6bca-440a-a0c',
      location: 'us-central1',
    });
  }
  return _syncInstance;
}

export const ai = getSyncAI();
