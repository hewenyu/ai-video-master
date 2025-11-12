
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { DecisionPoint } from './DecisionPoint';

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };
    
    const handleDecision = (choice: string) => {
        if (!isLoading) {
            onSendMessage(choice);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-800 overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={msg.id + '-' + index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg lg:max-w-xl px-5 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                            {typeof msg.text === 'string' ? <p className="whitespace-pre-wrap">{msg.text}</p> : msg.text}
                            {msg.decision && <DecisionPoint decision={msg.decision} onDecision={handleDecision} disabled={isLoading} />}
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-lg lg:max-w-xl px-5 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                            <LoadingSpinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700 bg-gray-800/70 backdrop-blur-sm">
                <div className="relative">
                    <textarea
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pr-20 pl-4 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-shadow"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="请输入您的想法..."
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        发送
                    </button>
                </div>
            </div>
        </div>
    );
};
