
import { RetrievalStatus } from '../types';

type StatusUpdater = (patentId: string, newStatus: RetrievalStatus) => void;
type SystemStatusUpdater = (status: string) => void;
type CompletionCallback = () => void;

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

const patentOrder = ['erp', 'crm', 'qvr'];

const processPatent = (
    patentId: string, 
    updateStatus: StatusUpdater, 
    systemStatusUpdater: SystemStatusUpdater
): Promise<void> => {
  return new Promise(resolve => {
    const steps = retrievalSteps[patentId];
    let currentStepIndex = 0;

    const nextStep = () => {
      if (currentStepIndex < steps.length) {
        const newStatus = steps[currentStepIndex];
        updateStatus(patentId, newStatus);
        
        // Update system status for more engaging feedback
        systemStatusUpdater(`PROCESSING ${patentId.toUpperCase()}: ${newStatus}`);
        
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
