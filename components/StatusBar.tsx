
import React from 'react';

interface StatusBarProps {
    status: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ status }) => (
    <div className="w-full bg-black/50 border border-green-400/30 text-green-400 rounded-md p-3 text-center text-sm font-semibold tracking-widest animate-pulse">
        <span>SYSTEM STATUS: {status}</span>
    </div>
);
