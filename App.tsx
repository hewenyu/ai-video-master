import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message, ConversationState, ScriptData, DecisionPoint as DecisionPointType } from './types';
import { SYSTEM_PROMPT } from './constants';
import { ChatInterface } from './components/ChatInterface';
import { ScriptDisplay } from './components/ScriptDisplay';
import { generateScript, parseGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init1',
            sender: 'ai',
            text: "你好！我是您的 AI 项目管家 (PM)。我将引导您完成一场轻松的对话，来了解您的需求，然后我的专家团队将为您打造一个完美的带货视频脚本。",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [conversationState, setConversationState] = useState<ConversationState>(ConversationState.GATHERING_INFO);
    const [scriptData, setScriptData] = useState<ScriptData | null>(null);

    const fullConversationHistory = useRef<string[]>([]);
    const isInitialized = useRef(false);

    const addMessage = (sender: 'ai' | 'user', text: string | React.ReactNode, decision?: DecisionPointType) => {
        const newMessage: Message = {
            id: Date.now().toString() + Math.random(),
            sender,
            text,
            decision
        };
        setMessages(prev => [...prev, newMessage]);
    };

    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const kickstartConversation = async () => {
            setIsLoading(true);
            try {
                // Initialize history with the first AI message
                fullConversationHistory.current.push(`PM: ${messages[0].text}`);
                
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const responseText = await generateScript(ai, SYSTEM_PROMPT, fullConversationHistory.current.join('\n\n'));
                const parsedResponse = parseGeminiResponse(responseText);

                if (parsedResponse.question) {
                    addMessage('ai', parsedResponse.question);
                    fullConversationHistory.current.push(`PM: ${parsedResponse.question}`);
                } else {
                    throw new Error("AI did not ask a question to start the conversation.");
                }
            } catch (error) {
                console.error("Error kicking off conversation:", error);
                addMessage('ai', "抱歉，启动时遇到问题，请刷新页面重试。");
            } finally {
                setIsLoading(false);
            }
        };

        kickstartConversation();
    }, []); // Run only once on mount

    const handleUserSubmit = useCallback(async (text: string) => {
        addMessage('user', text);
        fullConversationHistory.current.push(`User: ${text}`);

        if (conversationState === ConversationState.COMPLETED) {
            setScriptData(null); // Clear old script for revision
        }

        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const responseText = await generateScript(ai, SYSTEM_PROMPT, fullConversationHistory.current.join('\n\n'));
            const parsedResponse = parseGeminiResponse(responseText);
            
            if (parsedResponse.question) {
                setConversationState(ConversationState.GATHERING_INFO);
                addMessage('ai', parsedResponse.question);
                fullConversationHistory.current.push(`PM: ${parsedResponse.question}`);
            } else if (parsedResponse.confirmation) {
                setConversationState(ConversationState.AWAITING_CONFIRMATION);
                addMessage('ai', parsedResponse.confirmation);
                fullConversationHistory.current.push(`PM: ${parsedResponse.confirmation}`);
            } else if (parsedResponse.decisionPoint) {
                setConversationState(ConversationState.AWAITING_DECISION);
                addMessage('ai', parsedResponse.decisionPoint.question, parsedResponse.decisionPoint);
                fullConversationHistory.current.push(`PM Question: ${parsedResponse.decisionPoint.question}`);
            } else if (parsedResponse.script) {
                setScriptData(parsedResponse.script);
                setConversationState(ConversationState.COMPLETED);
                addMessage('ai', "视频方案已生成！请在右侧查看详情。如果您有任何修改意见，请随时提出。");
                fullConversationHistory.current.push(`AI Script:\n${JSON.stringify(parsedResponse.script, null, 2)}`);
            } else {
                 throw new Error("Invalid response format from AI.");
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            addMessage('ai', "抱歉，我的专家团队在讨论时遇到了一点问题。请稍后再试。");
        } finally {
            setIsLoading(false);
        }
    }, [conversationState]);


    return (
        <div className="flex flex-col lg:flex-row h-screen font-sans bg-gray-900 text-gray-200">
            <div className="lg:w-1/2 flex flex-col h-full border-r border-gray-700">
               <header className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                    <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        AI 视频脚本大师
                    </h1>
                    <p className="text-sm text-center text-gray-400 mt-1">与 AI 协同创作，生成高转化带货视频方案</p>
                </header>
                <ChatInterface
                    messages={messages}
                    onSendMessage={handleUserSubmit}
                    isLoading={isLoading}
                />
            </div>
            <div className="lg:w-1/2 flex flex-col h-full">
                <ScriptDisplay scriptData={scriptData} isLoading={isLoading && conversationState !== ConversationState.GATHERING_INFO && conversationState !== ConversationState.AWAITING_CONFIRMATION} />
            </div>
        </div>
    );
};

export default App;