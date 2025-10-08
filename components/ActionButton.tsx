
import React from 'react';

interface ActionButtonProps {
    onClick: () => void;
    disabled: boolean;
    isComplete: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, isComplete }) => {
    const getButtonText = () => {
        if (isComplete) return "DOCUMENTS RETRIEVED";
        if (disabled) return "PROTOCOL ACTIVE...";
        return "INITIATE RETRIEVAL PROTOCOL";
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="font-orbitron bg-cyan-500/80 text-slate-950 font-bold py-3 px-8 rounded-md
                       transition-all duration-300 ease-in-out
                       hover:enabled:bg-cyan-400 hover:enabled:shadow-lg hover:enabled:shadow-cyan-500/50
                       disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50
                       text-glow"
        >
            {getButtonText()}
        </button>
    );
};
