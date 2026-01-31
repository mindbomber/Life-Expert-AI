
import React, { useState, useRef, useEffect } from 'react';
import { Message, ExpertConfig } from '../types';
import { geminiService } from '../services/gemini';

interface ChatInterfaceProps {
  expert: ExpertConfig;
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ expert, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: expert.orientationQuestion, id: 'initial' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      id: Date.now().toString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { role: 'model', text: '', id: modelMessageId }]);

    try {
      await geminiService.sendMessageStream(
        'gemini-3-flash-preview',
        expert.systemInstruction,
        messages,
        input,
        (text) => {
          setMessages(prev => 
            prev.map(m => m.id === modelMessageId ? { ...m, text } : m)
          );
        }
      );
    } catch (error) {
      setMessages(prev => 
        prev.map(m => m.id === modelMessageId ? { ...m, text: "I'm sorry, I encountered an error. Please try again." } : m)
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className={`p-4 ${expert.bgColor} flex items-center justify-between border-b`}>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            title="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-2xl">{expert.icon}</div>
          <div>
            <h2 className={`font-bold text-lg ${expert.color}`}>{expert.role}</h2>
            <p className="text-xs text-slate-500">Active Consultation</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.text || (msg.role === 'model' && isTyping && !msg.text ? <span className="animate-pulse">...</span> : msg.text)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask your ${expert.role.toLowerCase()}...`}
            className="flex-1 px-5 py-3 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className={`p-3 rounded-full transition-all ${
              isTyping || !input.trim() 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-[10px] text-center text-slate-400">
          This AI provides general guidance and does not replace professional human expertise.
        </p>
      </form>
    </div>
  );
};
