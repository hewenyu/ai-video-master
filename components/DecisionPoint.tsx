
import React from 'react';
import { DecisionPoint as DecisionPointType } from '../types';

interface DecisionPointProps {
    decision: DecisionPointType;
    onDecision: (choice: string) => void;
    disabled: boolean;
}

export const DecisionPoint: React.FC<DecisionPointProps> = ({ decision, onDecision, disabled }) => {
    return (
        <div className="mt-4 space-y-2">
            {decision.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => onDecision(option)}
                    disabled={disabled}
                    className="w-full text-left bg-purple-500/20 text-purple-300 border border-purple-500/50 rounded-lg px-4 py-2 hover:bg-purple-500/40 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                   {option}
                </button>
            ))}
        </div>
    );
};
