import React, { useState, useContext } from 'react';
import { getSummary } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/TextArea';
import { LevelContext } from '../contexts/LevelContext';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { GamificationContext } from '../components/GamificationProvider';

export const Summarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Por favor, pega el texto que quieres resumir.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await getSummary(text, level);
      setSummary(result);
      addXp(10, 'summarizer');
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Resumidor Automático</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Pega cualquier texto largo, artículo o documento para obtener un resumen conciso.</p>
        
        <TextArea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pega tu texto aquí..."
        />

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Resumir
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {isLoading && (
        <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Condensando tu texto...</p>
        </div>
      )}

      {summary && (
        <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
           <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Resumen</h4>
           <MarkdownRenderer content={summary} />
        </div>
      )}
    </div>
  );
};