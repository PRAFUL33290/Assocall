import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleIcon, CloseIcon, SendIcon, UserIcon, SparklesIcon, LoadingSpinner } from './icons';
import { ChatMessage } from '../types';
import { sendMessageToChatStream } from '../services/geminiService';
import Logo from './Logo';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await sendMessageToChatStream(input);
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Erreur du Tchat :", error);
            setMessages(prev => [...prev, { role: 'model', text: "Désolé, j'ai rencontré une erreur. Veuillez réessayer." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-asso-blue text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-50"
                aria-label="Ouvrir/Fermer le Tchat"
            >
                {isOpen ? <CloseIcon /> : <ChatBubbleIcon />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-full max-h-[600px] bg-brand-light shadow-2xl rounded-lg flex flex-col z-40 animate-fade-in-up">
                    <header className="p-4 bg-brand-lighter rounded-t-lg flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Logo textColorClassName="text-white" />
                        </h3>
                    </header>
                    <div ref={chatContentRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="p-2 bg-asso-green rounded-full h-fit"><SparklesIcon /></div>}
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-asso-blue text-white' : 'bg-brand-lighter text-gray-200'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                                {msg.role === 'user' && <div className="p-2 bg-gray-600 rounded-full h-fit"><UserIcon /></div>}
                            </div>
                        ))}
                         {isLoading && messages[messages.length - 1]?.role !== 'model' && (
                            <div className="flex gap-3 justify-start">
                                <div className="p-2 bg-asso-green rounded-full h-fit"><SparklesIcon /></div>
                                <div className="max-w-xs p-3 rounded-lg bg-brand-lighter text-gray-200">
                                   <LoadingSpinner />
                                </div>
                            </div>
                        )}
                    </div>
                    <footer className="p-4 border-t border-brand-lighter">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                                placeholder="Posez votre question..."
                                className="flex-1 p-2 bg-brand-dark border-2 border-brand-lighter rounded-lg focus:ring-2 focus:ring-asso-blue focus:border-asso-blue transition-colors text-white"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="p-3 bg-asso-blue text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 transition-colors"
                                aria-label="Envoyer le message"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};

export default ChatBot;