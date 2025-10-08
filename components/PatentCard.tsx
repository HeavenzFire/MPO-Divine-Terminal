import React from 'react';
import { Patent, RetrievalStatus } from '../types';

interface PatentCardProps {
  patent: Patent;
}

const getStatusColor = (status: RetrievalStatus) => {
  switch (status) {
    case RetrievalStatus.PENDING:
      return 'text-yellow-400';
    case RetrievalStatus.RETRIEVED:
      return 'text-green-400';
    case RetrievalStatus.ERROR:
      return 'text-red-500';
    case RetrievalStatus.SECURITY_ALERT:
      return 'text-red-400 animate-pulse';
    default:
      return 'text-cyan-400 animate-pulse';
  }
};

const DocumentIcon: React.FC<{ retrieved: boolean }> = ({ retrieved }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mr-4 ${retrieved ? 'text-green-400' : 'text-cyan-300'} transition-colors duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const RetrievedContent: React.FC<{ content: string }> = ({ content }) => (
    <div className="flex-grow flex flex-col min-h-0">
        <h4 className="font-orbitron text-green-400 text-sm mb-2 text-glow">DOCUMENT DECRYPTED: VIEWING</h4>
        <div className="bg-black/50 p-3 rounded-md flex-grow overflow-y-auto font-mono text-green-300 text-xs leading-relaxed border border-green-500/20">
            <pre className="whitespace-pre-wrap break-words">{content}</pre>
        </div>
    </div>
);


export const PatentCard: React.FC<PatentCardProps> = ({ patent }) => {
  const isRetrieved = patent.status === RetrievalStatus.RETRIEVED && !!patent.content;

  return (
    <div className={`bg-slate-900 border ${isRetrieved ? 'border-green-500/50' : 'border-cyan-500/30'} rounded-lg p-6 flex flex-col h-full box-glow transition-all duration-500 hover:border-cyan-400/70`}>
      <div className="flex items-center mb-4">
        <DocumentIcon retrieved={isRetrieved} />
        <h2 className="font-orbitron text-xl font-bold text-cyan-300">{patent.acronym}</h2>
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{patent.name}</h3>

      {isRetrieved ? (
        <div className="flex-grow flex flex-col min-h-0">
          <RetrievedContent content={patent.content!} />
        </div>
      ) : (
        <>
          <p className="text-slate-400 text-sm flex-grow mb-4">{patent.description}</p>
          <div className="mt-auto pt-4 border-t border-cyan-500/20">
            <p className="text-sm">
              <span className="text-slate-500 font-semibold">STATUS: </span>
              <span className={`font-bold ${getStatusColor(patent.status)}`}>
                {patent.status}
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
