
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { getChatStream } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ChatBotProps {
  lang: Language;
}

const ChatBot: React.FC<ChatBotProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  
  const getWelcomeMessage = (l: Language) => {
    switch (l) {
      case Language.HI: return "नमस्ते! मैं अरिथमित्र हूँ। मैं आपकी वित्तीय सहायता कैसे कर सकता हूँ?";
      case Language.MR: return "नमस्कार! मी अरिथमित्र आहे. मी तुम्हाला आर्थिक बाबींमध्ये कशी मदत करू शकतो?";
      case Language.GU: return "નમસ્તે! હું અરિથમિત્ર છું. હું તમારી નાણાકીય બાબતોમાં કેવી રીતે મદદ કરી શકું?";
      case Language.TA: return "வணக்கம்! நான் அரித்மித்ரா. உங்கள் நிதியில் நான் எவ்வாறு உதவ முடியும்?";
      case Language.TE: return "హలో! నేను అరిథ్‌మిత్రాని. మీ ఆర్థిక వ్యవహారాల్లో నేను ఎలా సహాయపడగలను?";
      case Language.KN: return "ನಮಸ್ಕಾರ! ನಾನು ಅರಿತ್‌ಮಿತ್ರ. ನಿಮ್ಮ ಹಣಕಾಸಿನ ವಿಷಯದಲ್ಲಿ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?";
      case Language.BN: return "হ্যালো! আমি আরিথমিত্র। আমি কিভাবে আপনার আর্থিক বিষয়ে সাহায্য করতে পারি?";
      default: return "Hello! I am ArithMitra. How can I help you with your finances today?";
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const initializedRef = useRef(false);

  // Initialize welcome message when language changes or first mount
  useEffect(() => {
    if (!initializedRef.current || messages.length === 0) {
       setMessages([{
         id: 'init',
         role: 'model',
         text: getWelcomeMessage(lang),
         timestamp: new Date()
       }]);
       initializedRef.current = true;
    }
  }, [lang]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert internal message format to Gemini history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const stream = await getChatStream(history, userMsg.text);
      
      let botResponseText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Add placeholder for bot message
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        botResponseText += chunkText;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: botResponseText } : msg
        ));
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg">ArithMitra AI</h2>
          <p className="text-xs text-blue-100 opacity-90">Always here to help</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                 {msg.role === 'user' ? <UserIcon size={12} /> : <Bot size={12} />}
                 <span>{msg.role === 'user' ? 'You' : 'ArithMitra'}</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={16} />
                <span className="text-sm text-slate-500 dark:text-slate-400">Thinking...</span>
            </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.chatPlaceholder}
            className="flex-1 p-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-slate-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;