import React, { useState, useEffect, useRef, useContext } from 'react';
import { Chat } from '@google/genai';
import { getChatInstance, resetChat } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { LevelContext } from '../contexts/LevelContext';
import { ChatMessage } from '../types';
import { GamificationContext } from '../components/GamificationProvider';

// Custom hook for localStorage (Corrected Implementation)
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) { 
      console.error(error);
      return initialValue; 
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export const PrivateChat: React.FC = () => {
  const [history, setHistory] = useLocalStorage<ChatMessage[]>('chatHistory', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset chat when level changes to apply new system instruction
    resetChat();
    const geminiHistory = history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
    chatRef.current = getChatInstance(level, geminiHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMessage: ChatMessage = { role: 'user', text: currentInput };
    
    addXp(2, 'chat');
    setHistory(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
        if (!chatRef.current) {
            const geminiHistory = [...history, userMessage].map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
            chatRef.current = getChatInstance(level, geminiHistory);
        }

        const result = await chatRef.current.sendMessage({ message: currentInput });
        const modelMessage: ChatMessage = { role: 'model', text: result.text };
        setHistory(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: ChatMessage = { role: 'model', text: "Lo siento, tengo problemas para conectarme. Por favor, inténtalo de nuevo." };
        setHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHistory([]);
    resetChat();
  }

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col">
       <div className="bg-white dark:bg-slate-800 p-4 rounded-t-xl shadow-lg border-b border-x border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center">
             <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chat Privado</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Hazle una pregunta rápida a Lumen.</p>
            </div>
            <button onClick={handleReset} className="text-sm font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300">Reiniciar Chat</button>
        </div>
       </div>

      <div className="flex-grow p-6 bg-white dark:bg-slate-800/50 overflow-y-auto border-x border-slate-200 dark:border-slate-700">
        <div className="space-y-6">
          {history.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0">L</div>
              )}
              <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-amber-500 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0">L</div>
                 <div className="max-w-lg p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 rounded-bl-none">
                     <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce"></span>
                    </div>
                 </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-x border-b border-slate-200 dark:border-slate-700 rounded-b-xl shadow-lg">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-grow p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-300 focus:shadow-lg focus:shadow-amber-500/20"
            disabled={isLoading}
          />
          <Button onClick={handleSend} isLoading={isLoading} disabled={!input.trim()}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};