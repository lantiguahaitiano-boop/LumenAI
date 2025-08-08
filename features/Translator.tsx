import React, { useState, useContext } from 'react';
import { getTranslation } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { TextArea } from '../components/common/TextArea';
import { LevelContext } from '../contexts/LevelContext';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { GamificationContext } from '../components/GamificationProvider';

const LANGUAGES = [
    { value: 'English', label: 'Inglés' },
    { value: 'Spanish', label: 'Español' },
    { value: 'French', label: 'Francés' },
    { value: 'German', label: 'Alemán' },
    { value: 'Portuguese', label: 'Portugués' },
    { value: 'Italian', label: 'Italiano' },
    { value: 'Chinese', label: 'Chino' },
    { value: 'Japanese', label: 'Japonés' },
];

export const Translator: React.FC = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('English');
  const [toLang, setToLang] = useState('Spanish');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { level } = useContext(LevelContext);
  const { addXp } = useContext(GamificationContext);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Por favor, introduce texto para traducir.');
      return;
    }
    if(fromLang === toLang){
      setError('Los idiomas de origen y destino no pueden ser los mismos.');
      return;
    }
    setIsLoading(true);
    setError('');
    setTranslatedText('');
    try {
      const result = await getTranslation(text, fromLang, toLang, level);
      setTranslatedText(result);
      addXp(10, 'translator');
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Traductor Educativo</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Traduce textos académicos conservando el contexto y el significado técnico.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">De:</label>
            <select value={fromLang} onChange={e => setFromLang(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-300 focus:shadow-lg focus:shadow-amber-500/20">
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <TextArea
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Introduce el texto aquí..."
              className="mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">A:</label>
            <select value={toLang} onChange={e => setToLang(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-300 focus:shadow-lg focus:shadow-amber-500/20">
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <div className="mt-2 w-full h-[238px] p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <MarkdownRenderer content={translatedText || "La traducción aparecerá aquí."} />
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Traducir
          </Button>
        </div>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};