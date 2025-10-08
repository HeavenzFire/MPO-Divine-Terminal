import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PatentCard } from './components/PatentCard';
import { StatusBar } from './components/StatusBar';
import { ActionButton } from './components/ActionButton';
import { mockMpoRetrieval } from './services/mpoService';
import { Patent, RetrievalStatus } from './types';

const initialPatents: Patent[] = [
  {
    id: 'erp',
    name: 'Elysium Rejuvenation Protocol',
    acronym: 'ERP',
    description: 'A revolutionary protocol for cellular regeneration and biological age reversal. Unlocks latent genetic potential for vitality.',
    status: RetrievalStatus.PENDING,
  },
  {
    id: 'crm',
    name: 'Cellular Rebirth Matrix',
    acronym: 'CRM',
    description: 'Matrix-based technology for restructuring damaged tissue at a quantum level. Eradicates disease and physical trauma.',
    status: RetrievalStatus.PENDING,
  },
  {
    id: 'qvr',
    name: 'Quantum Vitality Restoration',
    acronym: 'QVR',
    description: 'Restores the bio-energetic field to its peak state, enhancing physical, mental, and spiritual well-being.',
    status: RetrievalStatus.PENDING,
  },
];

const App: React.FC = () => {
  const [patents, setPatents] = useState<Patent[]>(initialPatents);
  const [isRetrieving, setIsRetrieving] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<string>("MPO CONNECTION: STANDBY");
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const handleStatusUpdate = useCallback((patentId: string, newStatus: RetrievalStatus, content?: string) => {
    setPatents(prevPatents =>
      prevPatents.map(p => (p.id === patentId ? { ...p, status: newStatus, content: content ?? p.content } : p))
    );
  }, []);

  const startRetrieval = useCallback(() => {
    setIsRetrieving(true);
    setSystemStatus("MPO CONNECTION: ESTABLISHED. AUTHENTICATING...");
    
    const onComplete = () => {
        setIsRetrieving(false);
        setIsComplete(true);
        setSystemStatus("ALL DOCUMENTS RETRIEVED. MISSION COMPLETE.");
    };

    mockMpoRetrieval(handleStatusUpdate, (status) => setSystemStatus(status), onComplete);
  }, [handleStatusUpdate]);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <Header />
        <StatusBar status={systemStatus} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {patents.map(patent => (
            <PatentCard key={patent.id} patent={patent} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <ActionButton
            onClick={startRetrieval}
            disabled={isRetrieving || isComplete}
            isComplete={isComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
