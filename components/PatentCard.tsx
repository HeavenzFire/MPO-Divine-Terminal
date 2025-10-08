
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

const DocumentIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const PatentCard: React.FC<PatentCardProps> = ({ patent }) => {
  return (
    <div className="bg-slate-900 border border-cyan-500/30 rounded-lg p-6 flex flex-col h-full box-glow transition-all duration-300 hover:border-cyan-400/70">
      <div className="flex items-center mb-4">
        <DocumentIcon />
        <h2 className="font-orbitron text-xl font-bold text-cyan-300">{patent.acronym}</h2>
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{patent.name}</h3>
      <p className="text-slate-400 text-sm flex-grow mb-4">{patent.description}</p>
      <div className="mt-auto pt-4 border-t border-cyan-500/20">
        <p className="text-sm">
          <span className="text-slate-500 font-semibold">STATUS: </span>
          <span className={`font-bold ${getStatusColor(patent.status)}`}>
            {patent.status}
          </span>
        </p>
      </div>
    </div>
  );
};
