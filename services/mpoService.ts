import { GoogleGenAI } from "@google/genai";
import { RetrievalStatus } from '../types';

type StatusUpdater = (patentId: string, newStatus: RetrievalStatus, content?: string) => void;
type SystemStatusUpdater = (status: string) => void;
type CompletionCallback = () => void;

// Gemini AI Setup
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePatentContent = async (patentName: string, patentDescription: string): Promise<string> => {
    try {
        const prompt = `You are a quantum archivist AI. Generate a concise, classified summary for the following top-secret document. The tone should be highly technical, futuristic, and sound like it's from a secure government terminal. It may contain technical jargon, codenames, and hints of redacted information. Use line breaks for readability. Do not use markdown formatting.

Document Name: ${patentName}
Description: ${patentDescription}

Generate the classified summary text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating patent content:", error);
        return "ERROR: DOCUMENT CORRUPTED. UNABLE TO RENDER CONTENT. [CODE: 77-B]";
    }
};

const retrievalSteps: { [key: string]: RetrievalStatus[] } = {
  erp: [
    RetrievalStatus.CONNECTING,
    RetrievalStatus.AUTHENTICATING,
    RetrievalStatus.DECRYPTING,
    RetrievalStatus.RETRIEVED,
  ],
  crm: [
    RetrievalStatus.CONNECTING,
    RetrievalStatus.SECURITY_ALERT,
    RetrievalStatus.BYPASSING,
    RetrievalStatus.DECRYPTING,
    RetrievalStatus.RETRIEVED,
  ],
  qvr: [
    RetrievalStatus.CONNECTING,
    RetrievalStatus.AUTHENTICATING,
    RetrievalStatus.ALIGNING,
    RetrievalStatus.DECRYPTING,
    RetrievalStatus.RETRIEVED,
  ],
};

const patentDetails: { [key: string]: { name: string; description: string } } = {
    erp: {
        name: 'Elysium Rejuvenation Protocol',
        description: 'A revolutionary protocol for cellular regeneration and biological age reversal. Unlocks latent genetic potential for vitality.',
    },
    crm: {
        name: 'Cellular Rebirth Matrix',
        description: 'Matrix-based technology for restructuring damaged tissue at a quantum level. Eradicates disease and physical trauma.',
    },
    qvr: {
        name: 'Quantum Vitality Restoration',
        description: 'Restores the bio-energetic field to its peak state, enhancing physical, mental, and spiritual well-being.',
    },
};

const patentOrder = ['erp', 'crm', 'qvr'];

const processPatent = (
    patentId: string, 
    updateStatus: StatusUpdater, 
    systemStatusUpdater: SystemStatusUpdater
): Promise<void> => {
  return new Promise(resolve => {
    const steps = retrievalSteps[patentId];
    let currentStepIndex = 0;

    const nextStep = async () => {
      if (currentStepIndex < steps.length) {
        const newStatus = steps[currentStepIndex];
        
        if (newStatus === RetrievalStatus.RETRIEVED) {
            systemStatusUpdater(`DECRYPTION COMPLETE. RENDERING DOCUMENT: ${patentId.toUpperCase()}`);
            const details = patentDetails[patentId];
            const content = await generatePatentContent(details.name, details.description);
            updateStatus(patentId, newStatus, content);
        } else {
            updateStatus(patentId, newStatus);
            systemStatusUpdater(`PROCESSING ${patentId.toUpperCase()}: ${newStatus}`);
        }
        
        currentStepIndex++;
        const delay = newStatus === RetrievalStatus.SECURITY_ALERT ? 3000 : 1500;
        setTimeout(nextStep, delay);
      } else {
        resolve();
      }
    };
    
    setTimeout(nextStep, 1000); // Initial delay before starting
  });
};

export const mockMpoRetrieval = async (
    updateStatus: StatusUpdater, 
    systemStatusUpdater: SystemStatusUpdater,
    onComplete: CompletionCallback
) => {
    for (const patentId of patentOrder) {
        await processPatent(patentId, updateStatus, systemStatusUpdater);
    }
    onComplete();
};
